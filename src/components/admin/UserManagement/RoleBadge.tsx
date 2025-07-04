import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Shield } from 'lucide-react';

interface RoleBadgeProps {
  role: 'admin' | 'Premium' | 'user';
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({ role }) => {
  const getBadgeVariant = () => {
    switch (role) {
      case 'admin':
        return 'default';
      case 'Premium':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getBadgeClassName = () => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'Premium':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getBadgeContent = () => {
    switch (role) {
      case 'admin':
        return (
          <>
            <Shield className="h-3 w-3 mr-1" />
            Admin
          </>
        );
      case 'Premium':
        return 'Premium';
      default:
        return 'User';
    }
  };

  return (
    <Badge 
      variant={getBadgeVariant()}
      className={getBadgeClassName()}
    >
      {getBadgeContent()}
    </Badge>
  );
};