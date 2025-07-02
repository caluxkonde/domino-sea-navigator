
import React, { useState } from 'react';
import { BarChart3, Waves, MapPin, TrendingUp, Activity, Clock, Users, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { usePremiumStatus } from '@/hooks/usePremiumStatus';
import { useIsMobile } from '@/hooks/use-mobile';
import TidalInfo from './TidalInfo';
import WeatherInfo from './WeatherInfo';
import InfoSlideshow from './InfoSlideshow';

interface DashboardProps {
  onNavigateToInfo: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigateToInfo }) => {
  const { user } = useAuth();
  const { premiumStatus } = usePremiumStatus();
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = useState('today');

  // Mock data for enhanced dashboard
  const stats = [
    {
      title: 'Status Akun',
      value: premiumStatus.is_premium ? 'Premium' : 'Free',
      change: premiumStatus.is_premium ? 'Aktif hingga ' + new Date(premiumStatus.end_date || '').toLocaleDateString('id-ID') : 'Upgrade tersedia',
      icon: Activity,
      color: premiumStatus.is_premium ? 'text-green-600' : 'text-orange-600',
      bgColor: premiumStatus.is_premium ? 'bg-green-100' : 'bg-orange-100',
      trend: 'up'
    },
    {
      title: 'Fitur Tersedia',
      value: premiumStatus.is_premium ? '8' : '3',
      change: premiumStatus.is_premium ? 'Semua fitur aktif' : '5 fitur terkunci',
      icon: MapPin,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      trend: 'up'
    },
    {
      title: 'Info Terbaru',
      value: '12',
      change: '+3 artikel minggu ini',
      icon: Activity,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      trend: 'up'
    },
    {
      title: 'Akses Hari Ini',
      value: '5h',
      change: 'Waktu aktif',
      icon: Clock,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
      trend: 'stable'
    }
  ];

  const recentActivities = [
    { id: 1, action: 'Login ke sistem NaviMarine', time: '10 menit lalu', type: 'login' },
    { id: 2, action: 'Membaca artikel Info terbaru', time: '1 jam lalu', type: 'info' },
    { id: 3, action: 'Mengakses CV Builder', time: '2 jam lalu', type: 'cv' },
    { id: 4, action: 'Update profil pengguna', time: '1 hari lalu', type: 'profile' },
  ];

  const handleArticleClick = (articleId: string) => {
    onNavigateToInfo();
  };

  return (
    <div className={`space-y-4 ${isMobile ? 'px-4' : 'space-y-6'}`}>
      {/* Mobile Header */}
      {isMobile && (
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-sm text-muted-foreground">
              {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short' })}
            </div>
            <h1 className="text-xl font-bold text-foreground">
              Hi, {user?.user_metadata?.full_name?.split(' ')[0] || 'Pengguna'}
            </h1>
          </div>
          <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
            <span className="text-xs font-medium">
              {user?.user_metadata?.full_name?.split(' ').map((n: string) => n[0]).join('') || 'U'}
            </span>
          </div>
        </div>
      )}

      {/* Desktop Welcome Section */}
      {!isMobile && (
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 rounded-2xl p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  Selamat Datang, {user?.user_metadata?.full_name || 'Pengguna'}! 👋
                </h1>
                <p className="text-blue-100 text-lg mb-4">
                  Sistem Navigasi Maritim untuk Profesional Indonesia
                </p>
                <div className="flex items-center space-x-4">
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    <Activity className="h-3 w-3 mr-1" />
                    Status: {premiumStatus.is_premium ? 'Premium' : 'Free'}
                  </Badge>
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    <Users className="h-3 w-3 mr-1" />
                    Aktif Hari Ini
                  </Badge>
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center">
                  <Waves className="h-16 w-16 text-white/80" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Decorative waves */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="h-8 w-full">
              <path d="M0,60 C400,120 800,0 1200,60 L1200,120 L0,120 Z" fill="rgba(255,255,255,0.1)"></path>
            </svg>
          </div>
        </div>
      )}

      {/* Stats Grid - Mobile optimized */}
      <div className={`grid gap-4 ${isMobile ? 'grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'}`}>
        {stats.map((stat, index) => (
          <Card key={index} className={`relative overflow-hidden border-0 shadow-lg bg-card backdrop-blur-sm hover:shadow-xl transition-all duration-300 ${isMobile ? 'p-4' : ''}`}>
            {isMobile ? (
              <CardContent className="p-4 text-center">
                <div className={`w-12 h-12 rounded-full ${stat.bgColor} flex items-center justify-center mx-auto mb-3 relative`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  {/* Progress ring for mobile */}
                  <div className="absolute inset-0 rounded-full border-2 border-primary/20">
                    <div 
                      className="absolute inset-0 rounded-full border-2 border-primary border-r-transparent transform rotate-45"
                      style={{ 
                        borderImage: `conic-gradient(hsl(var(--primary)) ${index * 25}%, transparent 0) 1` 
                      }}
                    />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-foreground mb-1">{stat.value}</h3>
                <p className="text-xs font-medium text-muted-foreground">{stat.title}</p>
                <p className="text-xs text-muted-foreground/70 mt-1">{stat.change}</p>
              </CardContent>
            ) : (
              <>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                    <div className="flex items-center space-x-1">
                      <TrendingUp className={`h-4 w-4 ${stat.trend === 'up' ? 'text-green-500' : 'text-gray-400'}`} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    <h3 className="text-2xl font-bold text-slate-800">{stat.value}</h3>
                    <p className="text-sm font-medium text-slate-600">{stat.title}</p>
                    <p className="text-xs text-slate-500">{stat.change}</p>
                  </div>
                </CardContent>
              </>
            )}
          </Card>
        ))}
      </div>

      {/* Main Content Grid - Mobile Stack */}
      <div className={`${isMobile ? 'space-y-4' : 'grid grid-cols-1 xl:grid-cols-3 lg:grid-cols-2 gap-6'}`}>
        {/* Info Slideshow */}
        <div className="order-1">
          <Card className="border-0 shadow-lg bg-card backdrop-blur-sm">
            <CardHeader className={isMobile ? 'pb-3' : ''}>
              <CardTitle className="flex items-center justify-between">
                <span className={isMobile ? 'text-base' : ''}>Info Terbaru</span>
                <Button variant="ghost" size="sm" onClick={onNavigateToInfo}>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardTitle>
              {!isMobile && <CardDescription>Artikel dan informasi maritim terkini</CardDescription>}
            </CardHeader>
            <CardContent className={isMobile ? 'pt-0' : ''}>
              <InfoSlideshow onArticleClick={handleArticleClick} />
            </CardContent>
          </Card>
        </div>

        {/* Tidal Info Preview */}
        <div className="order-2">
          {premiumStatus.is_premium ? (
            <TidalInfo />
          ) : (
            <Card className="border-0 shadow-lg bg-card backdrop-blur-sm">
              <CardHeader className={isMobile ? 'pb-3' : ''}>
                <CardTitle className="flex items-center space-x-2">
                  <Waves className="h-5 w-5 text-blue-600" />
                  <span className={isMobile ? 'text-base' : ''}>Info Pasang Surut</span>
                  <Badge variant="outline">Premium</Badge>
                </CardTitle>
                {!isMobile && <CardDescription>Data pasang surut real-time</CardDescription>}
              </CardHeader>
              <CardContent className={isMobile ? 'pt-0' : ''}>
                <div className={`text-center ${isMobile ? 'py-6' : 'py-8'}`}>
                  <Waves className={`mx-auto text-blue-300 mb-4 ${isMobile ? 'h-8 w-8' : 'h-12 w-12'}`} />
                  <p className={`text-muted-foreground mb-4 ${isMobile ? 'text-sm' : ''}`}>Fitur ini memerlukan akun Premium</p>
                  <Button variant="outline" size="sm">
                    Upgrade ke Premium
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Weather Info */}
        <div className="order-3">
          <WeatherInfo />
        </div>
        
        {/* Recent Activities - Simplified for mobile */}
        {!isMobile && (
          <div className="order-4 xl:col-span-2 lg:col-span-1">
            <Card className="border-0 shadow-lg bg-card backdrop-blur-sm h-fit">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-indigo-600" />
                  <span>Aktivitas Terbaru</span>
                </CardTitle>
                <CardDescription>Riwayat aktivitas Anda di sistem</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                        activity.type === 'login' ? 'bg-green-500' :
                        activity.type === 'info' ? 'bg-blue-500' :
                        activity.type === 'cv' ? 'bg-purple-500' : 'bg-orange-500'
                      }`}></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4" size="sm">
                  Lihat Semua Aktivitas
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Quick Actions - Mobile Grid */}
      <Card className={`border-0 shadow-lg bg-gradient-to-r from-muted/30 to-primary/5 ${isMobile ? 'mx-2' : ''}`}>
        {!isMobile && (
          <CardHeader>
            <CardTitle className="text-foreground">Aksi Cepat</CardTitle>
            <CardDescription>Akses fitur utama dengan sekali klik</CardDescription>
          </CardHeader>
        )}
        <CardContent className={isMobile ? 'p-4' : ''}>
          <div className={`grid gap-4 ${isMobile ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-4'}`}>
            <Button 
              className={`flex flex-col space-y-2 bg-blue-600 hover:bg-blue-700 ${isMobile ? 'h-16 text-xs' : 'h-20'}`}
              onClick={onNavigateToInfo}
            >
              <Activity className={isMobile ? 'h-4 w-4' : 'h-6 w-6'} />
              <span className={isMobile ? 'text-xs' : 'text-sm'}>Baca Info</span>
            </Button>
            <Button className={`flex flex-col space-y-2 bg-green-600 hover:bg-green-700 ${isMobile ? 'h-16 text-xs' : 'h-20'}`}>
              <MapPin className={isMobile ? 'h-4 w-4' : 'h-6 w-6'} />
              <span className={isMobile ? 'text-xs' : 'text-sm'}>CV Builder</span>
            </Button>
            <Button className={`flex flex-col space-y-2 bg-purple-600 hover:bg-purple-700 ${isMobile ? 'h-16 text-xs' : 'h-20'}`}>
              <Waves className={isMobile ? 'h-4 w-4' : 'h-6 w-6'} />
              <span className={isMobile ? 'text-xs' : 'text-sm'}>Pasang Surut</span>
            </Button>
            <Button className={`flex flex-col space-y-2 bg-orange-600 hover:bg-orange-700 ${isMobile ? 'h-16 text-xs' : 'h-20'}`}>
              <BarChart3 className={isMobile ? 'h-4 w-4' : 'h-6 w-6'} />
              <span className={isMobile ? 'text-xs' : 'text-sm'}>Profil Saya</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
