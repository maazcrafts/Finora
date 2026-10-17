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
  'auth/unauthorized-domain': 'This website is not authorized for Google sign-in. Add the current site domain to Firebase Authentication → Settings → Authorized domains, then try again.',
  'auth/app-not-authorized': 'This app is not authorized for Firebase Authentication. Check the Firebase project configuration and authorized domains.',
  'auth/invalid-api-key': 'The Firebase API key is invalid. Check the VITE_FIREBASE_API_KEY value in the deployment environment.',
  'auth/web-storage-unsupported': 'Browser storage is unavailable, so Google sign-in cannot complete. Enable cookies/site storage and try again.',
  'auth/internal-error': 'Google sign-in could not be completed. Check the Firebase Google provider and OAuth authorized origins, then try again.',
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
    if (/origin_mismatch|unauthorized.*domain|not authorized to run this operation/i.test(error.message)) {
      return 'Google sign-in is not authorized for this website. Add the current site origin/domain to Firebase Authentication and the Google OAuth client, then try again.';
    }
  }
  return fallback;
}
