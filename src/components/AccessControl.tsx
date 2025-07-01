
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, Crown, Star } from 'lucide-react';
import { usePremiumStatus } from '@/hooks/usePremiumStatus';
import { useUserRoles } from '@/hooks/useUserRoles';

interface AccessControlProps {
  children: React.ReactNode;
  requirePremium?: boolean;
  requireAdmin?: boolean;
  onUpgradeClick?: () => void;
}

const AccessControl: React.FC<AccessControlProps> = ({ 
  children, 
  requirePremium = false, 
  requireAdmin = false,
  onUpgradeClick 
}) => {
  const { premiumStatus, loading: premiumLoading } = usePremiumStatus();
  const { isAdmin, loading: roleLoading } = useUserRoles();

  // Debug logging
  console.log('AccessControl Debug:', {
    premiumStatus,
    isAdmin,
    premiumLoading,
    roleLoading,
    requirePremium,
    requireAdmin
  });

  if (premiumLoading || roleLoading) {
    return (
      <div className="flex items-center justify-center py-8 sm:py-12">
        <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Check admin access
  if (requireAdmin && !isAdmin) {
    return (
      <Card className="mx-auto max-w-sm sm:max-w-md">
        <CardContent className="pt-4 sm:pt-6 text-center px-4 sm:px-6">
          <Lock className="h-8 w-8 sm:h-12 sm:w-12 mx-auto text-red-500 mb-3 sm:mb-4" />
          <h3 className="text-base sm:text-lg font-semibold text-slate-800 mb-2">
            Akses Terbatas
          </h3>
          <p className="text-sm sm:text-base text-slate-600 mb-4">
            Halaman ini hanya dapat diakses oleh Admin.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Check premium access (admins automatically have premium access)
  if (requirePremium && !premiumStatus.is_premium && !isAdmin) {
    return (
      <Card className="mx-auto max-w-sm sm:max-w-md">
        <CardContent className="pt-4 sm:pt-6 text-center px-4 sm:px-6">
          <Crown className="h-8 w-8 sm:h-12 sm:w-12 mx-auto text-yellow-500 mb-3 sm:mb-4" />
          <h3 className="text-base sm:text-lg font-semibold text-slate-800 mb-2">
            Upgrade ke Premium
          </h3>
          <p className="text-sm sm:text-base text-slate-600 mb-4">
            Fitur ini hanya tersedia untuk pengguna Premium. Upgrade sekarang untuk mendapatkan akses penuh ke semua fitur NaviMarine.
          </p>
          {onUpgradeClick && (
            <Button onClick={onUpgradeClick} className="w-full text-sm sm:text-base">
              <Star className="h-4 w-4 mr-2" />
              Upgrade Sekarang
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return <>{children}</>;
};

export default AccessControl;
