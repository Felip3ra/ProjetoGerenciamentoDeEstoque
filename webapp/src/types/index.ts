/**
 * MODELAGEM DE DADOS - SISTEMA DE GERENCIAMENTO DE ESTOQUE
 * 
 * DIAGRAMA ER (Entity Relationship):
 * 
 * ┌─────────────────┐       ┌──────────────────┐       ┌─────────────────┐
 * │    USUARIOS     │       │      ITENS       │       │  MOVIMENTACOES  │
 * ├─────────────────┤       ├──────────────────┤       ├─────────────────┤
 * │ id (PK)         │◄──┐   │ id (PK)          │◄──┬───│ id (PK)         │
 * │ nome            │   │   │ categoria        │   │   │ itemId (FK)     │
 * │ email           │   │   │ nome             │   │   │ deUsuarioId(FK) │
 * │ setor           │   │   │ marca            │   │   │ paraUsuarioId   │
 * │ status          │   │   │ modelo           │   │   │ tipoMovimentacao│
 * │ senha_hash      │   │   │ numeroSerie (UK) │   │   │ dataHora        │
 * │ perfil          │   │   │ patrimonio       │   │   │ observacao      │
 * │ createdAt       │   │   │ descricao        │   └───│ status_anterior │
 * └─────────────────┘   │   │ dataCompra       │       │ status_novo     │
 *                       │   │ statusItem       │       │ createdAt       │
 *                       └───│ usuarioAtualId   │       └─────────────────┘
 *                           │ createdAt        │
 *                           │ updatedAt        │
 *                           └──────────────────┘
 * 
 * RELACIONAMENTOS:
 * - Um USUARIO pode ter N ITENS (1:N)
 * - Um ITEM pertence a 0 ou 1 USUARIO (N:1)
 * - Uma MOVIMENTACAO referencia 1 ITEM (N:1)
 * - Uma MOVIMENTACAO pode ter USUARIO origem e destino (N:1)
 */

// Enums e tipos de status
export enum UserStatus {
  ATIVO = 'ATIVO',
  INATIVO = 'INATIVO'
}

export enum UserRole {
  ADMIN = 'ADMIN',
  OPERADOR = 'OPERADOR',
  LEITOR = 'LEITOR'
}

export enum ItemStatus {
  DISPONIVEL = 'DISPONIVEL',
  EM_USO = 'EM_USO',
  EM_MANUTENCAO = 'EM_MANUTENCAO',
  BAIXADO = 'BAIXADO'
}

export enum MovementType {
  ATRIBUICAO = 'ATRIBUICAO',           // Item atribuído a usuário
  DEVOLUCAO = 'DEVOLUCAO',             // Item devolvido (volta a disponível)
  TROCA_RESPONSAVEL = 'TROCA_RESPONSAVEL', // Transfer entre usuários
  MANUTENCAO = 'MANUTENCAO',           // Item vai para manutenção
  BAIXA = 'BAIXA'                      // Item dado baixa/descartado
}

// Entidades principais
export interface User {
  id: string;
  nome: string;
  email?: string;
  setor?: string;
  status: UserStatus;
  perfil: UserRole;
  senha?: string; // Apenas para criação/edição
  createdAt: string;
}

export interface Item {
  id: string;
  categoria: string;
  nome: string;
  marca?: string;
  modelo?: string;
  numeroSerie: string; // ÚNICO e OBRIGATÓRIO
  patrimonio?: string;
  descricao?: string;
  dataCompra?: string;
  statusItem: ItemStatus;
  usuarioAtualId?: string; // FK para User
  usuarioAtualNome?: string; // Denormalizado para exibição
  createdAt: string;
  updatedAt: string;
}

export interface Movement {
  id: string;
  itemId: string;
  itemNome?: string; // Denormalizado
  itemNumeroSerie?: string; // Denormalizado
  deUsuarioId?: string; // Pode ser null
  deUsuarioNome?: string; // Denormalizado
  paraUsuarioId?: string; // Pode ser null
  paraUsuarioNome?: string; // Denormalizado
  tipoMovimentacao: MovementType;
  statusAnterior: ItemStatus;
  statusNovo: ItemStatus;
  dataHora: string;
  observacao?: string;
  createdAt: string;
}

// DTOs para operações

export interface CreateUserDTO {
  nome: string;
  email?: string;
  setor?: string;
  perfil: UserRole;
  senha: string;
}

export interface UpdateUserDTO {
  id: string;
  nome?: string;
  email?: string;
  setor?: string;
  status?: UserStatus;
  perfil?: UserRole;
  senha?: string;
}

export interface CreateItemDTO {
  categoria: string;
  nome: string;
  marca?: string;
  modelo?: string;
  numeroSerie: string;
  patrimonio?: string;
  descricao?: string;
  dataCompra?: string;
}

export interface UpdateItemDTO {
  id: string;
  categoria?: string;
  nome?: string;
  marca?: string;
  modelo?: string;
  patrimonio?: string;
  descricao?: string;
  dataCompra?: string;
}

export interface AssignItemDTO {
  itemId: string;
  paraUsuarioId: string;
  observacao?: string;
}

export interface ReturnItemDTO {
  itemId: string;
  observacao?: string;
}

export interface TransferItemDTO {
  itemId: string;
  paraUsuarioId: string;
  observacao?: string;
}

export interface SetMaintenanceDTO {
  itemId: string;
  observacao?: string;
}

export interface DiscardItemDTO {
  itemId: string;
  observacao?: string;
}

// Filtros
export interface ItemFilter {
  status?: ItemStatus;
  categoria?: string;
  usuarioId?: string;
  searchText?: string; // Busca em marca/modelo/série/nome
}

export interface MovementFilter {
  itemId?: string;
  usuarioId?: string;
  tipoMovimentacao?: MovementType;
  dataInicio?: string;
  dataFim?: string;
}

// Relatórios
export interface InventoryReport {
  totalItens: number;
  disponiveis: number;
  emUso: number;
  emManutencao: number;
  baixados: number;
  itensPorCategoria: { [categoria: string]: number };
  itensPorUsuario: { usuarioId: string; usuarioNome: string; quantidade: number }[];
}

// Auth
export interface LoginCredentials {
  email: string;
  senha: string;
}

export interface AuthUser {
  id: string;
  nome: string;
  email?: string;
  perfil: UserRole;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
  token?: string;
}
