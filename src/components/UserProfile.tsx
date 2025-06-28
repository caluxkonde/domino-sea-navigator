
import React, { useState } from 'react';
import { User, Calendar, CreditCard, Clock, CheckCircle, Building, Mail, Phone, Edit, UserCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useContracts } from '@/hooks/useContracts';
import { useProfile } from '@/hooks/useProfile';
import { useUserRoles } from '@/hooks/useUserRoles';
import ProfileEditForm from './ProfileEditForm';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { differenceInDays } from 'date-fns';

const UserProfile = () => {
  const { user } = useAuth();
  const { contracts, loading: contractsLoading } = useContracts();
  const { profile, loading: profileLoading, updating, updateProfile, createProfile } = useProfile();
  const { isAdmin } = useUserRoles();
  const [isEditing, setIsEditing] = useState(false);

  const activeContract = contracts.find(contract => 
    contract.status === 'active' && contract.payment_status === 'verified'
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getContractTypeLabel = (type: string) => {
    switch (type) {
      case '3_months': return '3 Bulan';
      case '6_months': return '6 Bulan';
      case '1_year': return '1 Tahun';
      default: return type;
    }
  };

  const getDaysRemaining = (endDate: string) => {
    const days = differenceInDays(new Date(endDate), new Date());
    return Math.max(0, days);
  };

  const handleSaveProfile = async (data: any) => {
    if (profile) {
      return await updateProfile(data);
    } else {
      return await createProfile(data);
    }
  };

  if (profileLoading || contractsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Memuat profil...</p>
        </div>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="space-y-8">
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-100">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 p-4 rounded-full">
              <Edit className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-slate-800 mb-2">Edit Profil</h2>
              <p className="text-slate-600 text-lg">Perbarui informasi profil Anda</p>
            </div>
          </div>
        </div>

        <ProfileEditForm
          profile={profile}
          onSave={handleSaveProfile}
          onCancel={() => setIsEditing(false)}
          updating={updating}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 p-4 rounded-full">
              <User className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-slate-800 mb-2">Profil Pengguna</h2>
              <p className="text-slate-600 text-lg">Informasi akun dan status kontrak Anda</p>
            </div>
          </div>
          <Button onClick={() => setIsEditing(true)} className="flex items-center gap-2">
            <Edit className="h-4 w-4" />
            Edit Profil
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* User Information */}
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

        {/* Professional Information */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building className="h-5 w-5 text-purple-600" />
              <span>Informasi Profesional</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {profile?.current_position || profile?.company || profile?.maritime_experience_years ? (
              <div className="space-y-3">
                {profile.current_position && (
                  <div>
                    <p className="text-sm text-slate-500">Posisi</p>
                    <p className="font-medium text-slate-700">{profile.current_position}</p>
                  </div>
                )}
                {profile.company && (
                  <div>
                    <p className="text-sm text-slate-500">Perusahaan</p>
                    <p className="font-medium text-slate-700">{profile.company}</p>
                  </div>
                )}
                {profile.maritime_experience_years !== null && (
                  <div>
                    <p className="text-sm text-slate-500">Pengalaman Maritim</p>
                    <p className="font-medium text-slate-700">{profile.maritime_experience_years} tahun</p>
                  </div>
                )}
                {profile.bio && (
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
                  onClick={() => setIsEditing(true)}
                  className="mt-4"
                >
                  Lengkapi Profil
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Personal Information */}
      {(profile?.address || profile?.date_of_birth || profile?.emergency_contact) && (
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5 text-green-600" />
              <span>Informasi Personal</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {profile.date_of_birth && (
              <div>
                <p className="text-sm text-slate-500">Tanggal Lahir</p>
                <p className="font-medium text-slate-700">
                  {format(new Date(profile.date_of_birth), 'dd MMMM yyyy', { locale: id })}
                </p>
              </div>
            )}
            {profile.address && (
              <div>
                <p className="text-sm text-slate-500">Alamat</p>
                <p className="font-medium text-slate-700">{profile.address}</p>
              </div>
            )}
            {profile.emergency_contact && (
              <div>
                <p className="text-sm text-slate-500">Kontak Darurat</p>
                <p className="font-medium text-slate-700">{profile.emergency_contact}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Contract Status */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5 text-purple-600" />
            <span>Status Kontrak</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activeContract ? (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-semibold text-green-800">Kontrak Aktif</span>
                </div>
                <p className="text-2xl font-bold text-green-700">
                  Paket {getContractTypeLabel(activeContract.contract_type)}
                </p>
                <p className="text-sm text-green-600">{formatPrice(activeContract.price)}</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="bg-slate-100 p-2 rounded">
                    <Calendar className="h-4 w-4 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Dimulai</p>
                    <p className="font-medium text-slate-700">
                      {format(new Date(activeContract.start_date), 'dd MMMM yyyy', { locale: id })}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="bg-slate-100 p-2 rounded">
                    <Clock className="h-4 w-4 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Berakhir</p>
                    <p className="font-medium text-slate-700">
                      {format(new Date(activeContract.end_date), 'dd MMMM yyyy', { locale: id })}
                    </p>
                    <p className="text-xs text-amber-600 font-medium">
                      {getDaysRemaining(activeContract.end_date)} hari tersisa
                    </p>
                  </div>
                </div>

                {activeContract.whatsapp_number && (
                  <div className="flex items-center space-x-3">
                    <div className="bg-slate-100 p-2 rounded">
                      <Phone className="h-4 w-4 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">WhatsApp Terdaftar</p>
                      <p className="font-medium text-slate-700">{activeContract.whatsapp_number}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="bg-slate-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <CreditCard className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-700 mb-2">Tidak Ada Kontrak Aktif</h3>
              <p className="text-slate-500 text-sm">
                Silakan buat kontrak berlangganan untuk mengakses semua fitur
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Contracts */}
      {contracts.length > 0 && (
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5 text-blue-600" />
              <span>Riwayat Kontrak</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {contracts.slice(0, 5).map((contract) => (
                <div key={contract.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="bg-white p-2 rounded">
                      <CreditCard className="h-4 w-4 text-slate-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-700">
                        Paket {getContractTypeLabel(contract.contract_type)}
                      </p>
                      <p className="text-sm text-slate-500">
                        {format(new Date(contract.created_at), 'dd MMM yyyy', { locale: id })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-700">{formatPrice(contract.price)}</p>
                    <Badge 
                      className={
                        contract.payment_status === 'verified' 
                          ? 'bg-green-100 text-green-700 border-green-300'
                          : contract.payment_status === 'pending'
                          ? 'bg-amber-100 text-amber-700 border-amber-300'
                          : 'bg-red-100 text-red-700 border-red-300'
                      }
                    >
                      {contract.payment_status === 'verified' ? 'Terverifikasi' :
                       contract.payment_status === 'pending' ? 'Pending' : 'Ditolak'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UserProfile;
