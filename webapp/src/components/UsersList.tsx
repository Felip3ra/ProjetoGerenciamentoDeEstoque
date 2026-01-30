import { UserStatus, UserRole } from '@/types';
import type { User } from '@/types';
import { Badge } from './Badge';

interface UsersListProps {
  users: User[];
  itemCounts?: Map<string, number>;
}

const roleConfig = {
  [UserRole.ADMIN]: { label: 'Admin', color: 'red' as const },
  [UserRole.OPERADOR]: { label: 'Operador', color: 'blue' as const },
  [UserRole.LEITOR]: { label: 'Leitor', color: 'gray' as const }
};

const statusConfig = {
  [UserStatus.ATIVO]: { label: 'Ativo', color: 'green' as const },
  [UserStatus.INATIVO]: { label: 'Inativo', color: 'gray' as const }
};

export function UsersList({ users, itemCounts }: UsersListProps) {
  if (users.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <p className="text-gray-500">Nenhum usuário encontrado</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nome
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Setor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Perfil
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Itens
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => {
              const roleInfo = roleConfig[user.role];
              const statusInfo = statusConfig[user.status];
              const itemCount = itemCounts?.get(user.id) || 0;

              return (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-medium text-gray-900">{user.nome}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">{user.email || '—'}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{user.setor || '—'}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge color={roleInfo.color}>{roleInfo.label}</Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge color={statusInfo.color}>{statusInfo.label}</Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">
                      {itemCount > 0 ? `${itemCount} ${itemCount === 1 ? 'item' : 'itens'}` : '—'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
