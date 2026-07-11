export interface DatasetInfo {
  filename: string;
  rows: number;
  columns: number;
  table_name: string;
  preview?: Record<string, unknown>[];
  column_names?: string[];
}

export interface UploadResponse {
  filename: string;
  rows: number;
  columns: number;
  table_name: string;
  preview?: Record<string, unknown>[];
  column_names?: string[];
  [key: string]: unknown;
}

export interface ChatRequest {
  question: string;
}

export interface ChatResponse {
  question: string;
  generated_sql: string;
  results: Record<string, unknown>[];
  insights: string;
}

export interface HistoryItem {
  id?: string | number;
  question: string;
  timestamp: string;
  generated_sql?: string;
}

export type ProcessingStage =
  | "idle"
  | "generating_sql"
  | "executing_query"
  | "generating_insights"
  | "done"
  | "error";

export interface ApiErrorShape {
  message: string;
  detail?: string;
}
