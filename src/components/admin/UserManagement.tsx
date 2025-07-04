
import React, { useState } from 'react';
import { useUserManagement } from '@/hooks/useUserManagement';
import { 
  UserManagementHeader, 
  UserManagementFilters, 
  UserManagementTable 
} from './UserManagement/index';

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const { users, loading, updateUserRole } = useUserManagement();

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleRoleChange = async (userId: string, newRole: string) => {
    await updateUserRole(userId, newRole as 'admin' | 'Premium' | 'user');
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
      <UserManagementHeader userCount={users.length} />
      
      <UserManagementFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        roleFilter={roleFilter}
        onRoleFilterChange={setRoleFilter}
      />
      
      <UserManagementTable
        users={filteredUsers}
        onRoleChange={handleRoleChange}
      />
    </div>
  );
};

export default UserManagement;
