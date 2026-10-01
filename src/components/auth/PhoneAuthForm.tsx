import React, { useState } from 'react';
import { Loader2, ArrowLeft, Phone } from 'lucide-react';
import { AuthShell } from './AuthShell';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { OtpInput } from './OtpInput';
import { useAuth } from '../../context/AuthContext';
import type { AuthViewMode } from './LoginForm';

interface PhoneAuthFormProps {
  onNavigate: (mode: AuthViewMode) => void;
  onSuccess: () => void;
}

function toE164India(local: string): string | null {
  const digits = local.replace(/\D/g, '');
  if (digits.length === 10 && /^[6-9]/.test(digits)) {
    return `+91${digits}`;
  }
  if (digits.length === 12 && digits.startsWith('91') && /^91[6-9]/.test(digits)) {
    return `+${digits}`;
  }
  return null;
}

export const PhoneAuthForm: React.FC<PhoneAuthFormProps> = ({ onNavigate, onSuccess }) => {
  const { sendPhoneOtp, verifyPhoneOtp, clearPhoneAuth, getErrorMessage, isConfigured } = useAuth();
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phoneLocal, setPhoneLocal] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [fieldError, setFieldError] = useState<string | undefined>();
  const [otpError, setOtpError] = useState<string | undefined>();
  const [busy, setBusy] = useState(false);
  const [displayPhone, setDisplayPhone] = useState('');

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const e164 = toE164India(phoneLocal);
    if (!e164) {
      setFieldError('Enter a valid 10-digit Indian mobile number.');
      return;
    }
    setFieldError(undefined);
    if (!isConfigured) {
      setError('Firebase is not configured yet. Add your project keys to the .env file.');
      return;
    }
    setBusy(true);
    try {
      clearPhoneAuth();
      await sendPhoneOtp(e164);
      setDisplayPhone(e164);
      setStep('otp');
      setOtp('');
    } catch (err) {
      setError(getErrorMessage(err));
      clearPhoneAuth();
    } finally {
      setBusy(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (otp.length !== 6) {
      setOtpError('Enter the 6-digit code.');
      return;
    }
    setOtpError(undefined);
    setBusy(true);
    try {
      await verifyPhoneOtp(otp);
      onSuccess();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const handleResend = async () => {
    setError(null);
    setOtp('');
    setBusy(true);
    try {
      clearPhoneAuth();
      await sendPhoneOtp(displayPhone);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const handleChangeNumber = () => {
    clearPhoneAuth();
    setStep('phone');
    setOtp('');
    setError(null);
    setOtpError(undefined);
  };

  if (step === 'otp') {
    return (
      <AuthShell title="Enter verification code" subtitle={`We sent a 6-digit OTP to ${displayPhone}`}>
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <OtpInput value={otp} onChange={setOtp} disabled={busy} error={otpError} />

          {error && (
            <div role="alert" className="rounded-lg border border-[#C84A4A]/25 bg-[#C84A4A]/5 px-3 py-2 text-xs text-[#C84A4A]">
              {error}
            </div>
          )}

          <Button type="submit" variant="primary" size="md" className="w-full" disabled={busy || otp.length !== 6}>
            {busy ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Verifying…
              </span>
            ) : (
              'Verify OTP'
            )}
          </Button>

          <div className="flex flex-col sm:flex-row gap-2">
            <button
              type="button"
              onClick={handleResend}
              disabled={busy}
              className="flex-1 text-xs font-medium text-[#0B5D3B] hover:underline py-2"
            >
              Resend OTP
            </button>
            <button
              type="button"
              onClick={handleChangeNumber}
              disabled={busy}
              className="flex-1 text-xs font-medium text-[#6B7280] hover:text-[#111111] py-2"
            >
              Change number
            </button>
          </div>
        </form>
      </AuthShell>
    );
  }

  return (
    <AuthShell title="Continue with phone" subtitle="We'll send a one-time password to your mobile number.">
      <form onSubmit={handleSendOtp} className="space-y-4" noValidate>
        <div>
          <label className="block text-xs font-medium text-[#111111] mb-1.5" htmlFor="phone-local">
            Phone number
          </label>
          <div className="flex gap-2">
            <div className="shrink-0 w-[72px] rounded-lg border border-[#E5E7EB] bg-[#F7F8F6] px-3 py-2 text-sm font-semibold text-[#111111] flex items-center justify-center">
              +91
            </div>
            <div className="flex-1">
              <Input
                id="phone-local"
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                placeholder="XXXXXXXXXX"
                value={phoneLocal}
                onChange={(e) => setPhoneLocal(e.target.value.replace(/\D/g, '').slice(0, 10))}
                prefixElement={<Phone className="h-4 w-4" />}
                error={fieldError}
                disabled={busy}
                aria-label="Indian mobile number"
              />
            </div>
          </div>
        </div>

        {error && (
          <div role="alert" className="rounded-lg border border-[#C84A4A]/25 bg-[#C84A4A]/5 px-3 py-2 text-xs text-[#C84A4A]">
            {error}
          </div>
        )}

        <Button type="submit" variant="primary" size="md" className="w-full" disabled={busy}>
          {busy ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" /> Sending OTP…
            </span>
          ) : (
            'Send OTP'
          )}
        </Button>

        <button
          type="button"
          onClick={() => {
            clearPhoneAuth();
            onNavigate('login');
          }}
          className="w-full inline-flex items-center justify-center gap-1.5 text-xs font-medium text-[#6B7280] hover:text-[#111111]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to login
        </button>
      </form>
    </AuthShell>
  );
};
