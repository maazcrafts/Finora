import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  // Vite does not automatically expose .env values to vite.config.ts.
  // Load all environment variables here so the local dev API can see
  // OPENROUTER_API_KEY without exposing it to the browser.
  const env = loadEnv(mode, process.cwd(), '');
  const apiKey = env.OPENROUTER_API_KEY;
  const siteUrl = env.OPENROUTER_SITE_URL || 'http://localhost:3000';
  const model = env.OPENROUTER_MODEL || 'openrouter/free';

  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'fintrack-openrouter-dev-api',
        configureServer(server: any) {
          server.middlewares.use('/api/chat', async (req: any, res: any) => {
            if (req.method !== 'POST') {
              res.statusCode = 405;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({error: 'Method not allowed'}));
              return;
            }

            if (!apiKey) {
              res.statusCode = 503;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({
                error: 'OpenRouter is not configured. Add OPENROUTER_API_KEY to your local .env and restart the Vite dev server.',
              }));
              return;
            }

            try {
              let raw = '';
              for await (const chunk of req) raw += chunk;
              const body = raw ? JSON.parse(raw) : {};

              const safeMessages = Array.isArray(body.messages)
                ? body.messages
                    .filter(
                      (message: any) =>
                        message &&
                        (message.role === 'user' || message.role === 'assistant') &&
                        typeof message.content === 'string',
                    )
                    .slice(-12)
                    .map((message: any) => ({
                      role: message.role,
                      content: message.content.slice(0, 4000),
                    }))
                : [];

              const contextText =
                body.context && typeof body.context === 'object'
                  ? JSON.stringify(body.context)
                  : '{}';

              const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                  Authorization: `Bearer ${apiKey}`,
                  'Content-Type': 'application/json',
                  'HTTP-Referer': siteUrl,
                  'X-Title': env.OPENROUTER_APP_NAME || 'FinTrack',
                },
                body: JSON.stringify({
                  model,
                  messages: [
                    {
                      role: 'system',
                      content: [
                        'You are FinTrack Assistant, a practical personal-finance helper inside a budgeting app.',
                        'Use the supplied financial context. Never invent financial numbers.',
                        'Keep every answer short, clear, and easy to scan.',
                        'Prefer 1-3 short sentences or 2-3 bullet points. Avoid long introductions, repetition, filler, and unnecessary explanations.',
                        'When comparing spending categories, use a compact format such as: "Food — ₹4,850 (28%)" rather than a long paragraph.',
                        'Use ₹ for monetary amounts unless the user explicitly uses another currency.',
                        'Give one practical next step when appropriate.',
                        'Do not ask for passwords, API keys, OTPs, card numbers, bank credentials, or other secrets.',
                        'For investments, taxes, loans, or regulated financial decisions, provide general educational information rather than personalized professional advice.',
                        'If unrelated to personal finance or FinTrack, say you are focused on those topics.',
                        '',
                        `Current FinTrack financial context: ${contextText}`,
                      ].join('\n'),
                    },
                    ...safeMessages,
                  ],
                  temperature: 0.3,
                  max_tokens: 250,
                }),
              });

              const data = await response.json();
              res.statusCode = response.status;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({
                answer: data?.choices?.[0]?.message?.content,
                error: data?.error?.message,
              }));
            } catch {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({error: 'Unable to reach the financial assistant right now.'}));
            }
          });
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: env.DISABLE_HMR !== 'true',
      watch: env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
