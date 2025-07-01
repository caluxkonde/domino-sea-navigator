
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Crown, Star } from 'lucide-react';
import { usePremiumStatus } from '@/hooks/usePremiumStatus';

interface PremiumStatusIndicatorProps {
  onUpgradeClick: () => void;
}

const PremiumStatusIndicator: React.FC<PremiumStatusIndicatorProps> = ({ onUpgradeClick }) => {
  const { premiumStatus, loading } = usePremiumStatus();

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-6 w-16 sm:h-8 sm:w-20 bg-slate-200 rounded"></div>
      </div>
    );
  }

  if (premiumStatus.is_premium) {
    return (
      <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 hover:from-yellow-500 hover:to-orange-600 text-xs sm:text-sm">
        <Crown className="h-3 w-3 mr-1" />
        <span className="hidden sm:inline">Premium</span>
        <span className="sm:hidden">Pro</span>
      </Badge>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onUpgradeClick}
      className="border-orange-200 text-orange-600 hover:bg-orange-50 text-xs sm:text-sm px-2 sm:px-3"
    >
      <Star className="h-3 w-3 mr-1" />
      <span className="hidden sm:inline">Non Premium</span>
      <span className="sm:hidden">Free</span>
    </Button>
  );
};

export default PremiumStatusIndicator;
