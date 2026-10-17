import {
  GoogleAuthProvider,
  RecaptchaVerifier,
  ConfirmationResult,
  User,
  UserCredential,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithPhoneNumber,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile,
  reload,
  onAuthStateChanged,
  type Unsubscribe,
} from 'firebase/auth';
import { getFirebaseAuth, isFirebaseConfigured } from '../firebase/config';
import { getAuthErrorMessage } from '../utils/authErrors';

export type AuthProviderId = 'password' | 'google.com' | 'phone' | 'unknown';

export interface AuthUserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  phoneNumber: string | null;
  emailVerified: boolean;
  providerId: AuthProviderId;
}

let recaptchaVerifier: RecaptchaVerifier | null = null;
let confirmationResult: ConfirmationResult | null = null;

function mapProvider(user: User): AuthProviderId {
  const provider = user.providerData[0]?.providerId;
  if (provider === 'password' || provider === 'google.com' || provider === 'phone') {
    return provider;
  }
  return 'unknown';
}

export function mapFirebaseUser(user: User | null): AuthUserProfile | null {
  if (!user) return null;
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    phoneNumber: user.phoneNumber,
    emailVerified: user.emailVerified,
    providerId: mapProvider(user),
  };
}

/** Phone and Google users are treated as verified for app access. */
export function isUserAccessAllowed(user: AuthUserProfile | null): boolean {
  if (!user) return false;
  if (user.providerId === 'phone' || user.providerId === 'google.com') return true;
  return user.emailVerified;
}

export class AuthService {
  static isConfigured(): boolean {
    return isFirebaseConfigured();
  }

  static subscribe(callback: (user: AuthUserProfile | null) => void): Unsubscribe {
    if (!isFirebaseConfigured()) {
      callback(null);
      return () => undefined;
    }
    return onAuthStateChanged(getFirebaseAuth(), (user) => {
      callback(mapFirebaseUser(user));
    });
  }

  static async signInWithGoogle(): Promise<UserCredential> {
    const auth = getFirebaseAuth();
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    return signInWithPopup(auth, provider);
  }

  static async registerWithEmail(
    fullName: string,
    email: string,
    password: string
  ): Promise<UserCredential> {
    const auth = getFirebaseAuth();
    const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
    await updateProfile(credential.user, { displayName: fullName.trim() });
    await sendEmailVerification(credential.user);
    return credential;
  }

  static async signInWithEmail(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(getFirebaseAuth(), email.trim(), password);
  }

  static async sendPasswordReset(email: string): Promise<void> {
    await sendPasswordResetEmail(getFirebaseAuth(), email.trim());
  }

  static async resendVerificationEmail(): Promise<void> {
    const user = getFirebaseAuth().currentUser;
    if (!user) throw new Error('No signed-in user to verify.');
    await sendEmailVerification(user);
  }

  static async reloadCurrentUser(): Promise<AuthUserProfile | null> {
    const user = getFirebaseAuth().currentUser;
    if (!user) return null;
    await reload(user);
    return mapFirebaseUser(getFirebaseAuth().currentUser);
  }

  static async signOut(): Promise<void> {
    this.clearPhoneAuth();
    await signOut(getFirebaseAuth());
  }

  static ensureRecaptcha(containerId = 'recaptcha-container'): RecaptchaVerifier {
    const auth = getFirebaseAuth();
    if (recaptchaVerifier) {
      return recaptchaVerifier;
    }
    recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
      size: 'invisible',
    });
    return recaptchaVerifier;
  }

  static async sendPhoneOtp(e164Phone: string): Promise<void> {
    const auth = getFirebaseAuth();
    const verifier = this.ensureRecaptcha();
    confirmationResult = await signInWithPhoneNumber(auth, e164Phone, verifier);
  }

  static async verifyPhoneOtp(code: string): Promise<UserCredential> {
    if (!confirmationResult) {
      throw new Error('No OTP session found. Please request a new code.');
    }
    const result = await confirmationResult.confirm(code.trim());
    confirmationResult = null;
    return result;
  }

  static clearPhoneAuth(): void {
    confirmationResult = null;
    if (recaptchaVerifier) {
      try {
        recaptchaVerifier.clear();
      } catch {
        // ignore
      }
      recaptchaVerifier = null;
    }
  }

  static getErrorMessage(error: unknown): string {
    return getAuthErrorMessage(error);
  }
}
