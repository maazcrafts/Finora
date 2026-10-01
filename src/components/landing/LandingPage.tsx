import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { Button } from '../ui/Button';
import {
  ArrowRight,
  Receipt,
  PieChart,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Mail,
  BellRing,
  Repeat2,
  BarChart3,
  LineChart,
  Target,
} from 'lucide-react';

const MONEY_SLIDES = [
  {
    label: 'Balance',
    value: 'What you have left',
    description: 'See your available balance after recorded income and expenses.',
    icon: TrendingUp,
  },
  {
    label: 'Transactions',
    value: 'Track every move',
    description: 'Keep income and expenses organized with categories, dates, and notes.',
    icon: Receipt,
  },
  {
    label: 'Budget',
    value: 'Know what remains',
    description: 'Set a monthly limit and see how much you can still spend.',
    icon: PieChart,
  },
  {
    label: 'Insights',
    value: 'Spot spending patterns',
    description: 'Understand where your money goes and get practical suggestions.',
    icon: Sparkles,
  },
];

export const LandingPage: React.FC = () => {
  const { openAuthPage, setActivePage } = useFinance();

  return (
    <div className="bg-white min-h-screen text-[#111111]">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-[#E5E7EB] bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-[1240px] items-center justify-between px-3 sm:h-16 sm:px-6">
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-3"
            aria-label="Go to Finora home"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#0B5D3B] text-sm font-bold text-white shadow-sm">
              FN
            </div>
            <span className="text-base font-bold tracking-tight text-[#111111] sm:text-lg">
              FINORA
            </span>
          </button>

          <nav className="hidden items-center gap-7 text-xs font-semibold text-[#4B5563] md:flex">
            <a href="#features" className="transition-colors hover:text-[#111111]">
              Features
            </a>
            <a href="#preview" className="transition-colors hover:text-[#111111]">
              Overview
            </a>
            <a href="#advanced" className="transition-colors hover:text-[#111111]">
              Advanced
            </a>
          </nav>

          <div className="flex items-center gap-1 sm:gap-2.5">
            <button
              onClick={() => openAuthPage('login')}
              className="px-2 py-1.5 text-[11px] font-semibold text-[#111111] transition-colors hover:text-[#0B5D3B] sm:px-3 sm:text-xs"
            >
              Sign In
            </button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => openAuthPage('register')}
            >
              <span className="hidden sm:inline">Get Started</span>
              <span className="sm:hidden">Start</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-[1240px] px-3 py-12 text-center sm:px-6 sm:py-20 lg:py-24">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#0B5D3B]/15 bg-[#0B5D3B]/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#0B5D3B]">
          <Sparkles className="h-3.5 w-3.5" />
          <span className="whitespace-nowrap">PERSONAL FINANCE, SIMPLIFIED</span>
        </div>

        <h1 className="mx-auto max-w-3xl text-3xl font-bold leading-[1.08] tracking-tight text-[#111111] sm:text-5xl lg:text-6xl">
          Understand where your money goes.
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-[#6B7280] sm:mt-5 sm:text-lg sm:leading-relaxed">
          Track spending, manage budgets and turn everyday transactions into clear financial insights.
        </p>

        <div className="mx-auto mt-7 flex w-full max-w-md flex-col items-stretch justify-center gap-2.5 sm:mt-8 sm:w-auto sm:max-w-none sm:flex-row sm:items-center sm:gap-3">
          <Button
            variant="primary"
            size="lg"
            icon={<ArrowRight className="h-4 w-4" />}
            onClick={() => openAuthPage('register')}
          >
            Get Started Free
          </Button>
          <button
            onClick={() => setActivePage('how-it-works')}
            className="rounded-lg border border-[#E5E7EB] px-5 py-2.5 text-sm font-semibold text-[#111111] transition-colors hover:bg-[#F7F8F6]"
          >
            See how it works
          </button>
        </div>

        {/* Continuous money slider */}
        <div id="preview" className="mt-10 w-screen -ml-[calc((100vw-100%)/2)] overflow-hidden border-y border-[#E5E7EB] bg-[#F7F8F6] py-5 text-left shadow-sm sm:mt-14 sm:py-7">
          <div className="mx-auto mb-4 w-full max-w-[1240px] px-4 sm:mb-5 sm:px-6 lg:px-8">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#0B5D3B]">
              Built around your money
            </p>
            <p className="mt-1 text-sm text-[#6B7280]">
              Everything you need to stay on top of your finances.
            </p>
          </div>

          <div className="relative overflow-hidden">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-[#F7F8F6] to-transparent sm:w-16" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-[#F7F8F6] to-transparent sm:w-16" />

            <div className="finora-marquee flex w-max gap-3 sm:gap-4">
              {[...MONEY_SLIDES, ...MONEY_SLIDES].map((item, index) => {
                const Icon = item.icon;
                return (
                  <div
                    key={`${item.label}-${index}`}
                    className="finora-marquee-card w-[calc(100vw-40px)] max-w-[310px] shrink-0 rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-sm sm:w-[310px] sm:p-5"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#0B5D3B]/10 text-[#0B5D3B]">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-[#6B7280]">
                          {item.label}
                        </p>
                        <h2 className="mt-1 text-lg font-bold tracking-tight text-[#111111]">
                          {item.value}
                        </h2>
                        <p className="mt-1.5 text-xs leading-5 text-[#6B7280]">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <style>{`
            .finora-marquee {
              animation: finora-marquee 28s linear infinite;
              will-change: transform;
            }

            .finora-marquee:hover {
              animation-play-state: paused;
            }

            @keyframes finora-marquee {
              from {
                transform: translateX(0);
              }
              to {
                transform: translate3d(calc(-50% - 8px), 0, 0);
              }
            }

            @media (max-width: 640px) {
              .finora-marquee {
                animation-duration: 22s;
              }

              .finora-marquee-card {
                width: calc(100vw - 40px);
              }
            }

            @media (prefers-reduced-motion: reduce) {
              .finora-marquee {
                animation: none;
              }
            }
          `}</style>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-y border-[#E5E7EB] bg-[#F7F8F6] py-14 sm:py-20">
        <div className="mx-auto max-w-[1240px] px-4 sm:px-6">
          <div className="mx-auto mb-10 max-w-xl text-center sm:mb-14">
            <h2 className="text-2xl font-bold leading-tight tracking-tight text-[#111111] sm:text-3xl">
              Everything you need to stay financially aware.
            </h2>
            <p className="mt-2 text-sm text-[#6B7280]">
              Simple tools for tracking everyday spending, planning a budget, and understanding patterns.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
            {[
              {
                icon: Receipt,
                title: 'Track every transaction',
                description: 'Record money you spend or receive, with a category and an optional note.',
              },
              {
                icon: PieChart,
                title: 'Plan your monthly budget',
                description: 'Choose a monthly spending limit and monitor how much remains.',
              },
              {
                icon: TrendingUp,
                title: 'Understand your spending',
                description: 'See monthly spending and the categories where your money goes.',
              },
              {
                icon: Sparkles,
                title: 'Get intelligent insights',
                description: 'Get short money tips based on the transactions you have recorded.',
              },
            ].map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[#0B5D3B]/10 text-[#0B5D3B]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-semibold text-[#111111]">{feature.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-[#6B7280] sm:text-sm">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Advanced features */}
      <section id="advanced" className="border-y border-[#E5E7EB] bg-white py-14 sm:py-20">
        <div className="mx-auto max-w-[1240px] px-3 sm:px-6">
          <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-14">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#0B5D3B]/15 bg-[#0B5D3B]/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#0B5D3B]">
              <Sparkles className="h-3.5 w-3.5" />
              Advanced features
            </div>
            <h2 className="text-2xl font-bold leading-tight tracking-tight text-[#111111] sm:text-3xl">
              Go beyond basic expense tracking.
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#6B7280]">
              Finora turns your transaction history into smarter warnings, patterns, and spending insights.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: BellRing,
                title: 'Budget warnings',
                description: 'Get notified when your spending reaches or crosses your monthly budget limit.',
              },
              {
                icon: Repeat2,
                title: 'Recurring expenses',
                description: 'Track weekly or monthly recurring payments without adding the same expense every time.',
              },
              {
                icon: BarChart3,
                title: 'Category spending charts',
                description: 'See which categories take the biggest share of your spending at a glance.',
              },
              {
                icon: LineChart,
                title: 'Monthly spending trends',
                description: 'Compare your spending across months and spot changes in your financial habits.',
              },
              {
                icon: Target,
                title: 'Highest-expense analysis',
                description: 'Identify your biggest spending category and understand where the most money is going.',
              },
            ].map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="group rounded-xl border border-[#E5E7EB] bg-[#F7F8F6] p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#0B5D3B]/25 hover:bg-white hover:shadow-sm sm:p-6"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[#0B5D3B]/10 text-[#0B5D3B]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-semibold text-[#111111]">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#6B7280]">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-5 rounded-xl border border-[#E5E7EB] bg-[#0B5D3B] p-5 text-white sm:mt-6 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-white/70">
                  Built into Finora
                </p>
                <p className="mt-1 text-sm leading-6 text-white/90">
                  Advanced insights work from the transactions and budget data you already record.
                </p>
              </div>
              <button
                onClick={() => openAuthPage('register')}
                className="w-full shrink-0 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-[#0B5D3B] transition-colors hover:bg-neutral-100 sm:w-auto"
              >
                Try Finora
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Insights */}
      <section id="insights" className="mx-auto max-w-[1240px] px-3 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto mb-12 max-w-xl text-center">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-[#0B5D3B]">
            A clearer picture
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-[#111111] sm:text-3xl">
            Know what matters.
          </h2>
          <p className="mt-2 text-sm text-[#6B7280]">
            Start simple and add detail only when it helps.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
          <div className="space-y-3 rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#6B7280]">Balance</span>
            <p className="text-2xl font-bold leading-tight tabular-nums text-[#111111] sm:text-3xl">What you have left</p>
            <p className="text-xs leading-relaxed text-[#6B7280]">
              Money received minus money spent in the transactions you have recorded.
            </p>
          </div>
          <div className="space-y-3 rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#6B7280]">Monthly spending</span>
            <p className="text-2xl font-bold leading-tight tabular-nums text-[#C84A4A] sm:text-3xl">See where it goes</p>
            <p className="text-xs leading-relaxed text-[#6B7280]">
              Understand spending by category using your own activity.
            </p>
          </div>
          <div className="space-y-3 rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#6B7280]">Monthly budget</span>
            <p className="text-2xl font-bold leading-tight tabular-nums text-[#16845B] sm:text-3xl">Know what remains</p>
            <p className="text-xs leading-relaxed text-[#6B7280]">
              See how much of your planned limit remains.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-[#0B5D3B] py-14 text-white sm:py-20">
        <div className="mx-auto max-w-[1000px] space-y-6 px-4 text-center sm:px-6">
          <h2 className="text-2xl font-bold leading-tight tracking-tight sm:text-4xl">
            Make your money easier to understand.
          </h2>
          <p className="mx-auto max-w-xl text-sm leading-relaxed text-white/80 sm:text-base">
            Start with a transaction. Your spending picture will take shape as you go.
          </p>
          <div className="flex justify-center pt-2">
            <button
              onClick={() => openAuthPage('register')}
              className="rounded-lg bg-white px-6 py-3 text-sm font-bold text-[#0B5D3B] shadow-lg transition-colors hover:bg-neutral-100"
            >
              Launch Finora Free
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#E5E7EB] bg-white">
        <div className="mx-auto max-w-[1240px] px-4 py-10 sm:px-6 sm:py-12">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-10 lg:grid-cols-[1.6fr_1fr_1fr_1.2fr]">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0B5D3B] text-xs font-bold text-white">
                  FN
                </div>
                <span className="text-lg font-bold tracking-tight">FINORA</span>
              </div>
              <p className="mt-4 max-w-xs text-sm leading-6 text-[#6B7280]">
                A simple way to track spending, manage budgets, and understand your money.
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs text-[#6B7280]">
                <ShieldCheck className="h-4 w-4 text-[#0B5D3B]" />
                <span>Your financial data stays private.</span>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#111111]">Product</h3>
              <div className="mt-4 space-y-3 text-sm text-[#6B7280]">
                <a href="#features" className="block transition-colors hover:text-[#0B5D3B]">Features</a>
                <a href="#preview" className="block transition-colors hover:text-[#0B5D3B]">Overview</a>
                <a href="#advanced" className="block transition-colors hover:text-[#0B5D3B]">Advanced features</a>
                <a href="#insights" className="block transition-colors hover:text-[#0B5D3B]">Insights</a>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#111111]">Get started</h3>
              <div className="mt-4 space-y-3 text-sm text-[#6B7280]">
                <button onClick={() => openAuthPage('login')} className="block transition-colors hover:text-[#0B5D3B]">Sign in</button>
                <button onClick={() => openAuthPage('register')} className="block transition-colors hover:text-[#0B5D3B]">Create account</button>
                <button onClick={() => setActivePage('how-it-works')} className="block transition-colors hover:text-[#0B5D3B]">How it works</button>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#111111]">Finora</h3>
              <p className="mt-4 text-sm leading-6 text-[#6B7280]">
                Built to make personal finance easier to understand, one transaction at a time.
              </p>
              <a
                href="mailto:support@finora.app"
                className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[#0B5D3B] hover:underline"
              >
                <Mail className="h-4 w-4" />
                Contact support
              </a>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-3 border-t border-[#E5E7EB] pt-5 text-xs text-[#9CA3AF] sm:flex-row sm:items-center sm:justify-between">
            <span>© 2026 Finora. All rights reserved.</span>
            <span>Personal finance, simplified.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
