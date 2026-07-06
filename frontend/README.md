# Summaries — Frontend

A small React (Vite) client for the FastAPI text-summary backend. Full CRUD:
list, view, create, edit, delete.

## Structure

```
frontend/
  index.html
  src/
    main.jsx          # React entry point
    App.jsx            # top-level state + layout
    api.js              # all backend calls live here, nowhere else
    components/
      SummaryCard.jsx  # one row: expand, edit, delete
    styles.css
```

`api.js` is the one file that knows the backend's shape (URLs, JSON payloads,
error format). Every component just calls `api.list()`, `api.create()`, etc. —
if the backend's routes ever change, this is the only file to touch.

## Setup

```
cd frontend
npm install
cp .env.example .env      # edit if your API isn't on localhost:8004
npm run dev
```

Opens on `http://localhost:3000`.

## Connecting to your deployed API

Set `VITE_API_URL` in `.env` to your Render URL, e.g.:

```
VITE_API_URL=https://text-summary-repo.onrender.com
```

## Important: CORS

Your FastAPI backend needs to explicitly allow requests from this frontend's
origin, or the browser will block every request. Add this to
`project/app/main.py`, right after creating the app:

```python
from fastapi.middleware.cors import CORSMiddleware

application.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://your-frontend-domain.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

Without this, you'll see a CORS error in the browser console even though the
API itself works fine (e.g. via `http`/`curl`) — this is a browser-enforced
restriction, not a backend bug.
