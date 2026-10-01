import { FirebaseError } from 'firebase/app';

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  'auth/invalid-credential': 'The email or password is incorrect.',
  'auth/wrong-password': 'The email or password is incorrect.',
  'auth/user-not-found': 'The email or password is incorrect.',
  'auth/invalid-email': 'Please enter a valid email address.',
  'auth/email-already-in-use': 'An account already exists with this email.',
  'auth/weak-password': 'Password should be at least 6 characters.',
  'auth/missing-password': 'Please enter your password.',
  'auth/missing-email': 'Please enter your email address.',
  'auth/too-many-requests': 'Too many attempts. Please wait a moment and try again.',
  'auth/network-request-failed': 'Network error. Check your connection and try again.',
  'auth/popup-closed-by-user': 'Sign-in was cancelled before completion.',
  'auth/cancelled-popup-request': 'Sign-in was cancelled before completion.',
  'auth/popup-blocked': 'Pop-up was blocked by your browser. Please allow pop-ups and try again.',
  'auth/invalid-verification-code': 'The verification code is incorrect.',
  'auth/code-expired': 'This verification code has expired. Please request a new one.',
  'auth/invalid-verification-id': 'Verification session expired. Please request a new code.',
  'auth/missing-verification-code': 'Please enter the verification code.',
  'auth/invalid-phone-number': 'Please enter a valid phone number.',
  'auth/missing-phone-number': 'Please enter your phone number.',
  'auth/quota-exceeded': 'SMS quota exceeded. Please try again later.',
  'auth/captcha-check-failed': 'Security check failed. Please refresh and try again.',
  'auth/operation-not-allowed': 'This sign-in method is not enabled. Check Firebase Authentication settings.',
  'auth/user-disabled': 'This account has been disabled. Contact support for help.',
  'auth/requires-recent-login': 'For security, please sign in again and retry this action.',
  'auth/account-exists-with-different-credential':
    'An account already exists with the same email using a different sign-in method.',
  'auth/invalid-action-code': 'This link is invalid or has already been used.',
  'auth/expired-action-code': 'This link has expired. Please request a new one.',
};

export function getAuthErrorMessage(error: unknown, fallback = 'Something went wrong. Please try again.'): string {
  if (error instanceof FirebaseError) {
    return AUTH_ERROR_MESSAGES[error.code] ?? fallback;
  }
  if (error instanceof Error && error.message) {
    if (error.message.includes('Firebase is not configured')) {
      return 'Firebase is not configured yet. Add your project keys to the .env file.';
    }
  }
  return fallback;
}
