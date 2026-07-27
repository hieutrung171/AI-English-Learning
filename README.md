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

## MVP Phase 1

- Account registration and secure cookie-based sign-in
- Server-side role-based access control (`learner` and `admin`)
- Vietnamese/English interface with saved language preference
- Adaptive CEFR conversation tutor with topic-aware feedback
- Smart travel flashcards prepared for spaced-repetition scheduling
- Personalised multiple-choice grammar exercises with explanations
- Responsive learning dashboard with skill progress, streaks and daily goals
- Light/dark theme and mobile navigation

## API endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/v1/health` | Service health check |
| `POST` | `/api/v1/chat` | Conversational tutor |
| `POST` | `/api/v1/flashcards/generate` | Generate a vocabulary deck |
| `POST` | `/api/v1/exercises/generate` | Generate grammar exercises |
| `POST` | `/api/v1/writing/check` | Writing and grammar feedback |
| `POST` | `/api/v1/auth/register` | Create a learner account |
| `POST` | `/api/v1/auth/login` | Sign in and create a secure session |
| `POST` | `/api/v1/auth/logout` | End the current session |
| `GET` | `/api/v1/auth/me` | Read the signed-in profile |
| `GET` | `/api/v1/admin/users` | List users (admin only) |

Example conversation request:

```json
{
  "message": "Help me practice ordering coffee",
  "level": "A2",
  "topic": "Restaurant"
}
```

The current agent includes deterministic development engines so the project works
without an API key. The service layer in `backend/app/agent/service.py` is the
integration point for OpenAI, Gemini, Claude or LangChain.

## Roles and administrator account

Every public registration receives the `learner` role. To create the initial
administrator, set these values in `.env` before starting Docker:

```env
JWT_SECRET=use-a-long-random-secret-here
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=choose-a-strong-password
```

Then rebuild the backend:

```bash
docker compose up -d --build
```

The administrator account is created only when both admin values are present and
the password contains at least 8 characters. Restarting the backend updates the
configured administrator password and keeps the account assigned to the admin role.
Authorization is enforced by FastAPI, so learner accounts cannot call admin APIs.

## Delivery roadmap

- **Phase 1:** Conversation tutor, flashcards, grammar exercises — implemented
- **Phase 2:** Writing grader, speech-to-text pronunciation coach
- **Phase 3:** IELTS/TOEIC practice, gamification and leaderboard
- **Phase 4:** PWA, offline learning and learner community
