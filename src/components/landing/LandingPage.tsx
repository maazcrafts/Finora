import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { Button } from '../ui/Button';
import { formatIndianCurrency } from '../../utils/formatters';
import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  TrendingUp,
  Receipt,
  PieChart,
  Sparkles,
  ArrowUpRight,
  ChevronRight,
  Layers,
  Lock,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { openAuthPage, setActivePage } = useFinance();

  return (
    <div className="bg-white min-h-screen text-[#111111]">
      {/* Top Navbar */}
      <header className="border-b border-[#E5E7EB] bg-white/95 backdrop-blur-xs sticky top-0 z-40">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-[#0B5D3B] text-white flex items-center justify-center font-bold text-sm shadow-xs">
              FT
            </div>
            <span className="text-lg font-bold text-[#111111] tracking-tight">
              FINTRACK
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-[#4B5563]">
            <a href="#features" className="hover:text-[#111111] transition-colors">
              Platform Features
            </a>
            <a href="#preview" className="hover:text-[#111111] transition-colors">
              Live Preview
            </a>
            <a href="#insights" className="hover:text-[#111111] transition-colors">
              Financial Insights
            </a>
          </nav>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => openAuthPage('login')}
              className="text-xs font-semibold text-[#111111] hover:text-[#0B5D3B] px-3 py-1.5 transition-colors"
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

      {/* HERO SECTION */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 max-w-[1240px] mx-auto text-center">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B5D3B]/5 border border-[#0B5D3B]/15 text-[#0B5D3B] text-xs font-semibold uppercase tracking-wider mb-6">
          <Sparkles className="h-3.5 w-3.5" />
          <span>PERSONAL FINANCE, SIMPLIFIED</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl font-bold text-[#111111] tracking-tight max-w-3xl mx-auto leading-[1.12]">
          Understand where your money goes.
        </h1>

        {/* Description */}
        <p className="mt-5 text-base sm:text-lg text-[#6B7280] max-w-2xl mx-auto leading-relaxed">
          Track spending, manage budgets and turn everyday transactions into clear financial insights.
        </p>

        {/* Buttons */}
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
            className="px-5 py-2.5 text-sm font-semibold text-[#111111] hover:bg-[#F7F8F6] border border-[#E5E7EB] rounded-lg transition-colors"
          >
            See how it works
          </button>
        </div>

        <div id="preview" className="mx-auto mt-14 max-w-5xl border-y border-[#E5E7EB] bg-[#F7F8F6] px-5 py-7 text-left sm:mt-18 sm:px-8 sm:py-9">
          <h2 className="text-lg font-semibold text-[#111111]">Your money, in plain language</h2>
          <p className="mt-1 text-sm text-[#6B7280]">Everything is based on the transactions you add.</p>
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div><p className="text-sm font-semibold">Balance</p><p className="mt-1 text-sm text-[#6B7280]">What you have left after spending.</p></div>
            <div><p className="text-sm font-semibold">Money received</p><p className="mt-1 text-sm text-[#6B7280]">Income you’ve recorded this month.</p></div>
            <div><p className="text-sm font-semibold">Spent</p><p className="mt-1 text-sm text-[#6B7280]">Expenses grouped by category.</p></div>
            <div><p className="text-sm font-semibold">Budget left</p><p className="mt-1 text-sm text-[#6B7280]">How much remains within your limit.</p></div>
          </div>
        </div>
      </section>

      {/* FEATURE CARDS SECTION */}
      <section id="features" className="py-20 bg-[#F7F8F6] border-y border-[#E5E7EB]">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#111111] tracking-tight">
              Everything you need to stay financially aware.
            </h2>
            <p className="mt-2 text-sm text-[#6B7280]">
              Simple tools for tracking everyday spending, planning a budget, and understanding patterns.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Card 1 */}
            <div className="p-6 rounded-xl border border-[#E5E7EB] bg-white shadow-xs">
              <div className="h-10 w-10 rounded-lg bg-[#0B5D3B]/10 text-[#0B5D3B] flex items-center justify-center mb-4">
                <Receipt className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold text-[#111111]">
                Track every transaction
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-[#6B7280] leading-relaxed">
                Record money you spend or receive, with a category and an optional note.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-6 rounded-xl border border-[#E5E7EB] bg-white shadow-xs">
              <div className="h-10 w-10 rounded-lg bg-[#0B5D3B]/10 text-[#0B5D3B] flex items-center justify-center mb-4">
                <PieChart className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold text-[#111111]">
                Plan your monthly budget
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-[#6B7280] leading-relaxed">
                Choose a monthly spending limit. Add category limits only if you need them.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-6 rounded-xl border border-[#E5E7EB] bg-white shadow-xs">
              <div className="h-10 w-10 rounded-lg bg-[#0B5D3B]/10 text-[#0B5D3B] flex items-center justify-center mb-4">
                <TrendingUp className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold text-[#111111]">
                Understand your spending
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-[#6B7280] leading-relaxed">
                See monthly spending and the categories where your money goes.
              </p>
            </div>

            {/* Card 4 */}
            <div className="p-6 rounded-xl border border-[#E5E7EB] bg-white shadow-xs">
              <div className="h-10 w-10 rounded-lg bg-[#0B5D3B]/10 text-[#0B5D3B] flex items-center justify-center mb-4">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold text-[#111111]">
                Get intelligent insights
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-[#6B7280] leading-relaxed">
                Get short money tips based on the transactions you’ve recorded.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SIMPLE MONEY OVERVIEW */}
      <section className="py-20 px-4 sm:px-6 max-w-[1240px] mx-auto">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-semibold text-[#0B5D3B] uppercase tracking-wider block mb-1">
            A clearer picture
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#111111] tracking-tight">
            Know what matters.
          </h2>
          <p className="mt-2 text-sm text-[#6B7280]">
            Start simple and add detail only when it helps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl border border-[#E5E7EB] bg-white shadow-xs space-y-3">
            <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
              Balance
            </span>
            <p className="text-3xl font-bold text-[#111111] tabular-nums">
              What you have left
            </p>
            <p className="text-xs text-[#6B7280] leading-relaxed">
              Money received minus money spent in the transactions you’ve recorded.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-[#E5E7EB] bg-white shadow-xs space-y-3">
            <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
              Monthly spending
            </span>
            <p className="text-3xl font-bold text-[#C84A4A] tabular-nums">
              See where it goes
            </p>
            <p className="text-xs text-[#6B7280] leading-relaxed">
              Understand spending by category, using your own activity.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-[#E5E7EB] bg-white shadow-xs space-y-3">
            <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
              Monthly budget
            </span>
            <p className="text-3xl font-bold text-[#16845B] tabular-nums">
              Know what’s left
            </p>
            <p className="text-xs text-[#6B7280] leading-relaxed">
              See how much of your planned limit remains.
            </p>
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="py-20 bg-[#0B5D3B] text-white">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Make your money easier to understand.
          </h2>
          <p className="text-white/80 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            Start with a transaction. Your spending picture will take shape as you go.
          </p>
          <div className="pt-2 flex justify-center">
            <button
              onClick={() => openAuthPage('register')}
              className="px-6 py-3 rounded-lg bg-white text-[#0B5D3B] font-bold text-sm hover:bg-neutral-100 transition-colors shadow-lg"
            >
              Launch FinTrack Free
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#E5E7EB] py-8 text-center text-xs text-[#6B7280] bg-white">
        <div className="max-w-[1240px] mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#111111]">FINTRACK</span>
            <span>·</span>
            <span>Understand your money. Control your future.</span>
          </div>
          <div>
            <span>© 2026 FinTrack Technologies. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
