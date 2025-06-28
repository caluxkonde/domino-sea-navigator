
import React, { useState } from 'react';
import { BarChart3, Ship, Waves, MapPin, TrendingUp, Activity, Clock, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import TidalInfo from './TidalInfo';
import ShipStatus from './ShipStatus';
import NavigationMap from './NavigationMap';
import WeatherInfo from './WeatherInfo';

const Dashboard = () => {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState('today');

  // Mock data for enhanced dashboard
  const stats = [
    {
      title: 'Total Kapal Aktif',
      value: '12',
      change: '+2 dari kemarin',
      icon: Ship,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      trend: 'up'
    },
    {
      title: 'Rute Dilayari',
      value: '8',
      change: '+1 minggu ini',
      icon: MapPin,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      trend: 'up'
    },
    {
      title: 'Nautical Miles',
      value: '2,847',
      change: '+12% bulan ini',
      icon: Activity,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      trend: 'up'
    },
    {
      title: 'Waktu Berlayar',
      value: '164h',
      change: 'Minggu ini',
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      trend: 'stable'
    }
  ];

  const recentActivities = [
    { id: 1, action: 'Kapal MV Nusantara memulai pelayaran', time: '10 menit lalu', type: 'departure' },
    { id: 2, action: 'Kontrak baru ditandatangani', time: '1 jam lalu', type: 'contract' },
    { id: 3, action: 'Laporan cuaca diperbarui', time: '2 jam lalu', type: 'weather' },
    { id: 4, action: 'Kapal KM Bahari tiba di pelabuhan', time: '3 jam lalu', type: 'arrival' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Selamat Datang, {user?.user_metadata?.full_name || 'Kapten'}! 👋
              </h1>
              <p className="text-blue-100 text-lg mb-4">
                Mari kelola armada dan navigasi maritim Anda dengan efisien
              </p>
              <div className="flex items-center space-x-4">
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  <Activity className="h-3 w-3 mr-1" />
                  Sistem Aktif
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  <Users className="h-3 w-3 mr-1" />
                  12 Kapal Online
                </Badge>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center">
                <Ship className="h-16 w-16 text-white/80" />
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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="relative overflow-hidden border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
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
          </Card>
        ))}
      </div>

      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Ringkasan Operasional</h2>
        <div className="flex space-x-2">
          {['today', 'week', 'month'].map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange(range)}
              className="capitalize"
            >
              {range === 'today' ? 'Hari Ini' : range === 'week' ? 'Minggu Ini' : 'Bulan Ini'}
            </Button>
          ))}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 lg:grid-cols-2 gap-6">
        <div className="order-1">
          <ShipStatus />
        </div>
        <div className="order-2">
          <NavigationMap />
        </div>
        <div className="order-3">
          <TidalInfo />
        </div>
        <div className="order-4 xl:col-span-2 lg:col-span-1">
          <WeatherInfo />
        </div>
        
        {/* Recent Activities */}
        <div className="order-5 xl:col-span-1 lg:col-span-2">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm h-fit">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-indigo-600" />
                <span>Aktivitas Terbaru</span>
              </CardTitle>
              <CardDescription>Update real-time sistem navigasi</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                      activity.type === 'departure' ? 'bg-blue-500' :
                      activity.type === 'contract' ? 'bg-green-500' :
                      activity.type === 'weather' ? 'bg-orange-500' : 'bg-purple-500'
                    }`}></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800">{activity.action}</p>
                      <p className="text-xs text-slate-500">{activity.time}</p>
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
      </div>

      {/* Quick Actions */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-slate-50 to-blue-50">
        <CardHeader>
          <CardTitle className="text-slate-800">Aksi Cepat</CardTitle>
          <CardDescription>Akses fitur utama dengan sekali klik</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button className="h-20 flex flex-col space-y-2 bg-blue-600 hover:bg-blue-700">
              <Ship className="h-6 w-6" />
              <span className="text-sm">Tambah Kapal</span>
            </Button>
            <Button className="h-20 flex flex-col space-y-2 bg-green-600 hover:bg-green-700">
              <MapPin className="h-6 w-6" />
              <span className="text-sm">Buat Rute</span>
            </Button>
            <Button className="h-20 flex flex-col space-y-2 bg-purple-600 hover:bg-purple-700">
              <Waves className="h-6 w-6" />
              <span className="text-sm">Cek Pasut</span>
            </Button>
            <Button className="h-20 flex flex-col space-y-2 bg-orange-600 hover:bg-orange-700">
              <BarChart3 className="h-6 w-6" />
              <span className="text-sm">Laporan</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
