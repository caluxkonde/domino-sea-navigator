
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Save, X } from 'lucide-react';
import { ProfileData, useProfile } from '@/hooks/useProfile';

interface ProfileEditFormProps {
  profile: ProfileData | null;
  onSave: (data: Partial<ProfileData>) => Promise<boolean>;
  onCancel: () => void;
  updating: boolean;
}

const ProfileEditForm: React.FC<ProfileEditFormProps> = ({
  profile,
  onSave,
  onCancel,
  updating
}) => {
  const [formData, setFormData] = useState<Partial<ProfileData>>({
    full_name: '',
    phone: '',
    date_of_birth: '',
    address: '',
    bio: '',
    current_position: '',
    company: '',
    maritime_experience_years: 0,
    emergency_contact: ''
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        date_of_birth: profile.date_of_birth || '',
        address: profile.address || '',
        bio: profile.bio || '',
        current_position: profile.current_position || '',
        company: profile.company || '',
        maritime_experience_years: profile.maritime_experience_years || 0,
        emergency_contact: profile.emergency_contact || ''
      });
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await onSave(formData);
    if (success) {
      onCancel();
    }
  };

  const handleChange = (field: keyof ProfileData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-slate-800">
          Edit Profil
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="full_name">Nama Lengkap</Label>
              <Input
                id="full_name"
                value={formData.full_name || ''}
                onChange={(e) => handleChange('full_name', e.target.value)}
                placeholder="Masukkan nama lengkap"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Nomor Telepon</Label>
              <Input
                id="phone"
                value={formData.phone || ''}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="Masukkan nomor telepon"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date_of_birth">Tanggal Lahir</Label>
              <Input
                id="date_of_birth"
                type="date"
                value={formData.date_of_birth || ''}
                onChange={(e) => handleChange('date_of_birth', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="current_position">Posisi Saat Ini</Label>
              <Input
                id="current_position"
                value={formData.current_position || ''}
                onChange={(e) => handleChange('current_position', e.target.value)}
                placeholder="Contoh: Kapten, Mualim, dll"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Perusahaan</Label>
              <Input
                id="company"
                value={formData.company || ''}
                onChange={(e) => handleChange('company', e.target.value)}
                placeholder="Nama perusahaan"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maritime_experience_years">Pengalaman Maritim (Tahun)</Label>
              <Input
                id="maritime_experience_years"
                type="number"
                min="0"
                value={formData.maritime_experience_years || 0}
                onChange={(e) => handleChange('maritime_experience_years', parseInt(e.target.value) || 0)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Alamat</Label>
            <Textarea
              id="address"
              value={formData.address || ''}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="Alamat lengkap"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Biodata</Label>
            <Textarea
              id="bio"
              value={formData.bio || ''}
              onChange={(e) => handleChange('bio', e.target.value)}
              placeholder="Ceritakan sedikit tentang diri Anda"
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="emergency_contact">Kontak Darurat</Label>
            <Input
              id="emergency_contact"
              value={formData.emergency_contact || ''}
              onChange={(e) => handleChange('emergency_contact', e.target.value)}
              placeholder="Nama dan nomor kontak darurat"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={updating} className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              {updating ? 'Menyimpan...' : 'Simpan'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} className="flex items-center gap-2">
              <X className="h-4 w-4" />
              Batal
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProfileEditForm;
