import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trophy, Medal, Award, Star, Crown, Target, TrendingUp } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface LeaderboardEntry {
  id: string;
  user_id: string;
  points: number;
  rank: number;
  category: string;
  achievements: any[];
  last_updated: string;
  profiles?: {
    full_name: string;
    avatar_url?: string;
    current_position?: string;
  };
}

const Leaderboard = () => {
  const [selectedCategory, setSelectedCategory] = useState('general');
  const { user } = useAuth();

  // Fetch leaderboard data
  const { data: leaderboard, isLoading } = useQuery({
    queryKey: ['leaderboard', selectedCategory],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leaderboard')
        .select(`
          *,
          profiles (
            full_name,
            avatar_url,
            current_position
          )
        `)
        .eq('category', selectedCategory)
        .order('points', { ascending: false })
        .limit(100);

      if (error) throw error;
      
      // Add ranking based on points and ensure proper typing
      const rankedData = (data || []).map((entry, index) => ({
        ...entry,
        rank: index + 1,
        profiles: entry.profiles || { 
          full_name: 'Pengguna', 
          avatar_url: null, 
          current_position: null 
        }
      })) as LeaderboardEntry[];

      return rankedData;
    },
  });

  // Get user's current position
  const userPosition = leaderboard?.find(entry => entry.user_id === user?.id);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Award className="h-6 w-6 text-amber-600" />;
      default:
        return <span className="text-lg font-bold text-slate-600">#{rank}</span>;
    }
  };

  const getRankBadgeColor = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
    if (rank === 2) return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white';
    if (rank === 3) return 'bg-gradient-to-r from-amber-400 to-amber-600 text-white';
    if (rank <= 10) return 'bg-blue-100 text-blue-800';
    return 'bg-gray-100 text-gray-700';
  };

  const getPointsColor = (points: number) => {
    if (points >= 10000) return 'text-purple-600';
    if (points >= 5000) return 'text-blue-600';
    if (points >= 1000) return 'text-green-600';
    return 'text-slate-600';
  };

  const categories = [
    { value: 'general', label: 'Umum' },
    { value: 'navigation', label: 'Navigasi' },
    { value: 'contracts', label: 'Kontrak' },
    { value: 'learning', label: 'Pembelajaran' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-4">Leaderboard</h1>
        <p className="text-slate-600 mb-6">
          Lihat peringkat pengguna berdasarkan aktivitas dan pencapaian di platform
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Pilih kategori" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* User's Current Position */}
      {userPosition && (
        <Card className="mb-6 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Target className="h-5 w-5" />
              Posisi Anda
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100">
                  {getRankIcon(userPosition.rank)}
                </div>
                <div>
                  <p className="font-semibold text-blue-800">
                    {userPosition.profiles?.full_name || 'Anda'}
                  </p>
                  <p className="text-sm text-blue-600">
                    {userPosition.profiles?.current_position || 'Pengguna'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-2xl font-bold ${getPointsColor(userPosition.points)}`}>
                  {userPosition.points.toLocaleString()}
                </p>
                <p className="text-sm text-slate-500">poin</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top 3 Podium */}
      {leaderboard && leaderboard.length >= 3 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Podium Teratas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 2nd Place */}
            <Card className="order-1 md:order-1 border-gray-200 bg-gray-50">
              <CardContent className="pt-6 text-center">
                <div className="flex justify-center mb-3">
                  <Medal className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="font-bold text-lg">{leaderboard[1]?.profiles?.full_name || 'Pengguna'}</h3>
                <p className="text-sm text-slate-600 mb-2">
                  {leaderboard[1]?.profiles?.current_position || 'Peserta'}
                </p>
                <p className="text-2xl font-bold text-gray-600">
                  {leaderboard[1]?.points?.toLocaleString()} poin
                </p>
                <Badge className="mt-2 bg-gray-200 text-gray-800">#2</Badge>
              </CardContent>
            </Card>

            {/* 1st Place */}
            <Card className="order-2 md:order-2 border-yellow-200 bg-yellow-50 transform md:scale-105">
              <CardContent className="pt-6 text-center">
                <div className="flex justify-center mb-3">
                  <Crown className="h-16 w-16 text-yellow-500" />
                </div>
                <h3 className="font-bold text-xl">{leaderboard[0]?.profiles?.full_name || 'Pengguna'}</h3>
                <p className="text-sm text-slate-600 mb-2">
                  {leaderboard[0]?.profiles?.current_position || 'Peserta'}
                </p>
                <p className="text-3xl font-bold text-yellow-600">
                  {leaderboard[0]?.points?.toLocaleString()} poin
                </p>
                <Badge className="mt-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white">
                  👑 JUARA 1
                </Badge>
              </CardContent>
            </Card>

            {/* 3rd Place */}
            <Card className="order-3 md:order-3 border-amber-200 bg-amber-50">
              <CardContent className="pt-6 text-center">
                <div className="flex justify-center mb-3">
                  <Award className="h-12 w-12 text-amber-600" />
                </div>
                <h3 className="font-bold text-lg">{leaderboard[2]?.profiles?.full_name || 'Pengguna'}</h3>
                <p className="text-sm text-slate-600 mb-2">
                  {leaderboard[2]?.profiles?.current_position || 'Peserta'}
                </p>
                <p className="text-2xl font-bold text-amber-600">
                  {leaderboard[2]?.points?.toLocaleString()} poin
                </p>
                <Badge className="mt-2 bg-amber-200 text-amber-800">#3</Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Full Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Peringkat Lengkap
          </CardTitle>
          <CardDescription>
            Daftar semua peserta berdasarkan poin yang dikumpulkan
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array(10).fill(0).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 border rounded-lg animate-pulse">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-slate-200 rounded-full"></div>
                    <div>
                      <div className="h-4 bg-slate-200 rounded w-32"></div>
                      <div className="h-3 bg-slate-200 rounded w-24 mt-1"></div>
                    </div>
                  </div>
                  <div className="h-6 bg-slate-200 rounded w-16"></div>
                </div>
              ))}
            </div>
          ) : leaderboard && leaderboard.length > 0 ? (
            <div className="space-y-2">
              {leaderboard.map((entry) => (
                <div
                  key={entry.id}
                  className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
                    entry.user_id === user?.id ? 'bg-blue-50 border-blue-200' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-10 h-10">
                      {getRankIcon(entry.rank)}
                    </div>
                    <div>
                      <p className="font-semibold flex items-center gap-2">
                        {entry.profiles?.full_name || 'Pengguna'}
                        {entry.user_id === user?.id && (
                          <Badge variant="outline" className="text-xs">Anda</Badge>
                        )}
                      </p>
                      <p className="text-sm text-slate-600">
                        {entry.profiles?.current_position || 'Peserta'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className={`text-lg font-bold ${getPointsColor(entry.points)}`}>
                        {entry.points?.toLocaleString()}
                      </p>
                      <p className="text-xs text-slate-500">poin</p>
                    </div>
                    <Badge className={getRankBadgeColor(entry.rank)}>
                      #{entry.rank}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Trophy className="h-16 w-16 mx-auto text-slate-300 mb-4" />
              <p className="text-slate-500">Belum ada data leaderboard</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Achievement System Info */}
      <Card className="mt-6 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-800">
            <Star className="h-5 w-5" />
            Cara Mendapatkan Poin
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">Aktivitas Harian:</h4>
              <ul className="space-y-1 text-slate-600">
                <li>• Login harian: +10 poin</li>
                <li>• Update profil: +50 poin</li>
                <li>• Upload CV: +100 poin</li>
                <li>• Membuat kontrak: +200 poin</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Pencapaian Khusus:</h4>
              <ul className="space-y-1 text-slate-600">
                <li>• Verifikasi kontrak: +300 poin</li>
                <li>• Menyelesaikan sertifikasi: +500 poin</li>
                <li>• Referral pengguna baru: +250 poin</li>
                <li>• Aktivitas mingguan: +150 poin</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Leaderboard;
