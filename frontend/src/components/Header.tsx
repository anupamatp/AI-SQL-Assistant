import { Database, Github, Moon, Sun, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface HeaderProps {
  activeStage: "upload" | "ask" | "analyze";
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onToggleSidebar: () => void;
}

const STEPS: { key: HeaderProps["activeStage"]; label: string }[] = [
  { key: "upload", label: "Upload" },
  { key: "ask", label: "Ask" },
  { key: "analyze", label: "Analyze" },
];

export function Header({
  activeStage,
  darkMode,
  onToggleDarkMode,
  onToggleSidebar,
}: HeaderProps) {
  const activeIndex = STEPS.findIndex((s) => s.key === activeStage);

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-3 min-w-0">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onToggleSidebar}
            aria-label="Toggle query history"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-soft">
            <Database className="h-[18px] w-[18px]" />
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-[15px] font-semibold leading-tight">
              AI SQL Assistant
            </h1>
            <p className="hidden truncate text-xs text-muted-foreground sm:block">
              Upload CSV or Excel datasets and analyze them using AI.
            </p>
          </div>
        </div>

        {/* Pipeline stepper — reflects actual progress through Upload -> Ask -> Analyze */}
        <div className="hidden items-center md:flex" aria-label="Workflow progress">
          {STEPS.map((step, i) => {
            const state =
              i < activeIndex ? "done" : i === activeIndex ? "active" : "upcoming";
            return (
              <div key={step.key} className="flex items-center">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold transition-colors",
                      state === "done" && "bg-primary text-primary-foreground",
                      state === "active" &&
                        "bg-primary/15 text-primary ring-2 ring-primary/30",
                      state === "upcoming" && "bg-secondary text-muted-foreground"
                    )}
                  >
                    {i + 1}
                  </span>
                  <span
                    className={cn(
                      "text-xs font-medium",
                      state === "upcoming" ? "text-muted-foreground" : "text-foreground"
                    )}
                  >
                    {step.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={cn(
                      "mx-3 h-px w-8 rounded-full transition-colors",
                      i < activeIndex ? "bg-primary" : "bg-border"
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleDarkMode}
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
          </Button>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground"
            aria-label="View source on GitHub"
          >
            <Github className="h-[18px] w-[18px]" />
          </a>
        </div>
      </div>
    </header>
  );
}
