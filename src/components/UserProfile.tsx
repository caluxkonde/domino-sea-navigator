
import React, { useState } from 'react';
import { Edit } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useContracts } from '@/hooks/useContracts';
import { useProfile } from '@/hooks/useProfile';
import { useUserRoles } from '@/hooks/useUserRoles';
import ProfileEditForm from './ProfileEditForm';
import UserProfileHeader from './UserProfile/UserProfileHeader';
import UserAccountInfo from './UserProfile/UserAccountInfo';
import UserProfessionalInfo from './UserProfile/UserProfessionalInfo';
import UserPersonalInfo from './UserProfile/UserPersonalInfo';
import UserContractStatus from './UserProfile/UserContractStatus';

const UserProfile = () => {
  const { user } = useAuth();
  const { contracts, loading: contractsLoading } = useContracts();
  const { profile, loading: profileLoading, updating, updateProfile, createProfile } = useProfile();
  const { isAdmin } = useUserRoles();
  const [isEditing, setIsEditing] = useState(false);

  const activeContract = contracts.find(contract => 
    contract.status === 'active' && contract.payment_status === 'verified'
  );

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
      <UserProfileHeader onEditClick={() => setIsEditing(true)} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <UserAccountInfo user={user} profile={profile} isAdmin={isAdmin} />
        <UserProfessionalInfo profile={profile} onEditClick={() => setIsEditing(true)} />
      </div>

      <UserPersonalInfo profile={profile} />

      <UserContractStatus contracts={contracts} activeContract={activeContract} />
    </div>
  );
};

export default UserProfile;
