import { MovementType } from '@/types';
import type { Movement } from '@/types';
import { Badge } from './Badge';
import { ArrowRight, ArrowLeft, RefreshCw, Tool, Trash2 } from 'lucide-react';

interface MovementsListProps {
  movements: Movement[];
}

const movementConfig = {
  [MovementType.ATRIBUICAO]: {
    label: 'Atribuição',
    color: 'blue' as const,
    icon: ArrowRight
  },
  [MovementType.DEVOLUCAO]: {
    label: 'Devolução',
    color: 'green' as const,
    icon: ArrowLeft
  },
  [MovementType.TROCA_RESPONSAVEL]: {
    label: 'Transferência',
    color: 'purple' as const,
    icon: RefreshCw
  },
  [MovementType.MANUTENCAO]: {
    label: 'Manutenção',
    color: 'orange' as const,
    icon: Tool
  },
  [MovementType.BAIXA]: {
    label: 'Baixa',
    color: 'red' as const,
    icon: Trash2
  }
};

export function MovementsList({ movements }: MovementsListProps) {
  if (movements.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <p className="text-gray-500">Nenhuma movimentação encontrada</p>
      </div>
    );
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data/Hora
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Item
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                De
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Para
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Observação
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {movements.map((movement) => {
              const config = movementConfig[movement.tipoMovimentacao];
              const Icon = config.icon;

              return (
                <tr key={movement.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(movement.dataHora)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-gray-400" />
                      <Badge color={config.color}>{config.label}</Badge>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {movement.item ? (
                      <div>
                        <div className="font-medium text-gray-900">{movement.item.nome}</div>
                        <div className="text-sm text-gray-500">S/N: {movement.item.numeroSerie}</div>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {movement.deUsuario ? movement.deUsuario.nome : '—'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {movement.paraUsuario ? movement.paraUsuario.nome : '—'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {movement.observacao || '—'}
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
