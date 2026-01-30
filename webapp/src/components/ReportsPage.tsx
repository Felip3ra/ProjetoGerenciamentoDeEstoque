import { useState, useEffect } from 'react';
import { BarChart3, Package, CheckCircle, Users, Wrench, TrendingDown, PieChart } from 'lucide-react';
import type { InventoryReport } from '../types';
import { getInventoryReport } from '../services/reports';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RePieChart, Pie, Cell } from 'recharts';

export function ReportsPage() {
  const [report, setReport] = useState<InventoryReport | null>(null);

  useEffect(() => {
    loadReport();
  }, []);

  const loadReport = async () => {
    const data = await getInventoryReport();
    setReport(data);
  };

  if (!report) {
    return (
      <div className="p-6">
        <div className="animate-pulse">Carregando relatório...</div>
      </div>
    );
  }

  // Dados para gráfico de barras (categorias)
  const categoryData = Object.entries(report.itensPorCategoria).map(([name, value]) => ({
    name,
    quantidade: value
  }));

  // Dados para gráfico de pizza (status)
  const statusData = [
    { name: 'Disponíveis', value: report.disponiveis, color: '#10b981' },
    { name: 'Em Uso', value: report.emUso, color: '#3b82f6' },
    { name: 'Manutenção', value: report.emManutencao, color: '#f59e0b' },
    { name: 'Baixados', value: report.baixados, color: '#6b7280' }
  ];

  const visibleStatusData = statusData.filter((entry) => entry.value > 0);
  const statusTotal = statusData.reduce((total, entry) => total + entry.value, 0);
  const renderStatusLabel = ({
    name,
    value
  }: {
    name: string;
    value?: number;
  }) => {
    if (!value) return '';
    const percent = statusTotal > 0 ? Math.round((value / statusTotal) * 100) : 0;
    return `${name}: ${percent}%`;
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="mb-2">Relatórios</h1>
        <p className="text-gray-600">Análise e estatísticas do inventário</p>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Total de Itens</p>
            <Package className="w-5 h-5 text-accent" />
          </div>
          <p className="text-3xl text-accent">{report.totalItens}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Disponíveis</p>
            <CheckCircle className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl text-green-600">{report.disponiveis}</p>
          <p className="text-xs text-gray-500 mt-1">
            {report.totalItens > 0 
              ? `${Math.round((report.disponiveis / report.totalItens) * 100)}%`
              : '0%'
            } do total
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Em Uso</p>
            <Users className="w-5 h-5 text-primary" />
          </div>
          <p className="text-3xl text-primary">{report.emUso}</p>
          <p className="text-xs text-gray-500 mt-1">
            {report.totalItens > 0 
              ? `${Math.round((report.emUso / report.totalItens) * 100)}%`
              : '0%'
            } do total
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Manutenção</p>
            <Wrench className="w-5 h-5 text-orange-500" />
          </div>
          <p className="text-3xl text-orange-600">{report.emManutencao}</p>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Barras - Itens por Categoria */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-primary" />
            <h3>Itens por Categoria</h3>
          </div>
          
          {categoryData.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              Nenhum item cadastrado
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="quantidade" fill="#4f46e5" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Gráfico de Pizza - Distribuição por Status */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <PieChart className="w-5 h-5 text-primary" />
            <h3>Distribuição por Status</h3>
          </div>
          
          {report.totalItens === 0 ? (
            <div className="text-center py-12 text-gray-500">
              Nenhum item cadastrado
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <RePieChart>
                <Pie
                  data={visibleStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderStatusLabel}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {visibleStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RePieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Tabela - Itens por Usuário */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            <h3>Itens por Usuário</h3>
          </div>
        </div>

        <div className="overflow-x-auto">
          {report.itensPorUsuario.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              Nenhum item atribuído a usuários
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                    Usuário
                  </th>
                  <th className="px-6 py-3 text-right text-xs text-gray-500 uppercase tracking-wider">
                    Quantidade de Itens
                  </th>
                  <th className="px-6 py-3 text-right text-xs text-gray-500 uppercase tracking-wider">
                    % do Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {report.itensPorUsuario.map((item) => (
                  <tr key={item.usuarioId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm">{item.usuarioNome}</td>
                    <td className="px-6 py-4 text-sm text-right text-primary">
                      {item.quantidade}
                    </td>
                    <td className="px-6 py-4 text-sm text-right text-gray-600">
                      {Math.round((item.quantidade / report.emUso) * 100)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Resumo Executivo */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="mb-4">Resumo Executivo</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm text-gray-600 mb-3">Estatísticas Gerais</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between">
                <span className="text-gray-700">Total de itens cadastrados:</span>
                <span>{report.totalItens}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-700">Itens ativos (não baixados):</span>
                <span>{report.totalItens - report.baixados}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-700">Taxa de utilização:</span>
                <span className="text-primary">
                  {report.totalItens - report.baixados > 0
                    ? `${Math.round((report.emUso / (report.totalItens - report.baixados)) * 100)}%`
                    : '0%'
                  }
                </span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-700">Usuários com itens:</span>
                <span>{report.itensPorUsuario.length}</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm text-gray-600 mb-3">Categorias</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between">
                <span className="text-gray-700">Total de categorias:</span>
                <span>{Object.keys(report.itensPorCategoria).length}</span>
              </li>
              {Object.entries(report.itensPorCategoria)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 3)
                .map(([cat, qty]) => (
                  <li key={cat} className="flex justify-between">
                    <span className="text-gray-700">{cat}:</span>
                    <span>{qty} item(ns)</span>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
