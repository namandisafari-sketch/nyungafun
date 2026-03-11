import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Layers, Upload } from "lucide-react";
import BatchUploader from "@/components/admin/BatchUploader";
import ScannedDocumentSearch from "@/components/admin/ScannedDocumentSearch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdminBatchProcessing = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="p-4 sm:p-6 w-full space-y-4">
      <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
        <Layers className="h-6 w-6 text-primary" /> Batch Document Processing
      </h1>
      <p className="text-sm text-muted-foreground">
        Upload scanned application PDFs with their ID snippets. The system extracts the application number, renames and stores each PDF.
      </p>

      <Tabs defaultValue="upload" className="w-full">
        <TabsList>
          <TabsTrigger value="upload" className="gap-1.5">
            <Upload className="h-4 w-4" /> Upload & Process
          </TabsTrigger>
          <TabsTrigger value="search" className="gap-1.5">
            Search Documents
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="mt-4">
          <BatchUploader userId={user.id} />
        </TabsContent>

        <TabsContent value="search" className="mt-4">
          <ScannedDocumentSearch />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminBatchProcessing;
