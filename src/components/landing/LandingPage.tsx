import React, { useEffect, useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { Button } from '../ui/Button';
import {
  ArrowRight,
  Receipt,
  PieChart,
  Sparkles,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Mail,
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
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % MONEY_SLIDES.length);
    }, 3200);

    return () => window.clearInterval(timer);
  }, []);

  const slide = MONEY_SLIDES[activeSlide];
  const SlideIcon = slide.icon;

  const goToSlide = (index: number) => {
    setActiveSlide((index + MONEY_SLIDES.length) % MONEY_SLIDES.length);
  };

  return (
    <div className="bg-white min-h-screen text-[#111111]">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-[#E5E7EB] bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-[1240px] items-center justify-between px-4 sm:px-6">
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-3"
            aria-label="Go to Finora home"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0B5D3B] text-sm font-bold text-white shadow-sm">
              FN
            </div>
            <span className="text-lg font-bold tracking-tight text-[#111111]">
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
            <a href="#insights" className="transition-colors hover:text-[#111111]">
              Insights
            </a>
          </nav>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => openAuthPage('login')}
              className="px-3 py-1.5 text-xs font-semibold text-[#111111] transition-colors hover:text-[#0B5D3B]"
            >
              Sign In
            </button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => openAuthPage('register')}
            >
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-[1240px] px-4 py-16 text-center sm:px-6 sm:py-24">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#0B5D3B]/15 bg-[#0B5D3B]/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#0B5D3B]">
          <Sparkles className="h-3.5 w-3.5" />
          <span>PERSONAL FINANCE, SIMPLIFIED</span>
        </div>

        <h1 className="mx-auto max-w-3xl text-4xl font-bold leading-[1.12] tracking-tight text-[#111111] sm:text-6xl">
          Understand where your money goes.
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-[#6B7280] sm:text-lg">
          Track spending, manage budgets and turn everyday transactions into clear financial insights.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
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

        {/* Animated money overview slider */}
        <div
          id="preview"
          className="mx-auto mt-14 max-w-5xl overflow-hidden rounded-2xl border border-[#E5E7EB] bg-[#F7F8F6] text-left shadow-sm sm:mt-18"
        >
          <div className="flex items-center justify-between border-b border-[#E5E7EB] px-5 py-4 sm:px-7">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#0B5D3B]">
                Finora overview
              </p>
              <p className="mt-1 text-sm text-[#6B7280]">
                A clearer view of your everyday money.
              </p>
            </div>

            <div className="hidden items-center gap-1.5 sm:flex">
              {MONEY_SLIDES.map((item, index) => (
                <button
                  key={item.label}
                  type="button"
                  aria-label={`Show ${item.label}`}
                  onClick={() => goToSlide(index)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    activeSlide === index ? 'w-7 bg-[#0B5D3B]' : 'w-1.5 bg-[#D1D5DB]'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="relative min-h-[190px] px-5 py-7 sm:px-8 sm:py-9">
            <div key={slide.label} className="animate-in fade-in slide-in-from-right-3 duration-500">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0B5D3B]/10 text-[#0B5D3B]">
                  <SlideIcon className="h-5 w-5" />
                </div>
                <div className="max-w-2xl">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#6B7280]">
                    {slide.label}
                  </p>
                  <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#111111] sm:text-3xl">
                    {slide.value}
                  </h2>
                  <p className="mt-2 max-w-xl text-sm leading-6 text-[#6B7280]">
                    {slide.description}
                  </p>
                </div>
              </div>
            </div>

            <div className="absolute bottom-5 right-5 flex gap-1.5 sm:bottom-7 sm:right-7">
              <button
                type="button"
                onClick={() => goToSlide(activeSlide - 1)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E5E7EB] bg-white text-[#4B5563] transition-colors hover:border-[#0B5D3B]/30 hover:text-[#0B5D3B]"
                aria-label="Previous overview"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => goToSlide(activeSlide + 1)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E5E7EB] bg-white text-[#4B5563] transition-colors hover:border-[#0B5D3B]/30 hover:text-[#0B5D3B]"
                aria-label="Next overview"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-y border-[#E5E7EB] bg-[#F7F8F6] py-20">
        <div className="mx-auto max-w-[1240px] px-4 sm:px-6">
          <div className="mx-auto mb-14 max-w-xl text-center">
            <h2 className="text-2xl font-bold tracking-tight text-[#111111] sm:text-3xl">
              Everything you need to stay financially aware.
            </h2>
            <p className="mt-2 text-sm text-[#6B7280]">
              Simple tools for tracking everyday spending, planning a budget, and understanding patterns.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
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

      {/* Insights */}
      <section id="insights" className="mx-auto max-w-[1240px] px-4 py-20 sm:px-6">
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

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="space-y-3 rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#6B7280]">Balance</span>
            <p className="text-3xl font-bold tabular-nums text-[#111111]">What you have left</p>
            <p className="text-xs leading-relaxed text-[#6B7280]">
              Money received minus money spent in the transactions you have recorded.
            </p>
          </div>
          <div className="space-y-3 rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#6B7280]">Monthly spending</span>
            <p className="text-3xl font-bold tabular-nums text-[#C84A4A]">See where it goes</p>
            <p className="text-xs leading-relaxed text-[#6B7280]">
              Understand spending by category using your own activity.
            </p>
          </div>
          <div className="space-y-3 rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#6B7280]">Monthly budget</span>
            <p className="text-3xl font-bold tabular-nums text-[#16845B]">Know what remains</p>
            <p className="text-xs leading-relaxed text-[#6B7280]">
              See how much of your planned limit remains.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-[#0B5D3B] py-20 text-white">
        <div className="mx-auto max-w-[1000px] space-y-6 px-4 text-center sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
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
        <div className="mx-auto max-w-[1240px] px-4 py-12 sm:px-6">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1.2fr]">
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
