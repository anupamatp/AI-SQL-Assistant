import { motion } from "framer-motion";
import { Table2, FileText, Rows3, Columns3, Database } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { DatasetInfo } from "@/types";

interface DatasetCardProps {
  dataset: DatasetInfo;
}

const stats = (dataset: DatasetInfo) => [
  { label: "Filename", value: dataset.filename, icon: FileText },
  { label: "Rows", value: dataset.rows.toLocaleString(), icon: Rows3 },
  { label: "Columns", value: dataset.columns.toLocaleString(), icon: Columns3 },
  { label: "Table", value: dataset.table_name, icon: Database },
];

export function DatasetCard({ dataset }: DatasetCardProps) {
  const previewRows = dataset.preview?.slice(0, 5) ?? [];
  const columnNames =
    dataset.column_names ?? (previewRows[0] ? Object.keys(previewRows[0]) : []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>
            <Table2 className="h-[18px] w-[18px] text-primary" />
            Dataset Information
          </CardTitle>
          <CardDescription>Your data is loaded and ready to query.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {stats(dataset).map((stat) => (
              <div
                key={stat.label}
                className="rounded-lg border border-border bg-secondary/40 px-3.5 py-3"
              >
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <stat.icon className="h-3.5 w-3.5" />
                  {stat.label}
                </div>
                <p className="mt-1 truncate font-mono text-sm font-semibold" title={String(stat.value)}>
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          {previewRows.length > 0 && (
            <div className="mt-4">
              <p className="mb-2 text-xs font-medium text-muted-foreground">
                Preview (first {previewRows.length} rows)
              </p>
              <div className="overflow-x-auto rounded-lg border border-border scrollbar-thin">
                <table className="w-full text-left text-xs">
                  <thead className="sticky top-0 bg-secondary/70">
                    <tr>
                      {columnNames.map((col) => (
                        <th
                          key={col}
                          className="whitespace-nowrap px-3 py-2 font-semibold text-muted-foreground"
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewRows.map((row, i) => (
                      <tr
                        key={i}
                        className={i % 2 === 0 ? "bg-card" : "bg-secondary/20"}
                      >
                        {columnNames.map((col) => (
                          <td key={col} className="whitespace-nowrap px-3 py-2 font-mono">
                            {String((row as Record<string, unknown>)[col] ?? "")}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
