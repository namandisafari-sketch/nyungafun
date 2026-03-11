import { useState, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  FileText,
  Image,
  Loader2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Trash2,
} from "lucide-react";

interface PairItem {
  pdf: File;
  png: File;
  baseName: string;
  status: "pending" | "processing" | "done" | "error";
  applicationNumber?: string;
  confidence?: number;
  error?: string;
}

interface BatchUploaderProps {
  userId: string;
}

/**
 * Pairs PDFs with their PNG snippets by matching filenames.
 * E.g. "005124.pdf" pairs with "005124.png"
 */
function pairFiles(files: File[]): { pairs: PairItem[]; orphans: File[] } {
  const pdfMap = new Map<string, File>();
  const pngMap = new Map<string, File>();

  for (const f of files) {
    const ext = f.name.split(".").pop()?.toLowerCase() || "";
    const base = f.name.replace(/\.[^.]+$/, "");
    if (ext === "pdf") pdfMap.set(base, f);
    else if (["png", "jpg", "jpeg"].includes(ext)) pngMap.set(base, f);
  }

  const pairs: PairItem[] = [];
  const orphans: File[] = [];

  for (const [base, pdf] of pdfMap) {
    const png = pngMap.get(base);
    if (png) {
      pairs.push({ pdf, png, baseName: base, status: "pending" });
      pngMap.delete(base);
    } else {
      orphans.push(pdf);
    }
  }
  for (const f of pngMap.values()) orphans.push(f);

  return { pairs, orphans };
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1]); // strip data:...;base64,
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const BatchUploader = ({ userId }: BatchUploaderProps) => {
  const [pairs, setPairs] = useState<PairItem[]>([]);
  const [orphans, setOrphans] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback((files: FileList | File[]) => {
    const arr = Array.from(files);
    const { pairs: p, orphans: o } = pairFiles(arr);
    setPairs(p);
    setOrphans(o);
    if (p.length === 0) {
      toast.error("No matching PDF+PNG pairs found. Ensure filenames match (e.g. 005124.pdf + 005124.png).");
    } else {
      toast.success(`Found ${p.length} PDF-PNG pairs ready to process.`);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const processBatch = async () => {
    if (pairs.length === 0) return;
    setProcessing(true);
    setProgress(0);

    const updated = [...pairs];

    for (let i = 0; i < updated.length; i++) {
      const item = updated[i];
      item.status = "processing";
      setPairs([...updated]);

      try {
        // 1. OCR the PNG to get application number
        const imageBase64 = await fileToBase64(item.png);
        const { data: ocrData, error: ocrError } = await supabase.functions.invoke(
          "ocr-application-number",
          { body: { imageBase64 } }
        );

        if (ocrError) throw new Error(ocrError.message || "OCR failed");
        if (ocrData?.error) throw new Error(ocrData.error);

        const appNum = ocrData.application_number;
        const confidence = ocrData.confidence || 0;

        if (!appNum || appNum === "UNREADABLE") {
          item.status = "error";
          item.error = "Could not read application number";
          item.confidence = confidence;
          setPairs([...updated]);
          continue;
        }

        item.applicationNumber = appNum;
        item.confidence = confidence;

        // 2. Upload PDF to storage with application number as name
        const storagePath = `applications/${appNum}/${appNum}.pdf`;
        const pdfBytes = await item.pdf.arrayBuffer();

        const { error: uploadError } = await supabase.storage
          .from("scanned-documents")
          .upload(storagePath, pdfBytes, {
            contentType: "application/pdf",
            upsert: true,
          });

        if (uploadError) throw new Error("Upload failed: " + uploadError.message);

        // 3. Try to find matching application in DB
        const { data: appMatch } = await supabase
          .from("applications")
          .select("id")
          .or(`registration_number.eq.${appNum},nin.eq.${appNum}`)
          .limit(1)
          .maybeSingle();

        // 4. Save record in scanned_documents
        const { error: insertError } = await supabase
          .from("scanned_documents")
          .insert({
            application_number: appNum,
            application_id: appMatch?.id || null,
            original_filename: item.pdf.name,
            storage_path: storagePath,
            ocr_confidence: confidence,
            processed_by: userId,
          });

        if (insertError) throw new Error("DB insert failed: " + insertError.message);

        item.status = "done";
      } catch (err: any) {
        item.status = "error";
        item.error = err.message || "Unknown error";
      }

      setPairs([...updated]);
      setProgress(Math.round(((i + 1) / updated.length) * 100));
    }

    setProcessing(false);
    const doneCount = updated.filter((p) => p.status === "done").length;
    const errCount = updated.filter((p) => p.status === "error").length;
    toast.success(`Batch complete: ${doneCount} processed, ${errCount} errors.`);
  };

  const clearAll = () => {
    setPairs([]);
    setOrphans([]);
    setProgress(0);
  };

  const statusIcon = (s: PairItem["status"]) => {
    switch (s) {
      case "pending": return <FileText className="h-4 w-4 text-muted-foreground" />;
      case "processing": return <Loader2 className="h-4 w-4 text-primary animate-spin" />;
      case "done": return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "error": return <XCircle className="h-4 w-4 text-destructive" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-primary/40 rounded-xl p-8 text-center cursor-pointer hover:border-primary/70 hover:bg-primary/5 transition-colors"
      >
        <Upload className="h-10 w-10 mx-auto mb-3 text-primary/60" />
        <p className="text-sm font-medium text-foreground">
          Drop all PDF + PNG files here (or click to browse)
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Each PDF must have a matching PNG with the same filename (e.g. 005124.pdf + 005124.png)
        </p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".pdf,.png,.jpg,.jpeg"
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
      </div>

      {/* Orphans warning */}
      {orphans.length > 0 && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/30">
          <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
          <div className="text-xs text-destructive">
            <strong>{orphans.length} unmatched file(s):</strong>{" "}
            {orphans.map((f) => f.name).join(", ")}
          </div>
        </div>
      )}

      {/* Pairs list */}
      {pairs.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">
                {pairs.length} Document Pair{pairs.length > 1 ? "s" : ""} Ready
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={clearAll} disabled={processing}>
                  <Trash2 className="h-3.5 w-3.5 mr-1" /> Clear
                </Button>
                <Button size="sm" onClick={processBatch} disabled={processing}>
                  {processing ? (
                    <><Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" /> Processing...</>
                  ) : (
                    "Process All"
                  )}
                </Button>
              </div>
            </div>
            {processing && <Progress value={progress} className="mt-2" />}
          </CardHeader>
          <CardContent className="max-h-[400px] overflow-y-auto space-y-1.5">
            {pairs.map((p, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/30 text-sm"
              >
                {statusIcon(p.status)}
                <div className="flex-1 min-w-0">
                  <span className="font-medium truncate block">{p.baseName}</span>
                  <span className="text-xs text-muted-foreground flex items-center gap-2">
                    <FileText className="h-3 w-3" /> {(p.pdf.size / 1024).toFixed(0)}KB
                    <Image className="h-3 w-3 ml-1" /> {(p.png.size / 1024).toFixed(0)}KB
                  </span>
                </div>
                {p.applicationNumber && (
                  <Badge variant="secondary" className="font-mono">
                    #{p.applicationNumber}
                  </Badge>
                )}
                {p.confidence !== undefined && p.status !== "pending" && (
                  <span className="text-xs text-muted-foreground">{p.confidence}%</span>
                )}
                {p.error && (
                  <span className="text-xs text-destructive max-w-[200px] truncate" title={p.error}>
                    {p.error}
                  </span>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BatchUploader;
