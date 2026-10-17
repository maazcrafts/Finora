import React from 'react';
import { getInitials } from '../../services/userProfileService';

interface UserAvatarProps {
  name: string;
  photoURL?: string | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-16 w-16 text-xl',
};

export const UserAvatar: React.FC<UserAvatarProps> = ({
  name,
  photoURL,
  size = 'sm',
  className = '',
}) => {
  if (photoURL) {
    return (
      <img
        src={photoURL}
        alt={name}
        className={`${sizeClasses[size]} rounded-full object-cover border border-white shadow-xs ${className}`}
        referrerPolicy="no-referrer"
      />
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-full bg-[#0B5D3B] text-white flex items-center justify-center font-semibold border border-white shadow-xs ${className}`}
      aria-hidden="true"
    >
      {getInitials(name)}
    </div>
  );
};
