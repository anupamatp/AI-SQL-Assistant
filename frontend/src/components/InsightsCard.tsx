import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface InsightsCardProps {
  insights: string;
}

/** Splits insight text into bullet-friendly lines, tolerating plain prose or newline-separated points. */
function toBullets(text: string): string[] {
  const lines = text
    .split(/\r?\n|(?<=\.)\s+(?=[A-Z])/)
    .map((l) => l.replace(/^[-*•]\s*/, "").trim())
    .filter(Boolean);
  return lines.length > 0 ? lines : [text];
}

export function InsightsCard({ insights }: InsightsCardProps) {
  const bullets = toBullets(insights);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <Card className="border-primary/20 bg-gradient-to-br from-primary/[0.04] to-transparent">
        <CardHeader>
          <CardTitle>
            <Sparkles className="h-[18px] w-[18px] text-primary" />
            AI Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2.5">
            {bullets.map((line, i) => (
              <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-foreground/90">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </motion.div>
  );
}
