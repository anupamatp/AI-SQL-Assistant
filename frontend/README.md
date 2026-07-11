# AI SQL Assistant — Frontend

A polished React + TypeScript frontend for an AI-powered SQL analytics tool. This is a **frontend-only** project — it talks to your existing FastAPI backend and does not modify or invent any backend endpoints.

## Stack

- React 19 + Vite + TypeScript
- Tailwind CSS with a small shadcn/ui-style component set (Button, Card, Input, Textarea, Badge, Skeleton)
- Lucide React icons
- Axios for API calls
- Framer Motion for transitions
- Sonner for toast notifications

## Getting started

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

## Connecting to your backend

Copy `.env.example` to `.env` (already done) and set the backend URL:

```
VITE_API_BASE_URL=http://localhost:8000
```

The app expects these existing endpoints, used exactly as-is:

| Method | Endpoint         | Purpose                          |
| ------ | ---------------- | --------------------------------- |
| POST   | `/upload`         | Upload a CSV/XLSX/XLS dataset (multipart form, field name `file`) |
| POST   | `/chat`           | Ask a question — body `{ "question": "..." }` |
| GET    | `/history`        | List of previous questions |
| POST   | `/export/excel`   | Export current results as Excel (body `{ "generated_sql": "..." }`) |
| POST   | `/export/pdf`     | Export current results as PDF (body `{ "generated_sql": "..." }`) |

If your backend's field names differ slightly (e.g. `preview` or `column_names` on the upload response), adjust the mapping in `src/services/api.ts` and `src/types/index.ts` — everything else in the UI reads from those two files.

## Project structure

```
src/
  components/       Feature components (Header, Sidebar, UploadCard, DatasetCard,
                     AskCard, InsightsCard, SQLCard, ResultsTable, ExportCard, ...)
  components/ui/     Small reusable primitives (Button, Card, Input, Textarea, Badge, Skeleton)
  services/api.ts     Axios instance + typed API calls
  types/index.ts      Shared TypeScript interfaces
  lib/utils.ts         cn() class helper + formatting helpers
  App.tsx               App state, layout, and data flow
```

## Notes

- Dark mode toggle in the header flips a `dark` class on `<html>`; the current design tokens are tuned for the light theme described in the brief, so dark mode uses the same palette variables and can be extended in `src/index.css` if you want a distinct dark palette.
- The "Upload → Ask → Analyze" stepper in the header reflects real state (whether a dataset is loaded and whether a query has completed), not a static label.
- All error states render as inline alert cards — the UI never throws on a failed request.
