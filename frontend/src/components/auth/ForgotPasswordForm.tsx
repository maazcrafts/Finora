import React, { useState } from 'react';
import { Mail, Loader2, ArrowLeft } from 'lucide-react';
import { AuthShell } from './AuthShell';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useAuth } from '../../context/AuthContext';
import type { AuthViewMode } from './LoginForm';

interface ForgotPasswordFormProps {
  onNavigate: (mode: AuthViewMode) => void;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onNavigate }) => {
  const { sendPasswordReset, getErrorMessage, isConfigured } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [fieldError, setFieldError] = useState<string | undefined>();
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim()) {
      setFieldError('Email is required.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setFieldError('Enter a valid email address.');
      return;
    }
    setFieldError(undefined);
    if (!isConfigured) {
      setError('Firebase is not configured yet. Add your project keys to the .env file.');
      return;
    }
    setBusy(true);
    try {
      await sendPasswordReset(email);
      setSent(true);
    } catch (err) {
      // Avoid revealing whether the email exists; still show config/network issues.
      const msg = getErrorMessage(err);
      if (msg.toLowerCase().includes('network') || msg.toLowerCase().includes('configured')) {
        setError(msg);
      } else {
        setSent(true);
      }
    } finally {
      setBusy(false);
    }
  };

  if (sent) {
    return (
      <AuthShell title="Check your email" subtitle="If an account exists for that address, a reset link is on its way.">
        <div className="space-y-4">
          <div className="rounded-lg border border-[#E5E7EB] bg-[#F7F8F6] px-3.5 py-3 text-sm text-[#6B7280]">
            Follow the link in the email to choose a new password, then return here to sign in.
          </div>
          <Button type="button" variant="primary" size="md" className="w-full" onClick={() => onNavigate('login')}>
            Back to login
          </Button>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Forgot your password?"
      subtitle="Enter your email and we'll send you a password reset link."
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          prefixElement={<Mail className="h-4 w-4" />}
          error={fieldError}
          disabled={busy}
        />

        {error && (
          <div role="alert" className="rounded-lg border border-[#C84A4A]/25 bg-[#C84A4A]/5 px-3 py-2 text-xs text-[#C84A4A]">
            {error}
          </div>
        )}

        <Button type="submit" variant="primary" size="md" className="w-full" disabled={busy}>
          {busy ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" /> Sending…
            </span>
          ) : (
            'Send reset link'
          )}
        </Button>

        <button
          type="button"
          onClick={() => onNavigate('login')}
          className="w-full inline-flex items-center justify-center gap-1.5 text-xs font-medium text-[#6B7280] hover:text-[#111111]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to login
        </button>
      </form>
    </AuthShell>
  );
};
