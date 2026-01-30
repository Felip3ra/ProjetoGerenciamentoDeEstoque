import { useEffect, useState } from 'react';
import { Package, CheckCircle, Wrench, TrendingUp, Users } from 'lucide-react';
import { getDashboardStats } from '../services/reports';
import { getAllItems } from '../services/items';
import { getAllMovements } from '../services/movements';

export function Dashboard() {
  const [stats, setStats] = useState({
    totalItens: 0,
    disponiveis: 0,
    emUso: 0,
    emManutencao: 0,
    baixados: 0,
    utilizacao: 0
  });

  const [recentItems, setRecentItems] = useState<any[]>([]);
  const [recentMovements, setRecentMovements] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const dashboardStats = await getDashboardStats();
    setStats(dashboardStats);

    const items = await getAllItems();
    setRecentItems(items.slice(0, 5));

    const movements = await getAllMovements();
    setRecentMovements(movements.slice(0, 5));
  };

  const statCards = [
    {
      label: 'Total de Itens',
      value: stats.totalItens,
      icon: Package,
      color: 'bg-accent/100',
      textColor: 'text-accent'
    },
    {
      label: 'Disponíveis',
      value: stats.disponiveis,
      icon: CheckCircle,
      color: 'bg-green-500',
      textColor: 'text-green-600'
    },
    {
      label: 'Em Uso',
      value: stats.emUso,
      icon: Users,
      color: 'bg-primary',
      textColor: 'text-primary'
    },
    {
      label: 'Manutenção',
      value: stats.emManutencao,
      icon: Wrench,
      color: 'bg-orange-500',
      textColor: 'text-orange-600'
    }
  ];

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      DISPONIVEL: 'bg-green-100 text-green-700',
      EM_USO: 'bg-accent/15 text-accent',
      EM_MANUTENCAO: 'bg-orange-100 text-orange-700',
      BAIXADO: 'bg-gray-100 text-gray-700'
    };
    
    const labels: Record<string, string> = {
      DISPONIVEL: 'Disponível',
      EM_USO: 'Em Uso',
      EM_MANUTENCAO: 'Manutenção',
      BAIXADO: 'Baixado'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs ${styles[status] || styles.DISPONIVEL}`}>
        {labels[status] || status}
      </span>
    );
  };

  const getMovementTypeBadge = (type: string) => {
    const styles: Record<string, string> = {
      ATRIBUICAO: 'bg-accent/15 text-accent',
      DEVOLUCAO: 'bg-green-100 text-green-700',
      TROCA_RESPONSAVEL: 'bg-primary/10 text-primary/90',
      MANUTENCAO: 'bg-orange-100 text-orange-700',
      BAIXA: 'bg-red-100 text-red-700'
    };

    const labels: Record<string, string> = {
      ATRIBUICAO: 'Atribuição',
      DEVOLUCAO: 'Devolução',
      TROCA_RESPONSAVEL: 'Transferência',
      MANUTENCAO: 'Manutenção',
      BAIXA: 'Baixa'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs ${styles[type] || 'bg-gray-100 text-gray-700'}`}>
        {labels[type] || type}
      </span>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="mb-2">Dashboard</h1>
        <p className="text-gray-600">Visão geral do inventário</p>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">{card.label}</p>
                <div className={`${card.color} p-2 rounded-lg`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
              </div>
              <p className={`text-3xl ${card.textColor}`}>{card.value}</p>
            </div>
          );
        })}
      </div>

      {/* Taxa de utilização */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h3>Taxa de Utilização</h3>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex-1 bg-gray-200 rounded-full h-4">
            <div
              className="bg-primary h-4 rounded-full transition-all"
              style={{ width: `${stats.utilizacao}%` }}
            />
          </div>
          <span className="text-2xl text-primary">{stats.utilizacao}%</span>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          {stats.emUso} de {stats.totalItens - stats.baixados || stats.totalItens} itens ativos em uso
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Itens recentes */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3>Itens Cadastrados</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {recentItems.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                Nenhum item cadastrado
              </div>
            ) : (
              recentItems.map((item) => (
                <div key={item.id} className="p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex-1">
                      <p className="text-sm">{item.nome}</p>
                      <p className="text-xs text-gray-500">Nº {item.numeroSerie}</p>
                    </div>
                    {getStatusBadge(item.statusItem)}
                  </div>
                  {item.usuarioAtualNome && (
                    <p className="text-xs text-gray-500 mt-1">
                      Com: {item.usuarioAtualNome}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Movimentações recentes */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3>Movimentações Recentes</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {recentMovements.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                Nenhuma movimentação registrada
              </div>
            ) : (
              recentMovements.map((mov) => (
                <div key={mov.id} className="p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-sm flex-1">
                      {mov.itemNome || mov.itemNumeroSerie || `Item ${mov.itemId}`}
                    </p>
                    {getMovementTypeBadge(mov.tipoMovimentacao)}
                  </div>
                  <p className="text-xs text-gray-500">
                    {new Date(mov.dataHora).toLocaleString('pt-BR')}
                  </p>
                  {(mov.paraUsuarioNome || mov.deUsuarioNome) && (
                    <p className="text-xs text-gray-600 mt-1">
                      {mov.paraUsuarioNome ? 'Para' : 'De'}: {mov.paraUsuarioNome || mov.deUsuarioNome}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
