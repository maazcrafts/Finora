# FinTrack

Personal finance management — track income and expenses, manage monthly budgets, and view spending insights.

**Tagline:** Understand your money. Control your future.

## Stack

- React 19 + Vite 8 + TypeScript
- Tailwind CSS 4
- Firebase Authentication for identity
- Target backend: authenticated API, MongoDB Atlas, and OpenRouter AI service
- Current data implementation: per-user local mock storage; backend migration is not yet implemented

## Quick start

```bash
npm install
cp .env.example .env
# Fill in Firebase web configuration; backend secrets are only used by a server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start Vite dev server on port 3000 |
| `npm run build` | Production build |
| `npm run lint` | Typecheck (`tsc --noEmit`) |
| `npm run preview` | Preview production build |

## Firebase Authentication Setup

FinTrack uses **Firebase Authentication** (not Clerk or a custom OTP backend).

### 1. Create a Firebase project

1. Go to [Firebase Console](https://console.firebase.google.com/).
2. Create a project (or select an existing one).
3. Register a **Web** app and copy the client config values.

### 2. Enable Authentication

1. Open **Build → Authentication → Get started**.
2. Enable these sign-in providers:
   - **Google**
   - **Email/Password** (enable email link / verification as needed — FinTrack uses `sendEmailVerification`)
   - **Phone**

### 3. Google provider

1. In Authentication → Sign-in method → Google → Enable.
2. Set a project support email.
3. Add authorized domains (localhost is included by default for local development).

### 4. Email / Password provider

1. Enable Email/Password.
2. After registration, FinTrack calls Firebase `sendEmailVerification`.
3. Users must verify before accessing the dashboard when signed in with email/password.

### 5. Phone provider (OTP)

1. Enable Phone authentication.
2. For local testing, add test phone numbers under Phone → Phone numbers for testing (optional).
3. FinTrack uses the official web **reCAPTCHA** flow (`RecaptchaVerifier` + `signInWithPhoneNumber`).
4. Ensure your domain is authorized under Authentication → Settings → Authorized domains.

### 6. Authorized domains

Add any production host (e.g. `yourdomain.com`) under **Authentication → Settings → Authorized domains**.

### 7. Frontend environment variables

Create a `.env` file in the project root (never commit real secrets beyond the normal Firebase web client config):

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Use only the **client** Firebase config in the frontend. Do **not** put service account JSON, Admin SDK keys, or other server secrets in the Vite app.

### 8. Start the app and test

```bash
npm run dev
```

Test checklist:

1. **Google** — Continue with Google → lands on dashboard with profile photo/name.
2. **Email registration** — Create account → verify-email screen → open link in inbox → “I've verified my email”.
3. **Email login** — Sign in with verified credentials.
4. **Forgot password** — Request reset → check email (success message does not reveal whether the account exists).
5. **Phone OTP** — Enter +91 mobile → Send OTP → enter 6-digit code.
6. **Logout** — Profile menu or Settings → Log out → protected pages require sign-in again.

## Data isolation

Current mock transaction, budget, and notification storage keys are scoped by Firebase `user.uid` (not email). This is transitional local storage, not the target application database.

## Target Backend Architecture

The target architecture keeps the Vite + React frontend and uses Firebase Authentication only for identity. An API must verify the Firebase ID token on every protected request, then use the verified UID to access MongoDB Atlas. The frontend must not choose the UID used for authorization.

AI requests must go through the backend and a reusable AI service backed by OpenRouter. Do not call OpenRouter directly from browser code. Never expose `MONGODB_URI` or `OPENROUTER_API_KEY` through Vite or a `VITE_` variable. Firestore is not used.

These backend integrations are not implemented yet; see [AGENTS.md](AGENTS.md) for rules to follow while building them.

## Notes / limitations

- Transaction/budget persistence is **localStorage per UID** (not Cloud Firestore/MongoDB yet).
- Phone auth requires a real Firebase project with Phone provider + reCAPTCHA configured.
- Without `.env` Firebase keys, the UI loads but sign-in shows a clear configuration error.
