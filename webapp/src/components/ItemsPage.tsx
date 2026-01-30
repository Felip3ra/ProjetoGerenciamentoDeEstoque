import { useState, useEffect } from 'react';
import { Plus, Search, Filter, Package, History, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { ItemStatus } from '../types';
import type { Item, ItemFilter, User } from '../types';
import { getAllItems, deleteItem } from '../services/items';
import { getActiveUsers } from '../services/users';
import { hasPermission, PERMISSIONS } from '../services/auth';
import { ItemForm } from './ItemForm';
import { ItemDetails } from './ItemDetails';
import { ItemActions } from './ItemActions';

export function ItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const [filter, setFilter] = useState<ItemFilter>({});
  const [searchText, setSearchText] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [items, filter, searchText]);

  const loadData = async () => {
    const [itemsResult, usersResult] = await Promise.all([getAllItems(), getActiveUsers()]);
    setItems(itemsResult);
    setUsers(usersResult);
    setCategories(Array.from(new Set(itemsResult.map((item) => item.categoria))).sort());
  };

  const applyFilters = () => {
    let list = [...items];

    if (filter.status) {
      list = list.filter((i) => i.statusItem === filter.status);
    }

    if (filter.categoria) {
      list = list.filter((i) => i.categoria === filter.categoria);
    }

    if (filter.usuarioId) {
      list = list.filter((i) => i.usuarioAtualId === filter.usuarioId);
    }

    if (searchText) {
      const query = searchText.toLowerCase();
      list = list.filter(
        (i) =>
          i.nome.toLowerCase().includes(query) ||
          i.numeroSerie.toLowerCase().includes(query) ||
          (i.marca && i.marca.toLowerCase().includes(query)) ||
          (i.modelo && i.modelo.toLowerCase().includes(query))
      );
    }

    setFilteredItems(list);
  };

  const handleCreate = () => {
    setEditingItem(null);
    setShowForm(true);
  };

  const handleEdit = (item: Item) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleDelete = async (item: Item) => {
    if (!confirm(`Tem certeza que deseja deletar "${item.nome}"?`)) return;

    try {
      await deleteItem(item.id);
      await loadData();
      toast.success('Item removido com sucesso.');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleViewDetails = (item: Item) => {
    setSelectedItem(item);
    setShowDetails(true);
  };

  const handleFormClose = async (saved: boolean) => {
    setShowForm(false);
    setEditingItem(null);
    if (saved) await loadData();
  };

  const handleDetailsClose = async () => {
    setShowDetails(false);
    setSelectedItem(null);
    await loadData();
  };

  const getStatusBadge = (status: ItemStatus) => {
    const styles: Record<ItemStatus, string> = {
      DISPONIVEL: 'bg-green-100 text-green-700',
      EM_USO: 'bg-accent/15 text-accent',
      EM_MANUTENCAO: 'bg-orange-100 text-orange-700',
      BAIXADO: 'bg-gray-100 text-gray-700'
    };

    const labels: Record<ItemStatus, string> = {
      DISPONIVEL: 'Disponível',
      EM_USO: 'Em Uso',
      EM_MANUTENCAO: 'Manutenção',
      BAIXADO: 'Baixado'
    };

    return <span className={`px-2 py-1 rounded-full text-xs ${styles[status]}`}>{labels[status]}</span>;
  };

  const canEdit = hasPermission(PERMISSIONS.EDIT_ITEM);
  const canDelete = hasPermission(PERMISSIONS.DELETE_ITEM);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2">Itens</h1>
          <p className="text-gray-600">{filteredItems.length} item(ns) encontrado(s)</p>
        </div>

        {canEdit && (
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Novo Item
          </button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 space-y-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nome, marca, modelo ou número de série..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
              showFilters ? 'bg-primary/10 border-primary/30 text-primary/90' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Filter className="w-5 h-5" />
            Filtros
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
            <div>
              <label className="block text-sm mb-1 text-gray-700">Status</label>
              <select
                value={filter.status || ''}
                onChange={(e) => setFilter({ ...filter, status: (e.target.value as ItemStatus) || undefined })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="">Todos</option>
                <option value="DISPONIVEL">Disponível</option>
                <option value="EM_USO">Em Uso</option>
                <option value="EM_MANUTENCAO">Manutenção</option>
                <option value="BAIXADO">Baixado</option>
              </select>
            </div>

            <div>
              <label className="block text-sm mb-1 text-gray-700">Categoria</label>
              <select
                value={filter.categoria || ''}
                onChange={(e) => setFilter({ ...filter, categoria: e.target.value || undefined })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="">Todas</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm mb-1 text-gray-700">Usuário</label>
              <select
                value={filter.usuarioId || ''}
                onChange={(e) => setFilter({ ...filter, usuarioId: e.target.value || undefined })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="">Todos</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Item</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Nº Série</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Categoria</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Responsável</th>
                <th className="px-6 py-3 text-right text-xs text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    <Package className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                    Nenhum item encontrado
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm">{item.nome}</p>
                        {(item.marca || item.modelo) && (
                          <p className="text-xs text-gray-500">{[item.marca, item.modelo].filter(Boolean).join(' ')}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{item.numeroSerie}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{item.categoria}</td>
                    <td className="px-6 py-4">{getStatusBadge(item.statusItem)}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{item.usuarioAtualNome || '-'}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleViewDetails(item)}
                          className="p-1 text-gray-600 hover:text-primary transition-colors"
                          title="Ver detalhes e histórico"
                        >
                          <History className="w-4 h-4" />
                        </button>

                        <ItemActions item={item} onUpdate={loadData} />

                        {canEdit && (
                          <button
                            onClick={() => handleEdit(item)}
                            className="p-1 text-gray-600 hover:text-accent transition-colors"
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        )}

                        {canDelete && (
                          <button
                            onClick={() => handleDelete(item)}
                            className="p-1 text-gray-600 hover:text-red-600 transition-colors"
                            title="Deletar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && <ItemForm item={editingItem} onClose={handleFormClose} />}

      {showDetails && selectedItem && <ItemDetails item={selectedItem} onClose={handleDetailsClose} />}
    </div>
  );
}
