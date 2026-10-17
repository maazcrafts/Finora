# Finora backend

This Node.js/Express service hosts the private AI chat endpoint. GitHub Pages only hosts the static frontend; deploy this service separately (for example, as a Node web service).

## Local development

1. Copy `.env.example` to `.env` and set `OPENROUTER_API_KEY`.
2. Install dependencies: `npm install`.
3. Start the API: `npm run dev`.
4. Verify `http://localhost:8787/health`.

The frontend should set `VITE_API_BASE_URL=http://localhost:8787`.

## Deployment

Use `npm install` as the install command and `npm start` as the start command. Configure the server environment variables in the hosting dashboard. Set `FRONTEND_ORIGIN=https://maazcrafts.github.io` for the GitHub Pages site.

Never expose `OPENROUTER_API_KEY` through a `VITE_*` variable or put it in the frontend.
