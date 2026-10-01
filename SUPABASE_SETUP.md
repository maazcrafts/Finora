# Finora + Supabase PostgreSQL

Finora keeps Firebase Authentication and uses Supabase PostgreSQL for durable finance data.

## 1. Create the Supabase project

Create a Supabase project and copy:
- Project URL
- Publishable key

Add them to local `.env`:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
```

Never put a Supabase secret/service-role key in frontend code.

## 2. Connect Firebase Authentication

In Supabase:

Authentication → Third-party Auth → Firebase

Enter the Firebase Project ID used by Finora.

Supabase must trust the Firebase ID tokens used by the existing app.

## 3. Give Firebase users the authenticated role

Supabase's Firebase third-party integration expects Firebase JWTs to contain:

```json
{
  "role": "authenticated"
}
```

For existing users, configure Google Application Default Credentials for Firebase Admin and run:

```bash
node scripts/set-supabase-role.mjs
```

For newly created users, add the same custom claim through a Firebase Authentication trigger/function so future ID tokens also contain `role=authenticated`.

After assigning the claim, sign out/in or force-refresh the Firebase ID token.

## 4. Create the PostgreSQL tables

Open Supabase → SQL Editor and run the contents of:

`supabase/schema.sql`

The schema enables RLS and restricts rows to the Firebase user's JWT subject.

## 5. Start Finora

```bash
npm install
npm run dev
```

## Data behavior

- Existing localStorage data is retained.
- On first Supabase connection, existing local finance data is uploaded.
- On later sign-in, Supabase is used to hydrate the finance state.
- Local storage remains an offline fallback if Supabase is temporarily unavailable.
- New transactions, budget changes, notifications, and profile changes are synced to PostgreSQL.

This gives Finora a cloud persistence layer without making a temporary Supabase outage destroy the user's local working state.
