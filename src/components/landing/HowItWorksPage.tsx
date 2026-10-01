import React from 'react';
import { ArrowLeft, ArrowRight, CircleDollarSign, ListPlus, PieChart } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { useAuth } from '../../context/AuthContext';

const steps = [
  {
    number: '01',
    title: 'Add your money',
    description: 'Record what you spend and what you receive. Add a note when it helps.',
    icon: ListPlus,
  },
  {
    number: '02',
    title: 'Set your budget',
    description: 'Choose a monthly amount that feels right. Category limits are optional.',
    icon: CircleDollarSign,
  },
  {
    number: '03',
    title: 'See the picture',
    description: 'Understand where your money goes and get useful tips based on your activity.',
    icon: PieChart,
  },
];

export const HowItWorksPage: React.FC = () => {
  const { setActivePage, openAuthPage } = useFinance();
  const { isAuthenticated } = useAuth();

  return (
    <main className="min-h-screen bg-[#F7F8F6] px-5 py-8 text-[#111111] sm:px-8 sm:py-12">
      <div className="mx-auto max-w-4xl">
        <button
          type="button"
          onClick={() => setActivePage('landing')}
          className="inline-flex min-h-10 items-center gap-2 rounded-lg px-2 text-sm font-medium text-[#4B5563] hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B5D3B]"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back
        </button>

        <header className="mt-12 max-w-2xl sm:mt-16">
          <p className="text-sm font-semibold text-[#0B5D3B]">FINTRACK</p>
          <h1 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">FinTrack, made simple.</h1>
          <p className="mt-3 text-base leading-relaxed text-[#6B7280]">
            Know where your money goes. Make better decisions.
          </p>
        </header>

        <ol className="mt-10 divide-y divide-[#E5E7EB] border-y border-[#E5E7EB] bg-white sm:mt-14">
          {steps.map(({ number, title, description, icon: Icon }) => (
            <li key={number} className="grid gap-4 px-5 py-6 sm:grid-cols-[4rem_3rem_1fr] sm:items-center sm:px-7 sm:py-8">
              <span className="text-sm font-semibold tabular-nums text-[#6B7280]">{number}</span>
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#EAF2ED] text-[#0B5D3B]">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-lg font-semibold">{title}</h2>
                <p className="mt-1 text-sm leading-relaxed text-[#6B7280]">{description}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-[#6B7280]">Start with one transaction. You can set things up as you go.</p>
          <button
            type="button"
            onClick={() => isAuthenticated ? setActivePage('dashboard') : openAuthPage('register')}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#0B5D3B] px-5 text-sm font-semibold text-white hover:bg-[#06452C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B5D3B] focus-visible:ring-offset-2"
          >
            Start tracking <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </main>
  );
};