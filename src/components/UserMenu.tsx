
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, User, Settings, Crown } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useUserRoles } from '@/hooks/useUserRoles';
import { usePremiumStatus } from '@/hooks/usePremiumStatus';

interface UserMenuProps {
  onProfileClick: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({ onProfileClick }) => {
  const { user, signOut } = useAuth();
  const { isAdmin } = useUserRoles();
  const { premiumStatus } = usePremiumStatus();

  // Debug logging
  console.log('UserMenu Debug:', {
    user: user?.email,
    isAdmin,
    premiumStatus
  });

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-auto p-0">
          <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-700 rounded-lg px-2 sm:px-3 py-2 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-semibold">
              {user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate max-w-32">
                {user?.user_metadata?.full_name || 'Pengguna'}
              </p>
              <div className="flex items-center space-x-1">
                {isAdmin && (
                  <Badge variant="default" className="text-xs bg-red-100 text-red-800">
                    Admin
                  </Badge>
                )}
                <Badge 
                  variant={premiumStatus.is_premium ? 'default' : 'secondary'} 
                  className={`text-xs ${premiumStatus.is_premium 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : 'bg-gray-100 text-gray-800'}`}
                >
                  {premiumStatus.is_premium ? 'Premium' : 'Free'}
                </Badge>
              </div>
            </div>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <div className="px-2 py-1.5">
          <p className="text-sm font-medium text-slate-800 truncate">
            {user?.user_metadata?.full_name || 'Pengguna'}
          </p>
          <p className="text-xs text-slate-500 truncate">{user?.email}</p>
          <div className="flex items-center space-x-1 mt-1 flex-wrap gap-1">
            {isAdmin && (
              <Badge variant="outline" className="text-xs">
                Admin
              </Badge>
            )}
            <Badge 
              variant="outline" 
              className={`text-xs ${premiumStatus.is_premium ? 'text-yellow-600' : 'text-gray-600'}`}
            >
              {premiumStatus.is_premium ? (
                <>
                  <Crown className="h-3 w-3 mr-1" />
                  Premium
                </>
              ) : (
                'Free User'
              )}
            </Badge>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onProfileClick}>
          <User className="h-4 w-4 mr-2" />
          Profil Saya
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="h-4 w-4 mr-2" />
          Pengaturan
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={handleSignOut}
          className="text-red-600 focus:text-red-600"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Keluar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
