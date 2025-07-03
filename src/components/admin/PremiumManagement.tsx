import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Search, Crown, Calendar, Users, Plus, Clock } from 'lucide-react';
import { usePremiumManagement } from '@/hooks/usePremiumManagement';

import { format } from 'date-fns';
import { id } from 'date-fns/locale';

const PremiumManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [extensionMonths, setExtensionMonths] = useState('1');
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const { users, loading, extendPremiumSubscription } = usePremiumManagement();

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'premium' && user.is_premium) ||
                         (statusFilter === 'expired' && !user.is_premium);
    return matchesSearch && matchesStatus;
  });

  const handleExtendPremium = async () => {
    if (!selectedUser) return;
    
    await extendPremiumSubscription(selectedUser, parseInt(extensionMonths));
    setDialogOpen(false);
    setSelectedUser(null);
    setExtensionMonths('1');
  };

  const getDaysRemainingColor = (days: number) => {
    if (days <= 7) return 'text-red-600';
    if (days <= 30) return 'text-orange-600';
    return 'text-green-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-100">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Manajemen Premium</h2>
            <p className="text-slate-600">Kelola status premium dan masa aktif pengguna</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center space-x-2">
                <Crown className="h-6 w-6 text-yellow-600" />
                <div>
                  <p className="text-2xl font-bold text-slate-800">
                    {users.filter(u => u.is_premium).length}
                  </p>
                  <p className="text-sm text-slate-600">Premium Aktif</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center space-x-2">
                <Users className="h-6 w-6 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold text-slate-800">{users.length}</p>
                  <p className="text-sm text-slate-600">Total Pengguna</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5" />
            <span>Filter & Pencarian</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Cari berdasarkan nama atau email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="premium">Premium Aktif</SelectItem>
                <SelectItem value="expired">Tidak Premium</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Crown className="h-5 w-5" />
              <span>Status Premium Pengguna</span>
            </div>
            
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-yellow-600 hover:bg-yellow-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Perpanjang Premium
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Perpanjang Premium</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="user-select">Pilih Pengguna</Label>
                    <Select value={selectedUser || ''} onValueChange={setSelectedUser}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih pengguna..." />
                      </SelectTrigger>
                      <SelectContent>
                        {users.map((user) => (
                          <SelectItem key={user.user_id} value={user.user_id}>
                            {user.full_name || user.email} - {user.is_premium ? 'Premium' : 'Free'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="months">Durasi Perpanjangan</Label>
                    <Select value={extensionMonths} onValueChange={setExtensionMonths}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Bulan</SelectItem>
                        <SelectItem value="3">3 Bulan</SelectItem>
                        <SelectItem value="6">6 Bulan</SelectItem>
                        <SelectItem value="12">1 Tahun</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex space-x-3">
                    <Button onClick={handleExtendPremium} disabled={!selectedUser} className="flex-1">
                      Perpanjang Premium
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setDialogOpen(false)}
                    >
                      Batal
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pengguna</TableHead>
                  <TableHead>Peran</TableHead>
                  <TableHead>Status Premium</TableHead>
                  <TableHead>Masa Aktif</TableHead>
                  <TableHead>Sisa Waktu</TableHead>
                  <TableHead>Paket</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.user_id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                          {user.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">{user.full_name || 'Nama belum diatur'}</p>
                          <p className="text-sm text-slate-500">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={user.role === 'admin' ? 'default' : 'secondary'}
                        className={user.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}
                      >
                        {user.role === 'admin' ? 'Admin' : user.role === 'Premium' ? 'Premium' : 'User'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={user.is_premium ? 'default' : 'secondary'}
                        className={user.is_premium ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}
                      >
                        <Crown className={`h-3 w-3 mr-1 ${user.is_premium ? '' : 'opacity-50'}`} />
                        {user.is_premium ? 'Premium' : 'Free'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {user.end_date ? (
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-slate-400" />
                          <span className="text-sm text-slate-600">
                            {format(new Date(user.end_date), 'dd MMM yyyy', { locale: id })}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-slate-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {user.is_premium && user.days_remaining !== undefined ? (
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-slate-400" />
                          <span className={`text-sm font-medium ${getDaysRemainingColor(user.days_remaining)}`}>
                            {user.days_remaining > 0 ? `${user.days_remaining} hari` : 'Expired'}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-slate-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {user.contract_type ? (
                        <Badge variant="outline" className="text-xs">
                          {user.contract_type.replace('_', ' ').toUpperCase()}
                        </Badge>
                      ) : (
                        <span className="text-sm text-slate-400">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PremiumManagement;