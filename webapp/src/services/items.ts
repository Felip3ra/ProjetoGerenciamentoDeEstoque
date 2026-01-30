/**
 * ITEM SERVICE
 *
 * Integra itens com o backend.
 */

import type { CreateItemDTO, Item, ItemFilter, UpdateItemDTO } from '../types';
import { ItemStatus } from '../types';
import { apiRequest } from '@/lib/api-client';
import { mapItemFromApi, mapItemToApi } from '@/lib/api-mappers';
import { getAllUsers } from './users';

export async function getAllItems(): Promise<Item[]> {
  const [items, users] = await Promise.all([
    apiRequest<any[]>('/api/Item/GetAllItems'),
    getAllUsers()
  ]);
  const usersById = new Map(users.map((user) => [user.id, user]));

  return items.map((item) => {
    const mapped = mapItemFromApi(item);
    if (!mapped.usuarioAtualNome && mapped.usuarioAtualId) {
      const user = usersById.get(mapped.usuarioAtualId);
      if (user) {
        mapped.usuarioAtualNome = user.nome;
      }
    }
    return mapped;
  });
}

export async function getItemById(id: string): Promise<Item | null> {
  try {
    const item = await apiRequest<any>(`/api/Item/GetItemById/${id}`);
    return item ? mapItemFromApi(item) : null;
  } catch {
    return null;
  }
}

export async function createItem(data: CreateItemDTO): Promise<Item> {
  if (!data.numeroSerie) {
    throw new Error('Número de série é obrigatório');
  }

  const payload: Item = {
    id: '0',
    categoria: data.categoria,
    nome: data.nome,
    marca: data.marca,
    modelo: data.modelo,
    numeroSerie: data.numeroSerie,
    patrimonio: data.patrimonio,
    descricao: data.descricao,
    dataCompra: data.dataCompra,
    statusItem: ItemStatus.DISPONIVEL,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  await apiRequest<string>('/api/Item/AddItem', {
    method: 'POST',
    body: mapItemToApi(payload)
  });

  const items = await getAllItems();
  const created = items.find((item) => item.numeroSerie === data.numeroSerie);
  if (!created) {
    throw new Error('Item criado, mas não localizado no retorno.');
  }
  return created;
}

export async function updateItem(data: UpdateItemDTO): Promise<Item | null> {
  const existing = await getItemById(data.id);
  if (!existing) {
    throw new Error('Item não encontrado');
  }

  const updated: Item = {
    ...existing,
    categoria: data.categoria ?? existing.categoria,
    nome: data.nome ?? existing.nome,
    marca: data.marca ?? existing.marca,
    modelo: data.modelo ?? existing.modelo,
    patrimonio: data.patrimonio ?? existing.patrimonio,
    descricao: data.descricao ?? existing.descricao,
    dataCompra: data.dataCompra ?? existing.dataCompra,
    updatedAt: new Date().toISOString()
  };

  await apiRequest<string>('/api/Item/UpdateItem', {
    method: 'PUT',
    body: mapItemToApi(updated)
  });

  return await getItemById(data.id);
}

export async function deleteItem(_id: string): Promise<never> {
  throw new Error('Exclusão de item não está disponível no backend.');
}

export async function getItemsByUser(userId: string): Promise<Item[]> {
  const items = await getAllItems();
  return items.filter((item) => item.usuarioAtualId === userId);
}

export async function filterItems(filter: ItemFilter): Promise<Item[]> {
  let items = await getAllItems();

  if (filter.status) {
    items = items.filter((i) => i.statusItem === filter.status);
  }

  if (filter.categoria) {
    items = items.filter((i) => i.categoria === filter.categoria);
  }

  if (filter.usuarioId) {
    items = items.filter((i) => i.usuarioAtualId === filter.usuarioId);
  }

  if (filter.searchText) {
    const query = filter.searchText.toLowerCase();
    items = items.filter(
      (i) =>
        i.nome.toLowerCase().includes(query) ||
        i.numeroSerie.toLowerCase().includes(query) ||
        (i.marca && i.marca.toLowerCase().includes(query)) ||
        (i.modelo && i.modelo.toLowerCase().includes(query))
    );
  }

  return items;
}

export async function getCategories(): Promise<string[]> {
  const items = await getAllItems();
  const categories = new Set(items.map((i) => i.categoria));
  return Array.from(categories).sort();
}
