# Student Assistant AI – Full Stack

This folder contains:

- `frontend/` – premium neon-glass UI (static, for GitHub Pages or any static host)
- `backend/` – secure Node.js + Express API that talks to Gemini using a secret API key in `.env`.

## How to run locally

### 1. Backend

```bash
cd backend
npm install
# copy .env.example to .env and put your real Gemini key
npm start
```

Backend runs on http://localhost:8000

### 2. Frontend

```bash
cd frontend
python -m http.server 3000
```

Open: http://localhost:3000/login.html

## Deployment (summary)

- Push `frontend/` to a GitHub repo and enable GitHub Pages.
- Push `backend/` to a separate repo and deploy to Render / Railway with GEMINI_API_KEY set in environment variables.
- In `frontend/assets/js/gemini.js`, set API_BASE_URL to your deployed backend URL.
