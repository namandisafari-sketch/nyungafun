import { useState, useRef, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Camera, Upload, CheckCircle, Loader2, RotateCcw } from "lucide-react";

const PASSPORT_WIDTH = 413;
const PASSPORT_HEIGHT = 531;
const MAX_FILE_SIZE_KB = 300;

interface PassportPhotoCaptureProps {
  userId: string;
  value: string;
  onChange: (url: string) => void;
}

const PassportPhotoCapture = ({ userId, value, onChange }: PassportPhotoCaptureProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDevice, setSelectedDevice] = useState("");

  useEffect(() => {
    return () => {
      if (stream) stream.getTracks().forEach(t => t.stop());
    };
  }, [stream]);

  const startCamera = useCallback(async () => {
    try {
      if (stream) stream.getTracks().forEach(t => t.stop());

      // Get permission first to enumerate
      if (devices.length === 0) {
        const tempStream = await navigator.mediaDevices.getUserMedia({ video: true });
        tempStream.getTracks().forEach(t => t.stop());
        const allDevices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = allDevices.filter(d => d.kind === "videoinput");
        setDevices(videoDevices);
        if (videoDevices.length > 0 && !selectedDevice) setSelectedDevice(videoDevices[0].deviceId);
      }

      const newStream = await navigator.mediaDevices.getUserMedia({
        video: {
          deviceId: selectedDevice ? { exact: selectedDevice } : undefined,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      });
      setStream(newStream);
      if (videoRef.current) videoRef.current.srcObject = newStream;
      setCameraActive(true);
      setCapturedImage(null);
    } catch {
      toast.error("Could not access camera");
    }
  }, [selectedDevice, stream, devices]);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(t => t.stop());
      setStream(null);
    }
    setCameraActive(false);
  }, [stream]);

  const applyWhiteBackground = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i], g = data[i + 1], b = data[i + 2];

      // Convert to HSL to detect background
      const max = Math.max(r, g, b) / 255;
      const min = Math.min(r, g, b) / 255;
      const l = (max + min) / 2;
      const s = max === min ? 0 : l > 0.5
        ? (max - min) / (2 - max - min)
        : (max - min) / (max + min);

      // Replace near-uniform or light/desaturated pixels that aren't skin-tone
      const isSkinTone = r > 100 && g > 60 && b > 40 && r > g && r > b && Math.abs(r - g) > 15;
      const isBackground = (l > 0.65 && s < 0.35) || (l > 0.85) || (s < 0.1 && l > 0.5);

      if (isBackground && !isSkinTone) {
        data[i] = 255;
        data[i + 1] = 255;
        data[i + 2] = 255;
      }
    }

    ctx.putImageData(imageData, 0, 0);
  };

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;

    const videoAspect = video.videoWidth / video.videoHeight;
    const passportAspect = PASSPORT_WIDTH / PASSPORT_HEIGHT;

    let sx = 0, sy = 0, sw = video.videoWidth, sh = video.videoHeight;
    if (videoAspect > passportAspect) {
      sw = video.videoHeight * passportAspect;
      sx = (video.videoWidth - sw) / 2;
    } else {
      sh = video.videoWidth / passportAspect;
      sy = (video.videoHeight - sh) / 2;
    }

    canvas.width = PASSPORT_WIDTH;
    canvas.height = PASSPORT_HEIGHT;
    const ctx = canvas.getContext("2d")!;
    // White base
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, PASSPORT_WIDTH, PASSPORT_HEIGHT);
    ctx.drawImage(video, sx, sy, sw, sh, 0, 0, PASSPORT_WIDTH, PASSPORT_HEIGHT);

    // Apply code-based white background
    applyWhiteBackground(canvas, ctx);

    const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
    setCapturedImage(dataUrl);
    stopCamera();
  }, [stopCamera]);

  const uploadPhoto = async (source: string) => {
    setUploading(true);
    try {
      // Compress to under 300KB
      const img = new window.Image();
      img.src = source;
      await new Promise((resolve) => { img.onload = resolve; });

      const canvas = document.createElement("canvas");
      canvas.width = PASSPORT_WIDTH;
      canvas.height = PASSPORT_HEIGHT;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, PASSPORT_WIDTH, PASSPORT_HEIGHT);
      ctx.drawImage(img, 0, 0, PASSPORT_WIDTH, PASSPORT_HEIGHT);

      let lo = 0.1, hi = 0.95, best = "";
      for (let i = 0; i < 10; i++) {
        const mid = (lo + hi) / 2;
        const result = canvas.toDataURL("image/jpeg", mid);
        const sizeKB = Math.round((result.length - "data:image/jpeg;base64,".length) * 0.75 / 1024);
        if (sizeKB <= MAX_FILE_SIZE_KB) { best = result; lo = mid; } else { hi = mid; }
      }
      if (!best) best = canvas.toDataURL("image/jpeg", 0.1);

      // Convert to blob and upload
      const res = await fetch(best);
      const blob = await res.blob();
      const path = `${userId}/passport-photo/${Date.now()}.jpg`;

      const { error } = await supabase.storage.from("application-documents").upload(path, blob);
      if (error) throw error;

      const { data: urlData } = supabase.storage.from("application-documents").getPublicUrl(path);
      onChange(urlData.publicUrl);
      toast.success("Passport photo uploaded!");
    } catch (err: any) {
      toast.error("Upload failed: " + (err.message || "Unknown error"));
    }
    setUploading(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error("File too large. Max 5MB."); return; }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setCapturedImage(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">Passport Photo *</label>

      {value && !capturedImage && !cameraActive && (
        <div className="flex items-center gap-3">
          <img src={value} alt="Passport" className="w-16 h-20 object-cover rounded border border-border" />
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground flex items-center gap-1"><CheckCircle size={12} className="text-accent" /> Photo uploaded</span>
            <Button type="button" variant="ghost" size="sm" onClick={() => { setCapturedImage(null); onChange(""); }} className="text-xs">Change Photo</Button>
          </div>
        </div>
      )}

      {!value && !capturedImage && !cameraActive && (
        <div className="flex gap-2">
          <Button type="button" variant="outline" size="sm" onClick={startCamera} className="gap-2">
            <Camera size={14} /> Use Camera
          </Button>
          <Button type="button" variant="outline" size="sm" className="gap-2 relative overflow-hidden">
            <Upload size={14} /> Upload File
            <input type="file" accept="image/*" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
          </Button>
        </div>
      )}

      {cameraActive && (
        <div className="space-y-2">
          {devices.length > 1 && (
            <select className="w-full border rounded-md p-1.5 text-xs bg-background" value={selectedDevice} onChange={(e) => { setSelectedDevice(e.target.value); startCamera(); }}>
              {devices.map(d => <option key={d.deviceId} value={d.deviceId}>{d.label || `Camera ${d.deviceId.slice(0, 8)}`}</option>)}
            </select>
          )}
          <div className="relative rounded-lg overflow-hidden bg-muted" style={{ aspectRatio: `${PASSPORT_WIDTH}/${PASSPORT_HEIGHT}`, maxWidth: 200 }}>
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            <div className="absolute inset-0 border-2 border-dashed border-primary/40 pointer-events-none" />
          </div>
          <div className="flex gap-2">
            <Button type="button" size="sm" onClick={capturePhoto} className="gap-1"><Camera size={14} /> Capture</Button>
            <Button type="button" size="sm" variant="outline" onClick={stopCamera}>Cancel</Button>
          </div>
        </div>
      )}

      {capturedImage && !value && (
        <div className="space-y-2">
          <div className="rounded-lg overflow-hidden border border-border" style={{ width: 140, aspectRatio: `${PASSPORT_WIDTH}/${PASSPORT_HEIGHT}` }}>
            <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
          </div>
          <div className="flex gap-2">
            <Button type="button" size="sm" onClick={() => uploadPhoto(capturedImage)} disabled={uploading} className="gap-1">
              {uploading ? <><Loader2 size={14} className="animate-spin" /> Uploading...</> : <><CheckCircle size={14} /> Use This Photo</>}
            </Button>
            <Button type="button" size="sm" variant="outline" onClick={() => { setCapturedImage(null); }} className="gap-1">
              <RotateCcw size={14} /> Retake
            </Button>
          </div>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
      <p className="text-xs text-muted-foreground">Standard passport size (35×45mm) • ≤300KB • White background applied automatically</p>
    </div>
  );
};

export default PassportPhotoCapture;
