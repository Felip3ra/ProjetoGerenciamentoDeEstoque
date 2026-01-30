import { useState, useEffect } from 'react';
import { Plus, Search, Users as UsersIcon, Edit, Trash2, Package, X } from 'lucide-react';
import { toast } from 'sonner';
import { UserStatus } from '../types';
import type { Item, User } from '../types';
import { getAllUsers, deleteUser, createUser, updateUser } from '../services/users';
import { getAllItems } from '../services/items';
import { hasPermission, PERMISSIONS } from '../services/auth';

export function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [searchText, setSearchText] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const canEdit = hasPermission(PERMISSIONS.EDIT_USER);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const [usersResult, itemsResult] = await Promise.all([getAllUsers(), getAllItems()]);
    setUsers(usersResult);
    setItems(itemsResult);
  };

  const filteredUsers = users.filter(
    (u) =>
      u.nome.toLowerCase().includes(searchText.toLowerCase()) ||
      (u.email && u.email.toLowerCase().includes(searchText.toLowerCase())) ||
      (u.setor && u.setor.toLowerCase().includes(searchText.toLowerCase()))
  );

  const handleDelete = async (user: User) => {
    if (!confirm(`Tem certeza que deseja deletar "${user.nome}"?`)) return;

    try {
      await deleteUser(user.id);
      await loadUsers();
      toast.success('Usuario removido com sucesso.');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const getUserItems = (userId: string) => {
    return items.filter((item) => item.usuarioAtualId === userId);
  };

  const getStatusBadge = (status: UserStatus) => {
    return status === UserStatus.ATIVO ? (
      <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">Ativo</span>
    ) : (
      <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">Inativo</span>
    );
  };

  const getRoleBadge = (perfil: string) => {
    const styles: Record<string, string> = {
      ADMIN: 'bg-primary/10 text-primary/90',
      OPERADOR: 'bg-accent/15 text-accent',
      LEITOR: 'bg-gray-100 text-gray-700'
    };

    return <span className={`px-2 py-1 rounded-full text-xs ${styles[perfil]}`}>{perfil}</span>;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2">Usuários</h1>
          <p className="text-gray-600">{filteredUsers.length} usuário(s) encontrado(s)</p>
        </div>

        {canEdit && (
          <button
            onClick={() => {
              setEditingUser(null);
              setShowForm(true);
            }}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Novo Usuário
          </button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nome, email ou setor..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Nome</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Setor</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Perfil</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Itens</th>
                <th className="px-6 py-3 text-right text-xs text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    <UsersIcon className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                    Nenhum usuário encontrado
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const userItems = getUserItems(user.id);
                  return (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm">{user.nome}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{user.email || '-'}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{user.setor || '-'}</td>
                      <td className="px-6 py-4">{getRoleBadge(user.perfil)}</td>
                      <td className="px-6 py-4">{getStatusBadge(user.status)}</td>
                      <td className="px-6 py-4">
                        {userItems.length > 0 ? (
                          <button
                            onClick={() => setSelectedUserId(user.id)}
                            className="flex items-center gap-1 text-sm text-primary hover:text-primary/90"
                          >
                            <Package className="w-4 h-4" />
                            {userItems.length}
                          </button>
                        ) : (
                          <span className="text-sm text-gray-400">0</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {canEdit && (
                            <>
                              <button
                                onClick={() => {
                                  setEditingUser(user);
                                  setShowForm(true);
                                }}
                                className="p-1 text-gray-600 hover:text-accent transition-colors"
                                title="Editar"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(user)}
                                className="p-1 text-gray-600 hover:text-red-600 transition-colors"
                                title="Deletar"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <UserFormModal
          user={editingUser}
          onClose={async (saved) => {
            setShowForm(false);
            setEditingUser(null);
            if (saved) await loadUsers();
          }}
        />
      )}

      {selectedUserId && (
        <UserItemsModal
          userId={selectedUserId}
          items={items}
          users={users}
          onClose={() => setSelectedUserId(null)}
        />
      )}
    </div>
  );
}

function UserFormModal({ user, onClose }: { user: User | null; onClose: (saved: boolean) => void }) {
  const sectorOptions = ['Requisitos', 'Desenvolvimento', 'QA', 'Operacoes'];
  const initialPerfil = user
    ? user.perfil === 'ADMIN' || user.perfil === 'OPERADOR'
      ? user.perfil
      : 'OPERADOR'
    : 'LEITOR';
  const [formData, setFormData] = useState({
    nome: user?.nome || '',
    email: user?.email || '',
    setor: user?.setor || 'Desenvolvimento',
    perfil: initialPerfil,
    status: user?.status || 'ATIVO',
    senha: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (user) {
        if (formData.perfil !== 'ADMIN' && formData.perfil !== 'OPERADOR') {
          setError('Selecione operador ou admin para editar o usuario.');
          return;
        }

        await updateUser({
          id: user.id,
          nome: formData.nome,
          email: formData.email || undefined,
          setor: formData.setor || undefined,
          perfil: formData.perfil as any,
          status: formData.status as any,
          senha: formData.perfil === 'ADMIN' ? formData.senha || undefined : undefined
        });
        toast.success('Usuario atualizado com sucesso.');
      } else {
        if (!formData.senha) {
          setError('Senha é obrigatória para novo usuário');
          return;
        }
        await createUser({
          nome: formData.nome,
          email: formData.email || undefined,
          setor: formData.setor || undefined,
          perfil: formData.perfil as any,
          senha: formData.senha
        });
        toast.success('Usuario criado com sucesso.');
      }
      onClose(true);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2>{user ? 'Editar Usuário' : 'Novo Usuário'}</h2>
          <button onClick={() => onClose(false)} className="p-1 hover:bg-gray-100 rounded-lg">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">{error}</div>}

          <div>
            <label className="block text-sm mb-1 text-gray-700">
              Nome <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-700">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-700">Setor</label>
            <select
              value={formData.setor}
              onChange={(e) => setFormData({ ...formData, setor: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              {sectorOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-700">Perfil</label>
            <select
              value={formData.perfil}
              onChange={(e) => {
                const perfil = e.target.value;
                setFormData((prev) => ({
                  ...prev,
                  perfil,
                  senha: user && perfil !== 'ADMIN' ? '' : prev.senha
                }));
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              {!user && <option value="LEITOR">Leitor</option>}
              <option value="OPERADOR">Operador</option>
              <option value="ADMIN">Admin</option>
            </select>
            {user?.perfil === 'LEITOR' && (
              <p className="mt-1 text-xs text-gray-500">Na edicao, selecione operador ou admin.</p>
            )}
          </div>

          {user && (
            <div>
              <label className="block text-sm mb-1 text-gray-700">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="ATIVO">Ativo</option>
                <option value="INATIVO">Inativo</option>
              </select>
            </div>
          )}

          {!user ? (
            <div>
              <label className="block text-sm mb-1 text-gray-700">
                Senha <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={formData.senha}
                onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                required
              />
            </div>
          ) : formData.perfil === 'ADMIN' ? (
            <div>
              <label className="block text-sm mb-1 text-gray-700">Senha (opcional)</label>
              <input
                type="password"
                value={formData.senha}
                onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="Defina uma nova senha"
              />
            </div>
          ) : null}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => onClose(false)}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
              {user ? 'Salvar' : 'Criar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function UserItemsModal({
  userId,
  items,
  users,
  onClose
}: {
  userId: string;
  items: Item[];
  users: User[];
  onClose: () => void;
}) {
  const userItems = items.filter((item) => item.usuarioAtualId === userId);
  const user = users.find((u) => u.id === userId);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2>Itens de {user?.nome}</h2>
            <p className="text-sm text-gray-600">{userItems.length} item(ns)</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {userItems.length === 0 ? (
            <div className="text-center py-8 text-gray-500">Nenhum item atribuído</div>
          ) : (
            <div className="space-y-3">
              {userItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm">{item.nome}</p>
                    <p className="text-xs text-gray-500">Nº {item.numeroSerie}</p>
                  </div>
                  <span className="text-xs text-gray-600">{item.categoria}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
