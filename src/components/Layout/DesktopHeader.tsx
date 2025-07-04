import React from 'react';
import { Button } from '@/components/ui/button';
import { Search, Settings, Sun, Moon } from 'lucide-react';
import PremiumStatusIndicator from '@/components/PremiumStatusIndicator';
import NotificationDropdown from '@/components/NotificationDropdown';
import UserMenu from '@/components/UserMenu';
import RoleManagementDialog from '@/components/RoleManagementDialog';
import { useUserRoles } from '@/hooks/useUserRoles';

interface DesktopHeaderProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onShowPremiumUpgrade: () => void;
  onProfileClick: () => void;
}

export const DesktopHeader: React.FC<DesktopHeaderProps> = ({
  darkMode,
  onToggleDarkMode,
  onShowPremiumUpgrade,
  onProfileClick
}) => {
  const { isAdmin } = useUserRoles();

  return (
    <header className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 shadow-sm sticky top-0 z-50">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari di Info Pelaut..."
              className="pl-10 pr-4 py-2 w-64 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <PremiumStatusIndicator onUpgradeClick={onShowPremiumUpgrade} />
          
          {isAdmin && <RoleManagementDialog />}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleDarkMode}
            className="relative"
          >
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          
          <NotificationDropdown />
          
          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
          
          <UserMenu onProfileClick={onProfileClick} />
        </div>
      </div>
    </header>
  );
};