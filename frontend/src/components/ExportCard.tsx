import { useState } from "react";
import { motion } from "framer-motion";
import { Download, FileSpreadsheet, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { exportExcel, exportPdf, extractErrorMessage } from "@/services/api";

interface ExportCardProps {
  generatedSql: string;
  disabled: boolean;
}

export function ExportCard({ generatedSql, disabled }: ExportCardProps) {
  const [exportingExcel, setExportingExcel] = useState(false);
  const [exportingPdf, setExportingPdf] = useState(false);

  const handleExportExcel = async () => {
    setExportingExcel(true);
    try {
      await exportExcel();
      toast.success("Excel downloaded");
    } catch (error) {
      const { message, detail } = extractErrorMessage(error);
      toast.error("Export failed", { description: detail ?? message });
    } finally {
      setExportingExcel(false);
    }
  };

  const handleExportPdf = async () => {
    setExportingPdf(true);
    try {
      await exportPdf();
      toast.success("PDF downloaded");
    } catch (error) {
      const { message, detail } = extractErrorMessage(error);
      toast.error("Export failed", { description: detail ?? message });
    } finally {
      setExportingPdf(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: 0.15 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>
            <Download className="h-[18px] w-[18px] text-primary" />
            Export
          </CardTitle>
          <CardDescription>Save these results for later.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2.5 sm:flex-row">
            <Button
              variant="secondary"
              className="flex-1"
              disabled={disabled || exportingExcel}
              loading={exportingExcel}
              onClick={handleExportExcel}
            >
              {!exportingExcel && <FileSpreadsheet className="h-4 w-4 text-primary" />}
              Export Excel
            </Button>
            <Button
              variant="secondary"
              className="flex-1"
              disabled={disabled || exportingPdf}
              loading={exportingPdf}
              onClick={handleExportPdf}
            >
              {!exportingPdf && <FileText className="h-4 w-4 text-indigo" />}
              Export PDF
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
