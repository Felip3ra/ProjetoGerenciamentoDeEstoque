import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import type { Item, User } from '../types';
import { getActiveUsers } from '../services/users';
import { assignItem, returnItem, transferItem, setMaintenance, discardItem } from '../services/movements';

interface MovementModalProps {
  item: Item;
  actionType: string;
  onClose: (success: boolean) => void;
}

export function MovementModal({ item, actionType, onClose }: MovementModalProps) {
  const [userId, setUserId] = useState('');
  const [observacao, setObservacao] = useState('');
  const [error, setError] = useState('');
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const activeUsers = await getActiveUsers();
    setUsers(activeUsers);
  };

  const getTitle = () => {
    const titles: Record<string, string> = {
      assign: 'Atribuir Item',
      return: 'Devolver Item',
      transfer: 'Transferir Item',
      maintenance: 'Enviar para Manutenção',
      discard: 'Dar Baixa no Item'
    };
    return titles[actionType] || 'Movimentação';
  };

  const getButtonLabel = () => {
    const labels: Record<string, string> = {
      assign: 'Atribuir',
      return: 'Devolver',
      transfer: 'Transferir',
      maintenance: 'Enviar',
      discard: 'Confirmar Baixa'
    };
    return labels[actionType] || 'Confirmar';
  };

  const needsUser = actionType === 'assign' || actionType === 'transfer';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const successMessages: Record<string, string> = {
        assign: 'Item atribuido com sucesso.',
        return: 'Item devolvido com sucesso.',
        transfer: 'Item transferido com sucesso.',
        maintenance: 'Item enviado para manutencao.',
        discard: 'Item baixado com sucesso.'
      };

      switch (actionType) {
        case 'assign':
          await assignItem({ itemId: item.id, paraUsuarioId: userId, observacao });
          break;
        case 'return':
          await returnItem({ itemId: item.id, observacao });
          break;
        case 'transfer':
          await transferItem({ itemId: item.id, paraUsuarioId: userId, observacao });
          break;
        case 'maintenance':
          await setMaintenance({ itemId: item.id, observacao });
          break;
        case 'discard':
          await discardItem({ itemId: item.id, observacao });
          break;
        default:
          throw new Error('Ação inválida');
      }
      
      toast.success(successMessages[actionType] || 'Movimentacao registrada.');
      onClose(true);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3>{getTitle()}</h3>
          <button
            onClick={() => onClose(false)}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Item:</p>
            <p className="text-sm">{item.nome}</p>
            <p className="text-xs text-gray-500">Nº {item.numeroSerie}</p>
            {item.usuarioAtualNome && actionType !== 'assign' && (
              <p className="text-xs text-gray-500 mt-2">
                Atualmente com: {item.usuarioAtualNome}
              </p>
            )}
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {needsUser && (
            <div>
              <label className="block text-sm mb-1 text-gray-700">
                {actionType === 'assign' ? 'Atribuir para' : 'Transferir para'}{' '}
                <span className="text-red-500">*</span>
              </label>
              <select
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                required
              >
                <option value="">Selecione um usuário</option>
                {users
                  .filter(u => u.id !== item.usuarioAtualId)
                  .map(user => (
                    <option key={user.id} value={user.id}>
                      {user.nome} {user.setor ? `(${user.setor})` : ''}
                    </option>
                  ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm mb-1 text-gray-700">
              Observação {actionType === 'discard' && <span className="text-red-500">*</span>}
            </label>
            <textarea
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
              placeholder={
                actionType === 'discard'
                  ? 'Motivo da baixa (obrigatório)'
                  : 'Observações sobre esta movimentação'
              }
              rows={3}
              required={actionType === 'discard'}
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => onClose(false)}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={`px-4 py-2 text-white rounded-lg transition-colors ${
                actionType === 'discard'
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-primary hover:bg-primary/90'
              }`}
            >
              {getButtonLabel()}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
