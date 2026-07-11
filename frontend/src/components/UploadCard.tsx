import { useCallback, useRef, useState } from "react";
import { UploadCloud, FileSpreadsheet, X, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn, formatBytes } from "@/lib/utils";

const ACCEPTED_EXTENSIONS = [".csv", ".xlsx", ".xls"];

interface UploadCardProps {
  uploading: boolean;
  progress: number;
  onUpload: (file: File) => void;
}

export function UploadCard({ uploading, progress, onUpload }: UploadCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isAccepted = (file: File) =>
    ACCEPTED_EXTENSIONS.some((ext) => file.name.toLowerCase().endsWith(ext));

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!isAccepted(file)) return;
    setSelectedFile(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <UploadCloud className="h-[18px] w-[18px] text-primary" />
          Upload Dataset
        </CardTitle>
        <CardDescription>Bring in a CSV or Excel file to get started.</CardDescription>
      </CardHeader>
      <CardContent>
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-10 text-center transition-colors duration-150",
            isDragging
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/40 hover:bg-secondary/40"
          )}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10">
            <UploadCloud className="h-5 w-5 text-primary" />
          </div>
          <p className="mt-3 text-sm font-medium">
            Drag & drop your file here, or{" "}
            <span className="text-primary underline-offset-2 hover:underline">browse</span>
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Supports CSV, XLSX, XLS
          </p>
        </div>

        {selectedFile && (
          <div className="mt-4 flex items-center justify-between gap-3 rounded-lg border border-border bg-secondary/40 px-3.5 py-2.5">
            <div className="flex min-w-0 items-center gap-2.5">
              <FileSpreadsheet className="h-4 w-4 shrink-0 text-primary" />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{selectedFile.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatBytes(selectedFile.size)}
                </p>
              </div>
            </div>
            {!uploading && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedFile(null);
                  if (inputRef.current) inputRef.current.value = "";
                }}
                className="rounded-md p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
                aria-label="Remove file"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        )}

        {uploading && (
          <div className="mt-3">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-primary transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Loader2 className="h-3 w-3 animate-spin" />
              Uploading dataset...
            </p>
          </div>
        )}

        <Button
          className="mt-4 w-full"
          size="lg"
          disabled={!selectedFile || uploading}
          loading={uploading}
          onClick={() => selectedFile && onUpload(selectedFile)}
        >
          {uploading ? "Uploading..." : "Upload Dataset"}
        </Button>
      </CardContent>
    </Card>
  );
}
