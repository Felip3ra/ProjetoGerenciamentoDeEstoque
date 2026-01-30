/**
 * AUTH SERVICE
 *
 * Integra autenticação com o backend.
 */

import type { LoginCredentials, AuthUser } from '../types';
import { UserRole } from '../types';
import { apiRequest } from '@/lib/api-client';
import { mapUserRole } from '@/lib/api-mappers';
import { setAuthUser, getAuthUser, clearAuth } from './storage';

export async function login(credentials: LoginCredentials): Promise<AuthUser | null> {
  const response = await apiRequest<{
    accessToken?: string;
    token?: string;
    tokenType?: string;
    expiresIn?: number;
  }>('/api/Auth/Login', {
    method: 'POST',
    body: {
      email: credentials.email,
      passwordHash: credentials.senha
    }
  });

  const token = response.accessToken || response.token;
  if (!token) {
    return null;
  }

  const users = await apiRequest<any[]>('/api/User/GetAllUsers');
  const matched = users.find((u) => (u.email || '').toLowerCase() === credentials.email.toLowerCase());

  const authUser: AuthUser = matched
    ? {
        id: String(matched.id ?? ''),
        nome: matched.name || matched.nome || credentials.email,
        email: matched.email || credentials.email,
        perfil: mapUserRole(matched.profile)
      }
    : {
        id: '',
        nome: credentials.email,
        email: credentials.email,
        perfil: UserRole.ADMIN
      };

  setAuthUser(authUser, token);
  return authUser;
}

export function logout() {
  clearAuth();
}

export function getCurrentUser(): AuthUser | null {
  const auth = getAuthUser();
  return auth?.user || null;
}

export function isAuthenticated(): boolean {
  return getCurrentUser() !== null;
}

export function hasPermission(requiredRole: UserRole): boolean {
  const user = getCurrentUser();
  if (!user) return false;

  const roleHierarchy: { [key in UserRole]: number } = {
    ADMIN: 3,
    OPERADOR: 2,
    LEITOR: 1
  };

  return roleHierarchy[user.perfil] >= roleHierarchy[requiredRole];
}

export function canEdit(): boolean {
  return hasPermission(UserRole.OPERADOR);
}

export function isAdmin(): boolean {
  return hasPermission(UserRole.ADMIN);
}

export const PERMISSIONS = {
  CREATE_USER: UserRole.ADMIN,
  EDIT_USER: UserRole.ADMIN,
  DELETE_USER: UserRole.ADMIN,
  VIEW_USERS: UserRole.LEITOR,
  CREATE_ITEM: UserRole.OPERADOR,
  EDIT_ITEM: UserRole.OPERADOR,
  DELETE_ITEM: UserRole.ADMIN,
  VIEW_ITEMS: UserRole.LEITOR,
  CREATE_MOVEMENT: UserRole.OPERADOR,
  VIEW_MOVEMENTS: UserRole.LEITOR,
  VIEW_REPORTS: UserRole.LEITOR
};
