import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Fingerprint, Loader2, Wifi, WifiOff, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { discoverDevice, captureFingerprint } from "@/lib/mantraScanner";

interface MantraScannerCaptureProps {
  label: string;
  existingUrl?: string;
  onCapture: (dataUrl: string) => void;
}

const MantraScannerCapture = ({ label, existingUrl, onCapture }: MantraScannerCaptureProps) => {
  const [status, setStatus] = useState<"checking" | "ready" | "notready" | "notfound" | "idle">("idle");
  const [scanning, setScanning] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(existingUrl || null);
  const [activePort, setActivePort] = useState<number | undefined>();

  const checkDevice = async () => {
    setStatus("checking");
    const result = await discoverDevice();
    setStatus(result.status === "notfound" ? "notfound" : result.status);
    if (result.port) setActivePort(result.port);
    if (result.status === "ready") {
      toast.success(result.message);
    } else if (result.status === "notfound") {
      toast.error(result.message);
    }
  };

  const handleCapture = async () => {
    setScanning(true);
    try {
      const result = await captureFingerprint(activePort);
      if (result.success && result.imageData) {
        // If the data is already a data URL or base64 image, use it directly
        const imageDataUrl = result.imageData.startsWith("data:")
          ? result.imageData
          : `data:image/png;base64,${result.imageData}`;
        setCapturedImage(imageDataUrl);
        onCapture(imageDataUrl);
        toast.success("Fingerprint captured successfully!");
      } else {
        toast.error(result.errorMessage || "Capture failed");
      }
    } catch {
      toast.error("Scanner error. Please try again.");
    } finally {
      setScanning(false);
    }
  };

  const handleClear = () => {
    setCapturedImage(null);
    onCapture("");
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-1.5">
        <Fingerprint className="w-3.5 h-3.5 text-primary" />
        <span className="text-xs font-medium text-foreground">{label}</span>
      </div>

      {/* Preview area */}
      <div className="w-[90px] h-[112px] rounded-lg border-2 border-border bg-muted flex items-center justify-center overflow-hidden">
        {capturedImage ? (
          <img src={capturedImage} alt={label} className="w-full h-full object-cover" />
        ) : (
          <Fingerprint className="w-8 h-8 text-muted-foreground/40" />
        )}
      </div>

      {/* Status badge */}
      {status !== "idle" && (
        <Badge
          variant={status === "ready" ? "default" : status === "checking" ? "secondary" : "destructive"}
          className="text-[9px] h-5"
        >
          {status === "checking" && <Loader2 className="w-3 h-3 mr-1 animate-spin" />}
          {status === "ready" && <Wifi className="w-3 h-3 mr-1" />}
          {status === "notfound" && <WifiOff className="w-3 h-3 mr-1" />}
          {status === "checking" ? "Detecting..." : status === "ready" ? "Scanner Ready" : status === "notready" ? "Not Ready" : "Not Found"}
        </Badge>
      )}

      {/* Actions */}
      <div className="flex gap-1">
        {status !== "ready" ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-6 text-[10px] gap-1 px-2"
            onClick={checkDevice}
            disabled={status === "checking"}
          >
            {status === "checking" ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wifi className="w-3 h-3" />}
            {status === "idle" ? "Connect Scanner" : "Retry"}
          </Button>
        ) : (
          <Button
            type="button"
            variant="default"
            size="sm"
            className="h-6 text-[10px] gap-1 px-2"
            onClick={handleCapture}
            disabled={scanning}
          >
            {scanning ? <Loader2 className="w-3 h-3 animate-spin" /> : <Fingerprint className="w-3 h-3" />}
            {scanning ? "Scanning..." : "Scan"}
          </Button>
        )}
        {capturedImage && (
          <Button type="button" variant="ghost" size="sm" className="h-6 text-[10px] gap-1 px-2" onClick={handleClear}>
            <RotateCcw className="w-3 h-3" /> Clear
          </Button>
        )}
      </div>
    </div>
  );
};

export default MantraScannerCapture;
