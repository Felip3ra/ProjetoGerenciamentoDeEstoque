/**
 * MOVEMENT SERVICE
 *
 * Integra movimentações com o backend.
 */

import type {
  AssignItemDTO,
  DiscardItemDTO,
  Movement,
  MovementFilter,
  ReturnItemDTO,
  SetMaintenanceDTO,
  TransferItemDTO
} from '../types';
import { ItemStatus, MovementType } from '../types';
import { apiRequest } from '@/lib/api-client';
import { mapMovementFromApi } from '@/lib/api-mappers';
import { getAllItems, getItemById } from './items';
import { getAllUsers } from './users';

async function addMovement(payload: {
  itemId: number;
  movementType: MovementType;
  fromUserId?: number | null;
  toUserId?: number | null;
  newStatus: ItemStatus;
  observation?: string;
}): Promise<void> {
  await apiRequest<string>('/api/Movement/AddMovement', {
    method: 'POST',
    body: {
      itemId: payload.itemId,
      fromUserId: payload.fromUserId ?? null,
      toUserId: payload.toUserId ?? null,
      movementType: payload.movementType,
      movementDateTime: new Date().toISOString(),
      observation: payload.observation,
      newStatus: payload.newStatus,
      createdAt: new Date().toISOString()
    }
  });
}

export async function assignItem(data: AssignItemDTO): Promise<Movement> {
  const item = await getItemById(data.itemId);
  if (!item) throw new Error('Item não encontrado');

  if (item.statusItem === ItemStatus.BAIXADO) {
    throw new Error('Não é possível atribuir item baixado/descartado');
  }

  await addMovement({
    itemId: Number(item.id),
    movementType: MovementType.ATRIBUICAO,
    fromUserId: null,
    toUserId: Number(data.paraUsuarioId),
    newStatus: ItemStatus.EM_USO,
    observation: data.observacao
  });

  const movements = await getAllMovements();
  const movement = movements.find((m) => m.itemId === item.id && m.tipoMovimentacao === MovementType.ATRIBUICAO);
  if (!movement) throw new Error('Movimentação não encontrada após atribuição');
  return movement;
}

export async function returnItem(data: ReturnItemDTO): Promise<Movement> {
  const item = await getItemById(data.itemId);
  if (!item) throw new Error('Item não encontrado');

  await addMovement({
    itemId: Number(item.id),
    movementType: MovementType.DEVOLUCAO,
    fromUserId: item.usuarioAtualId ? Number(item.usuarioAtualId) : null,
    toUserId: null,
    newStatus: ItemStatus.DISPONIVEL,
    observation: data.observacao
  });

  const movements = await getAllMovements();
  const movement = movements.find((m) => m.itemId === item.id && m.tipoMovimentacao === MovementType.DEVOLUCAO);
  if (!movement) throw new Error('Movimentação não encontrada após devolução');
  return movement;
}

export async function transferItem(data: TransferItemDTO): Promise<Movement> {
  const item = await getItemById(data.itemId);
  if (!item) throw new Error('Item não encontrado');

  await addMovement({
    itemId: Number(item.id),
    movementType: MovementType.TROCA_RESPONSAVEL,
    fromUserId: item.usuarioAtualId ? Number(item.usuarioAtualId) : null,
    toUserId: Number(data.paraUsuarioId),
    newStatus: ItemStatus.EM_USO,
    observation: data.observacao
  });

  const movements = await getAllMovements();
  const movement = movements.find((m) => m.itemId === item.id && m.tipoMovimentacao === MovementType.TROCA_RESPONSAVEL);
  if (!movement) throw new Error('Movimentação não encontrada após transferência');
  return movement;
}

export async function setMaintenance(data: SetMaintenanceDTO): Promise<Movement> {
  const item = await getItemById(data.itemId);
  if (!item) throw new Error('Item não encontrado');

  await addMovement({
    itemId: Number(item.id),
    movementType: MovementType.MANUTENCAO,
    fromUserId: item.usuarioAtualId ? Number(item.usuarioAtualId) : null,
    toUserId: null,
    newStatus: ItemStatus.EM_MANUTENCAO,
    observation: data.observacao
  });

  const movements = await getAllMovements();
  const movement = movements.find((m) => m.itemId === item.id && m.tipoMovimentacao === MovementType.MANUTENCAO);
  if (!movement) throw new Error('Movimentação não encontrada após manutenção');
  return movement;
}

export async function discardItem(data: DiscardItemDTO): Promise<Movement> {
  const item = await getItemById(data.itemId);
  if (!item) throw new Error('Item não encontrado');

  await addMovement({
    itemId: Number(item.id),
    movementType: MovementType.BAIXA,
    fromUserId: item.usuarioAtualId ? Number(item.usuarioAtualId) : null,
    toUserId: null,
    newStatus: ItemStatus.BAIXADO,
    observation: data.observacao
  });

  const movements = await getAllMovements();
  const movement = movements.find((m) => m.itemId === item.id && m.tipoMovimentacao === MovementType.BAIXA);
  if (!movement) throw new Error('Movimentação não encontrada após baixa');
  return movement;
}

export async function getAllMovements(): Promise<Movement[]> {
  const [movements, items, users] = await Promise.all([
    apiRequest<any[]>('/api/Movement/GetAllMovements'),
    getAllItems(),
    getAllUsers()
  ]);

  const itemsById = new Map(items.map((item) => [item.id, item]));
  const usersById = new Map(users.map((user) => [user.id, user]));

  return movements
    .map((movement) => {
      const mapped = mapMovementFromApi(movement);
      const item = itemsById.get(mapped.itemId);
      const fromUser = mapped.deUsuarioId ? usersById.get(mapped.deUsuarioId) : undefined;
      const toUser = mapped.paraUsuarioId ? usersById.get(mapped.paraUsuarioId) : undefined;

      return {
        ...mapped,
        itemNome: mapped.itemNome ?? item?.nome,
        itemNumeroSerie: mapped.itemNumeroSerie ?? item?.numeroSerie,
        deUsuarioNome: mapped.deUsuarioNome ?? fromUser?.nome,
        paraUsuarioNome: mapped.paraUsuarioNome ?? toUser?.nome
      };
    })
    .sort((a, b) => new Date(b.dataHora).getTime() - new Date(a.dataHora).getTime());
}

export async function getMovementsByItem(itemId: string): Promise<Movement[]> {
  const movements = await getAllMovements();
  return movements.filter((m) => m.itemId === itemId);
}

export async function getMovementsByUser(userId: string): Promise<Movement[]> {
  const movements = await getAllMovements();
  return movements.filter((m) => m.deUsuarioId === userId || m.paraUsuarioId === userId);
}

export async function filterMovements(filter: MovementFilter): Promise<Movement[]> {
  let movements = await getAllMovements();

  if (filter.itemId) {
    movements = movements.filter((m) => m.itemId === filter.itemId);
  }

  if (filter.usuarioId) {
    movements = movements.filter((m) => m.deUsuarioId === filter.usuarioId || m.paraUsuarioId === filter.usuarioId);
  }

  if (filter.tipoMovimentacao) {
    movements = movements.filter((m) => m.tipoMovimentacao === filter.tipoMovimentacao);
  }

  if (filter.dataInicio) {
    movements = movements.filter((m) => m.dataHora >= filter.dataInicio!);
  }

  if (filter.dataFim) {
    movements = movements.filter((m) => m.dataHora <= filter.dataFim!);
  }

  return movements;
}
