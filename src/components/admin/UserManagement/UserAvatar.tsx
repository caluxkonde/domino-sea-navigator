import React from 'react';

interface UserAvatarProps {
  fullName?: string | null;
  email?: string | null;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ fullName, email }) => {
  const getInitial = () => {
    return fullName?.charAt(0) || email?.charAt(0) || 'U';
  };

  return (
    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
      {getInitial()}
    </div>
  );
};