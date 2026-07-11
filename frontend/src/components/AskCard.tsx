import { forwardRef } from "react";
import { Sparkles, Send, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { ProcessingStage } from "@/types";
import { cn } from "@/lib/utils";

const SUGGESTED_QUESTIONS = [
  "Top 10 customers",
  "Highest sales month",
  "Duplicate records",
  "Missing values",
  "Sales summary",
  "Average sales",
];

const STAGE_LABEL: Record<ProcessingStage, string> = {
  idle: "",
  generating_sql: "Generating SQL...",
  executing_query: "Executing query...",
  generating_insights: "Generating insights...",
  done: "",
  error: "",
};

interface AskCardProps {
  question: string;
  onQuestionChange: (value: string) => void;
  onAsk: () => void;
  disabled: boolean;
  processing: boolean;
  stage: ProcessingStage;
}

export const AskCard = forwardRef<HTMLTextAreaElement, AskCardProps>(
  ({ question, onQuestionChange, onAsk, disabled, processing, stage }, ref) => {
    const stageLabel = STAGE_LABEL[stage];

    return (
      <Card className={cn(disabled && "opacity-70")}>
        <CardHeader>
          <CardTitle>
            <Sparkles className="h-[18px] w-[18px] text-primary" />
            Ask AI
          </CardTitle>
          <CardDescription>
            {disabled ? "Upload a dataset to begin." : "Ask a question in plain English."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            ref={ref}
            value={question}
            onChange={(e) => onQuestionChange(e.target.value)}
            placeholder="Ask a question about your uploaded dataset..."
            disabled={disabled || processing}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                if (!disabled && !processing && question.trim()) onAsk();
              }
            }}
          />

          <div className="mt-3 flex flex-wrap gap-1.5">
            {SUGGESTED_QUESTIONS.map((chip) => (
              <button
                key={chip}
                type="button"
                disabled={disabled || processing}
                onClick={() => onQuestionChange(chip)}
                className="rounded-full border border-border bg-secondary/40 px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
              >
                {chip}
              </button>
            ))}
          </div>

          <div className="mt-4 flex items-center gap-3">
            <Button
              size="lg"
              className="flex-1 sm:flex-none"
              disabled={disabled || processing || !question.trim()}
              onClick={onAsk}
            >
              {processing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              {processing ? "Working..." : "Ask AI"}
            </Button>
            {processing && stageLabel && (
              <span className="text-xs font-medium text-muted-foreground">{stageLabel}</span>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }
);
AskCard.displayName = "AskCard";
