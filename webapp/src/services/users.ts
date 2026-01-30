/**
 * USER SERVICE
 *
 * Integra usuários com o backend.
 */

import type { CreateUserDTO, UpdateUserDTO, User } from '../types';
import { UserStatus } from '../types';
import { apiRequest } from '@/lib/api-client';
import { mapUserFromApi, mapUserToApi, mapLabelToDepartment, mapRoleToApi, mapStatusToApi } from '@/lib/api-mappers';

export async function getAllUsers(): Promise<User[]> {
  const users = await apiRequest<any[]>('/api/User/GetAllUsers');
  return users.map(mapUserFromApi);
}

export async function getUserById(id: string): Promise<User | null> {
  try {
    const user = await apiRequest<any>(`/api/User/GetUserById/${id}`);
    return user ? mapUserFromApi(user) : null;
  } catch {
    return null;
  }
}

export async function createUser(data: CreateUserDTO): Promise<User> {
  if (!data.nome || !data.senha) {
    throw new Error('Nome e senha são obrigatórios');
  }

  await apiRequest<string>('/api/User/AddUser', {
    method: 'POST',
    body: {
      id: 0,
      name: data.nome,
      email: data.email,
      department: mapLabelToDepartment(data.setor),
      status: mapStatusToApi(UserStatus.ATIVO),
      hasAccess: true,
      passwordHash: data.senha,
      profile: mapRoleToApi(data.perfil),
      createdAt: new Date().toISOString()
    }
  });

  const users = await getAllUsers();
  const created = users.find((u) => u.email === data.email);
  if (!created) {
    throw new Error('Usuário criado, mas não localizado no retorno.');
  }
  return created;
}

export async function updateUser(data: UpdateUserDTO): Promise<User | null> {
  const existing = await getUserById(data.id);
  if (!existing) {
    throw new Error('Usuário não encontrado');
  }

  const updated: User = {
    ...existing,
    nome: data.nome ?? existing.nome,
    email: data.email ?? existing.email,
    setor: data.setor ?? existing.setor,
    status: data.status ?? existing.status,
    perfil: data.perfil ?? existing.perfil
  };

  const passwordHash = data.senha?.trim();
  await apiRequest<string>('/api/User/UpdateUser', {
    method: 'PUT',
    body: mapUserToApi(updated, passwordHash || undefined)
  });

  return await getUserById(data.id);
}

export async function deleteUser(_id: string): Promise<never> {
  throw new Error('Exclusão de usuário não está disponível no backend.');
}

export async function getActiveUsers(): Promise<User[]> {
  const users = await getAllUsers();
  return users.filter((u) => u.status === UserStatus.ATIVO);
}

export async function searchUsers(query: string): Promise<User[]> {
  const users = await getAllUsers();
  const lowerQuery = query.toLowerCase();
  return users.filter(
    (u) =>
      u.nome.toLowerCase().includes(lowerQuery) ||
      (u.email && u.email.toLowerCase().includes(lowerQuery))
  );
}
