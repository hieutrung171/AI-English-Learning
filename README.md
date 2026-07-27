# AI English Learning

AI-powered English learning platform built with Next.js, FastAPI, and an extensible agent layer.

## Project structure

```text
.
├── frontend/          # Next.js web app
├── backend/           # FastAPI AI service
├── docker-compose.yml
├── .env.example
└── README.md
```

## Run with Docker

1. Copy `.env.example` to `.env`.
2. Add `OPENAI_API_KEY` if you want to connect an AI model.
3. Start all services:

```bash
docker compose up --build
```

Open:

- Frontend: http://localhost:3000
- Backend API docs: http://localhost:8000/docs
- Backend health check: http://localhost:8000/api/v1/health

## Run locally

### Backend

```bash
cd backend
python -m venv .venv
# Windows: .venv\Scripts\activate
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## API

`POST /api/v1/chat`

```json
{
  "message": "Help me practice ordering coffee",
  "level": "A2"
}
```

The starter returns a deterministic tutor response. Replace the implementation in
`backend/app/agent/service.py` when connecting LangChain or another model provider.
