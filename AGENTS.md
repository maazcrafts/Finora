# Finora architecture rules

1. Keep the frontend on Vite + React + TypeScript. Do not migrate it to Next.js.
2. Keep all browser application code under `frontend/`; GitHub Pages publishes only the static `frontend/dist/` output.
3. Keep Node.js API code and server-only dependencies under `backend/`. GitHub Pages cannot execute this backend.
4. Firebase Authentication is used for user identity; Supabase PostgreSQL is the finance-data store. Do not introduce Firestore or MongoDB without an explicit architecture decision.
5. `VITE_FIREBASE_*`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, and `VITE_API_BASE_URL` are public frontend build-time configuration. Never place secret keys in any `VITE_*` variable.
6. Keep `OPENROUTER_API_KEY`, Firebase Admin credentials, and Supabase service-role/secret keys server-side only.
7. The backend must validate authentication and authorization before exposing or modifying private user data. Never trust a user ID supplied by the frontend as proof of identity.
8. Route AI requests through the backend. Keep the provider API key out of the browser bundle.
9. Do not introduce new financial-data persistence in localStorage; existing local fallback behavior is transitional and should be handled deliberately.
10. Do not claim deployment or a feature is working until it has been built or tested successfully.
