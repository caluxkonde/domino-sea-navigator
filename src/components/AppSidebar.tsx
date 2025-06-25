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
  Ship,
  Waves,
  BarChart3,
  MapPin,
  FileText,
  Users,
  Settings,
  LogOut,
  User,
  Newspaper,
  FileUser,
  Award,
  Trophy,
  Shield,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useUserRoles } from '@/hooks/useUserRoles';

interface AppSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const AppSidebar = ({ activeTab, onTabChange }: AppSidebarProps) => {
  const { user, signOut } = useAuth();
  const { isAdmin, loading: rolesLoading } = useUserRoles();

  const menuItems = [
    {
      id: 'overview',
      label: 'Dashboard',
      icon: BarChart3,
      description: 'Ringkasan aktivitas'
    },
    {
      id: 'ships',
      label: 'Manajemen Kapal',
      icon: Ship,
      description: 'Kelola data kapal'
    },
    {
      id: 'routes',
      label: 'Peta Navigasi',
      icon: MapPin,
      description: 'Rute dan navigasi'
    },
    {
      id: 'tides',
      label: 'Info Pasang Surut',
      icon: Waves,
      description: 'Data BMKG'
    },
    {
      id: 'contracts',
      label: 'Kontrak',
      icon: FileText,
      description: 'Manajemen kontrak'
    },
  ];

  const mediaItems = [
    {
      id: 'blog',
      label: 'Blog & Lowongan',
      icon: Newspaper,
      description: 'Info dan pekerjaan'
    },
    {
      id: 'cv-builder',
      label: 'CV Builder',
      icon: FileUser,
      description: 'Buat CV profesional'
    },
    {
      id: 'certifications',
      label: 'Sertifikasi',
      icon: Award,
      description: 'Program sertifikasi'
    },
    {
      id: 'leaderboard',
      label: 'Leaderboard',
      icon: Trophy,
      description: 'Peringkat pengguna'
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
      id: 'admin',
      label: 'Panel Admin',
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

  return (
    <Sidebar className="border-r border-slate-200">
      <SidebarHeader className="border-b border-slate-200 p-6">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Ship className="h-8 w-8 text-blue-600" />
            <Waves className="h-4 w-4 text-blue-400 absolute -bottom-1 -right-1" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">NaviMarine</h1>
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
            {isAdmin && !rolesLoading && (
              <Badge variant="default" className="text-xs bg-red-100 text-red-800">
                Admin
              </Badge>
            )}
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4 py-2">
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-600 font-medium">
            Navigasi Utama
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
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

        {/* Media & Tools */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-600 font-medium">
            Media & Tools
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mediaItems.map((item) => (
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
          <p>NaviMarine v2.0</p>
          <p>© 2024 Maritime System</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
