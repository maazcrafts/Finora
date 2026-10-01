import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { LoginForm, type AuthViewMode } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { ForgotPasswordForm } from './ForgotPasswordForm';
import { VerifyEmailForm } from './VerifyEmailForm';
import { PhoneAuthForm } from './PhoneAuthForm';

interface AuthPageProps {
  initialMode?: AuthViewMode;
  onAuthenticated: () => void;
  onBackToLanding?: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  initialMode = 'login',
  onAuthenticated,
}) => {
  const { user, needsEmailVerification, isAuthenticated } = useAuth();
  const [mode, setMode] = useState<AuthViewMode>(initialMode);

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  useEffect(() => {
    if (needsEmailVerification) {
      setMode('verify');
    } else if (isAuthenticated) {
      onAuthenticated();
    }
  }, [needsEmailVerification, isAuthenticated, onAuthenticated]);

  const handleAuthSuccess = () => {
    // onAuthStateChanged may lag one tick; verification gate handled by effect
    if (user && needsEmailVerification) {
      setMode('verify');
      return;
    }
    // Effect will call onAuthenticated when isAuthenticated becomes true
  };

  if (mode === 'register') {
    return (
      <RegisterForm
        onNavigate={setMode}
        onRegistered={() => setMode('verify')}
        onGoogleSuccess={onAuthenticated}
      />
    );
  }

  if (mode === 'forgot') {
    return <ForgotPasswordForm onNavigate={setMode} />;
  }

  if (mode === 'verify') {
    return (
      <VerifyEmailForm
        onNavigate={setMode}
        onVerified={onAuthenticated}
      />
    );
  }

  if (mode === 'phone') {
    return <PhoneAuthForm onNavigate={setMode} onSuccess={onAuthenticated} />;
  }

  return (
    <LoginForm
      onNavigate={setMode}
      onSuccess={handleAuthSuccess}
      onNeedsVerification={() => setMode('verify')}
    />
  );
};
