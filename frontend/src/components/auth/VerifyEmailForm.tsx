import React, { useState } from 'react';
import { Loader2, Mail, ArrowLeft } from 'lucide-react';
import { AuthShell } from './AuthShell';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';
import type { AuthViewMode } from './LoginForm';

interface VerifyEmailFormProps {
  onNavigate: (mode: AuthViewMode) => void;
  onVerified: () => void;
}

export const VerifyEmailForm: React.FC<VerifyEmailFormProps> = ({ onNavigate, onVerified }) => {
  const {
    user,
    resendVerificationEmail,
    refreshUser,
    logout,
    getErrorMessage,
  } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [busy, setBusy] = useState<'idle' | 'resend' | 'check'>('idle');

  const email = user?.email ?? 'your email address';

  const handleResend = async () => {
    setError(null);
    setInfo(null);
    setBusy('resend');
    try {
      await resendVerificationEmail();
      setInfo('Verification email sent. Check your inbox and spam folder.');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusy('idle');
    }
  };

  const handleVerified = async () => {
    setError(null);
    setInfo(null);
    setBusy('check');
    try {
      const refreshed = await refreshUser();
      if (refreshed?.emailVerified) {
        onVerified();
      } else {
        setError('Email not verified yet. Open the link in your inbox, then try again.');
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusy('idle');
    }
  };

  const handleChangeEmail = async () => {
    await logout();
    onNavigate('register');
  };

  const handleBackToLogin = async () => {
    await logout();
    onNavigate('login');
  };

  return (
    <AuthShell title="Verify your email" subtitle="We've sent a verification link to your email address.">
      <div className="space-y-4">
        <div className="rounded-lg border border-[#E5E7EB] bg-[#F7F8F6] px-3.5 py-3 text-sm text-[#6B7280]">
          <div className="flex items-start gap-2">
            <Mail className="h-4 w-4 text-[#0B5D3B] mt-0.5 shrink-0" />
            <div>
              <p>Verification link sent to</p>
              <p className="font-semibold text-[#111111] break-all mt-0.5">{email}</p>
            </div>
          </div>
        </div>

        {info && (
          <div role="status" className="rounded-lg border border-[#16845B]/20 bg-[#16845B]/5 px-3 py-2 text-xs text-[#16845B]">
            {info}
          </div>
        )}
        {error && (
          <div role="alert" className="rounded-lg border border-[#C84A4A]/25 bg-[#C84A4A]/5 px-3 py-2 text-xs text-[#C84A4A]">
            {error}
          </div>
        )}

        <Button type="button" variant="primary" size="md" className="w-full" onClick={handleVerified} disabled={busy !== 'idle'}>
          {busy === 'check' ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" /> Checking…
            </span>
          ) : (
            "I've verified my email"
          )}
        </Button>

        <Button type="button" variant="outline" size="md" className="w-full" onClick={handleResend} disabled={busy !== 'idle'}>
          {busy === 'resend' ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" /> Sending…
            </span>
          ) : (
            'Resend verification email'
          )}
        </Button>

        <div className="flex flex-col sm:flex-row gap-2 pt-1">
          <button
            type="button"
            onClick={handleChangeEmail}
            className="flex-1 text-xs font-medium text-[#6B7280] hover:text-[#111111] py-2"
          >
            Change email
          </button>
          <button
            type="button"
            onClick={handleBackToLogin}
            className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-medium text-[#6B7280] hover:text-[#111111] py-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to login
          </button>
        </div>
      </div>
    </AuthShell>
  );
};
