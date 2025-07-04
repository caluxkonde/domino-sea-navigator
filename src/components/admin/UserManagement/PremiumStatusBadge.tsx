import React from 'react';
import { Badge } from '@/components/ui/badge';

interface PremiumStatus {
  is_premium: boolean;
  end_date?: string;
  subscription_type?: string;
}

interface PremiumStatusBadgeProps {
  premiumStatus?: PremiumStatus;
}

export const PremiumStatusBadge: React.FC<PremiumStatusBadgeProps> = ({ premiumStatus }) => {
  return (
    <div className="flex flex-col space-y-1">
      <Badge 
        variant={premiumStatus?.is_premium ? 'default' : 'secondary'}
        className={premiumStatus?.is_premium 
          ? 'bg-green-100 text-green-800' 
          : 'bg-gray-100 text-gray-800'}
      >
        {premiumStatus?.is_premium ? 'Premium' : 'Free'}
      </Badge>
      {premiumStatus?.is_premium && premiumStatus.end_date && (
        <span className="text-xs text-slate-500">
          Hingga {new Date(premiumStatus.end_date).toLocaleDateString('id-ID')}
        </span>
      )}
    </div>
  );
};