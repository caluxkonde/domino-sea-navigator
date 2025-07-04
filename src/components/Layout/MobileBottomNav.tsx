import React from 'react';
import { Button } from '@/components/ui/button';
import { Activity, Waves, Users } from 'lucide-react';
import { useUserRoles } from '@/hooks/useUserRoles';
import { usePremiumStatus } from '@/hooks/usePremiumStatus';

interface MobileBottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onTabChange
}) => {
  const { isAdmin } = useUserRoles();
  const { premiumStatus } = usePremiumStatus();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-md border-t border-border shadow-lg z-50">
      <div className="flex items-center justify-around py-2 px-2 max-w-sm mx-auto">
        <Button
          variant={activeTab === 'overview' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onTabChange('overview')}
          className="flex flex-col items-center py-2 px-2 h-auto min-w-0 flex-1"
        >
          <Activity className="h-4 w-4 mb-1" />
          <span className="text-xs">Home</span>
        </Button>
        <Button
          variant={activeTab === 'blog' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onTabChange('blog')}
          className="flex flex-col items-center py-2 px-2 h-auto min-w-0 flex-1"
        >
          <Activity className="h-4 w-4 mb-1" />
          <span className="text-xs">Info</span>
        </Button>
        <Button
          variant={activeTab === 'tides' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onTabChange('tides')}
          className="flex flex-col items-center py-2 px-2 h-auto min-w-0 flex-1"
          disabled={!isAdmin && !premiumStatus.is_premium}
        >
          <Waves className="h-4 w-4 mb-1" />
          <span className="text-xs">Tides</span>
        </Button>
        <Button
          variant={activeTab === 'profile' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onTabChange('profile')}
          className="flex flex-col items-center py-2 px-2 h-auto min-w-0 flex-1"
        >
          <Users className="h-4 w-4 mb-1" />
          <span className="text-xs">Profile</span>
        </Button>
      </div>
    </div>
  );
};