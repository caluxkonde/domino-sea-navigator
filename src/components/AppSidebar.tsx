
import React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  BarChart3,
  Waves,
  MapPin,
  FileText,
  LogOut,
  User,
  Newspaper,
  FileUser,
  Award,
  Shield,
  Info,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useUserRoles } from '@/hooks/useUserRoles';
import { usePremiumStatus } from '@/hooks/usePremiumStatus';

interface AppSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const AppSidebar = ({ activeTab, onTabChange }: AppSidebarProps) => {
  const { user, signOut } = useAuth();
  const { isAdmin, loading: rolesLoading } = useUserRoles();
  const { premiumStatus, loading: premiumLoading } = usePremiumStatus();

  const mainMenuItems = [
    {
      id: 'overview',
      label: 'Dashboard',
      icon: BarChart3,
      description: 'Ringkasan aktivitas',
      requirePremium: false
    }
  ];

  const premiumItems = [
    {
      id: 'tides',
      label: 'Info Pasang Surut',
      icon: Waves,
      description: 'Data BMKG',
      requirePremium: true
    },
    {
      id: 'routes',
      label: 'Peta Navigasi',
      icon: MapPin,
      description: 'Rute dan navigasi',
      requirePremium: true
    },
    {
      id: 'contracts',
      label: 'Kontrak',
      icon: FileText,
      description: 'Manajemen kontrak',
      requirePremium: true
    },
    {
      id: 'certifications',
      label: 'Sertifikasi',
      icon: Award,
      description: 'Program sertifikasi',
      requirePremium: true
    },
  ];

  const freeItems = [
    {
      id: 'blog',
      label: 'Info & Lowongan',
      icon: Info,
      description: 'Informasi & lowongan kerja',
      requirePremium: false
    },
    {
      id: 'cv-builder',
      label: 'CV Builder',
      icon: FileUser,
      description: 'Buat CV profesional',
      requirePremium: false
    },
  ];

  const accountItems = [
    {
      id: 'profile',
      label: 'Profil',
      icon: User,
      description: 'Pengaturan akun'
    },
  ];

  // Add admin menu if user is admin
  if (isAdmin && !rolesLoading) {
    accountItems.unshift({
      id: 'premium-management',
      label: 'Kelola Premium',
      icon: Shield,
      description: 'Manajemen premium & masa aktif'
    });
    accountItems.unshift({
      id: 'admin-dashboard',
      label: 'Dashboard Admin',
      icon: Shield,
      description: 'Panel admin utama'
    });
    accountItems.unshift({
      id: 'user-management',
      label: 'Kelola Pengguna',
      icon: Shield,
      description: 'Manajemen pengguna'
    });
    accountItems.unshift({
      id: 'blog-management',
      label: 'Kelola Artikel',
      icon: Shield,
      description: 'Manajemen blog'
    });
    accountItems.unshift({
      id: 'admin',
      label: 'Verifikasi Kontrak',
      icon: Shield,
      description: 'Kelola sistem'
    });
  }

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const canAccessItem = (requirePremium: boolean) => {
    if (isAdmin) return true;
    if (!requirePremium) return true;
    return premiumStatus.is_premium;
  };

  return (
    <Sidebar className="border-r border-slate-200">
      <SidebarHeader className="border-b border-slate-200 p-6">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Waves className="h-8 w-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Info Pelaut</h1>
            <p className="text-xs text-slate-500">Sistem Navigasi</p>
          </div>
        </div>
        
        {/* User Info */}
        <div className="mt-4 p-3 bg-slate-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-800">
                {user?.user_metadata?.full_name || 'Pengguna'}
              </p>
              <p className="text-xs text-slate-500">{user?.email}</p>
            </div>
            <div className="flex flex-col gap-1">
              {isAdmin && !rolesLoading && (
                <Badge variant="default" className="text-xs bg-red-100 text-red-800">
                  Admin
                </Badge>
              )}
              {!premiumLoading && (
                <Badge variant={premiumStatus.is_premium ? 'default' : 'secondary'} 
                       className={`text-xs ${premiumStatus.is_premium 
                         ? 'bg-yellow-100 text-yellow-800' 
                         : 'bg-gray-100 text-gray-800'}`}>
                  {premiumStatus.is_premium ? 'Premium' : 'Free'}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4 py-2">
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-600 font-medium">
            Utama
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => onTabChange(item.id)}
                    isActive={activeTab === item.id}
                    className="w-full justify-start group"
                  >
                    <item.icon className="h-4 w-4 mr-3" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-xs text-slate-500 group-hover:text-slate-600">
                        {item.description}
                      </p>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Free Features */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-600 font-medium">
            Fitur Gratis
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {freeItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => onTabChange(item.id)}
                    isActive={activeTab === item.id}
                    className="w-full justify-start group"
                  >
                    <item.icon className="h-4 w-4 mr-3" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-xs text-slate-500 group-hover:text-slate-600">
                        {item.description}
                      </p>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Premium Features */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-600 font-medium">
            Fitur Premium
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {premiumItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => onTabChange(item.id)}
                    isActive={activeTab === item.id}
                    className={`w-full justify-start group ${
                      !canAccessItem(item.requirePremium) ? 'opacity-60' : ''
                    }`}
                  >
                    <item.icon className="h-4 w-4 mr-3" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{item.label}</p>
                        {item.requirePremium && !canAccessItem(item.requirePremium) && (
                          <Badge variant="outline" className="text-xs">
                            Premium
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 group-hover:text-slate-600">
                        {item.description}
                      </p>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Account */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-600 font-medium">
            Akun
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {accountItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => onTabChange(item.id)}
                    isActive={activeTab === item.id}
                    className="w-full justify-start group"
                  >
                    <item.icon className="h-4 w-4 mr-3" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-xs text-slate-500 group-hover:text-slate-600">
                        {item.description}
                      </p>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-slate-200 p-4">
        <Button
          onClick={handleSignOut}
          variant="outline"
          size="sm"
          className="w-full justify-start text-slate-600 hover:text-slate-800"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Keluar
        </Button>
        
        <div className="mt-2 text-xs text-slate-400 text-center">
          <p>Info Pelaut v2.0</p>
          <p>© 2025 Maritime System</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
