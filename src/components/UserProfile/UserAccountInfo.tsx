
import React from 'react';
import { User, Mail, Phone, Calendar, Building, UserCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProfileData } from '@/hooks/useProfile';
import { User as AuthUser } from '@supabase/supabase-js';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface UserAccountInfoProps {
  user: AuthUser | null;
  profile: ProfileData | null;
  isAdmin: boolean;
}

const UserAccountInfo: React.FC<UserAccountInfoProps> = ({ user, profile, isAdmin }) => {
  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <User className="h-5 w-5 text-blue-600" />
          <span>Informasi Akun</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="bg-slate-100 p-2 rounded">
              <Mail className="h-4 w-4 text-slate-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Email</p>
              <p className="font-medium text-slate-700">{user?.email || profile?.email}</p>
            </div>
          </div>

          {profile?.full_name && (
            <div className="flex items-center space-x-3">
              <div className="bg-slate-100 p-2 rounded">
                <UserCheck className="h-4 w-4 text-slate-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Nama Lengkap</p>
                <p className="font-medium text-slate-700">{profile.full_name}</p>
              </div>
            </div>
          )}

          {profile?.phone && (
            <div className="flex items-center space-x-3">
              <div className="bg-slate-100 p-2 rounded">
                <Phone className="h-4 w-4 text-slate-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Telepon</p>
                <p className="font-medium text-slate-700">{profile.phone}</p>
              </div>
            </div>
          )}
          
          <div className="flex items-center space-x-3">
            <div className="bg-slate-100 p-2 rounded">
              <Calendar className="h-4 w-4 text-slate-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Bergabung Sejak</p>
              <p className="font-medium text-slate-700">
                {(user?.created_at || profile?.created_at) && format(new Date(user?.created_at || profile?.created_at!), 'dd MMMM yyyy', { locale: id })}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="bg-slate-100 p-2 rounded">
              <Building className="h-4 w-4 text-slate-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Status Akun</p>
              <Badge className="bg-green-100 text-green-700 border-green-300">
                Aktif {isAdmin && '(Admin)'}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserAccountInfo;
