import axios, { AxiosError } from "axios";
import type {
  ChatRequest,
  ChatResponse,
  HistoryItem,
  UploadResponse,
} from "@/types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8080";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
});

/** Normalizes axios errors into a readable message + optional backend detail. */
export function extractErrorMessage(error: unknown): {
  message: string;
  detail?: string;
} {
  if (axios.isAxiosError(error)) {
    const err = error as AxiosError<{ detail?: string; message?: string }>;
    const detail = err.response?.data?.detail || err.response?.data?.message;
    if (!err.response) {
      return { message: "Unable to reach the server. Is the backend running?" };
    }
    return {
      message: `Request failed (${err.response.status})`,
      detail: typeof detail === "string" ? detail : undefined,
    };
  }
  if (error instanceof Error) {
    return { message: error.message };
  }
  return { message: "Something went wrong" };
}

export async function uploadDataset(
  file: File,
  onProgress?: (percent: number) => void
): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await apiClient.post<UploadResponse>("/upload/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (evt) => {
      if (onProgress && evt.total) {
        onProgress(Math.round((evt.loaded / evt.total) * 100));
      }
    },
  });
  return data;
}

export async function askQuestion(payload: ChatRequest): Promise<ChatResponse> {
  const { data } = await apiClient.post<ChatResponse>("/chat/", payload);
  return data;
}

export async function fetchHistory(): Promise<HistoryItem[]> {
  const { data } = await apiClient.get<HistoryItem[]>("/history/");
  return Array.isArray(data) ? data : [];
}

export async function clearHistory(): Promise<void> {
  await apiClient.delete("/history/");
}

async function downloadBlob(
  url: string,
  body: Record<string, unknown>,
  filename: string
) {
  const response = await apiClient.post(url, body, { responseType: "blob" });
  const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = blobUrl;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(blobUrl);
}

export async function exportExcel(): Promise<void> {
  const response = await apiClient.post(
    "/export/excel",
    {},
    {
      responseType: "blob",
    }
  );

  const blobUrl = window.URL.createObjectURL(new Blob([response.data]));

  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = "query_results.xlsx";
  document.body.appendChild(link);
  link.click();
  link.remove();

  window.URL.revokeObjectURL(blobUrl);
}

export async function exportPdf(): Promise<void> {
  const response = await apiClient.post(
    "/export/pdf",
    {},
    {
      responseType: "blob",
    }
  );

  const blobUrl = window.URL.createObjectURL(new Blob([response.data]));

  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = "query_results.pdf";
  document.body.appendChild(link);
  link.click();
  link.remove();

  window.URL.revokeObjectURL(blobUrl);
}