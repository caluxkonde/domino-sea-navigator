
import React from 'react';
import { User, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UserProfileHeaderProps {
  onEditClick: () => void;
}

const UserProfileHeader: React.FC<UserProfileHeaderProps> = ({ onEditClick }) => {
  return (
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
        <Button onClick={onEditClick} className="flex items-center gap-2">
          <Edit className="h-4 w-4" />
          Edit Profil
        </Button>
      </div>
    </div>
  );
};

export default UserProfileHeader;
