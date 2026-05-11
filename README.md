# AI Resume Analyzer

Production-style full-stack resume analysis app built with React 18, Vite, Tailwind CSS, Framer Motion, Express, and the Anthropic Claude API.

## Stack

- Frontend: React 18 + Vite + Tailwind CSS + Framer Motion
- Backend: Node.js + Express
- AI: Anthropic Claude `claude-sonnet-4-20250514`
- Parsing: `pdf-parse`, `mammoth`, plain text fallback
- Charts: Recharts
- Export: `html2canvas` + `jspdf`

## Project Structure

```text
resume analyzer/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   └── utils/
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── server/
│   ├── middleware/
│   ├── prompts/
│   ├── routes/
│   ├── services/
│   ├── index.js
│   └── package.json
├── .env
├── .env.example
└── package.json
```

## Features

- Resume upload for PDF, DOCX, and TXT files
- ATS scoring and section-by-section breakdown
- Strengths, weaknesses, missing keyword detection, and action items
- Job description matching with re-analysis
- AI rewrite panel for summary, experience, and skills
- Radar chart section benchmarking
- PDF report export
- Local history of recent analyses
- In-memory file handling with no resume persistence

## Environment Variables

Copy `.env.example` to `.env` and provide a valid Anthropic API key:

```env
ANTHROPIC_API_KEY=your_key_here
PORT=5000
NODE_ENV=development
MAX_FILE_SIZE_MB=5
```

## Install

```bash
npm run install:all
```

If you prefer manual installs:

```bash
npm install
cd client && npm install
cd ../server && npm install
```

## Run Locally

Start both frontend and backend:

```bash
npm run dev
```

App URLs:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

## Build

```bash
npm run build
```

## API

### `POST /api/analyze`

Request: `multipart/form-data`

- `file` required, accepts PDF/DOCX/TXT
- `jobDescription` optional string

Success response:

```json
{
  "success": true,
  "data": {
    "overallScore": 78,
    "atsScore": 82
  },
  "meta": {
    "wordCount": 542,
    "processingTimeMs": 3241,
    "model": "claude-sonnet-4-20250514"
  }
}
```

Common failure responses:

- `400` invalid type, missing file, file too large, unreadable file, empty or scanned resume
- `500` malformed AI JSON after retry, or missing server API key
- `502` upstream AI service unavailable
- `504` AI request timeout

## Notes

- Resume content is sanitized before being inserted into prompts.
- Resume files are parsed in memory and are not stored on disk.
- The backend retries once if Claude returns malformed JSON.
- Quick tips are generated separately so the main analysis schema stays stable.
