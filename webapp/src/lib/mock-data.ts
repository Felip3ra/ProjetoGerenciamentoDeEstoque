import { UserStatus, UserRole, ItemStatus, MovementType } from '@/types';
import type { User, Item, Movement } from '@/types';

// ===== MOCK USERS =====
export const mockUsers: User[] = [
  {
    id: '1',
    nome: 'Letícia Silva',
    email: 'leticia@empresa.com',
    setor: 'TI',
    status: UserStatus.ATIVO,
    role: UserRole.ADMIN,
    createdAt: new Date('2024-01-15')
  },
  {
    id: '2',
    nome: 'Carlos Oliveira',
    email: 'carlos@empresa.com',
    setor: 'Desenvolvimento',
    status: UserStatus.ATIVO,
    role: UserRole.OPERADOR,
    createdAt: new Date('2024-01-20')
  },
  {
    id: '3',
    nome: 'Ana Santos',
    email: 'ana@empresa.com',
    setor: 'Design',
    status: UserStatus.ATIVO,
    role: UserRole.OPERADOR,
    createdAt: new Date('2024-02-01')
  },
  {
    id: '4',
    nome: 'Pedro Costa',
    email: 'pedro@empresa.com',
    setor: 'Marketing',
    status: UserStatus.ATIVO,
    role: UserRole.LEITOR,
    createdAt: new Date('2024-02-10')
  },
  {
    id: '5',
    nome: 'Mariana Alves',
    email: 'mariana@empresa.com',
    setor: 'RH',
    status: UserStatus.INATIVO,
    role: UserRole.LEITOR,
    createdAt: new Date('2024-01-05')
  }
];

// ===== MOCK ITEMS =====
export const mockItems: Item[] = [
  {
    id: 'item-1',
    categoria: 'Notebook',
    nome: 'MacBook Pro 14"',
    marca: 'Apple',
    modelo: 'M3 Pro',
    numeroSerie: '0000001',
    patrimonio: 'PAT-2024-001',
    descricao: 'MacBook Pro 14" com 16GB RAM',
    dataCompra: new Date('2024-01-10'),
    status: ItemStatus.EM_USO,
    usuarioAtualId: '1',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'item-2',
    categoria: 'Notebook',
    nome: 'Dell Latitude',
    marca: 'Dell',
    modelo: 'Latitude 5430',
    numeroSerie: '0000002',
    patrimonio: 'PAT-2024-002',
    descricao: 'Dell Latitude i7 16GB',
    dataCompra: new Date('2024-01-12'),
    status: ItemStatus.EM_USO,
    usuarioAtualId: '2',
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: 'item-3',
    categoria: 'Monitor',
    nome: 'Monitor LG UltraWide',
    marca: 'LG',
    modelo: '34WN80C',
    numeroSerie: '0000003',
    patrimonio: 'PAT-2024-003',
    descricao: 'Monitor 34" UltraWide',
    dataCompra: new Date('2024-02-01'),
    status: ItemStatus.EM_USO,
    usuarioAtualId: '3',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-05')
  },
  {
    id: 'item-4',
    categoria: 'Mouse',
    nome: 'Logitech MX Master 3',
    marca: 'Logitech',
    modelo: 'MX Master 3',
    numeroSerie: '0000004',
    descricao: 'Mouse sem fio',
    dataCompra: new Date('2024-02-05'),
    status: ItemStatus.DISPONIVEL,
    createdAt: new Date('2024-02-05'),
    updatedAt: new Date('2024-02-05')
  },
  {
    id: 'item-5',
    categoria: 'Teclado',
    nome: 'Keychron K8',
    marca: 'Keychron',
    modelo: 'K8 Pro',
    numeroSerie: '0000005',
    patrimonio: 'PAT-2024-005',
    descricao: 'Teclado mecânico wireless',
    dataCompra: new Date('2024-02-10'),
    status: ItemStatus.DISPONIVEL,
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-02-10')
  },
  {
    id: 'item-6',
    categoria: 'Notebook',
    nome: 'Lenovo ThinkPad',
    marca: 'Lenovo',
    modelo: 'T14 Gen 3',
    numeroSerie: '0000006',
    patrimonio: 'PAT-2024-006',
    descricao: 'ThinkPad i5 8GB',
    dataCompra: new Date('2024-01-20'),
    status: ItemStatus.EM_MANUTENCAO,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2025-01-05')
  },
  {
    id: 'item-7',
    categoria: 'Monitor',
    nome: 'Dell UltraSharp',
    marca: 'Dell',
    modelo: 'U2720Q',
    numeroSerie: '0000007',
    patrimonio: 'PAT-2024-007',
    descricao: 'Monitor 27" 4K',
    dataCompra: new Date('2024-01-25'),
    status: ItemStatus.BAIXADO,
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2025-01-03')
  },
  {
    id: 'item-8',
    categoria: 'Webcam',
    nome: 'Logitech Brio',
    marca: 'Logitech',
    modelo: 'Brio 4K',
    numeroSerie: '0000008',
    descricao: 'Webcam 4K',
    dataCompra: new Date('2024-03-01'),
    status: ItemStatus.DISPONIVEL,
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-01')
  }
];

// Populate user references in items
mockItems.forEach(item => {
  if (item.usuarioAtualId) {
    item.usuarioAtual = mockUsers.find(u => u.id === item.usuarioAtualId);
  }
});

// ===== MOCK MOVEMENTS =====
export const mockMovements: Movement[] = [
  {
    id: 'mov-1',
    itemId: 'item-1',
    paraUsuarioId: '1',
    tipoMovimentacao: MovementType.ATRIBUICAO,
    dataHora: new Date('2024-01-15T10:30:00'),
    observacao: 'Atribuição inicial',
    realizadoPorId: '1'
  },
  {
    id: 'mov-2',
    itemId: 'item-2',
    paraUsuarioId: '2',
    tipoMovimentacao: MovementType.ATRIBUICAO,
    dataHora: new Date('2024-01-20T14:15:00'),
    observacao: 'Novo colaborador',
    realizadoPorId: '1'
  },
  {
    id: 'mov-3',
    itemId: 'item-3',
    paraUsuarioId: '3',
    tipoMovimentacao: MovementType.ATRIBUICAO,
    dataHora: new Date('2024-02-05T09:00:00'),
    observacao: 'Monitor para designer',
    realizadoPorId: '1'
  },
  {
    id: 'mov-4',
    itemId: 'item-6',
    paraUsuarioId: '4',
    tipoMovimentacao: MovementType.ATRIBUICAO,
    dataHora: new Date('2024-02-15T11:00:00'),
    observacao: 'Notebook temporário',
    realizadoPorId: '1'
  },
  {
    id: 'mov-5',
    itemId: 'item-6',
    deUsuarioId: '4',
    tipoMovimentacao: MovementType.DEVOLUCAO,
    dataHora: new Date('2024-12-20T16:00:00'),
    observacao: 'Devolução para manutenção',
    realizadoPorId: '2'
  },
  {
    id: 'mov-6',
    itemId: 'item-6',
    tipoMovimentacao: MovementType.MANUTENCAO,
    dataHora: new Date('2025-01-05T10:00:00'),
    observacao: 'Troca de bateria e limpeza',
    realizadoPorId: '1'
  },
  {
    id: 'mov-7',
    itemId: 'item-7',
    tipoMovimentacao: MovementType.BAIXA,
    dataHora: new Date('2025-01-03T14:30:00'),
    observacao: 'Monitor com defeito irreparável',
    realizadoPorId: '1'
  }
];

// Populate references in movements
mockMovements.forEach(mov => {
  mov.item = mockItems.find(i => i.id === mov.itemId);
  if (mov.deUsuarioId) {
    mov.deUsuario = mockUsers.find(u => u.id === mov.deUsuarioId);
  }
  if (mov.paraUsuarioId) {
    mov.paraUsuario = mockUsers.find(u => u.id === mov.paraUsuarioId);
  }
  mov.realizadoPor = mockUsers.find(u => u.id === mov.realizadoPorId);
});

// ===== CURRENT USER (SIMULATED AUTH) =====
export const currentUser: User = mockUsers[0]; // Letícia (Admin)
