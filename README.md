<div align="center">

# 💸 FINORA

### **Your money. One command center. Zero financial chaos.**

A modern personal-finance workspace built to help you **track, understand, plan, and act** on your money — with automation, analytics, recurring transactions, budgets, and an AI finance assistant in one place.

<br />

![Finora](https://img.shields.io/badge/FINORA-Personal%20Finance-0B5D3B?style=for-the-badge)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=111)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=fff)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=fff)
![Supabase](https://img.shields.io/badge/Supabase-Postgres-3ECF8E?style=for-the-badge&logo=supabase&logoColor=111)

<br />

**[🚀 Explore Finora](https://github.com/maazcrafts/Finora)**

</div>

---

## ⚡ The idea

Most finance apps answer:

> **“How much money do I have?”**

Finora is designed around a bigger question:

> **“What is happening with my money — and what should I do next?”**

Instead of scattering transactions, budgets, analytics, recurring expenses, and financial questions across different tools, Finora brings them into a single workflow.

**Capture → Organize → Analyze → Understand → Act**

---

# 🧠 What makes Finora different?

Finora isn't just another expense tracker.

It combines **structured finance management + analytics + natural-language input + AI assistance** into one application.

### ✦ Type naturally

Instead of filling a form every time:

`spent ₹450 on groceries`

`paid 799 for Netflix`

`got paid ₹25,000`

Finora's quick-add parser turns natural language into a transaction you can review and save.

### ✦ Ask your finances questions

The built-in AI finance assistant can work with your financial context and help explain spending patterns, budgets, and transactions.

### ✦ See patterns, not just numbers

Dashboard analytics turn raw transactions into information you can actually use.

### ✦ Automate recurring money

Subscriptions, rent, salaries, EMIs, and other repeating transactions can be represented with recurrence rules instead of being manually recreated every month.

### ✦ Keep financial data isolated

User data is scoped to the authenticated user, with durable persistence backed by Supabase/Postgres and Firebase identity.

---

# 🧩 Core features

| Area | What Finora does |
| --- | --- |
| 🔐 Authentication | Google, email/password, phone OTP |
| 💸 Transactions | Income & expense tracking |
| ⚡ Quick Add | Natural-language transaction parsing |
| 🎙️ Voice Input | Speak a transaction and review before saving |
| 🔁 Recurring Transactions | Repeat expenses/income using recurrence rules |
| 💰 Budgets | Monthly budgets with crossing/overage warnings |
| 📊 Analytics | Spending and financial dashboard insights |
| 🧾 Financial Summary | Dedicated summary view |
| 🤖 AI Assistant | Finance-focused conversational assistant |
| 🔔 Notifications | Budget and finance-related notifications |
| 🗃️ Persistence | Supabase/Postgres durable storage |
| 🛡️ Data Isolation | Per-user authorization through Firebase identity |
| 📱 Responsive UI | Desktop and mobile-friendly experience |

---

# 🎙️ Voice → Finance

One of Finora's fastest workflows:

```text
🎙️  "I spent 650 rupees on dinner today"
                     ↓
              Speech Recognition
                     ↓
             Natural Language Parser
                     ↓
              Transaction Preview
                     ↓
                 Confirm
                     ↓
                  💸 Saved
```

The voice workflow **does not blindly auto-save**. The parsed transaction is shown for review before it is committed.

---

# ⚡ Quick Add

You can enter transactions conversationally:

```text
spent 500 on groceries
paid 999 for Netflix
got paid 30000 salary
received 250 cashback
refund 450 from Amazon
deposit 5000 cash
```

Finora interprets the text, extracts the relevant transaction details, and presents them for confirmation.

---

# 🔁 Recurring transactions

Finora understands that money doesn't only move once.

Examples:

- 🏠 Rent
- 🎵 Streaming subscriptions
- 💻 Software subscriptions
- 💳 EMIs
- 💼 Salary
- 📱 Phone bills
- 🌐 Internet bills

Instead of manually recreating the same transaction, recurrence rules can materialize future transactions according to the configured schedule.

---

# 📊 Finance intelligence

Finora's dashboard is built to move beyond a simple transaction list.

It can surface:

- Income vs expenses
- Spending patterns
- Budget utilization
- Budget crossing warnings
- Financial summaries
- Transaction-level details
- Recurring transaction information
- Notification-driven financial events

The goal is simple:

> **Turn financial records into financial understanding.**

---

# 🤖 AI Finance Assistant

Finora includes a dedicated AI assistant for finance-related conversations.

### Architecture

```text
┌───────────────────────┐
│     Finora Frontend   │
│     React + Vite      │
└───────────┬───────────┘
            │
            ▼
┌───────────────────────┐
│   Finance Assistant   │
│   Context + Prompting │
└───────────┬───────────┘
            │
            ▼
┌───────────────────────┐
│       /api/chat       │
│   Server-side proxy   │
└───────────┬───────────┘
            │
            ▼
┌───────────────────────┐
│       OpenRouter      │
│        AI Models      │
└───────────────────────┘
```

The browser does **not** need to expose the OpenRouter API key.

---

# 🏗️ Architecture

At a high level:

```text
                         ┌──────────────────┐
                         │      FINORA      │
                         └────────┬─────────┘
                                  │
             ┌────────────────────┼────────────────────┐
             │                    │                    │
             ▼                    ▼                    ▼
      ┌────────────┐      ┌──────────────┐      ┌─────────────┐
      │    Auth    │      │   Finance    │      │     AI      │
      │  Firebase  │      │ Transactions │      │  Assistant  │
      └─────┬──────┘      └──────┬───────┘      └──────┬──────┘
            │                    │                     │
            │                    ▼                     ▼
            │             ┌──────────────┐      ┌─────────────┐
            │             │   Supabase   │      │ OpenRouter  │
            │             │  PostgreSQL  │      │     API     │
            │             └──────────────┘      └─────────────┘
            │
            ▼
      Firebase Identity
```

### Frontend

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Context-based application state
- Responsive component architecture

### Identity

- Firebase Authentication
- Google authentication
- Email/password authentication
- Phone OTP authentication
- Firebase ID tokens

### Persistence

- Supabase
- PostgreSQL
- Row Level Security
- Firebase UID-based user isolation

### AI

- OpenRouter
- Server-side API proxy
- Finance-specific assistant service

---

# 🛡️ Security model

Finora treats financial data as user-owned data.

### Authentication

Firebase handles identity.

### Authorization

Supabase policies use the authenticated Firebase identity to scope records to the corresponding user.

Conceptually:

```text
Firebase User
     │
     │ ID Token
     ▼
Supabase Auth Context
     │
     │ verified user identity
     ▼
PostgreSQL RLS
     │
     ▼
Only that user's records
```

### Secrets

Never expose server secrets through Vite variables.

❌ Don't do:

```env
VITE_OPENROUTER_API_KEY=...
VITE_SUPABASE_SERVICE_ROLE_KEY=...
```

✅ Keep server-side secrets server-side.

---

# 🧰 Tech stack

### Frontend

```text
React 19
TypeScript
Vite 8
Tailwind CSS 4
```

### Backend / services

```text
Supabase
PostgreSQL
Firebase Authentication
OpenRouter
```

### Developer workflow

```text
Git
GitHub
VS Code
Vercel
Render
```

---

# 🚀 Run Finora locally

## 1. Clone

```bash
git clone https://github.com/maazcrafts/Finora.git
cd Finora
```

## 2. Install

```bash
npm install
```

## 3. Configure environment

Create:

```text
.env
```

Example frontend configuration:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
```

For AI functionality, keep the OpenRouter credential on the server/API side rather than exposing it as a `VITE_` variable.

## 4. Start development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

# 📜 Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm run lint` | Run TypeScript checks |
| `npm run preview` | Preview production build |

---

# 🗂️ Project structure

```text
Finora/
│
├── api/
│   └── chat.ts
│
├── scripts/
│   └── Supabase / project utilities
│
├── src/
│   ├── components/
│   │   ├── auth/
│   │   ├── assistant/
│   │   ├── advanced/
│   │   ├── dashboard/
│   │   ├── summary/
│   │   └── ...
│   │
│   ├── context/
│   │   └── application contexts
│   │
│   ├── services/
│   │   ├── financeAssistantService.ts
│   │   ├── transactionService.ts
│   │   └── ...
│   │
│   ├── types/
│   │   └── finance.ts
│   │
│   └── App.tsx
│
├── supabase/
│   └── database / policy configuration
│
├── .env.example
├── package.json
└── README.md
```

---

# 🧭 Product flow

```text
              ┌──────────────┐
              │     LOGIN    │
              └──────┬───────┘
                     ▼
              ┌──────────────┐
              │  DASHBOARD   │
              └──────┬───────┘
                     │
       ┌─────────────┼─────────────┐
       ▼             ▼             ▼
  Transactions    Budgets       Summary
       │             │             │
       └─────────────┼─────────────┘
                     ▼
                Analytics
                     │
                     ▼
              AI Assistant
                     │
                     ▼
              Better decisions
```

---

# 🧪 Development principles

Finora is being developed around a few practical principles:

**1. Fast input**

Recording an expense should take seconds, not a form-filling session.

**2. Explain the numbers**

A dashboard should provide context, not just totals.

**3. Automate repetition**

Recurring financial activity should not require repetitive manual entry.

**4. Keep identity and data separate**

Authentication identifies the user; authorization determines what data they can access.

**5. Never expose secrets**

Browser code should never receive server-only credentials.

**6. Review before committing**

Natural-language and voice parsing should provide a clear confirmation step before saving.

---

# 🗺️ Roadmap

Finora is designed to keep evolving.

### Current

- [x] Authentication
- [x] Transaction management
- [x] Budgets
- [x] Recurring transactions
- [x] Dashboard analytics
- [x] Financial summary
- [x] Notifications
- [x] Natural-language quick add
- [x] Voice transaction input
- [x] AI finance assistant
- [x] Supabase persistence
- [x] Responsive auth experience

### Next

- [ ] Deeper financial forecasting
- [ ] Smarter spending categorization
- [ ] More advanced recurring rules
- [ ] Richer financial reports
- [ ] Improved AI financial context
- [ ] More automation around financial goals
- [ ] Expanded mobile experience

---

# 🎯 Why Finora?

Because personal finance shouldn't feel like maintaining a spreadsheet.

You should be able to say:

> **“I spent ₹700 on dinner.”**

and move on.

You should be able to ask:

> **“Where did most of my money go this month?”**

and get an explanation.

You should be able to see:

> **“My subscription is coming up.”**

before it becomes a surprise.

And you should be able to open one dashboard and understand the state of your money.

That's the direction of **Finora**.

---

<div align="center">

## 💚 FINORA

### **Understand your money. Control your future.**

Built with React, TypeScript, PostgreSQL, Firebase, Supabase and AI.

<br />

**Made for people who want their money to make sense.**

<br />

⭐ If Finora is useful to you, consider starring the repository.

</div>
