# Finora + Supabase PostgreSQL

Finora uses Firebase Authentication for identity and Supabase PostgreSQL for durable finance data.

## Existing Supabase project

Finora uses the existing Alfiya Mehendi Supabase project.

- Project ref: `kqpumgzmhfhoucfdvlqk`
- Project URL: `https://kqpumgzmhfhoucfdvlqk.supabase.co`

The Finora tables coexist with the existing Alfiya Mehendi tables.

## 1. Frontend environment

Create `frontend/.env` using `frontend/.env.example` and set:

```env
VITE_SUPABASE_URL=https://kqpumgzmhfhoucfdvlqk.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
```

Get the publishable key from Supabase Dashboard → Settings → API Keys. Never place a secret/service-role key in frontend code.

## 2. Connect Firebase Authentication

In the Supabase project, open **Authentication → Third-party Auth → Firebase** and enter the Firebase Project ID used by Finora.

The Supabase client passes the Firebase ID token through its `accessToken` callback.

## 3. Assign the authenticated role

Supabase's Firebase third-party integration expects Firebase JWTs to contain:

```json
{ "role": "authenticated" }
```

Configure Google Application Default Credentials for Firebase Admin, then run the helper from the repository root:

```bash
cd backend
npm install
node scripts/set-supabase-role.mjs
```

For newly created users, add the same custom claim through a Firebase Authentication trigger/function. After assigning the claim, sign out and back in or refresh the Firebase ID token.

## 4. Create the database tables

Open Supabase → SQL Editor and run the complete contents of `supabase/schema.sql`. The migration is designed for Finora's tables and should not drop the existing Alfiya Mehendi tables.

Review the row-level security policies before using real financial data.

## 5. Run the application

Follow the two-terminal instructions in the root [README](./README.md). The frontend and backend are separate processes; the GitHub Pages deployment publishes only the frontend.

## Data behavior

- Existing localStorage data is retained as the current offline/fallback behavior.
- Supabase stores persistent finance data when configured.
- The app syncs finance records through its Supabase services.
