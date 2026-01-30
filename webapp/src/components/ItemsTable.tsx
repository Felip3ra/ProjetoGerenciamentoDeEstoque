import { ItemStatus, UserRole } from '@/types';
import type { Item } from '@/types';
import { Badge } from './Badge';
import { User, History, UserPlus, Undo2, Tool, Trash2 } from 'lucide-react';
import { currentUser } from '@/lib/mock-data';

interface ItemsTableProps {
  items: Item[];
  onAssign: (item: Item) => void;
  onReturn: (item: Item) => void;
  onMaintenance: (item: Item) => void;
  onViewHistory: (item: Item) => void;
}

const statusConfig = {
  [ItemStatus.DISPONIVEL]: { label: 'Disponível', color: 'green' as const },
  [ItemStatus.EM_USO]: { label: 'Em Uso', color: 'purple' as const },
  [ItemStatus.EM_MANUTENCAO]: { label: 'Em Manutenção', color: 'orange' as const },
  [ItemStatus.BAIXADO]: { label: 'Baixado', color: 'red' as const }
};

export function ItemsTable({ items, onAssign, onReturn, onMaintenance, onViewHistory }: ItemsTableProps) {
  const canEdit = currentUser.role === UserRole.ADMIN || currentUser.role === UserRole.OPERADOR;

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <p className="text-gray-500">Nenhum item encontrado</p>
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
                Item
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Categoria
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nº Série
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Usuário Atual
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {items.map((item) => {
              const statusInfo = statusConfig[item.status];
              
              return (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="font-medium text-gray-900">{item.nome}</div>
                      <div className="text-sm text-gray-500">{item.marca} {item.modelo}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{item.categoria}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-mono text-gray-900">{item.numeroSerie}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge color={statusInfo.color}>{statusInfo.label}</Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.usuarioAtual ? (
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-900">{item.usuarioAtual.nome}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onViewHistory(item)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Ver histórico"
                      >
                        <History className="w-4 h-4" />
                      </button>

                      {canEdit && item.status === ItemStatus.DISPONIVEL && (
                        <button
                          onClick={() => onAssign(item)}
                          className="p-2 text-accent hover:bg-accent/10 rounded-lg transition-colors"
                          title="Atribuir"
                        >
                          <UserPlus className="w-4 h-4" />
                        </button>
                      )}

                      {canEdit && item.status === ItemStatus.EM_USO && (
                        <>
                          <button
                            onClick={() => onReturn(item)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Devolver"
                          >
                            <Undo2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onMaintenance(item)}
                            className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                            title="Enviar para manutenção"
                          >
                            <Tool className="w-4 h-4" />
                          </button>
                        </>
                      )}

                      {canEdit && item.status === ItemStatus.EM_MANUTENCAO && (
                        <button
                          onClick={() => onReturn(item)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Retornar da manutenção"
                        >
                          <Undo2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
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
