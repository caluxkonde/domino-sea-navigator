import React from 'react';
import { Users } from 'lucide-react';

interface UserManagementHeaderProps {
  userCount: number;
}

export const UserManagementHeader: React.FC<UserManagementHeaderProps> = ({ userCount }) => {
  return (
    <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-100">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Manajemen Pengguna</h2>
          <p className="text-slate-600">Kelola pengguna dan peran mereka dalam sistem</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center space-x-2">
            <Users className="h-6 w-6 text-purple-600" />
            <div>
              <p className="text-2xl font-bold text-slate-800">{userCount}</p>
              <p className="text-sm text-slate-600">Total Pengguna</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};