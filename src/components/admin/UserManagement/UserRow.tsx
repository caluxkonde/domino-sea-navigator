import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Edit } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { UserAvatar } from './UserAvatar';
import { RoleBadge } from './RoleBadge';
import { PremiumStatusBadge } from './PremiumStatusBadge';

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

interface UserRowProps {
  user: UserWithRole;
  onRoleChange: (userId: string, newRole: string) => void;
}

export const UserRow: React.FC<UserRowProps> = ({ user, onRoleChange }) => {
  return (
    <TableRow key={user.id}>
      <TableCell>
        <div className="flex items-center space-x-3">
          <UserAvatar fullName={user.full_name} email={user.email} />
          <div>
            <p className="font-medium text-slate-800">{user.full_name || 'Nama belum diatur'}</p>
            <p className="text-sm text-slate-500">{user.position || 'Posisi belum diatur'}</p>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <span className="text-slate-600">{user.email}</span>
      </TableCell>
      <TableCell>
        <RoleBadge role={user.role} />
      </TableCell>
      <TableCell>
        <PremiumStatusBadge premiumStatus={user.premium_status} />
      </TableCell>
      <TableCell>
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-slate-400" />
          <span className="text-sm text-slate-600">
            {format(new Date(user.created_at), 'dd MMM yyyy', { locale: id })}
          </span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center space-x-2">
          <Select
            value={user.role}
            onValueChange={(value) => onRoleChange(user.id, value)}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="Premium">Premium</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
          <Button size="sm" variant="outline">
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};