# Finora

Finora is a personal-finance dashboard for tracking transactions, budgets, spending patterns, recurring transactions, and finance-related questions.

## Repository structure

```text
Finora/
├── frontend/                 # React + TypeScript + Vite static website
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── services/
│   │   ├── firebase/
│   │   └── lib/
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts
├── backend/                  # Express API; deploy separately from Pages
│   ├── api/chat.ts
│   ├── server.ts
│   └── package.json
├── supabase/                 # PostgreSQL schema and SQL
├── .github/workflows/        # GitHub Pages build/deploy workflow
├── SUPABASE_SETUP.md
└── README.md
```

## Deploy the frontend to GitHub Pages

A GitHub Actions workflow builds `frontend/` and publishes `frontend/dist/`. After pushing to `main`:

1. Open **Settings → Pages** in this repository.
2. Under **Build and deployment**, select **GitHub Actions** as the source.
3. Add the repository Actions secrets listed below.
4. Open **Actions** and check the **Deploy Finora frontend to GitHub Pages** workflow.

Required Actions secrets:

- `VITE_API_BASE_URL`: public URL of the separately deployed backend, without a trailing slash.
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

Values prefixed with `VITE_` are embedded into the public frontend bundle. Only use public client configuration and publishable keys there; never use a Supabase service-role key, Firebase Admin credentials, or an OpenRouter key.

The site URL will be `https://maazcrafts.github.io/Finora/`. Add `maazcrafts.github.io` to Firebase Authentication's authorized domains. Configure Supabase third-party Firebase authentication and row-level security as documented in [SUPABASE_SETUP.md](./SUPABASE_SETUP.md).

## Run locally

Terminal 1 — backend:

```bash
cd backend
cp .env.example .env
# Add OPENROUTER_API_KEY to backend/.env
npm install
npm run dev
```

Terminal 2 — frontend:

```bash
cd frontend
cp .env.example .env
# Fill in Firebase/Supabase client configuration
npm ci
npm run dev
```

Vite runs on `http://localhost:3000`; the API runs on `http://localhost:8787`. Set `VITE_API_BASE_URL=http://localhost:8787` in `frontend/.env`.

## Backend deployment

GitHub Pages cannot run Node.js or the AI API. Deploy `backend/` as a separate Node.js web service. Use `npm install` for installation and `npm start` for startup, then configure `OPENROUTER_API_KEY`, `OPENROUTER_MODEL`, and `FRONTEND_ORIGIN` in that service's environment. The health endpoint is `/health`.

## Database setup

See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for Supabase configuration and SQL setup.
