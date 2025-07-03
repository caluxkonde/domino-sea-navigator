import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  Waves, 
  MapPin, 
  FileText, 
  User, 
  Info, 
  FileUser, 
  Award,
  Shield,
  Activity
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useUserRoles } from '@/hooks/useUserRoles';
import { usePremiumStatus } from '@/hooks/usePremiumStatus';

interface MobileNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({ activeTab, onTabChange }) => {
  const { isAdmin } = useUserRoles();
  const { premiumStatus } = usePremiumStatus();

  const allMenuItems = [
    { id: 'overview', label: 'Dashboard', icon: BarChart3, color: 'text-blue-600', type: 'main' },
    { id: 'blog', label: 'Info & Lowongan', icon: Info, color: 'text-purple-600', type: 'free' },
    { id: 'cv-builder', label: 'CV Builder', icon: FileUser, color: 'text-green-600', type: 'free' },
    { id: 'tides', label: 'Pasang Surut', icon: Waves, color: 'text-blue-500', type: 'premium' },
    { id: 'routes', label: 'Navigasi', icon: MapPin, color: 'text-indigo-600', type: 'premium' },
    { id: 'contracts', label: 'Kontrak', icon: FileText, color: 'text-orange-600', type: 'premium' },
    { id: 'certifications', label: 'Sertifikasi', icon: Award, color: 'text-yellow-600', type: 'premium' },
    { id: 'profile', label: 'Profil', icon: User, color: 'text-gray-600', type: 'account' },
  ];

  const adminItems = [
    { id: 'admin-dashboard', label: 'Admin Dashboard', icon: Shield, color: 'text-red-600', type: 'admin' },
    { id: 'admin', label: 'Verifikasi', icon: Shield, color: 'text-red-500', type: 'admin' },
    { id: 'blog-management', label: 'Kelola Artikel', icon: Shield, color: 'text-red-400', type: 'admin' },
    { id: 'user-management', label: 'Kelola User', icon: Shield, color: 'text-red-700', type: 'admin' },
    { id: 'premium-management', label: 'Kelola Premium', icon: Shield, color: 'text-red-800', type: 'admin' },
  ];

  const menuItems = isAdmin ? [...allMenuItems, ...adminItems] : allMenuItems;

  const canAccess = (type: string) => {
    if (type === 'admin') return isAdmin;
    if (type === 'premium') return isAdmin || premiumStatus.is_premium;
    return true;
  };

  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex space-x-3 px-4 min-w-max">
        {menuItems.map((item) => {
          const hasAccess = canAccess(item.type);
          return (
            <div key={item.id} className="flex-shrink-0">
              <Button
                variant={activeTab === item.id ? 'default' : 'ghost'}
                size="sm"
                onClick={() => hasAccess && onTabChange(item.id)}
                className={`
                  flex flex-col items-center space-y-1 h-16 w-20 p-2 relative
                  ${!hasAccess ? 'opacity-50 cursor-not-allowed' : ''}
                  ${activeTab === item.id ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}
                `}
                disabled={!hasAccess}
              >
                <item.icon className={`h-5 w-5 ${activeTab === item.id ? '' : item.color}`} />
                <span className="text-xs font-medium text-center leading-tight">
                  {item.label}
                </span>
                {item.type === 'premium' && !hasAccess && (
                  <Badge variant="secondary" className="absolute -top-1 -right-1 text-xs px-1 py-0 h-4">
                    Pro
                  </Badge>
                )}
                {item.type === 'admin' && (
                  <Badge variant="destructive" className="absolute -top-1 -right-1 text-xs px-1 py-0 h-4">
                    A
                  </Badge>
                )}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MobileNavigation;