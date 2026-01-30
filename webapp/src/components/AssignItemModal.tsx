import { useState } from 'react';
import { UserStatus } from '@/types';
import type { Item, User } from '@/types';
import { X } from 'lucide-react';

interface AssignItemModalProps {
  item: Item;
  users: User[];
  onConfirm: (userId: string, observacao: string) => void;
  onClose: () => void;
}

export function AssignItemModal({ item, users, onConfirm, onClose }: AssignItemModalProps) {
  const [selectedUserId, setSelectedUserId] = useState('');
  const [observacao, setObservacao] = useState('');

  const activeUsers = users.filter(u => u.status === UserStatus.ATIVO);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUserId) {
      onConfirm(selectedUserId, observacao);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Atribuir Item</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Item
            </label>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="font-medium text-gray-900">{item.nome}</p>
              <p className="text-sm text-gray-600">{item.marca} {item.modelo}</p>
              <p className="text-sm text-gray-500 font-mono">S/N: {item.numeroSerie}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Atribuir para <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/30"
              required
            >
              <option value="">Selecione um usuário</option>
              {activeUsers.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.nome} {user.setor ? `(${user.setor})` : ''}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Observação
            </label>
            <textarea
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/30"
              rows={3}
              placeholder="Adicione observações opcionais..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
            >
              Atribuir
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
