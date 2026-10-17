import React from 'react';
import { AuthIllustration } from './AuthIllustration';

interface AuthShellProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  illustrationMode?: 'login' | 'register';
}

export const AuthShell: React.FC<AuthShellProps> = ({ children, title, subtitle, illustrationMode = 'login' }) => (
  <div className="min-h-screen bg-[#F7F8F6] text-[#111111]">
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <aside className="relative hidden lg:flex min-h-screen overflow-hidden bg-[#06452C] text-white">
        <AuthIllustration mode={illustrationMode} />
        <div className="relative z-10 w-full px-10 xl:px-14 py-10 pointer-events-none">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-white text-[#0B5D3B] flex items-center justify-center font-bold text-sm">FT</div>
            <div>
              <p className="text-lg font-bold tracking-tight leading-none">FINORA</p>
              <p className="text-xs text-white/70 mt-1">Personal finance, clarified</p>
            </div>
          </div>
        </div>
      </aside>

      <div className="lg:hidden relative h-[300px] sm:h-[360px] overflow-hidden bg-[#06452C]">
        <AuthIllustration mode={illustrationMode} />
        <div className="absolute top-5 left-5 flex items-center gap-2.5 z-10">
          <div className="h-9 w-9 rounded-lg bg-white text-[#0B5D3B] flex items-center justify-center font-bold text-sm">FT</div>
          <span className="text-base font-bold tracking-tight text-white">FINORA</span>
        </div>
      </div>

      <main className="flex flex-col justify-center px-4 sm:px-8 py-7 sm:py-14">
        <div className="w-full max-w-md mx-auto">
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
    <div id="recaptcha-container" />
  </div>
);
