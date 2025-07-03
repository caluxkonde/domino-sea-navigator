import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Users, FileText, Briefcase, Bell, User, 
  PlusCircle, MoreHorizontal, Calendar, Ship, Navigation,
  Settings, CreditCard, Trophy, BookOpen, MapPin, Crown
} from 'lucide-react';
import { useUserRoles } from '@/hooks/useUserRoles';
import { usePremiumStatus } from '@/hooks/usePremiumStatus';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href?: string;
  onClick?: () => void;
  role?: 'admin' | 'Premium' | 'user';
  premium?: boolean;
  admin?: boolean;
}

interface MobileMenuProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ activeTab, onTabChange }) => {
  const { isAdmin } = useUserRoles();
  const { premiumStatus } = usePremiumStatus();
  const [showMore, setShowMore] = useState(false);

  const menuItems: MenuItem[] = [
    { id: 'overview', label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" />, onClick: () => onTabChange('overview') },
    { id: 'blog', label: 'Info & Lowongan', icon: <FileText className="h-5 w-5" />, onClick: () => onTabChange('blog') },
    { id: 'cv-builder', label: 'CV Builder', icon: <User className="h-5 w-5" />, onClick: () => onTabChange('cv-builder') },
    { id: 'tides', label: 'Pasang Surut', icon: <Calendar className="h-5 w-5" />, onClick: () => onTabChange('tides'), premium: true },
    { id: 'routes', label: 'Navigasi', icon: <Navigation className="h-5 w-5" />, onClick: () => onTabChange('routes'), premium: true },
    { id: 'contracts', label: 'Kontrak', icon: <Briefcase className="h-5 w-5" />, onClick: () => onTabChange('contracts'), premium: true },
    { id: 'certifications', label: 'Sertifikasi', icon: <Trophy className="h-5 w-5" />, onClick: () => onTabChange('certifications'), premium: true },
    { id: 'profile', label: 'Profil', icon: <User className="h-5 w-5" />, onClick: () => onTabChange('profile') },
    
    // Admin only menus
    { id: 'admin-dashboard', label: 'Admin Panel', icon: <Settings className="h-5 w-5" />, onClick: () => onTabChange('admin-dashboard'), admin: true },
    { id: 'admin', label: 'Verifikasi', icon: <CreditCard className="h-5 w-5" />, onClick: () => onTabChange('admin'), admin: true },
    { id: 'blog-management', label: 'Kelola Artikel', icon: <BookOpen className="h-5 w-5" />, onClick: () => onTabChange('blog-management'), admin: true },
    { id: 'user-management', label: 'Kelola User', icon: <Users className="h-5 w-5" />, onClick: () => onTabChange('user-management'), admin: true },
    { id: 'premium-management', label: 'Kelola Premium', icon: <Crown className="h-5 w-5" />, onClick: () => onTabChange('premium-management'), admin: true },
  ];

  const filteredItems = menuItems.filter(item => {
    // Show admin items only to admins
    if (item.admin && !isAdmin) return false;
    
    // Show premium items to admins or premium users
    if (item.premium && !isAdmin && !premiumStatus.is_premium) return false;
    
    return true;
  });

  const maxDisplayItems = 8;
  const displayedItems = showMore ? filteredItems : filteredItems.slice(0, maxDisplayItems);
  const hasMoreItems = filteredItems.length > maxDisplayItems;

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="bg-card/95 backdrop-blur-md p-4">
      <motion.div 
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3"
        initial="hidden"
        animate="visible"
      >
        {displayedItems.map((item, index) => {
          const isActive = activeTab === item.id;
          const canAccess = item.admin ? isAdmin : (item.premium ? (isAdmin || premiumStatus.is_premium) : true);
          
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <button
                onClick={canAccess ? item.onClick : undefined}
                disabled={!canAccess}
                className={`
                  w-full aspect-square flex flex-col items-center justify-center
                  rounded-xl shadow-sm border transition-all duration-200
                  ${isActive 
                    ? 'bg-primary text-primary-foreground border-primary shadow-md' 
                    : 'bg-background hover:bg-muted border-border hover:shadow-md'
                  }
                  ${!canAccess ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  relative
                `}
              >
                <div className={`mb-2 ${isActive ? 'text-primary-foreground' : 'text-muted-foreground'}`}>
                  {item.icon}
                </div>
                <span className={`text-xs font-medium text-center leading-tight px-1 ${
                  isActive ? 'text-primary-foreground' : 'text-foreground'
                }`}>
                  {item.label}
                </span>
                
                {/* Premium badge */}
                {item.premium && !canAccess && (
                  <div className="absolute -top-1 -right-1 bg-yellow-400 text-yellow-900 text-xs px-1 py-0.5 rounded-full font-medium">
                    Pro
                  </div>
                )}
                
                {/* Admin badge */}
                {item.admin && (
                  <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 py-0.5 rounded-full font-medium">
                    A
                  </div>
                )}
              </button>
            </motion.div>
          );
        })}

        {/* More button */}
        {hasMoreItems && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: displayedItems.length * 0.1, duration: 0.3 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <button
              onClick={() => setShowMore(!showMore)}
              className="w-full aspect-square flex flex-col items-center justify-center
                       rounded-xl shadow-sm border bg-background hover:bg-muted 
                       border-border hover:shadow-md transition-all duration-200"
            >
              <MoreHorizontal className="h-5 w-5 text-muted-foreground mb-2" />
              <span className="text-xs font-medium text-foreground">
                {showMore ? 'Sembunyikan' : 'Lainnya'}
              </span>
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default MobileMenu;