# FinTrack Architecture Rules

1. Keep the existing application on Vite + React. Do not migrate it to Next.js.
2. Use Firebase Authentication only for sign-in and identity.
3. Use MongoDB Atlas as the application database. Do not use Firestore.
4. Keep `MONGODB_URI` and `OPENROUTER_API_KEY` server-only. Never prefix either with `VITE_` or expose them to browser code.
5. Treat `VITE_FIREBASE_*` values as public Firebase Web App configuration only. Never put Firebase Admin credentials in the frontend.
6. The backend must verify each Firebase ID token and use the verified Firebase UID for data access. Never authorize from a `userId` or `firebaseUid` supplied by the frontend.
7. Route all AI requests through the backend. Keep OpenRouter behind a reusable AI service (for example, `services/aiService`) so the provider or model can change independently of the UI.
8. Do not add new financial-data persistence to `localStorage`. The existing local mock persistence is transitional and must be replaced by authenticated backend APIs as the MongoDB layer is implemented.
9. The backend and MongoDB/OpenRouter integration are not wired yet. Do not describe them as working until implemented and verified.