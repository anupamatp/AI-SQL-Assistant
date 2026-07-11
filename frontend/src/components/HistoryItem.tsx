import { Clock } from "lucide-react";
import type { HistoryItem as HistoryItemType } from "@/types";
import { formatTimestamp, cn } from "@/lib/utils";

interface HistoryItemProps {
  item: HistoryItemType;
  onClick: () => void;
}

export function HistoryItem({ item, onClick }: HistoryItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group w-full rounded-lg border border-transparent px-3 py-2.5 text-left transition-all duration-150",
        "hover:border-border hover:bg-secondary/60 active:scale-[0.99]"
      )}
    >
      <p className="line-clamp-2 text-sm text-foreground/90 group-hover:text-foreground">
        {item.question}
      </p>
      <div className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
        <Clock className="h-3 w-3" />
        <span>{formatTimestamp(item.timestamp)}</span>
      </div>
    </button>
  );
}
