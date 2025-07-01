
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { UserPlus, Shield, Users, Crown } from 'lucide-react';

const RoleManagementDialog = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'admin' | 'user'>('user');
  const [notes, setNotes] = useState('');
  const { toast } = useToast();

  const handleAssignRole = async () => {
    if (!email.trim()) {
      toast({
        title: 'Error',
        description: 'Email harus diisi',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      // First, check if user exists
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('id, email')
        .eq('email', email.trim())
        .single();

      if (userError || !userData) {
        toast({
          title: 'User Tidak Ditemukan',
          description: 'Email tidak terdaftar dalam sistem. Pastikan user sudah mendaftar terlebih dahulu.',
          variant: 'destructive',
        });
        return;
      }

      // Insert or update role
      const { error: roleError } = await supabase
        .from('user_roles')
        .upsert({
          user_id: userData.id,
          role: role
        });

      if (roleError) throw roleError;

      // Create notification for the user
      await supabase
        .from('notifications')
        .insert({
          user_id: userData.id,
          type: 'role_change',
          title: 'Role Berubah',
          message: `Role Anda telah diubah menjadi ${role}${notes ? `. Catatan: ${notes}` : ''}`,
          data: { role, notes, assigned_by: 'admin' }
        });

      toast({
        title: 'Berhasil',
        description: `Role ${role} berhasil diberikan kepada ${email}`,
      });

      setEmail('');
      setRole('user');
      setNotes('');
      setOpen(false);
    } catch (error) {
      console.error('Error assigning role:', error);
      toast({
        title: 'Error',
        description: 'Gagal mengubah role user',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-purple-600 hover:bg-purple-700">
          <UserPlus className="h-4 w-4 mr-2" />
          Kelola Role
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Shield className="h-6 w-6 text-purple-600" />
            <span>Kelola Role Pengguna</span>
          </DialogTitle>
          <DialogDescription>
            Berikan atau ubah role pengguna. Pastikan email sudah terdaftar dalam sistem.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Role Information */}
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Jenis Role</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                <div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-gray-600">
                      User
                    </Badge>
                    <span className="text-sm font-medium">Pengguna Biasa</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Akses terbatas ke fitur dasar aplikasi
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                <div>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-red-100 text-red-800">
                      Admin
                    </Badge>
                    <span className="text-sm font-medium">Administrator</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Akses penuh ke semua fitur dan panel admin
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Form */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Pengguna</Label>
              <Input
                id="email"
                type="email"
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <p className="text-xs text-gray-500">
                Email harus sudah terdaftar dalam sistem
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={role} onValueChange={(value: 'admin' | 'user') => setRole(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4" />
                      <span>User - Pengguna Biasa</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="admin">
                    <div className="flex items-center space-x-2">
                      <Crown className="h-4 w-4" />
                      <span>Admin - Administrator</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Catatan (Opsional)</Label>
              <Textarea
                id="notes"
                placeholder="Catatan tambahan untuk pengguna..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <div className="flex space-x-3">
            <Button
              onClick={handleAssignRole}
              disabled={loading}
              className="flex-1"
            >
              {loading ? 'Memproses...' : 'Berikan Role'}
            </Button>
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Batal
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RoleManagementDialog;
