import { useState, useEffect } from 'react';
import { Activity, Filter, Calendar } from 'lucide-react';
import { MovementType } from '../types';
import type { Movement, MovementFilter } from '../types';
import { getAllMovements, filterMovements } from '../services/movements';

export function MovementsPage() {
  const [movements, setMovements] = useState<Movement[]>([]);
  const [filteredMovements, setFilteredMovements] = useState<Movement[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filter, setFilter] = useState<MovementFilter>({});

  useEffect(() => {
    loadMovements();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [movements, filter]);

  const loadMovements = async () => {
    const allMovements = await getAllMovements();
    setMovements(allMovements);
  };

  const applyFilters = async () => {
    const filtered = await filterMovements(filter);
    setFilteredMovements(filtered);
  };

  const getMovementBadge = (type: MovementType) => {
    const styles: Record<MovementType, string> = {
      ATRIBUICAO: 'bg-accent/15 text-accent',
      DEVOLUCAO: 'bg-green-100 text-green-700',
      TROCA_RESPONSAVEL: 'bg-primary/10 text-primary/90',
      MANUTENCAO: 'bg-orange-100 text-orange-700',
      BAIXA: 'bg-red-100 text-red-700'
    };

    const labels: Record<MovementType, string> = {
      ATRIBUICAO: 'Atribuição',
      DEVOLUCAO: 'Devolução',
      TROCA_RESPONSAVEL: 'Transferência',
      MANUTENCAO: 'Manutenção',
      BAIXA: 'Baixa'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs ${styles[type]}`}>
        {labels[type]}
      </span>
    );
  };

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
      <span className={`px-2 py-1 rounded-full text-xs ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2">Movimentações</h1>
          <p className="text-gray-600">{filteredMovements.length} registro(s) encontrado(s)</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 space-y-4">
        <div className="flex justify-between items-center">
          <h3>Filtros</h3>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
              showFilters 
                ? 'bg-primary/10 border-primary/30 text-primary/90'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Filter className="w-5 h-5" />
            {showFilters ? 'Ocultar' : 'Mostrar'}
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
            <div>
              <label className="block text-sm mb-1 text-gray-700">Tipo de Movimentação</label>
              <select
                value={filter.tipoMovimentacao || ''}
                onChange={(e) => setFilter({ ...filter, tipoMovimentacao: e.target.value as MovementType || undefined })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="">Todos</option>
                <option value="ATRIBUICAO">Atribuição</option>
                <option value="DEVOLUCAO">Devolução</option>
                <option value="TROCA_RESPONSAVEL">Transferência</option>
                <option value="MANUTENCAO">Manutenção</option>
                <option value="BAIXA">Baixa</option>
              </select>
            </div>

            <div>
              <label className="block text-sm mb-1 text-gray-700">Data Início</label>
              <input
                type="date"
                value={filter.dataInicio || ''}
                onChange={(e) => setFilter({ ...filter, dataInicio: e.target.value || undefined })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <div>
              <label className="block text-sm mb-1 text-gray-700">Data Fim</label>
              <input
                type="date"
                value={filter.dataFim || ''}
                onChange={(e) => setFilter({ ...filter, dataFim: e.target.value || undefined })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>
        )}
      </div>

      {/* Timeline de Movimentações */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {filteredMovements.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Activity className="w-12 h-12 mx-auto mb-2 text-gray-400" />
            Nenhuma movimentação encontrada
          </div>
        ) : (
          <div className="space-y-4">
            {filteredMovements.map((mov, index) => (
              <div
                key={mov.id}
                className="relative pl-8 pb-4 border-l-2 border-gray-200 last:border-transparent"
              >
                <div className="absolute left-[-9px] top-2 w-4 h-4 bg-white border-2 border-primary rounded-full" />
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {getMovementBadge(mov.tipoMovimentacao)}
                        <span className="text-xs text-gray-500">
                          {new Date(mov.dataHora).toLocaleString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      
                      <p className="text-sm mb-2">
                        <span className="text-gray-600">Item:</span>{' '}
                        <span>{mov.itemNome}</span>
                        {mov.itemNumeroSerie && (
                          <span className="text-gray-500"> (Nº {mov.itemNumeroSerie})</span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {mov.deUsuarioNome && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-500 w-16">De:</span>
                        <span className="text-gray-900">{mov.deUsuarioNome}</span>
                      </div>
                    )}
                    
                    {mov.paraUsuarioNome && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-500 w-16">Para:</span>
                        <span className="text-gray-900">{mov.paraUsuarioNome}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-500 w-16">Status:</span>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(mov.statusAnterior)}
                        <span className="text-gray-400">→</span>
                        {getStatusBadge(mov.statusNovo)}
                      </div>
                    </div>

                    {mov.observacao && (
                      <div className="mt-3 p-3 bg-white rounded border border-gray-200">
                        <p className="text-xs text-gray-500 mb-1">Observação:</p>
                        <p className="text-sm text-gray-700 italic">"{mov.observacao}"</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
