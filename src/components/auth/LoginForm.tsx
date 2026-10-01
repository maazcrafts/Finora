import React, { useState } from 'react';
import { Mail, Lock, Loader2 } from 'lucide-react';
import { AuthShell } from './AuthShell';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useAuth } from '../../context/AuthContext';
import { GoogleIcon } from './GoogleIcon';

export type AuthViewMode = 'login' | 'register' | 'forgot' | 'verify' | 'phone' | 'reset-sent';

interface LoginFormProps {
  onNavigate: (mode: AuthViewMode) => void;
  onSuccess: () => void;
  onNeedsVerification: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onNavigate,
  onSuccess,
  onNeedsVerification,
}) => {
  const { signInWithEmail, signInWithGoogle, getErrorMessage, isConfigured } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [busy, setBusy] = useState<'idle' | 'email' | 'google'>('idle');

  const validate = () => {
    const next: typeof fieldErrors = {};
    if (!email.trim()) next.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) next.email = 'Enter a valid email address.';
    if (!password) next.password = 'Password is required.';
    setFieldErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!validate()) return;
    if (!isConfigured) {
      setError('Firebase is not configured yet. Add your project keys to the .env file.');
      return;
    }
    setBusy('email');
    try {
      await signInWithEmail(email, password);
      // Auth listener updates; parent decides verify vs dashboard
      onSuccess();
    } catch (err) {
      const msg = getErrorMessage(err);
      setError(msg);
      // If signed in but unverified, AuthContext will surface needsEmailVerification
      if (msg.toLowerCase().includes('verify')) onNeedsVerification();
    } finally {
      setBusy('idle');
    }
  };

  const handleGoogle = async () => {
    setError(null);
    if (!isConfigured) {
      setError('Firebase is not configured yet. Add your project keys to the .env file.');
      return;
    }
    setBusy('google');
    try {
      await signInWithGoogle();
      onSuccess();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusy('idle');
    }
  };

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to continue managing your finances." illustrationMode="login">
      <div className="space-y-4">
        <Button
          type="button"
          variant="outline"
          size="md"
          className="w-full"
          disabled={busy !== 'idle'}
          onClick={handleGoogle}
          icon={busy === 'google' ? <Loader2 className="h-4 w-4 animate-spin" /> : <GoogleIcon />}
        >
          {busy === 'google' ? 'Signing in…' : 'Continue with Google'}
        </Button>

        <div className="relative py-1">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#E5E7EB]" />
          </div>
          <div className="relative flex justify-center text-[11px] uppercase tracking-wider text-[#6B7280]">
            <span className="bg-white px-3">OR</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5" noValidate>
          <Input
            label="Email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            prefixElement={<Mail className="h-4 w-4" />}
            error={fieldErrors.email}
            disabled={busy !== 'idle'}
          />
          <div>
            <Input
              label="Password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              prefixElement={<Lock className="h-4 w-4" />}
              error={fieldErrors.password}
              disabled={busy !== 'idle'}
            />
            <div className="mt-1.5 flex justify-end">
              <button
                type="button"
                onClick={() => onNavigate('forgot')}
                className="text-xs font-medium text-[#0B5D3B] hover:underline"
              >
                Forgot password?
              </button>
            </div>
          </div>

          {error && (
            <div role="alert" className="rounded-lg border border-[#C84A4A]/25 bg-[#C84A4A]/5 px-3 py-2 text-xs text-[#C84A4A]">
              {error}
            </div>
          )}

          <Button type="submit" variant="primary" size="md" className="w-full" disabled={busy !== 'idle'}>
            {busy === 'email' ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Signing in…
              </span>
            ) : (
              'Sign in'
            )}
          </Button>
        </form>

        <button
          type="button"
          onClick={() => onNavigate('phone')}
          className="w-full py-2.5 rounded-lg border border-[#E5E7EB] text-sm font-semibold text-[#111111] hover:bg-[#F7F8F6] transition-colors"
          disabled={busy !== 'idle'}
        >
          Continue with phone
        </button>

        <p className="pt-1 text-center text-xs text-[#6B7280]">
          Don&apos;t have an account?{' '}
          <button
            type="button"
            onClick={() => onNavigate('register')}
            className="font-semibold text-[#0B5D3B] hover:underline"
          >
            Create account
          </button>
        </p>
      </div>
    </AuthShell>
  );
};
