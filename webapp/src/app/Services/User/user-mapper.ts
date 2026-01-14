import { Injectable } from '@angular/core';
import { Department } from '../../interfaces/department';
import { Status } from '../../interfaces/status';
import { User } from '../../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class UserMapper {

  // No arquivo user-mapper.ts

private readonly departmentLabels: Record<string, string> = {
  '1': 'Requisitos',
  '2': 'Desenvolvimento',
  '3': 'QA',
  '4': 'Operações',
  Requirements: 'Requisitos',
  Development: 'Desenvolvimento',
  QA: 'QA',
  Operations: 'Operações',
};

departmentLabel(value: any): string {
  // Se o valor for nulo ou indefinido
  if (value === null || value === undefined) return '-';

  // Converte para string e limpa espacos (ex: 4 vira "4")
  let key = String(value).trim();
  const numericKey = Number(key);
  if (!Number.isNaN(numericKey)) {
    key = String(numericKey);
  }

  // Busca no dicionário. Se não achar (ex: se vier "Operations"), 
  // ele retorna o próprio valor original.
  return this.departmentLabels[key] ?? key;
}


  private readonly statusLabels: Record<string, string> = {
    '1': 'Active',
    '2': 'Inactive',
  };

  

  departmentClass(value: any): string {
  const label = this.departmentLabel(value);
  switch (label) {
    case 'Development': return 'badge-blue';
    case 'QA': return 'badge-green';
    case 'Operations': return 'badge-gray';
    case 'Requirements': return 'badge-purple';
    default: return 'badge-gray';
  }
}

  accessLabel(value: User['hasAccess']): string {
    if (typeof value === 'boolean') {
      return value ? 'Com acesso' : 'Sem acesso';
    }
    return String(value ?? '-');
  }

  statusLabel(value: User['status']): string {
    if (typeof value === 'string') {
      const trimmed = value.trim();
      const numericValue = Number(trimmed);
      if (!Number.isNaN(numericValue)) {
        return this.statusLabels[String(numericValue)] ?? trimmed;
      }
      return trimmed || '-';
    }
    if (typeof value === 'number') {
      return this.statusLabels[String(value)] ?? String(value);
    }
    return value || '-';
  }

  isActiveStatus(value: User['status']): boolean {
    if (typeof value === 'number') {
      return value === 1;
    }
    return value === Status.Active;
  }

  fromApiDepartment(value: User['department']): Department {
    if (typeof value === 'string' && value.trim() !== '' && !Number.isNaN(Number(value))) {
      value = Number(value);
    }
    if (typeof value === 'number') {
      return value === 2
        ? Department.Development
        : value === 3
          ? Department.QA
          : value === 4
            ? Department.Operations
            : Department.Requirements;
    }
    return value as Department;
  }

  toApiDepartment(value: Department | number): number {
    if (typeof value === 'string' && value.trim() !== '' && !Number.isNaN(Number(value))) {
      return Number(value);
    }
    if (typeof value === 'number') {
      return value;
    }
    return value === Department.Development
      ? 2
      : value === Department.QA
        ? 3
        : value === Department.Operations
          ? 4
          : 1;
  }

  fromApiStatus(value: User['status']): Status {
    if (typeof value === 'number') {
      return value === 2 ? Status.Inactive : Status.Active;
    }
    return value as Status;
  }

  toApiStatus(value: Status | number): number {
    if (typeof value === 'number') {
      return value;
    }
    return value === Status.Inactive ? 2 : 1;
  }
}
