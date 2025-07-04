import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { UserCheck } from 'lucide-react';
import { UserRow } from './UserRow';

interface UserWithRole {
  id: string;
  full_name: string | null;
  email: string | null;
  position: string | null;
  created_at: string;
  role: 'admin' | 'Premium' | 'user';
  premium_status?: {
    is_premium: boolean;
    end_date?: string;
    subscription_type?: string;
  };
}

interface UserManagementTableProps {
  users: UserWithRole[];
  onRoleChange: (userId: string, newRole: string) => void;
}

export const UserManagementTable: React.FC<UserManagementTableProps> = ({ users, onRoleChange }) => {
  return (
    <Card className="border-0 shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <UserCheck className="h-5 w-5" />
          <span>Daftar Pengguna</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Peran</TableHead>
                <TableHead>Status Premium</TableHead>
                <TableHead>Tanggal Daftar</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <UserRow 
                  key={user.id}
                  user={user} 
                  onRoleChange={onRoleChange} 
                />
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};