import { History, PanelLeftClose, PanelLeftOpen, X, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import type { HistoryItem as HistoryItemType } from "@/types";
import { HistoryItem } from "@/components/HistoryItem";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarProps {
  history: HistoryItemType[];
  loading: boolean;
  clearing: boolean;
  collapsed: boolean;
  mobileOpen: boolean;
  onSelect: (question: string) => void;
  onClear: () => void;
  onToggleCollapse: () => void;
  onCloseMobile: () => void;
}

function HistorySkeleton() {
  return (
    <div className="space-y-2 px-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="space-y-2 rounded-lg px-3 py-2.5">
          <Skeleton className="h-3.5 w-[85%]" />
          <Skeleton className="h-2.5 w-16" />
        </div>
      ))}
    </div>
  );
}

function SidebarContent({
  history,
  loading,
  clearing,
  onSelect,
  onClear,
}: Pick<SidebarProps, "history" | "loading" | "clearing" | "onSelect" | "onClear">) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-2 px-4 pb-3 pt-4">
        <div className="flex items-center gap-2">
          <History className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold">Query History</h2>
        </div>
        {history.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 gap-1 px-2 text-xs text-muted-foreground hover:text-destructive"
            disabled={clearing}
            loading={clearing}
            onClick={onClear}
            aria-label="Clear history"
          >
            {!clearing && <Trash2 className="h-3.5 w-3.5" />}
            Clear
          </Button>
        )}
      </div>
      <div className="flex-1 space-y-1 overflow-y-auto scrollbar-thin px-3 pb-4">
        {loading ? (
          <HistorySkeleton />
        ) : history.length === 0 ? (
          <div className="px-2 py-8 text-center">
            <p className="text-sm text-muted-foreground">No previous queries.</p>
          </div>
        ) : (
          history.map((item, idx) => (
            <HistoryItem
              key={item.id ?? `${item.question}-${idx}`}
              item={item}
              onClick={() => onSelect(item.question)}
            />
          ))
        )}
      </div>
    </div>
  );
}

export function Sidebar({
  history,
  loading,
  clearing,
  collapsed,
  mobileOpen,
  onSelect,
  onClear,
  onToggleCollapse,
  onCloseMobile,
}: SidebarProps) {
  return (
    <>
      {/* Desktop / tablet sidebar */}
      <aside
        className={cn(
          "relative hidden shrink-0 border-r border-border bg-card/60 transition-[width] duration-200 lg:block",
          collapsed ? "w-[52px]" : "w-[260px]"
        )}
      >
        <button
          onClick={onToggleCollapse}
          className="absolute -right-3 top-5 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-soft transition-colors hover:text-foreground"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <PanelLeftOpen className="h-3.5 w-3.5" />
          ) : (
            <PanelLeftClose className="h-3.5 w-3.5" />
          )}
        </button>
        {collapsed ? (
          <div className="flex flex-col items-center gap-3 pt-6">
            <History className="h-[18px] w-[18px] text-muted-foreground" />
          </div>
        ) : (
          <SidebarContent
            history={history}
            loading={loading}
            clearing={clearing}
            onSelect={onSelect}
            onClear={onClear}
          />
        )}
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onCloseMobile}
              className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-[2px] lg:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.22 }}
              className="fixed inset-y-0 left-0 z-50 w-[280px] border-r border-border bg-card shadow-card-hover lg:hidden"
            >
              <div className="flex items-center justify-end px-2 pt-2">
                <Button variant="ghost" size="icon" onClick={onCloseMobile}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <SidebarContent
                history={history}
                loading={loading}
                clearing={clearing}
                onSelect={onSelect}
                onClear={onClear}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}