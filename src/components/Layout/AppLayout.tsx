import React, { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from '@/components/AppSidebar';
import Dashboard from '@/components/Dashboard';
import TidalInfo from '@/components/TidalInfo';
import NavigationMap from '@/components/NavigationMap';
import ContractManagement from '@/components/ContractManagement';
import AdminPanel from '@/components/AdminPanel';
import AdminDashboard from '@/components/admin/AdminDashboard';
import UserManagement from '@/components/admin/UserManagement';
import BlogManagement from '@/components/admin/BlogManagement';
import UserProfile from '@/components/UserProfile';
import BlogPage from '@/components/BlogPage';
import CVBuilder from '@/components/CVBuilder';
import CertificationPage from '@/components/CertificationPage';
import PremiumUpgrade from '@/components/PremiumUpgrade';
import AccessControl from '@/components/AccessControl';
import PremiumManagement from '@/components/admin/PremiumManagement';
import MobileMenu from '@/components/MobileMenu';
import { DesktopHeader } from './DesktopHeader';
import { MobileHeader } from './MobileHeader';
import { MobileBottomNav } from './MobileBottomNav';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useIsMobile } from '@/hooks/use-mobile';
import { Toaster } from '@/components/ui/toaster';

interface AppLayoutProps {
  onAuthRequired: () => void;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ onAuthRequired }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showPremiumUpgrade, setShowPremiumUpgrade] = useState(false);
  const { darkMode, toggleDarkMode } = useAppTheme();
  const isMobile = useIsMobile();

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <Dashboard onNavigateToInfo={() => setActiveTab('blog')} />;
      case 'tides':
        return (
          <AccessControl requirePremium onUpgradeClick={() => setShowPremiumUpgrade(true)}>
            <TidalInfo />
          </AccessControl>
        );
      case 'routes':
        return (
          <AccessControl requirePremium onUpgradeClick={() => setShowPremiumUpgrade(true)}>
            <NavigationMap />
          </AccessControl>
        );
      case 'contracts':
        return (
          <AccessControl requirePremium onUpgradeClick={() => setShowPremiumUpgrade(true)}>
            <ContractManagement />
          </AccessControl>
        );
      case 'admin':
        return (
          <AccessControl requireAdmin>
            <AdminPanel />
          </AccessControl>
        );
      case 'admin-dashboard':
        return (
          <AccessControl requireAdmin>
            <AdminDashboard onNavigate={setActiveTab} />
          </AccessControl>
        );
      case 'user-management':
        return (
          <AccessControl requireAdmin>
            <UserManagement />
          </AccessControl>
        );
      case 'blog-management':
        return (
          <AccessControl requireAdmin>
            <BlogManagement />
          </AccessControl>
        );
      case 'certifications':
        return (
          <AccessControl requirePremium onUpgradeClick={() => setShowPremiumUpgrade(true)}>
            <CertificationPage />
          </AccessControl>
        );
      case 'premium-management':
        return (
          <AccessControl requireAdmin>
            <PremiumManagement />
          </AccessControl>
        );
      case 'profile':
        return <UserProfile />;
      case 'blog':
        return <BlogPage />;
      case 'cv-builder':
        return <CVBuilder />;
      default:
        return <Dashboard onNavigateToInfo={() => setActiveTab('blog')} />;
    }
  };

  return (
    <SidebarProvider>
      <div className={`flex min-h-screen transition-all duration-300 ${darkMode ? 'dark' : ''}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-blue-900"></div>
        <div className="relative z-10 flex w-full">
          {!isMobile && <AppSidebar activeTab={activeTab} onTabChange={setActiveTab} />}
          
          <div className="flex-1 flex flex-col">
            {/* Desktop Header */}
            {!isMobile && (
              <DesktopHeader
                darkMode={darkMode}
                onToggleDarkMode={toggleDarkMode}
                onShowPremiumUpgrade={() => setShowPremiumUpgrade(true)}
                onProfileClick={() => setActiveTab('profile')}
              />
            )}

            {/* Mobile Header */}
            {isMobile && (
              <MobileHeader
                darkMode={darkMode}
                onToggleDarkMode={toggleDarkMode}
                onShowPremiumUpgrade={() => setShowPremiumUpgrade(true)}
                onProfileClick={() => setActiveTab('profile')}
              />
            )}

            {/* Main Content */}
            <main className={`flex-1 ${isMobile ? 'p-0 pb-20' : 'p-6'} overflow-auto`}>
              <div className={isMobile ? 'w-full' : 'max-w-7xl mx-auto'}>
                {renderContent()}
              </div>
            </main>

            {/* Mobile Navigation Menu */}
            {isMobile && (
              <MobileMenu activeTab={activeTab} onTabChange={setActiveTab} />
            )}

            {/* Mobile Bottom Tab Bar */}
            {isMobile && (
              <MobileBottomNav activeTab={activeTab} onTabChange={setActiveTab} />
            )}
          </div>
        </div>
      </div>
      
      <PremiumUpgrade 
        open={showPremiumUpgrade} 
        onOpenChange={setShowPremiumUpgrade} 
      />
      <Toaster />
    </SidebarProvider>
  );
};