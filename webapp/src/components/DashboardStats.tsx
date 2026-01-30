import type { InventoryStats } from '@/types';
import { Package, CheckCircle, Tool, XCircle, Users } from 'lucide-react';

interface DashboardStatsProps {
  stats: InventoryStats;
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  const statCards = [
    {
      label: 'Total de Itens',
      value: stats.totalItems,
      icon: Package,
      color: 'text-accent',
      bgColor: 'bg-accent/10'
    },
    {
      label: 'Disponíveis',
      value: stats.disponiveis,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      label: 'Em Uso',
      value: stats.emUso,
      icon: Users,
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      label: 'Em Manutenção',
      value: stats.emManutencao,
      icon: Tool,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      label: 'Baixados',
      value: stats.baixados,
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {statCards.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.label} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-3xl font-semibold mt-2">{stat.value}</p>
              </div>
              <div className={`${stat.bgColor} ${stat.color} p-3 rounded-lg`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
