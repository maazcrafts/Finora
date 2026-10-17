import type { IncomingMessage, ServerResponse } from 'node:http';

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

type FinanceContext = {
  balance: number;
  totalIncome: number;
  totalExpenses: number;
  transactionCount: number;
  budget: number;
  budgetSpent: number;
  budgetRemaining: number;
  topCategories: Array<{ category: string; amount: number; percentage: number }>;
  recentTransactions: Array<{
    date: string;
    type: 'income' | 'expense';
    category: string;
    amount: number;
    description: string;
  }>;
};

const MODEL = process.env.OPENROUTER_MODEL || 'openrouter/free';

function sendJson(res: ServerResponse, status: number, payload: unknown) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(payload));
}

async function readBody(req: IncomingMessage): Promise<any> {
  let raw = '';
  for await (const chunk of req) raw += chunk;
  return raw ? JSON.parse(raw) : {};
}

function buildSystemPrompt(context: FinanceContext): string {
  return [
    'You are FinTrack Assistant, a practical personal-finance helper inside a budgeting app.',
    'Answer questions about budgeting, spending habits, saving, transaction organization, and how to use FinTrack.',
    'Use the supplied financial context when it is relevant. Never invent financial numbers.',
    'Keep every answer short, clear, and easy to scan.',
    'Prefer 1-3 short sentences or 2-3 bullet points. Avoid long introductions, repetition, filler, and unnecessary explanations.',
    'When comparing spending categories, use a compact format such as: "Food — ₹4,850 (28%)" rather than a long paragraph.',
    'Use ₹ for monetary amounts unless the user explicitly uses another currency.',
    'Give one practical next step when appropriate.',
    'Do not present yourself as a licensed financial adviser. For investments, taxes, loans, or other regulated/high-stakes financial decisions, provide general educational information and suggest checking an appropriate professional or official source.',
    'Never ask for passwords, API keys, OTPs, card numbers, bank credentials, or other secrets.',
    'If a question is unrelated to personal finance or FinTrack, briefly say you are focused on those topics.',
    '',
    'CURRENT USER FINANCIAL CONTEXT:',
    JSON.stringify(context),
  ].join('\n');
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== 'POST') {
    sendJson(res, 405, { error: 'Method not allowed' });
    return;
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    sendJson(res, 503, {
      error: 'OpenRouter is not configured. Add OPENROUTER_API_KEY to the server environment.',
    });
    return;
  }

  try {
    const body = await readBody(req);
    const messages = Array.isArray(body.messages) ? body.messages : [];
    const context = body.context as FinanceContext | undefined;

    if (!context || messages.length === 0) {
      sendJson(res, 400, { error: 'Chat messages and financial context are required.' });
      return;
    }

    const safeMessages = messages
      .filter((message: ChatMessage) => message && (message.role === 'user' || message.role === 'assistant'))
      .slice(-12)
      .map((message: ChatMessage) => ({
        role: message.role,
        content: String(message.content).slice(0, 4000),
      }));

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.OPENROUTER_SITE_URL || 'http://localhost:3000',
        'X-Title': 'FinTrack',
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: buildSystemPrompt(context) },
          ...safeMessages,
        ],
        temperature: 0.3,
        max_tokens: 250,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      const message = data?.error?.message || 'OpenRouter request failed.';
      sendJson(res, response.status >= 500 ? 502 : response.status, { error: message });
      return;
    }

    const answer = data?.choices?.[0]?.message?.content;
    if (!answer) {
      sendJson(res, 502, { error: 'The AI returned an empty response.' });
      return;
    }

    sendJson(res, 200, { answer });
  } catch (error) {
    console.error('FinTrack AI error:', error);
    sendJson(res, 500, { error: 'Unable to reach the financial assistant right now.' });
  }
}
