
import React from 'react';
import { User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProfileData } from '@/hooks/useProfile';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface UserPersonalInfoProps {
  profile: ProfileData | null;
}

const UserPersonalInfo: React.FC<UserPersonalInfoProps> = ({ profile }) => {
  const hasPersonalInfo = profile?.address || profile?.date_of_birth || profile?.emergency_contact;

  if (!hasPersonalInfo) {
    return null;
  }

  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <User className="h-5 w-5 text-green-600" />
          <span>Informasi Personal</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {profile?.date_of_birth && (
          <div>
            <p className="text-sm text-slate-500">Tanggal Lahir</p>
            <p className="font-medium text-slate-700">
              {format(new Date(profile.date_of_birth), 'dd MMMM yyyy', { locale: id })}
            </p>
          </div>
        )}
        {profile?.address && (
          <div>
            <p className="text-sm text-slate-500">Alamat</p>
            <p className="font-medium text-slate-700">{profile.address}</p>
          </div>
        )}
        {profile?.emergency_contact && (
          <div>
            <p className="text-sm text-slate-500">Kontak Darurat</p>
            <p className="font-medium text-slate-700">{profile.emergency_contact}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserPersonalInfo;
