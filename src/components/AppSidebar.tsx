
import React from 'react';
import { Ship, Settings, Route, FileText, Waves, Home } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

interface AppSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const AppSidebar = ({ activeTab, onTabChange }: AppSidebarProps) => {
  const menuItems = [
    {
      id: 'overview',
      label: 'Dashboard',
      icon: Home,
      description: 'Ringkasan umum sistem'
    },
    {
      id: 'ships',
      label: 'Manajemen Kapal',
      icon: Settings,
      description: 'Kelola data kapal'
    },
    {
      id: 'routes',
      label: 'Rute & Navigasi',
      icon: Route,
      description: 'Manajemen rute pelayaran'
    },
    {
      id: 'contracts',
      label: 'Kontrak Nahkoda',
      icon: FileText,
      description: 'Kelola kontrak nahkoda'
    }
  ];

  return (
    <Sidebar className="border-r border-slate-200 bg-white/80 backdrop-blur-sm">
      <SidebarContent>
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Ship className="h-8 w-8 text-blue-600" />
              <Waves className="h-4 w-4 text-blue-400 absolute -bottom-1 -right-1" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">NaviMarine</h2>
              <p className="text-xs text-slate-600">Sistem Navigasi</p>
            </div>
          </div>
        </div>
        
        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-500 font-medium">
            Menu Utama
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      onClick={() => onTabChange(item.id)}
                      className={`w-full justify-start p-3 rounded-lg transition-all duration-200 group ${
                        isActive
                          ? 'bg-blue-50 text-blue-700 border-blue-200 shadow-sm'
                          : 'hover:bg-slate-50 text-slate-700 hover:text-slate-900'
                      }`}
                    >
                      <Icon className={`h-5 w-5 mr-3 ${
                        isActive ? 'text-blue-600' : 'text-slate-500 group-hover:text-slate-700'
                      }`} />
                      <div className="flex flex-col items-start">
                        <span className="text-sm font-medium">{item.label}</span>
                        <span className="text-xs text-slate-500 mt-0.5 hidden lg:block">
                          {item.description}
                        </span>
                      </div>
                      {isActive && (
                        <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full"></div>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
