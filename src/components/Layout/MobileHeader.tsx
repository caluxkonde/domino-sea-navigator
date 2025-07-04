import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Sun, Moon, Waves } from 'lucide-react';
import PremiumStatusIndicator from '@/components/PremiumStatusIndicator';
import NotificationDropdown from '@/components/NotificationDropdown';
import UserMenu from '@/components/UserMenu';
import { useUserRoles } from '@/hooks/useUserRoles';
import { usePremiumStatus } from '@/hooks/usePremiumStatus';
import { useAuth } from '@/hooks/useAuth';

interface MobileHeaderProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onShowPremiumUpgrade: () => void;
  onProfileClick: () => void;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  darkMode,
  onToggleDarkMode,
  onShowPremiumUpgrade,
  onProfileClick
}) => {
  const { user } = useAuth();
  const { isAdmin } = useUserRoles();
  const { premiumStatus } = usePremiumStatus();

  return (
    <div className="bg-card/95 backdrop-blur-md border-b border-border p-4 sticky top-0 z-50">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
            <Waves className="h-5 w-5 text-primary" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground">
              {new Date().toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' })}
            </div>
            <h1 className="text-sm font-semibold text-foreground">
              Hi, {user?.user_metadata?.full_name?.split(' ')[0] || 'User'}
            </h1>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex flex-col space-y-1">
            {isAdmin && (
              <Badge variant="destructive" className="text-xs px-2 py-0 h-5">
                Admin
              </Badge>
            )}
            <Badge 
              variant={premiumStatus.is_premium ? 'default' : 'secondary'} 
              className={`text-xs px-2 py-0 h-5 ${
                premiumStatus.is_premium 
                  ? 'bg-yellow-100 text-yellow-800 border-yellow-300' 
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {premiumStatus.is_premium ? 'Premium' : 'Free'}
            </Badge>
          </div>
          <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
            <span className="text-xs font-medium">
              {user?.user_metadata?.full_name?.split(' ').map((n: string) => n[0]).join('') || 'U'}
            </span>
          </div>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Cari di Info Pelaut..."
          className="w-full pl-10 pr-4 py-2 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
        />
      </div>

      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={onToggleDarkMode}>
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <NotificationDropdown />
        </div>
        
        <div className="flex items-center space-x-2">
          <PremiumStatusIndicator onUpgradeClick={onShowPremiumUpgrade} />
          <UserMenu onProfileClick={onProfileClick} />
        </div>
      </div>
    </div>
  );
};