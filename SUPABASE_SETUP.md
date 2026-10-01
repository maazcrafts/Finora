# Finora + Supabase PostgreSQL

Finora keeps Firebase Authentication and uses Supabase PostgreSQL for durable finance data.

## Existing Supabase project

Finora uses the existing Alfiya Mehendi Supabase project instead of creating another Supabase project.

- Project ref: `kqpumgzmhfhoucfdvlqk`
- Project URL: `https://kqpumgzmhfhoucfdvlqk.supabase.co`

The Finora tables are added to the same PostgreSQL database and coexist with the existing Alfiya Mehendi tables.

## 1. Environment variables

Add these to Finora's local `.env`:

```env
VITE_SUPABASE_URL=https://kqpumgzmhfhoucfdvlqk.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
```

Get the Publishable key from Supabase Dashboard → Settings → API Keys.

Never put a Supabase secret/service-role key in frontend code.

## 2. Connect Firebase Authentication

In the same Supabase project:

Authentication → Third-party Auth → Firebase

Enter the Firebase Project ID used by Finora.

Supabase supports Firebase Auth as a third-party authentication provider. The Firebase JWT is passed to the Supabase client through the `accessToken` callback.

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

## 4. Create the Finora PostgreSQL tables

Open Supabase → SQL Editor and run the complete contents of:

`supabase/schema.sql`

The migration is idempotent for the Finora tables and does not drop or modify the existing Alfiya Mehendi tables.

The RLS policies restrict each row to the Firebase UID in the JWT `sub` claim.

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
