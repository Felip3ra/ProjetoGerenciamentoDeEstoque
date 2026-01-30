import { ItemStatus, MovementType, UserRole, UserStatus } from '@/types';
import type { Item, Movement, User } from '@/types';

type ApiUser = {
  id?: number | string;
  name?: string;
  email?: string;
  department?: number | string;
  status?: number | string;
  hasAccess?: boolean;
  passwordHash?: string | null;
  profile?: string | null;
  createdAt?: string;
};

type ApiItem = {
  id?: number | string;
  category?: string;
  name?: string;
  brand?: string;
  model?: string;
  serialNumber?: string;
  patrimonyNumber?: string;
  description?: string;
  purchaseDate?: string;
  statusItem?: string;
  currentUserId?: number | string | null;
  createdAt?: string;
  updatedAt?: string;
  currentUser?: ApiUser | null;
};

type ApiMovement = {
  id?: number | string;
  itemId?: number | string;
  fromUserId?: number | string | null;
  toUserId?: number | string | null;
  movementType?: string;
  movementDateTime?: string;
  observation?: string | null;
  previousStatus?: string | null;
  newStatus?: string | null;
  createdAt?: string;
  item?: ApiItem | null;
  fromUser?: ApiUser | null;
  toUser?: ApiUser | null;
};

const departmentLabels: Record<number, string> = {
  1: 'Requisitos',
  2: 'Desenvolvimento',
  3: 'QA',
  4: 'Operacoes'
};

const departmentByLabel: Record<string, number> = {
  requisitos: 1,
  desenvolvimento: 2,
  qa: 3,
  operacoes: 4,
  operações: 4
};

function normalizeString(value?: string | null): string {
  return (value || '').trim();
}

export function mapDepartmentToLabel(dep?: number | string): string | undefined {
  if (dep === undefined || dep === null) return undefined;
  if (typeof dep === 'number') return departmentLabels[dep] || undefined;
  const normalized = dep.trim().toLowerCase();
  if (departmentByLabel[normalized]) return departmentLabels[departmentByLabel[normalized]];
  return dep;
}

export function mapLabelToDepartment(label?: string): number {
  if (!label) return 2;
  const normalized = label.trim().toLowerCase();
  return departmentByLabel[normalized] || 2;
}

export function mapUserRole(profile?: string | null): UserRole {
  const value = normalizeString(profile).toLowerCase();
  if (value === 'admin') return UserRole.ADMIN;
  if (value === 'operador') return UserRole.OPERADOR;
  if (value === 'leitor') return UserRole.LEITOR;
  return UserRole.LEITOR;
}

export function mapRoleToApi(profile: UserRole | string): string {
  const value = typeof profile === 'string' ? profile : profile.toString();
  if (value === UserRole.ADMIN || value.toLowerCase() === 'admin') return 'Admin';
  if (value === UserRole.OPERADOR || value.toLowerCase() === 'operador') return 'Operador';
  return 'Leitor';
}

export function mapUserStatus(status?: number | string): UserStatus {
  if (status === 1 || status === 'Active' || status === 'ACTIVE') return UserStatus.ATIVO;
  if (status === 2 || status === 'Inactive' || status === 'INACTIVE') return UserStatus.INATIVO;
  return UserStatus.ATIVO;
}

export function mapStatusToApi(status: UserStatus): number {
  return status === UserStatus.INATIVO ? 2 : 1;
}

export function mapUserFromApi(user: ApiUser): User {
  return {
    id: String(user.id ?? ''),
    nome: user.name || '',
    email: user.email || undefined,
    setor: mapDepartmentToLabel(user.department),
    status: mapUserStatus(user.status),
    perfil: mapUserRole(user.profile),
    createdAt: user.createdAt || new Date().toISOString()
  };
}

export function mapItemFromApi(item: ApiItem): Item {
  const currentUserName = item.currentUser?.name;
  return {
    id: String(item.id ?? ''),
    categoria: item.category || '',
    nome: item.name || '',
    marca: item.brand || undefined,
    modelo: item.model || undefined,
    numeroSerie: item.serialNumber || '',
    patrimonio: item.patrimonyNumber || undefined,
    descricao: item.description || undefined,
    dataCompra: item.purchaseDate || undefined,
    statusItem: (item.statusItem as ItemStatus) || ItemStatus.DISPONIVEL,
    usuarioAtualId: item.currentUserId !== null && item.currentUserId !== undefined ? String(item.currentUserId) : undefined,
    usuarioAtualNome: currentUserName || undefined,
    createdAt: item.createdAt || new Date().toISOString(),
    updatedAt: item.updatedAt || new Date().toISOString()
  };
}

export function mapMovementFromApi(movement: ApiMovement): Movement {
  const item = movement.item;
  const fromUser = movement.fromUser;
  const toUser = movement.toUser;

  return {
    id: String(movement.id ?? ''),
    itemId: String(movement.itemId ?? ''),
    itemNome: item?.name || undefined,
    itemNumeroSerie: item?.serialNumber || undefined,
    deUsuarioId: movement.fromUserId !== null && movement.fromUserId !== undefined ? String(movement.fromUserId) : undefined,
    deUsuarioNome: fromUser?.name || undefined,
    paraUsuarioId: movement.toUserId !== null && movement.toUserId !== undefined ? String(movement.toUserId) : undefined,
    paraUsuarioNome: toUser?.name || undefined,
    tipoMovimentacao: (movement.movementType as MovementType) || MovementType.ATRIBUICAO,
    statusAnterior: (movement.previousStatus as ItemStatus) || ItemStatus.DISPONIVEL,
    statusNovo: (movement.newStatus as ItemStatus) || ItemStatus.DISPONIVEL,
    dataHora: movement.movementDateTime || movement.createdAt || new Date().toISOString(),
    observacao: movement.observation || undefined,
    createdAt: movement.createdAt || new Date().toISOString()
  };
}

export function mapUserToApi(user: User, passwordHash?: string): ApiUser {
  return {
    id: Number(user.id),
    name: user.nome,
    email: user.email || undefined,
    department: mapLabelToDepartment(user.setor),
    status: mapStatusToApi(user.status),
    hasAccess: true,
    passwordHash: passwordHash,
    profile: mapRoleToApi(user.perfil),
    createdAt: user.createdAt
  };
}

export function mapItemToApi(item: Item): ApiItem {
  return {
    id: Number(item.id),
    category: item.categoria,
    name: item.nome,
    brand: item.marca || undefined,
    model: item.modelo || undefined,
    serialNumber: item.numeroSerie,
    patrimonyNumber: item.patrimonio || undefined,
    description: item.descricao || undefined,
    purchaseDate: item.dataCompra || undefined,
    statusItem: item.statusItem,
    currentUserId: item.usuarioAtualId ? Number(item.usuarioAtualId) : null,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt
  };
}

export type { ApiUser, ApiItem, ApiMovement };
