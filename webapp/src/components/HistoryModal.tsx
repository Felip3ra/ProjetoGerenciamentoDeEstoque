import { MovementType } from '@/types';
import type { Movement, Item } from '@/types';
import { X } from 'lucide-react';
import { Badge } from './Badge';

interface HistoryModalProps {
  item: Item;
  movements: Movement[];
  onClose: () => void;
}

const movementConfig = {
  [MovementType.ATRIBUICAO]: { label: 'Atribuição', color: 'blue' as const },
  [MovementType.DEVOLUCAO]: { label: 'Devolução', color: 'green' as const },
  [MovementType.TROCA_RESPONSAVEL]: { label: 'Transferência', color: 'purple' as const },
  [MovementType.MANUTENCAO]: { label: 'Manutenção', color: 'orange' as const },
  [MovementType.BAIXA]: { label: 'Baixa', color: 'red' as const }
};

export function HistoryModal({ item, movements, onClose }: HistoryModalProps) {
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold">Histórico de Movimentações</h2>
            <p className="text-sm text-gray-600 mt-1">
              {item.nome} - S/N: {item.numeroSerie}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {movements.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              Nenhuma movimentação registrada
            </div>
          ) : (
            <div className="space-y-4">
              {movements.map((movement, index) => {
                const config = movementConfig[movement.tipoMovimentacao];
                
                return (
                  <div
                    key={movement.id}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <Badge color={config.color}>{config.label}</Badge>
                      <span className="text-sm text-gray-500">
                        {formatDate(movement.dataHora)}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-3">
                      {movement.deUsuario && (
                        <div>
                          <p className="text-xs text-gray-500">De</p>
                          <p className="text-sm font-medium text-gray-900">
                            {movement.deUsuario.nome}
                          </p>
                        </div>
                      )}
                      
                      {movement.paraUsuario && (
                        <div>
                          <p className="text-xs text-gray-500">Para</p>
                          <p className="text-sm font-medium text-gray-900">
                            {movement.paraUsuario.nome}
                          </p>
                        </div>
                      )}
                    </div>

                    {movement.observacao && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <p className="text-xs text-gray-500">Observação</p>
                        <p className="text-sm text-gray-700 mt-1">{movement.observacao}</p>
                      </div>
                    )}

                    {movement.realizadoPor && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-400">
                          Realizado por: {movement.realizadoPor.nome}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
