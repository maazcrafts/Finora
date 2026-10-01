import React from 'react';
import { ShieldCheck, TrendingUp, Wallet } from 'lucide-react';

interface AuthShellProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export const AuthShell: React.FC<AuthShellProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-[#F7F8F6] text-[#111111]">
      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
        {/* Brand panel */}
        <aside className="relative hidden lg:flex flex-col justify-between bg-[#06452C] text-white px-10 xl:px-14 py-12 overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                'radial-gradient(circle at 20% 20%, #fff 0, transparent 45%), radial-gradient(circle at 80% 0%, #fff 0, transparent 35%)',
            }}
            aria-hidden="true"
          />
          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-white text-[#0B5D3B] flex items-center justify-center font-bold text-sm">
                FT
              </div>
              <div>
                <p className="text-lg font-bold tracking-tight leading-none">FINTRACK</p>
                <p className="text-xs text-white/70 mt-1">Personal finance, clarified</p>
              </div>
            </div>

            <div className="mt-16 max-w-md">
              <h1 className="text-3xl xl:text-4xl font-bold tracking-tight leading-tight">
                Understand your money. Control your future.
              </h1>
              <p className="mt-4 text-sm text-white/75 leading-relaxed">
                Track income and expenses, stay within monthly budgets, and turn everyday spending into clear financial decisions.
              </p>
            </div>

            <ul className="mt-10 space-y-4 max-w-sm">
              {[
                { icon: <Wallet className="h-4 w-4" />, text: 'See balance, income, and expenses at a glance' },
                { icon: <TrendingUp className="h-4 w-4" />, text: 'Spot spending trends before they become problems' },
                { icon: <ShieldCheck className="h-4 w-4" />, text: 'Secure sign-in with Google, email, or phone' },
              ].map((item) => (
                <li key={item.text} className="flex items-start gap-3 text-sm text-white/85">
                  <span className="mt-0.5 h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                    {item.icon}
                  </span>
                  <span className="pt-1.5">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>

          <p className="relative z-10 text-xs text-white/50">
            Your financial data stays private to your account.
          </p>
        </aside>

        {/* Form panel */}
        <main className="flex flex-col justify-center px-4 sm:px-8 py-10 sm:py-14">
          <div className="w-full max-w-md mx-auto">
            <div className="lg:hidden flex items-center gap-2.5 mb-8">
              <div className="h-9 w-9 rounded-lg bg-[#0B5D3B] text-white flex items-center justify-center font-bold text-sm">
                FT
              </div>
              <span className="text-base font-bold tracking-tight">FINTRACK</span>
            </div>

            <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 sm:p-8 shadow-xs">
              <div className="mb-6">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#111111]">{title}</h2>
                <p className="mt-1.5 text-sm text-[#6B7280]">{subtitle}</p>
              </div>
              {children}
            </div>
          </div>
        </main>
      </div>
      {/* Invisible reCAPTCHA host for phone auth */}
      <div id="recaptcha-container" />
    </div>
  );
};
