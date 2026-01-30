/**
 * API SERVICE - Simulação de camada de serviços/API
 * Em produção, estas funções fariam chamadas HTTP para o backend
 */

import { ItemStatus, MovementType, UserStatus } from '@/types';
import type { User, Item, Movement, CreateUserDTO, UpdateUserDTO, CreateItemDTO, UpdateItemDTO, AssignItemDTO, ReturnItemDTO, TransferItemDTO, MaintenanceItemDTO, WriteOffItemDTO, ItemFilter, MovementFilter, InventoryStats } from '@/types';

import { mockUsers, mockItems, mockMovements, currentUser } from './mock-data';

// Simula delay de rede
const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms));

// ===== USER ENDPOINTS =====

export const userService = {
  async getAll(): Promise<User[]> {
    await delay();
    return [...mockUsers];
  },

  async getById(id: string): Promise<User | null> {
    await delay();
    return mockUsers.find(u => u.id === id) || null;
  },

  async create(dto: CreateUserDTO): Promise<User> {
    await delay();
    const newUser: User = {
      id: `user-${Date.now()}`,
      ...dto,
      status: UserStatus.ATIVO,
      createdAt: new Date()
    };
    mockUsers.push(newUser);
    return newUser;
  },

  async update(id: string, dto: UpdateUserDTO): Promise<User> {
    await delay();
    const index = mockUsers.findIndex(u => u.id === id);
    if (index === -1) throw new Error('Usuário não encontrado');
    
    mockUsers[index] = { ...mockUsers[index], ...dto };
    return mockUsers[index];
  },

  async delete(id: string): Promise<void> {
    await delay();
    const index = mockUsers.findIndex(u => u.id === id);
    if (index === -1) throw new Error('Usuário não encontrado');
    
    // Verificar se tem itens atribuídos
    const hasItems = mockItems.some(i => i.usuarioAtualId === id);
    if (hasItems) {
      throw new Error('Não é possível excluir usuário com itens atribuídos');
    }
    
    mockUsers.splice(index, 1);
  }
};

// ===== ITEM ENDPOINTS =====

export const itemService = {
  async getAll(filter?: ItemFilter): Promise<Item[]> {
    await delay();
    let items = [...mockItems];

    // Populate user references
    items = items.map(item => ({
      ...item,
      usuarioAtual: item.usuarioAtualId 
        ? mockUsers.find(u => u.id === item.usuarioAtualId) 
        : undefined
    }));

    if (!filter) return items;

    if (filter.status) {
      items = items.filter(i => i.status === filter.status);
    }

    if (filter.categoria) {
      items = items.filter(i => i.categoria === filter.categoria);
    }

    if (filter.usuarioAtualId) {
      items = items.filter(i => i.usuarioAtualId === filter.usuarioAtualId);
    }

    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      items = items.filter(i => 
        i.marca.toLowerCase().includes(searchLower) ||
        i.modelo.toLowerCase().includes(searchLower) ||
        i.numeroSerie.toLowerCase().includes(searchLower) ||
        i.nome.toLowerCase().includes(searchLower)
      );
    }

    return items;
  },

  async getById(id: string): Promise<Item | null> {
    await delay();
    const item = mockItems.find(i => i.id === id);
    if (!item) return null;

    return {
      ...item,
      usuarioAtual: item.usuarioAtualId 
        ? mockUsers.find(u => u.id === item.usuarioAtualId) 
        : undefined
    };
  },

  async getBySerialNumber(numeroSerie: string): Promise<Item | null> {
    await delay();
    const item = mockItems.find(i => i.numeroSerie === numeroSerie);
    if (!item) return null;

    return {
      ...item,
      usuarioAtual: item.usuarioAtualId 
        ? mockUsers.find(u => u.id === item.usuarioAtualId) 
        : undefined
    };
  },

  async create(dto: CreateItemDTO): Promise<Item> {
    await delay();
    
    // Validação: número de série único
    const exists = mockItems.some(i => i.numeroSerie === dto.numeroSerie);
    if (exists) {
      throw new Error('Já existe um item com este número de série');
    }

    const newItem: Item = {
      id: `item-${Date.now()}`,
      ...dto,
      dataCompra: dto.dataCompra ? new Date(dto.dataCompra) : undefined,
      status: ItemStatus.DISPONIVEL,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    mockItems.push(newItem);
    return newItem;
  },

  async update(id: string, dto: UpdateItemDTO): Promise<Item> {
    await delay();
    const index = mockItems.findIndex(i => i.id === id);
    if (index === -1) throw new Error('Item não encontrado');

    mockItems[index] = {
      ...mockItems[index],
      ...dto,
      dataCompra: dto.dataCompra ? new Date(dto.dataCompra) : mockItems[index].dataCompra,
      updatedAt: new Date()
    };

    return mockItems[index];
  },

  async delete(id: string): Promise<void> {
    await delay();
    const index = mockItems.findIndex(i => i.id === id);
    if (index === -1) throw new Error('Item não encontrado');

    mockItems.splice(index, 1);
  }
};

// ===== MOVEMENT ENDPOINTS =====

export const movementService = {
  async getAll(filter?: MovementFilter): Promise<Movement[]> {
    await delay();
    let movements = [...mockMovements];

    // Populate references
    movements = movements.map(mov => ({
      ...mov,
      item: mockItems.find(i => i.id === mov.itemId),
      deUsuario: mov.deUsuarioId ? mockUsers.find(u => u.id === mov.deUsuarioId) : undefined,
      paraUsuario: mov.paraUsuarioId ? mockUsers.find(u => u.id === mov.paraUsuarioId) : undefined,
      realizadoPor: mockUsers.find(u => u.id === mov.realizadoPorId)
    }));

    if (!filter) return movements.sort((a, b) => b.dataHora.getTime() - a.dataHora.getTime());

    if (filter.itemId) {
      movements = movements.filter(m => m.itemId === filter.itemId);
    }

    if (filter.usuarioId) {
      movements = movements.filter(m => 
        m.deUsuarioId === filter.usuarioId || m.paraUsuarioId === filter.usuarioId
      );
    }

    if (filter.tipoMovimentacao) {
      movements = movements.filter(m => m.tipoMovimentacao === filter.tipoMovimentacao);
    }

    if (filter.dataInicio) {
      movements = movements.filter(m => m.dataHora >= filter.dataInicio!);
    }

    if (filter.dataFim) {
      movements = movements.filter(m => m.dataHora <= filter.dataFim!);
    }

    return movements.sort((a, b) => b.dataHora.getTime() - a.dataHora.getTime());
  },

  async getByItemId(itemId: string): Promise<Movement[]> {
    return this.getAll({ itemId });
  },

  async assign(dto: AssignItemDTO): Promise<Movement> {
    await delay();
    
    const item = mockItems.find(i => i.id === dto.itemId);
    if (!item) throw new Error('Item não encontrado');
    
    if (item.status === ItemStatus.BAIXADO) {
      throw new Error('Não é possível atribuir item baixado/descartado');
    }

    const user = mockUsers.find(u => u.id === dto.paraUsuarioId);
    if (!user) throw new Error('Usuário não encontrado');

    // Atualizar item
    item.status = ItemStatus.EM_USO;
    item.usuarioAtualId = dto.paraUsuarioId;
    item.updatedAt = new Date();

    // Criar movimentação
    const movement: Movement = {
      id: `mov-${Date.now()}`,
      itemId: dto.itemId,
      paraUsuarioId: dto.paraUsuarioId,
      tipoMovimentacao: MovementType.ATRIBUICAO,
      dataHora: new Date(),
      observacao: dto.observacao,
      realizadoPorId: currentUser.id,
      item,
      paraUsuario: user,
      realizadoPor: currentUser
    };

    mockMovements.push(movement);
    return movement;
  },

  async return(dto: ReturnItemDTO): Promise<Movement> {
    await delay();
    
    const item = mockItems.find(i => i.id === dto.itemId);
    if (!item) throw new Error('Item não encontrado');
    
    if (!item.usuarioAtualId) {
      throw new Error('Item não está atribuído a ninguém');
    }

    const deUsuario = mockUsers.find(u => u.id === item.usuarioAtualId);

    // Atualizar item
    const oldUserId = item.usuarioAtualId;
    item.status = ItemStatus.DISPONIVEL;
    item.usuarioAtualId = undefined;
    item.updatedAt = new Date();

    // Criar movimentação
    const movement: Movement = {
      id: `mov-${Date.now()}`,
      itemId: dto.itemId,
      deUsuarioId: oldUserId,
      tipoMovimentacao: MovementType.DEVOLUCAO,
      dataHora: new Date(),
      observacao: dto.observacao,
      realizadoPorId: currentUser.id,
      item,
      deUsuario,
      realizadoPor: currentUser
    };

    mockMovements.push(movement);
    return movement;
  },

  async transfer(dto: TransferItemDTO): Promise<Movement> {
    await delay();
    
    const item = mockItems.find(i => i.id === dto.itemId);
    if (!item) throw new Error('Item não encontrado');
    
    if (!item.usuarioAtualId) {
      throw new Error('Item não está atribuído. Use ATRIBUIÇÃO ao invés de TRANSFERÊNCIA');
    }

    if (item.usuarioAtualId === dto.paraUsuarioId) {
      throw new Error('Item já está com este usuário');
    }

    const deUsuario = mockUsers.find(u => u.id === item.usuarioAtualId);
    const paraUsuario = mockUsers.find(u => u.id === dto.paraUsuarioId);
    if (!paraUsuario) throw new Error('Usuário destino não encontrado');

    // Atualizar item
    const oldUserId = item.usuarioAtualId;
    item.usuarioAtualId = dto.paraUsuarioId;
    item.updatedAt = new Date();

    // Criar movimentação
    const movement: Movement = {
      id: `mov-${Date.now()}`,
      itemId: dto.itemId,
      deUsuarioId: oldUserId,
      paraUsuarioId: dto.paraUsuarioId,
      tipoMovimentacao: MovementType.TROCA_RESPONSAVEL,
      dataHora: new Date(),
      observacao: dto.observacao,
      realizadoPorId: currentUser.id,
      item,
      deUsuario,
      paraUsuario,
      realizadoPor: currentUser
    };

    mockMovements.push(movement);
    return movement;
  },

  async maintenance(dto: MaintenanceItemDTO): Promise<Movement> {
    await delay();
    
    const item = mockItems.find(i => i.id === dto.itemId);
    if (!item) throw new Error('Item não encontrado');

    // Se estava com alguém, registrar de quem saiu
    const deUsuarioId = item.usuarioAtualId;
    const deUsuario = deUsuarioId ? mockUsers.find(u => u.id === deUsuarioId) : undefined;

    // Atualizar item
    item.status = ItemStatus.EM_MANUTENCAO;
    item.usuarioAtualId = undefined;
    item.updatedAt = new Date();

    // Criar movimentação
    const movement: Movement = {
      id: `mov-${Date.now()}`,
      itemId: dto.itemId,
      deUsuarioId,
      tipoMovimentacao: MovementType.MANUTENCAO,
      dataHora: new Date(),
      observacao: dto.observacao,
      realizadoPorId: currentUser.id,
      item,
      deUsuario,
      realizadoPor: currentUser
    };

    mockMovements.push(movement);
    return movement;
  },

  async writeOff(dto: WriteOffItemDTO): Promise<Movement> {
    await delay();
    
    const item = mockItems.find(i => i.id === dto.itemId);
    if (!item) throw new Error('Item não encontrado');

    // Se estava com alguém, registrar de quem saiu
    const deUsuarioId = item.usuarioAtualId;
    const deUsuario = deUsuarioId ? mockUsers.find(u => u.id === deUsuarioId) : undefined;

    // Atualizar item
    item.status = ItemStatus.BAIXADO;
    item.usuarioAtualId = undefined;
    item.updatedAt = new Date();

    // Criar movimentação
    const movement: Movement = {
      id: `mov-${Date.now()}`,
      itemId: dto.itemId,
      deUsuarioId,
      tipoMovimentacao: MovementType.BAIXA,
      dataHora: new Date(),
      observacao: dto.observacao,
      realizadoPorId: currentUser.id,
      item,
      deUsuario,
      realizadoPor: currentUser
    };

    mockMovements.push(movement);
    return movement;
  }
};

// ===== STATS & REPORTS =====

export const statsService = {
  async getInventoryStats(): Promise<InventoryStats> {
    await delay();
    
    return {
      totalItems: mockItems.length,
      disponiveis: mockItems.filter(i => i.status === ItemStatus.DISPONIVEL).length,
      emUso: mockItems.filter(i => i.status === ItemStatus.EM_USO).length,
      emManutencao: mockItems.filter(i => i.status === ItemStatus.EM_MANUTENCAO).length,
      baixados: mockItems.filter(i => i.status === ItemStatus.BAIXADO).length,
      totalUsers: mockUsers.length,
      usersAtivos: mockUsers.filter(u => u.status === UserStatus.ATIVO).length
    };
  },

  async getItemsByUser(): Promise<Map<string, Item[]>> {
    await delay();
    const map = new Map<string, Item[]>();
    
    mockItems.forEach(item => {
      if (item.usuarioAtualId) {
        if (!map.has(item.usuarioAtualId)) {
          map.set(item.usuarioAtualId, []);
        }
        map.get(item.usuarioAtualId)!.push({
          ...item,
          usuarioAtual: mockUsers.find(u => u.id === item.usuarioAtualId)
        });
      }
    });

    return map;
  },

  async getCategories(): Promise<string[]> {
    await delay();
    const categories = new Set(mockItems.map(i => i.categoria));
    return Array.from(categories).sort();
  }
};
