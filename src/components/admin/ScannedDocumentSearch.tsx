import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Search, FileText, Eye, ExternalLink } from "lucide-react";

interface ScannedDoc {
  id: string;
  application_number: string;
  original_filename: string;
  storage_path: string;
  ocr_confidence: number;
  created_at: string;
  application_id: string | null;
}

const ScannedDocumentSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ScannedDoc[]>([]);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewDoc, setPreviewDoc] = useState<ScannedDoc | null>(null);

  const search = async (q: string) => {
    setLoading(true);
    let req = supabase
      .from("scanned_documents")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (q.trim()) {
      req = req.ilike("application_number", `%${q.trim()}%`);
    }

    const { data } = await req;
    setResults((data as ScannedDoc[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    search("");
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    search(query);
  };

  const openPreview = (doc: ScannedDoc) => {
    const { data } = supabase.storage
      .from("scanned-documents")
      .getPublicUrl(doc.storage_path);
    setPreviewUrl(data.publicUrl);
    setPreviewDoc(doc);
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by application number..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button type="submit" disabled={loading}>
          Search
        </Button>
      </form>

      {results.length === 0 && !loading && (
        <p className="text-sm text-muted-foreground py-8 text-center">
          No scanned documents found.
        </p>
      )}

      <div className="grid gap-2">
        {results.map((doc) => (
          <Card key={doc.id} className="hover:bg-muted/30 transition-colors">
            <CardContent className="flex items-center gap-3 p-3">
              <FileText className="h-5 w-5 text-primary shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-semibold text-sm">
                    #{doc.application_number}
                  </span>
                  <Badge variant="outline" className="text-[10px]">
                    {doc.ocr_confidence}% conf.
                  </Badge>
                  {doc.application_id && (
                    <Badge className="text-[10px] bg-green-500/10 text-green-700 border-green-500/30">
                      Linked
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  {doc.original_filename} · {new Date(doc.created_at).toLocaleDateString()}
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => openPreview(doc)}>
                <Eye className="h-4 w-4 mr-1" /> Preview
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* PDF Preview Dialog */}
      <Dialog open={!!previewUrl} onOpenChange={() => { setPreviewUrl(null); setPreviewDoc(null); }}>
        <DialogContent className="max-w-4xl h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Application #{previewDoc?.application_number}
              {previewUrl && (
                <a href={previewUrl} target="_blank" rel="noopener noreferrer" className="ml-auto">
                  <Button variant="outline" size="sm">
                    <ExternalLink className="h-3.5 w-3.5 mr-1" /> Open
                  </Button>
                </a>
              )}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 min-h-0">
            {previewUrl && (
              <iframe src={previewUrl} className="w-full h-full rounded-lg border" title="PDF Preview" />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ScannedDocumentSearch;
