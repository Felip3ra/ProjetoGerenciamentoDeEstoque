/**
 * REPORTS SERVICE
 *
 * Gera relatórios no cliente usando dados do backend.
 */

import { ItemStatus } from '../types';
import type { InventoryReport } from '../types';
import { getAllItems } from './items';
import { getAllUsers } from './users';

export async function getInventoryReport(): Promise<InventoryReport> {
  const items = await getAllItems();
  const users = await getAllUsers();

  const report: InventoryReport = {
    totalItens: items.length,
    disponiveis: items.filter((i) => i.statusItem === ItemStatus.DISPONIVEL).length,
    emUso: items.filter((i) => i.statusItem === ItemStatus.EM_USO).length,
    emManutencao: items.filter((i) => i.statusItem === ItemStatus.EM_MANUTENCAO).length,
    baixados: items.filter((i) => i.statusItem === ItemStatus.BAIXADO).length,
    itensPorCategoria: {},
    itensPorUsuario: []
  };

  items.forEach((item) => {
    if (!report.itensPorCategoria[item.categoria]) {
      report.itensPorCategoria[item.categoria] = 0;
    }
    report.itensPorCategoria[item.categoria]++;
  });

  const itemsByUser = new Map<string, { nome: string; count: number }>();

  items
    .filter((i) => i.usuarioAtualId && i.statusItem === ItemStatus.EM_USO)
    .forEach((item) => {
      const userId = item.usuarioAtualId!;
      const existing = itemsByUser.get(userId);

      if (existing) {
        existing.count++;
      } else {
        const user = users.find((u) => u.id === userId);
        if (user) {
          itemsByUser.set(userId, { nome: user.nome, count: 1 });
        }
      }
    });

  report.itensPorUsuario = Array.from(itemsByUser.entries())
    .map(([userId, data]) => ({
      usuarioId: userId,
      usuarioNome: data.nome,
      quantidade: data.count
    }))
    .sort((a, b) => b.quantidade - a.quantidade);

  return report;
}

export async function getDashboardStats() {
  const report = await getInventoryReport();

  return {
    totalItens: report.totalItens,
    disponiveis: report.disponiveis,
    emUso: report.emUso,
    emManutencao: report.emManutencao,
    baixados: report.baixados,
    utilizacao: report.totalItens > 0 ? Math.round((report.emUso / (report.totalItens - report.baixados)) * 100) : 0
  };
}
