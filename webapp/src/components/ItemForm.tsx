import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import type { Item, CreateItemDTO, UpdateItemDTO } from '../types';
import { createItem, updateItem } from '../services/items';

interface ItemFormProps {
  item: Item | null;
  onClose: (saved: boolean) => void;
}

export function ItemForm({ item, onClose }: ItemFormProps) {
  const [formData, setFormData] = useState({
    categoria: '',
    nome: '',
    marca: '',
    modelo: '',
    numeroSerie: '',
    patrimonio: '',
    descricao: '',
    dataCompra: ''
  });

  const [error, setError] = useState('');

  useEffect(() => {
    if (item) {
      setFormData({
        categoria: item.categoria,
        nome: item.nome,
        marca: item.marca || '',
        modelo: item.modelo || '',
        numeroSerie: item.numeroSerie,
        patrimonio: item.patrimonio || '',
        descricao: item.descricao || '',
        dataCompra: item.dataCompra || ''
      });
    }
  }, [item]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (item) {
        // Edição
        const updateData: UpdateItemDTO = {
          id: item.id,
          categoria: formData.categoria,
          nome: formData.nome,
          marca: formData.marca || undefined,
          modelo: formData.modelo || undefined,
          patrimonio: formData.patrimonio || undefined,
          descricao: formData.descricao || undefined,
          dataCompra: formData.dataCompra || undefined
        };
        await updateItem(updateData);
        toast.success('Item atualizado com sucesso.');
      } else {
        // Criação
        const createData: CreateItemDTO = {
          categoria: formData.categoria,
          nome: formData.nome,
          marca: formData.marca || undefined,
          modelo: formData.modelo || undefined,
          numeroSerie: formData.numeroSerie,
          patrimonio: formData.patrimonio || undefined,
          descricao: formData.descricao || undefined,
          dataCompra: formData.dataCompra || undefined
        };
        await createItem(createData);
        toast.success('Item criado com sucesso.');
      }
      
      onClose(true);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2>{item ? 'Editar Item' : 'Novo Item'}</h2>
          <button
            onClick={() => onClose(false)}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1 text-gray-700">
                Categoria <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.categoria}
                onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="Ex: Notebook, Monitor, Mouse"
                required
                list="categorias"
              />
              <datalist id="categorias">
                <option value="Notebook" />
                <option value="Monitor" />
                <option value="Mouse" />
                <option value="Teclado" />
                <option value="Headset" />
                <option value="Webcam" />
                <option value="Smartphone" />
                <option value="Tablet" />
              </datalist>
            </div>

            <div>
              <label className="block text-sm mb-1 text-gray-700">
                Nome <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="Ex: MacBook Pro 16"
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-1 text-gray-700">Marca</label>
              <input
                type="text"
                value={formData.marca}
                onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="Ex: Apple"
              />
            </div>

            <div>
              <label className="block text-sm mb-1 text-gray-700">Modelo</label>
              <input
                type="text"
                value={formData.modelo}
                onChange={(e) => setFormData({ ...formData, modelo: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="Ex: M1 Pro"
              />
            </div>

            <div>
              <label className="block text-sm mb-1 text-gray-700">
                Número de Série <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.numeroSerie}
                onChange={(e) => setFormData({ ...formData, numeroSerie: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="Ex: ABC123XYZ"
                required
                disabled={!!item}
              />
              {item && (
                <p className="text-xs text-gray-500 mt-1">
                  Número de série não pode ser alterado
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm mb-1 text-gray-700">Patrimônio</label>
              <input
                type="text"
                value={formData.patrimonio}
                onChange={(e) => setFormData({ ...formData, patrimonio: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="Ex: PAT-001"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm mb-1 text-gray-700">Descrição</label>
              <textarea
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="Informações adicionais sobre o item"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm mb-1 text-gray-700">Data de Compra</label>
              <input
                type="date"
                value={formData.dataCompra}
                onChange={(e) => setFormData({ ...formData, dataCompra: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => onClose(false)}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              {item ? 'Salvar' : 'Criar Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
