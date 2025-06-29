
import { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AuthProvider } from '@/hooks/useAuth';
import AuthPage from '@/components/AuthPage';
import AppSidebar from '@/components/AppSidebar';
import Dashboard from '@/components/Dashboard';
import TidalInfo from '@/components/TidalInfo';
import NavigationMap from '@/components/NavigationMap';
import ContractManagement from '@/components/ContractManagement';
import AdminPanel from '@/components/AdminPanel';
import UserProfile from '@/components/UserProfile';
import BlogPage from '@/components/BlogPage';
import CVBuilder from '@/components/CVBuilder';
import CertificationPage from '@/components/CertificationPage';
import PremiumUpgrade from '@/components/PremiumUpgrade';
import PremiumStatusIndicator from '@/components/PremiumStatusIndicator';
import AccessControl from '@/components/AccessControl';
import { useAuth } from '@/hooks/useAuth';
import { Toaster } from '@/components/ui/toaster';
import { Button } from '@/components/ui/button';
import { Bell, Search, Settings, Sun, Moon } from 'lucide-react';
import { useState as useTheme } from 'react';

const AppContent = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [showPremiumUpgrade, setShowPremiumUpgrade] = useState(false);
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-6"></div>
            <div className="animate-pulse absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-t-blue-400 mx-auto"></div>
          </div>
          <h2 className="text-xl font-semibold text-slate-800 mb-2">Memuat NaviMarine</h2>
          <p className="text-slate-600">Menyiapkan sistem navigasi maritim...</p>
          <div className="mt-4 flex justify-center space-x-1">
            <div className="animate-bounce w-2 h-2 bg-blue-500 rounded-full"></div>
            <div className="animate-bounce w-2 h-2 bg-blue-500 rounded-full" style={{ animationDelay: '0.1s' }}></div>
            <div className="animate-bounce w-2 h-2 bg-blue-500 rounded-full" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

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
      case 'profile':
        return <UserProfile />;
      case 'blog':
        return <BlogPage />;
      case 'cv-builder':
        return <CVBuilder />;
      case 'certifications':
        return (
          <AccessControl requirePremium onUpgradeClick={() => setShowPremiumUpgrade(true)}>
            <CertificationPage />
          </AccessControl>
        );
      default:
        return <Dashboard onNavigateToInfo={() => setActiveTab('blog')} />;
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <SidebarProvider>
      <div className={`flex min-h-screen transition-all duration-300 ${darkMode ? 'dark' : ''}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-blue-900"></div>
        <div className="relative z-10 flex w-full">
          <AppSidebar activeTab={activeTab} onTabChange={setActiveTab} />
          
          <div className="flex-1 flex flex-col">
            {/* Enhanced Header */}
            <header className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 shadow-sm sticky top-0 z-50">
              <div className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Cari di NaviMarine..."
                      className="pl-10 pr-4 py-2 w-64 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <PremiumStatusIndicator onUpgradeClick={() => setShowPremiumUpgrade(true)} />
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleDarkMode}
                    className="relative"
                  >
                    {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  </Button>
                  
                  <Button variant="ghost" size="sm" className="relative">
                    <Bell className="h-4 w-4" />
                    {notifications > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {notifications}
                      </span>
                    )}
                  </Button>
                  
                  <Button variant="ghost" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                  
                  <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-700 rounded-lg px-3 py-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      {user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                    </div>
                    <div className="hidden sm:block">
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                        {user?.user_metadata?.full_name || 'Pengguna'}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Online</p>
                    </div>
                  </div>
                </div>
              </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 p-6 overflow-auto">
              <div className="max-w-7xl mx-auto">
                {renderContent()}
              </div>
            </main>
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

const Index = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default Index;
