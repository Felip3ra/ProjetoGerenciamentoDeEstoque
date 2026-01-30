import { LayoutDashboard, Package, Users, Activity, BarChart3, LogOut, UserCircle } from 'lucide-react';
import type { AuthUser } from '../types';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  user: AuthUser;
  onLogout: () => void;
}

export function Sidebar({ currentPage, onNavigate, user, onLogout }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'items', label: 'Itens', icon: Package },
    { id: 'users', label: 'Usuários', icon: Users },
    { id: 'movements', label: 'Movimentações', icon: Activity },
    { id: 'reports', label: 'Relatórios', icon: BarChart3 }
  ];

  const getRoleBadgeColor = () => {
    switch (user.perfil) {
      case 'ADMIN': return 'bg-primary/10 text-primary/90';
      case 'OPERADOR': return 'bg-accent/15 text-accent';
      case 'LEITOR': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-primary mb-1">Gestão de Estoque</h2>
        <p className="text-xs text-gray-500">Controle de Ativos</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 mb-3 px-2">
          <UserCircle className="w-8 h-8 text-gray-400" />
          <div className="flex-1 min-w-0">
            <p className="text-sm truncate">{user.nome}</p>
            <span className={`text-xs px-2 py-0.5 rounded-full ${getRoleBadgeColor()}`}>
              {user.perfil}
            </span>
          </div>
        </div>
        
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm">Sair</span>
        </button>
      </div>
    </div>
  );
}
