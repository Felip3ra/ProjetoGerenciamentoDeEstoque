/**
 * CAMADA DE PERSISTÊNCIA - STORAGE SERVICE
 * 
 * Simula um banco de dados usando localStorage.
 * Em produção, seria substituído por chamadas à API REST/Supabase.
 */

import type { User, Item, Movement, AuthUser } from '../types';

const STORAGE_KEYS = {
  USERS: 'inventory_users',
  ITEMS: 'inventory_items',
  MOVEMENTS: 'inventory_movements',
  AUTH_USER: 'inventory_auth_user',
  AUTH_TOKEN: 'inventory_auth_token'
};

// Inicializa storage com dados de exemplo
export function initializeStorage() {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    const defaultUsers: User[] = [
      {
        id: '1',
        nome: 'Admin Sistema',
        email: 'admin@sistema.com',
        setor: 'TI',
        status: 'ATIVO',
        perfil: 'ADMIN',
        senha: 'admin123', // Em produção, seria hash
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        nome: 'Letícia Silva',
        email: 'leticia@empresa.com',
        setor: 'Design',
        status: 'ATIVO',
        perfil: 'OPERADOR',
        senha: 'leticia123',
        createdAt: new Date().toISOString()
      },
      {
        id: '3',
        nome: 'João Santos',
        email: 'joao@empresa.com',
        setor: 'Desenvolvimento',
        status: 'ATIVO',
        perfil: 'LEITOR',
        senha: 'joao123',
        createdAt: new Date().toISOString()
      }
    ];
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(defaultUsers));
  }

  if (!localStorage.getItem(STORAGE_KEYS.ITEMS)) {
    const defaultItems: Item[] = [
      {
        id: '1',
        categoria: 'Notebook',
        nome: 'MacBook Pro 16"',
        marca: 'Apple',
        modelo: 'M1 Pro',
        numeroSerie: '0000001',
        patrimonio: 'PAT-001',
        descricao: 'Notebook para design e desenvolvimento',
        dataCompra: '2024-01-15',
        statusItem: 'EM_USO',
        usuarioAtualId: '2',
        usuarioAtualNome: 'Letícia Silva',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '2',
        categoria: 'Monitor',
        nome: 'Dell UltraSharp 27"',
        marca: 'Dell',
        modelo: 'U2723DE',
        numeroSerie: '0000002',
        patrimonio: 'PAT-002',
        statusItem: 'DISPONIVEL',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '3',
        categoria: 'Mouse',
        nome: 'Logitech MX Master 3',
        marca: 'Logitech',
        modelo: 'MX Master 3',
        numeroSerie: '0000003',
        statusItem: 'EM_USO',
        usuarioAtualId: '2',
        usuarioAtualNome: 'Letícia Silva',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(defaultItems));
  }

  if (!localStorage.getItem(STORAGE_KEYS.MOVEMENTS)) {
    const defaultMovements: Movement[] = [
      {
        id: '1',
        itemId: '1',
        itemNome: 'MacBook Pro 16"',
        itemNumeroSerie: '0000001',
        paraUsuarioId: '2',
        paraUsuarioNome: 'Letícia Silva',
        tipoMovimentacao: 'ATRIBUICAO',
        statusAnterior: 'DISPONIVEL',
        statusNovo: 'EM_USO',
        dataHora: new Date().toISOString(),
        observacao: 'Atribuição inicial',
        createdAt: new Date().toISOString()
      }
    ];
    localStorage.setItem(STORAGE_KEYS.MOVEMENTS, JSON.stringify(defaultMovements));
  }
}

// Generic CRUD operations
export function getAll<T>(key: string): T[] {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}

export function getById<T extends { id: string }>(key: string, id: string): T | null {
  const items = getAll<T>(key);
  return items.find(item => item.id === id) || null;
}

export function create<T extends { id: string }>(key: string, item: T): T {
  const items = getAll<T>(key);
  items.push(item);
  localStorage.setItem(key, JSON.stringify(items));
  return item;
}

export function update<T extends { id: string }>(key: string, id: string, updates: Partial<T>): T | null {
  const items = getAll<T>(key);
  const index = items.findIndex(item => item.id === id);
  
  if (index === -1) return null;
  
  items[index] = { ...items[index], ...updates };
  localStorage.setItem(key, JSON.stringify(items));
  return items[index];
}

export function remove<T extends { id: string }>(key: string, id: string): boolean {
  const items = getAll<T>(key);
  const filtered = items.filter(item => item.id !== id);
  
  if (filtered.length === items.length) return false;
  
  localStorage.setItem(key, JSON.stringify(filtered));
  return true;
}

// Auth specific
export function setAuthUser(user: AuthUser, token: string) {
  localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(user));
  localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
}

export function getAuthUser(): { user: AuthUser; token: string } | null {
  const user = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  
  if (!user || !token) return null;
  
  return { user: JSON.parse(user), token };
}

export function clearAuth() {
  localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
  localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
}

// Exportar keys para uso nos services
export { STORAGE_KEYS };
