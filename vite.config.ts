import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
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
              res.end(JSON.stringify({ error: 'Method not allowed' }));
              return;
            }

            const apiKey = process.env.OPENROUTER_API_KEY;
            if (!apiKey) {
              res.statusCode = 503;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({
                error: 'OpenRouter is not configured. Add OPENROUTER_API_KEY to your local environment.',
              }));
              return;
            }

            try {
              let raw = '';
              for await (const chunk of req) raw += chunk;
              const body = raw ? JSON.parse(raw) : {};

              const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                  Authorization: `Bearer ${apiKey}`,
                  'Content-Type': 'application/json',
                  'HTTP-Referer': process.env.OPENROUTER_SITE_URL || 'http://localhost:3000',
                  'X-Title': 'FinTrack',
                },
                body: JSON.stringify({
                  model: process.env.OPENROUTER_MODEL || 'openrouter/free',
                  messages: [
                    {
                      role: 'system',
                      content: [
                        'You are FinTrack Assistant, a practical personal-finance helper inside a budgeting app.',
                        'Use the supplied financial context. Never invent financial numbers.',
                        'Give concise, actionable budgeting and spending guidance.',
                        'Do not ask for passwords, API keys, OTPs, card numbers, bank credentials, or other secrets.',
                        'For investments, taxes, loans, or regulated financial decisions, provide general educational information rather than personalized professional advice.',
                        'If unrelated to personal finance or FinTrack, say you are focused on those topics.',
                      ].join('\\n'),
                    },
                    {
                      role: 'user',
                      content: JSON.stringify(body),
                    },
                  ],
                  temperature: 0.4,
                  max_tokens: 500,
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
              res.end(JSON.stringify({ error: 'Unable to reach the financial assistant right now.' }));
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
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});