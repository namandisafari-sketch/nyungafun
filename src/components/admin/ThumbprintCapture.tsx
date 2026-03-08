import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Fingerprint, PenTool } from "lucide-react";
import ThumbprintCaptureDraw from "./ThumbprintCaptureDraw";
import MantraScannerCapture from "./MantraScannerCapture";

interface ThumbprintCaptureProps {
  label: string;
  existingUrl?: string;
  onCapture: (dataUrl: string) => void;
}

const ThumbprintCapture = ({ label, existingUrl, onCapture }: ThumbprintCaptureProps) => {
  return (
    <Tabs defaultValue="scanner" className="w-fit">
      <TabsList className="h-7 p-0.5">
        <TabsTrigger value="scanner" className="text-[10px] h-6 gap-1 px-2">
          <Fingerprint className="w-3 h-3" /> Scanner
        </TabsTrigger>
        <TabsTrigger value="draw" className="text-[10px] h-6 gap-1 px-2">
          <PenTool className="w-3 h-3" /> Draw
        </TabsTrigger>
      </TabsList>
      <TabsContent value="scanner" className="mt-2">
        <MantraScannerCapture label={label} existingUrl={existingUrl} onCapture={onCapture} />
      </TabsContent>
      <TabsContent value="draw" className="mt-2">
        <ThumbprintCaptureDraw label={label} existingUrl={existingUrl} onCapture={onCapture} />
      </TabsContent>
    </Tabs>
  );
};

export default ThumbprintCapture;
