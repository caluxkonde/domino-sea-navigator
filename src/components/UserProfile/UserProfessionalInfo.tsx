
import React from 'react';
import { Building } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProfileData } from '@/hooks/useProfile';

interface UserProfessionalInfoProps {
  profile: ProfileData | null;
  onEditClick: () => void;
}

const UserProfessionalInfo: React.FC<UserProfessionalInfoProps> = ({ profile, onEditClick }) => {
  const hasProInfo = profile?.current_position || profile?.company || profile?.maritime_experience_years || profile?.bio;

  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Building className="h-5 w-5 text-purple-600" />
          <span>Informasi Profesional</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {hasProInfo ? (
          <div className="space-y-3">
            {profile?.current_position && (
              <div>
                <p className="text-sm text-slate-500">Posisi</p>
                <p className="font-medium text-slate-700">{profile.current_position}</p>
              </div>
            )}
            {profile?.company && (
              <div>
                <p className="text-sm text-slate-500">Perusahaan</p>
                <p className="font-medium text-slate-700">{profile.company}</p>
              </div>
            )}
            {profile?.maritime_experience_years !== null && (
              <div>
                <p className="text-sm text-slate-500">Pengalaman Maritim</p>
                <p className="font-medium text-slate-700">{profile.maritime_experience_years} tahun</p>
              </div>
            )}
            {profile?.bio && (
              <div>
                <p className="text-sm text-slate-500">Bio</p>
                <p className="font-medium text-slate-700">{profile.bio}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-slate-500">Belum ada informasi profesional</p>
            <Button 
              variant="outline" 
              onClick={onEditClick}
              className="mt-4"
            >
              Lengkapi Profil
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserProfessionalInfo;
