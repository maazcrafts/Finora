import React, { useState } from 'react';
import { Mail, Lock, User, Loader2 } from 'lucide-react';
import { AuthShell } from './AuthShell';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useAuth } from '../../context/AuthContext';
import { GoogleIcon } from './GoogleIcon';
import type { AuthViewMode } from './LoginForm';

interface RegisterFormProps {
  onNavigate: (mode: AuthViewMode) => void;
  onRegistered: () => void;
  onGoogleSuccess: () => void;
}

function passwordStrengthMessage(password: string): string | null {
  if (!password) return 'Password is required.';
  if (password.length < 8) return 'Password must be at least 8 characters.';
  if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
    return 'Use letters and at least one number.';
  }
  return null;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onNavigate,
  onRegistered,
  onGoogleSuccess,
}) => {
  const { registerWithEmail, signInWithGoogle, getErrorMessage, isConfigured } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState<'idle' | 'email' | 'google'>('idle');

  const validate = () => {
    const next: Record<string, string> = {};
    if (!fullName.trim()) next.fullName = 'Full name is required.';
    if (!email.trim()) next.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) next.email = 'Enter a valid email address.';
    const pwdErr = passwordStrengthMessage(password);
    if (pwdErr) next.password = pwdErr;
    if (password !== confirmPassword) next.confirmPassword = 'Passwords must match.';
    if (!termsAccepted) next.terms = 'Please accept the Terms of Service and Privacy Policy.';
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
      await registerWithEmail(fullName, email, password);
      onRegistered();
    } catch (err) {
      setError(getErrorMessage(err));
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
      onGoogleSuccess();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusy('idle');
    }
  };

  return (
    <AuthShell
      title="Create your FinTrack account"
      subtitle="Start tracking spending, budgets, and financial insights."
    >
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
          {busy === 'google' ? 'Connecting…' : 'Continue with Google'}
        </Button>

        <button
          type="button"
          onClick={() => onNavigate('phone')}
          className="w-full py-2.5 rounded-lg border border-[#E5E7EB] text-sm font-semibold text-[#111111] hover:bg-[#F7F8F6] transition-colors"
          disabled={busy !== 'idle'}
        >
          Continue with phone
        </button>

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
            label="Full name"
            autoComplete="name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            prefixElement={<User className="h-4 w-4" />}
            error={fieldErrors.fullName}
            disabled={busy !== 'idle'}
          />
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
          <Input
            label="Password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            prefixElement={<Lock className="h-4 w-4" />}
            error={fieldErrors.password}
            helperText={!fieldErrors.password ? 'At least 8 characters with a number.' : undefined}
            disabled={busy !== 'idle'}
          />
          <Input
            label="Confirm password"
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            prefixElement={<Lock className="h-4 w-4" />}
            error={fieldErrors.confirmPassword}
            disabled={busy !== 'idle'}
          />

          <label className="flex items-start gap-2 cursor-pointer text-xs text-[#6B7280]">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="mt-0.5 h-3.5 w-3.5 rounded border-[#E5E7EB] text-[#0B5D3B] focus:ring-[#0B5D3B]"
            />
            <span>
              I agree to the Terms of Service and Privacy Policy.
              {fieldErrors.terms && (
                <span className="block text-[#C84A4A] mt-1">{fieldErrors.terms}</span>
              )}
            </span>
          </label>

          {error && (
            <div role="alert" className="rounded-lg border border-[#C84A4A]/25 bg-[#C84A4A]/5 px-3 py-2 text-xs text-[#C84A4A]">
              {error}
            </div>
          )}

          <Button type="submit" variant="primary" size="md" className="w-full" disabled={busy !== 'idle'}>
            {busy === 'email' ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Creating account…
              </span>
            ) : (
              'Create account'
            )}
          </Button>
        </form>

        <p className="text-center text-xs text-[#6B7280]">
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => onNavigate('login')}
            className="font-semibold text-[#0B5D3B] hover:underline"
          >
            Sign in
          </button>
        </p>
      </div>
    </AuthShell>
  );
};
