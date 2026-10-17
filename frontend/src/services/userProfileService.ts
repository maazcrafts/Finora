/**
 * Helpers for mapping Firebase auth users into FinTrack profile models.
 */
import { UserProfile } from '../types/finance';
import { initialMockUser } from '../data/mock/mockUser';
import type { AuthUserProfile } from './authService';

const PROFILE_KEY_PREFIX = 'fintrack_profile_';

function profileKey(uid: string): string {
  return `${PROFILE_KEY_PREFIX}${uid}`;
}

export function getInitials(name: string | null | undefined, fallback = 'FT'): string {
  if (!name?.trim()) return fallback;
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function buildProfileFromAuth(authUser: AuthUserProfile): UserProfile {
  let stored: Partial<UserProfile> = {};
  try {
    const raw = localStorage.getItem(profileKey(authUser.uid));
    if (raw) stored = JSON.parse(raw);
  } catch {
    // ignore
  }

  const displayName =
    authUser.displayName?.trim() ||
    stored.name ||
    (authUser.phoneNumber ? `User ${authUser.phoneNumber.slice(-4)}` : 'FinTrack User');

  return {
    ...initialMockUser,
    ...stored,
    id: authUser.uid,
    name: displayName,
    email: authUser.email || stored.email || authUser.phoneNumber || '',
    photoURL: authUser.photoURL,
    phoneNumber: authUser.phoneNumber,
    authProvider: authUser.providerId,
  };
}

export function persistUserProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(profileKey(profile.id), JSON.stringify(profile));
  } catch {
    // ignore
  }
}

export function clearUserProfile(uid: string): void {
  try {
    localStorage.removeItem(profileKey(uid));
  } catch {
    // ignore
  }
}
