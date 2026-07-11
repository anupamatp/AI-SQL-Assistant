import { useState } from "react";
import { motion } from "framer-motion";
import { Code2, Copy, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface SQLCardProps {
  sql: string;
}

export function SQLCard({ sql }: SQLCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(sql);
      setCopied(true);
      toast.success("Copied!");
      setTimeout(() => setCopied(false), 1600);
    } catch {
      toast.error("Unable to copy to clipboard");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: 0.05 }}
    >
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle>
            <Code2 className="h-[18px] w-[18px] text-primary" />
            Generated SQL
          </CardTitle>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-primary" /> Copied!
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" /> Copy
              </>
            )}
          </button>
        </CardHeader>
        <CardContent>
          <pre className="scrollbar-thin overflow-x-auto rounded-lg bg-[#0B1120] p-4 text-[13px] leading-relaxed text-slate-100">
            <code className="font-mono">{sql}</code>
          </pre>
        </CardContent>
      </Card>
    </motion.div>
  );
}
