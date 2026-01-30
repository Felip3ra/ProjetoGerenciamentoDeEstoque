import { useState, useEffect } from 'react';
import { X, Package, Calendar, Hash, User, FileText, History } from 'lucide-react';
import type { Item, Movement } from '../types';
import { getMovementsByItem } from '../services/movements';

interface ItemDetailsProps {
  item: Item;
  onClose: () => void;
}

export function ItemDetails({ item, onClose }: ItemDetailsProps) {
  const [movements, setMovements] = useState<Movement[]>([]);

  useEffect(() => {
    loadMovements();
  }, [item.id]);

  const loadMovements = async () => {
    try {
      const itemMovements = await getMovementsByItem(item.id);
      setMovements(itemMovements);
    } catch {
      setMovements([]);
    }
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
      <span className={`px-2 py-1 rounded-full text-xs ${styles[status] || styles.DISPONIVEL}`}>
        {labels[status] || status}
      </span>
    );
  };

  const getMovementBadge = (type: string) => {
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Package className="w-6 h-6 text-primary" />
            <div>
              <h2>{item.nome}</h2>
              <p className="text-sm text-gray-600">{item.categoria}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Informações do Item */}
          <div>
            <h3 className="mb-4">Informações do Item</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Hash className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Número de Série</p>
                  <p className="text-sm">{item.numeroSerie}</p>
                </div>
              </div>

              {item.patrimonio && (
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Patrimônio</p>
                    <p className="text-sm">{item.patrimonio}</p>
                  </div>
                </div>
              )}

              {(item.marca || item.modelo) && (
                <div className="flex items-start gap-3">
                  <Package className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Marca/Modelo</p>
                    <p className="text-sm">
                      {[item.marca, item.modelo].filter(Boolean).join(' ')}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  {getStatusBadge(item.statusItem)}
                </div>
              </div>

              {item.usuarioAtualNome && (
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Responsável Atual</p>
                    <p className="text-sm">{item.usuarioAtualNome}</p>
                  </div>
                </div>
              )}

              {item.dataCompra && (
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Data de Compra</p>
                    <p className="text-sm">
                      {new Date(item.dataCompra).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {item.descricao && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Descrição</p>
                <p className="text-sm">{item.descricao}</p>
              </div>
            )}
          </div>

          {/* Histórico de Movimentações */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <History className="w-5 h-5 text-primary" />
              <h3>Histórico de Movimentações</h3>
            </div>

            {movements.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Nenhuma movimentação registrada
              </div>
            ) : (
              <div className="space-y-3">
                {movements.map((mov, index) => (
                  <div
                    key={mov.id}
                    className="relative pl-6 pb-3 border-l-2 border-gray-200 last:border-transparent"
                  >
                    <div className="absolute left-[-9px] top-0 w-4 h-4 bg-white border-2 border-primary rounded-full" />
                    
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        {getMovementBadge(mov.tipoMovimentacao)}
                        <span className="text-xs text-gray-500">
                          {new Date(mov.dataHora).toLocaleString('pt-BR')}
                        </span>
                      </div>

                      <div className="space-y-1 text-sm">
                        {mov.deUsuarioNome && (
                          <p className="text-gray-600">
                            De: <span className="text-gray-900">{mov.deUsuarioNome}</span>
                          </p>
                        )}
                        {mov.paraUsuarioNome && (
                          <p className="text-gray-600">
                            Para: <span className="text-gray-900">{mov.paraUsuarioNome}</span>
                          </p>
                        )}
                        <p className="text-gray-600">
                          Status: {getStatusBadge(mov.statusAnterior)} → {getStatusBadge(mov.statusNovo)}
                        </p>
                        {mov.observacao && (
                          <p className="text-gray-700 mt-2 italic">
                            "{mov.observacao}"
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
