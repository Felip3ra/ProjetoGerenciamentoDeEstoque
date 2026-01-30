import { useState } from 'react';
import type { Item } from '@/types';
import { X } from 'lucide-react';

interface ReturnItemModalProps {
  item: Item;
  onConfirm: (observacao: string) => void;
  onClose: () => void;
}

export function ReturnItemModal({ item, onConfirm, onClose }: ReturnItemModalProps) {
  const [observacao, setObservacao] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(observacao);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Devolver Item</h2>
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

          {item.usuarioAtual && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Usuário Atual
              </label>
              <div className="bg-accent/10 p-3 rounded-lg">
                <p className="font-medium text-primary">{item.usuarioAtual.nome}</p>
                {item.usuarioAtual.setor && (
                  <p className="text-sm text-accent">{item.usuarioAtual.setor}</p>
                )}
              </div>
            </div>
          )}

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
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Confirmar Devolução
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
