import { useEffect, useRef, useState } from "react";
import { Toaster, toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, ListChecks } from "lucide-react";

import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { UploadCard } from "@/components/UploadCard";
import { DatasetCard } from "@/components/DatasetCard";
import { AskCard } from "@/components/AskCard";
import { InsightsCard } from "@/components/InsightsCard";
import { SQLCard } from "@/components/SQLCard";
import { ResultsTable } from "@/components/ResultsTable";
import { ExportCard } from "@/components/ExportCard";
import { ErrorAlert } from "@/components/ErrorAlert";
import { EmptyState } from "@/components/EmptyState";
import { ResultsSkeleton } from "@/components/ResultsSkeleton";

import {
  askQuestion,
  clearHistory,
  extractErrorMessage,
  fetchHistory,
  uploadDataset,
} from "@/services/api";
import type {
  ChatResponse,
  DatasetInfo,
  HistoryItem,
  ProcessingStage,
} from "@/types";

export default function App() {
  // Theme
  const [darkMode, setDarkMode] = useState(false);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  // Sidebar
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // History
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyClearing, setHistoryClearing] = useState(false);

  const loadHistory = async () => {
    setHistoryLoading(true);
    try {
      const data = await fetchHistory();
      setHistory(data);
    } catch {
      // Non-critical: history sidebar simply stays empty.
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleClearHistory = async () => {
    setHistoryClearing(true);
    try {
      await clearHistory(); // DELETE /history/
      await loadHistory(); // GET /history/ to refresh
      toast.success("Query history cleared");
    } catch (error) {
      const err = extractErrorMessage(error);
      toast.error("Unable to clear history", { description: err.detail ?? err.message });
    } finally {
      setHistoryClearing(false);
    }
  };

  // Upload
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dataset, setDataset] = useState<DatasetInfo | null>(null);
  const [uploadError, setUploadError] = useState<{ message: string; detail?: string } | null>(null);

  const handleUpload = async (file: File) => {
    setUploading(true);
    setUploadProgress(0);
    setUploadError(null);
    try {
      const res = await uploadDataset(file, setUploadProgress);
      setDataset({
        filename: res.filename,
        rows: res.rows,
        columns: res.columns,
        table_name: res.table_name,
        preview: res.preview,
        column_names: res.column_names,
      });
      toast.success("Dataset uploaded successfully");
    } catch (error) {
      const err = extractErrorMessage(error);
      setUploadError(err);
      toast.error("Dataset upload failed", { description: err.detail ?? err.message });
    } finally {
      setUploading(false);
    }
  };

  // Ask AI
  const [question, setQuestion] = useState("");
  const [stage, setStage] = useState<ProcessingStage>("idle");
  const [chatResult, setChatResult] = useState<ChatResponse | null>(null);
  const [chatError, setChatError] = useState<{ message: string; detail?: string } | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const processing = stage === "generating_sql" || stage === "executing_query" || stage === "generating_insights";

  const handleAsk = async () => {
    if (!question.trim()) return;
    setChatError(null);
    setChatResult(null);
    setStage("generating_sql");

    // Progress the visible stage while the single /chat call resolves in the background.
    const stageTimer1 = setTimeout(() => setStage("executing_query"), 700);
    const stageTimer2 = setTimeout(() => setStage("generating_insights"), 1600);

    try {
      const res = await askQuestion({ question });
      setChatResult(res);
      setStage("done");
      toast.success("Query completed");
      loadHistory();
    } catch (error) {
      const err = extractErrorMessage(error);
      setChatError(err);
      setStage("error");
      toast.error("Unable to generate SQL", { description: err.detail ?? err.message });
    } finally {
      clearTimeout(stageTimer1);
      clearTimeout(stageTimer2);
    }
  };

  const handleSelectHistory = (q: string) => {
    setQuestion(q);
    setMobileSidebarOpen(false);
    textareaRef.current?.focus();
    textareaRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const activeStage: "upload" | "ask" | "analyze" = !dataset
    ? "upload"
    : chatResult
    ? "analyze"
    : "ask";

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Toaster position="top-right" richColors closeButton />
      <Header
        activeStage={activeStage}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode((d) => !d)}
        onToggleSidebar={() => setMobileSidebarOpen(true)}
      />

      <div className="flex flex-1">
        <Sidebar
          history={history}
          loading={historyLoading}
          clearing={historyClearing}
          collapsed={sidebarCollapsed}
          mobileOpen={mobileSidebarOpen}
          onSelect={handleSelectHistory}
          onClear={handleClearHistory}
          onToggleCollapse={() => setSidebarCollapsed((c) => !c)}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />

        <main className="mx-auto w-full max-w-4xl flex-1 space-y-5 px-4 py-6 sm:px-6 sm:py-8">
          <UploadCard uploading={uploading} progress={uploadProgress} onUpload={handleUpload} />

          {uploadError && (
            <ErrorAlert message={uploadError.message} detail={uploadError.detail} />
          )}

          <AnimatePresence mode="wait">
            {dataset && <DatasetCard key={dataset.table_name} dataset={dataset} />}
          </AnimatePresence>

          <AskCard
            ref={textareaRef}
            question={question}
            onQuestionChange={setQuestion}
            onAsk={handleAsk}
            disabled={!dataset}
            processing={processing}
            stage={stage}
          />

          <section aria-live="polite" className="space-y-5">
            {processing && <ResultsSkeleton />}

            {!processing && chatError && (
              <ErrorAlert message={chatError.message} detail={chatError.detail} />
            )}

            {!processing && !chatError && chatResult && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
                className="space-y-5"
              >
                <InsightsCard insights={chatResult.insights} />
                <SQLCard sql={chatResult.generated_sql} />
                <ResultsTable results={chatResult.results ?? []} />
                <ExportCard generatedSql={chatResult.generated_sql} disabled={false} />
              </motion.div>
            )}

            {!processing && !chatError && !chatResult && dataset && (
              <EmptyState icon={Sparkles} message="Your results will appear here." />
            )}

            {!dataset && (
              <EmptyState icon={ListChecks} message="Upload a dataset to begin." />
            )}
          </section>
        </main>
      </div>
    </div>
  );
}