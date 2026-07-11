import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

interface ErrorAlertProps {
  message: string;
  detail?: string;
}

export function ErrorAlert({ message, detail }: ErrorAlertProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-3 rounded-xl border border-destructive/20 bg-destructive/5 p-4"
    >
      <AlertTriangle className="h-[18px] w-[18px] shrink-0 text-destructive" />
      <div className="min-w-0">
        <p className="text-sm font-medium text-destructive">{message}</p>
        {detail && (
          <p className="mt-1 break-words font-mono text-xs text-destructive/80">
            Reason: {detail}
          </p>
        )}
      </div>
    </motion.div>
  );
}
