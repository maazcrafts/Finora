import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  AuthService,
  AuthUserProfile,
  isUserAccessAllowed,
  mapFirebaseUser,
} from '../services/authService';

interface AuthContextType {
  user: AuthUserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isEmailVerified: boolean;
  needsEmailVerification: boolean;
  isConfigured: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  registerWithEmail: (fullName: string, email: string, password: string) => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
  refreshUser: () => Promise<AuthUserProfile | null>;
  sendPhoneOtp: (e164Phone: string) => Promise<void>;
  verifyPhoneOtp: (code: string) => Promise<void>;
  clearPhoneAuth: () => void;
  logout: () => Promise<void>;
  getErrorMessage: (error: unknown) => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isConfigured = AuthService.isConfigured();

  useEffect(() => {
    if (!isConfigured) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    const unsubscribe = AuthService.subscribe((nextUser) => {
      setUser(nextUser);
      setIsLoading(false);
    });

    return unsubscribe;
  }, [isConfigured]);

  const signInWithGoogle = useCallback(async () => {
    const credential = await AuthService.signInWithGoogle();
    // Update the React context immediately from Firebase's successful result.
    // The auth listener remains responsible for subsequent session changes.
    setUser(mapFirebaseUser(credential.user));
  }, []);

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    const credential = await AuthService.signInWithEmail(email, password);
    // Do not wait for the auth observer before allowing the UI to react.
    setUser(mapFirebaseUser(credential.user));
  }, []);

  const registerWithEmail = useCallback(async (fullName: string, email: string, password: string) => {
    const credential = await AuthService.registerWithEmail(fullName, email, password);
    // Registration also signs the user in. Keeping the context synchronized here
    // makes the verification screen deterministic even if the observer is delayed.
    setUser(mapFirebaseUser(credential.user));
  }, []);

  const sendPasswordReset = useCallback(async (email: string) => {
    await AuthService.sendPasswordReset(email);
  }, []);

  const resendVerificationEmail = useCallback(async () => {
    await AuthService.resendVerificationEmail();
  }, []);

  const refreshUser = useCallback(async () => {
    const refreshed = await AuthService.reloadCurrentUser();
    setUser(refreshed);
    return refreshed;
  }, []);

  const sendPhoneOtp = useCallback(async (e164Phone: string) => {
    await AuthService.sendPhoneOtp(e164Phone);
  }, []);

  const verifyPhoneOtp = useCallback(async (code: string) => {
    const credential = await AuthService.verifyPhoneOtp(code);
    setUser(mapFirebaseUser(credential.user));
  }, []);

  const clearPhoneAuth = useCallback(() => {
    AuthService.clearPhoneAuth();
  }, []);

  const logout = useCallback(async () => {
    await AuthService.signOut();
    setUser(null);
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      isLoading,
      isAuthenticated: Boolean(user) && isUserAccessAllowed(user),
      isEmailVerified: Boolean(user?.emailVerified),
      needsEmailVerification: Boolean(
        user && user.providerId === 'password' && !user.emailVerified
      ),
      isConfigured,
      signInWithGoogle,
      signInWithEmail,
      registerWithEmail,
      sendPasswordReset,
      resendVerificationEmail,
      refreshUser,
      sendPhoneOtp,
      verifyPhoneOtp,
      clearPhoneAuth,
      logout,
      getErrorMessage: AuthService.getErrorMessage,
    }),
    [
      user,
      isLoading,
      isConfigured,
      signInWithGoogle,
      signInWithEmail,
      registerWithEmail,
      sendPasswordReset,
      resendVerificationEmail,
      refreshUser,
      sendPhoneOtp,
      verifyPhoneOtp,
      clearPhoneAuth,
      logout,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
