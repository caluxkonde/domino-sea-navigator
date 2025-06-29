
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

  if (premiumLoading || roleLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Check admin access
  if (requireAdmin && !isAdmin) {
    return (
      <Card className="mx-auto max-w-md">
        <CardContent className="pt-6 text-center">
          <Lock className="h-12 w-12 mx-auto text-red-500 mb-4" />
          <h3 className="text-lg font-semibold text-slate-800 mb-2">
            Akses Terbatas
          </h3>
          <p className="text-slate-600 mb-4">
            Halaman ini hanya dapat diakses oleh Admin.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Check premium access
  if (requirePremium && !premiumStatus.is_premium && !isAdmin) {
    return (
      <Card className="mx-auto max-w-md">
        <CardContent className="pt-6 text-center">
          <Crown className="h-12 w-12 mx-auto text-yellow-500 mb-4" />
          <h3 className="text-lg font-semibold text-slate-800 mb-2">
            Upgrade ke Premium
          </h3>
          <p className="text-slate-600 mb-4">
            Fitur ini hanya tersedia untuk pengguna Premium. Upgrade sekarang untuk mendapatkan akses penuh ke semua fitur NaviMarine.
          </p>
          {onUpgradeClick && (
            <Button onClick={onUpgradeClick} className="w-full">
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
