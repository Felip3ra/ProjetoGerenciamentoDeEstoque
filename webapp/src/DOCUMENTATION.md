# Sistema de Gerenciamento de Estoque - Documentação Completa

## 📋 Visão Geral

Sistema completo para controle de ativos/itens físicos com rastreamento de número de série, responsável atual e histórico completo de movimentações.

---

## 🗄️ Modelagem do Banco de Dados

### Diagrama ER (Entity Relationship)

```
┌─────────────────────┐       ┌──────────────────────┐       ┌─────────────────────┐
│      USUARIOS       │       │       ITENS          │       │   MOVIMENTACOES     │
├─────────────────────┤       ├──────────────────────┤       ├─────────────────────┤
│ id (PK)             │◄──┐   │ id (PK)              │◄──┬───│ id (PK)             │
│ nome                │   │   │ categoria            │   │   │ itemId (FK)         │
│ email               │   │   │ nome                 │   │   │ deUsuarioId (FK)    │
│ setor               │   │   │ marca                │   │   │ paraUsuarioId (FK)  │
│ status              │   │   │ modelo               │   │   │ tipoMovimentacao    │
│ senha_hash          │   │   │ numeroSerie (UNIQUE) │   │   │ dataHora            │
│ perfil              │   │   │ patrimonio           │   │   │ observacao          │
│ createdAt           │   │   │ descricao            │   │   │ statusAnterior      │
└─────────────────────┘   │   │ dataCompra           │   └───│ statusNovo          │
                          │   │ statusItem           │       │ createdAt           │
                          └───│ usuarioAtualId (FK)  │       └─────────────────────┘
                              │ createdAt            │
                              │ updatedAt            │
                              └──────────────────────┘
```

### Relacionamentos

- **USUARIO → ITENS**: 1:N (Um usuário pode ter vários itens)
- **ITEM → USUARIO**: N:1 (Um item pertence a 0 ou 1 usuário)
- **MOVIMENTACAO → ITEM**: N:1 (Muitas movimentações para 1 item)
- **MOVIMENTACAO → USUARIO (origem)**: N:1 (Opcional)
- **MOVIMENTACAO → USUARIO (destino)**: N:1 (Opcional)

### Constraints e Índices

```sql
-- USUARIOS
CONSTRAINT pk_usuarios PRIMARY KEY (id)
CONSTRAINT uk_usuarios_email UNIQUE (email) WHERE email IS NOT NULL
INDEX idx_usuarios_status (status)
INDEX idx_usuarios_perfil (perfil)

-- ITENS
CONSTRAINT pk_itens PRIMARY KEY (id)
CONSTRAINT uk_itens_numero_serie UNIQUE (numeroSerie)
CONSTRAINT fk_itens_usuario FOREIGN KEY (usuarioAtualId) REFERENCES usuarios(id)
INDEX idx_itens_status (statusItem)
INDEX idx_itens_categoria (categoria)
INDEX idx_itens_usuario (usuarioAtualId)

-- MOVIMENTACOES
CONSTRAINT pk_movimentacoes PRIMARY KEY (id)
CONSTRAINT fk_movimentacoes_item FOREIGN KEY (itemId) REFERENCES itens(id)
CONSTRAINT fk_movimentacoes_de_usuario FOREIGN KEY (deUsuarioId) REFERENCES usuarios(id)
CONSTRAINT fk_movimentacoes_para_usuario FOREIGN KEY (paraUsuarioId) REFERENCES usuarios(id)
INDEX idx_movimentacoes_item (itemId)
INDEX idx_movimentacoes_data (dataHora DESC)
INDEX idx_movimentacoes_tipo (tipoMovimentacao)
```

---

## 🏗️ Arquitetura do Backend

### Estrutura de Camadas

```
┌─────────────────────────────────────────┐
│           CONTROLLERS                    │
│  (Recebe requisições HTTP)              │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│           SERVICES                       │
│  (Regras de negócio)                    │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│         REPOSITORIES                     │
│  (Acesso ao banco de dados)             │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│           DATABASE                       │
│  (PostgreSQL/Supabase)                  │
└─────────────────────────────────────────┘
```

### Estrutura de Arquivos

```
/backend
├── /controllers
│   ├── auth.controller.ts
│   ├── users.controller.ts
│   ├── items.controller.ts
│   ├── movements.controller.ts
│   └── reports.controller.ts
├── /services
│   ├── auth.service.ts
│   ├── users.service.ts
│   ├── items.service.ts
│   ├── movements.service.ts
│   └── reports.service.ts
├── /repositories
│   ├── users.repository.ts
│   ├── items.repository.ts
│   └── movements.repository.ts
├── /middleware
│   ├── auth.middleware.ts
│   └── validation.middleware.ts
├── /types
│   └── index.ts
└── /utils
    ├── errors.ts
    └── validators.ts
```

---

## 🔌 Endpoints REST API

### Autenticação

```
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me
```

### Usuários

```
GET    /api/users              - Lista todos os usuários
GET    /api/users/:id          - Busca usuário por ID
GET    /api/users/search?q=    - Busca usuários por texto
POST   /api/users              - Cria novo usuário
PUT    /api/users/:id          - Atualiza usuário
DELETE /api/users/:id          - Deleta usuário
GET    /api/users/:id/items    - Lista itens do usuário
```

### Itens

```
GET    /api/items                      - Lista todos os itens
GET    /api/items/:id                  - Busca item por ID
GET    /api/items/serial/:numeroSerie  - Busca por número de série
GET    /api/items/filter?              - Filtra itens (status, categoria, usuário, texto)
POST   /api/items                      - Cria novo item
PUT    /api/items/:id                  - Atualiza item
DELETE /api/items/:id                  - Deleta item
GET    /api/items/categories           - Lista categorias únicas
```

### Movimentações

```
GET    /api/movements                  - Lista todas as movimentações
GET    /api/movements/:id              - Busca movimentação por ID
GET    /api/movements/item/:itemId     - Histórico de um item
GET    /api/movements/user/:userId     - Movimentações de um usuário
GET    /api/movements/filter?          - Filtra movimentações
POST   /api/movements/assign           - Atribui item a usuário
POST   /api/movements/return           - Devolve item
POST   /api/movements/transfer         - Transfere item entre usuários
POST   /api/movements/maintenance      - Envia para manutenção
POST   /api/movements/discard          - Dá baixa no item
```

### Relatórios

```
GET    /api/reports/inventory          - Relatório completo de inventário
GET    /api/reports/dashboard          - Estatísticas para dashboard
GET    /api/reports/export             - Exporta relatório (CSV/Excel)
```

---

## 📝 Regras de Negócio

### Usuários

1. **Email único**: Se fornecido, deve ser único no sistema
2. **Senha obrigatória**: Necessária na criação (mínimo 6 caracteres)
3. **Não deletar com itens**: Usuário com itens atribuídos não pode ser deletado
4. **Status**: Usuário INATIVO não pode receber novos itens

### Itens

1. **Número de série único**: Obrigatório e único no sistema
2. **Status inicial**: Todo item criado inicia como DISPONIVEL
3. **Validação de status**: Apenas transições válidas são permitidas
4. **Atualização automática**: updatedAt é atualizado automaticamente

### Movimentações

1. **ATRIBUIÇÃO**:
   - Item deve estar DISPONIVEL ou EM_MANUTENCAO
   - Não pode atribuir item BAIXADO
   - Usuário destino deve estar ATIVO
   - Atualiza item para EM_USO

2. **DEVOLUÇÃO**:
   - Item deve ter usuário atual
   - Remove usuário do item
   - Atualiza item para DISPONIVEL

3. **TRANSFERÊNCIA**:
   - Item deve estar EM_USO
   - Usuário destino deve estar ATIVO
   - Não pode transferir para o mesmo usuário
   - Mantém status EM_USO

4. **MANUTENÇÃO**:
   - Item não pode estar BAIXADO
   - Remove usuário se existir
   - Atualiza para EM_MANUTENCAO

5. **BAIXA**:
   - Remove usuário se existir
   - Atualiza para BAIXADO
   - Observação é obrigatória

### Autorização por Perfil

```
ADMIN:
  ✓ CRUD completo de usuários
  ✓ CRUD completo de itens
  ✓ Todas as movimentações
  ✓ Todos os relatórios
  ✓ Pode deletar itens

OPERADOR:
  ✗ Não pode gerenciar usuários
  ✓ CRUD de itens
  ✓ Todas as movimentações
  ✓ Todos os relatórios
  ✗ Não pode deletar itens

LEITOR:
  ✗ Não pode gerenciar usuários
  ✗ Não pode criar/editar itens
  ✗ Não pode criar movimentações
  ✓ Pode visualizar tudo
```

---

## 📦 Exemplos de Payloads JSON

### 1. Criar Usuário

```json
POST /api/users
{
  "nome": "Maria Santos",
  "email": "maria@empresa.com",
  "setor": "RH",
  "perfil": "OPERADOR",
  "senha": "senha123"
}
```

**Resposta (201 Created):**
```json
{
  "id": "user_123abc",
  "nome": "Maria Santos",
  "email": "maria@empresa.com",
  "setor": "RH",
  "status": "ATIVO",
  "perfil": "OPERADOR",
  "createdAt": "2026-01-07T10:30:00Z"
}
```

### 2. Criar Item

```json
POST /api/items
{
  "categoria": "Notebook",
  "nome": "Dell Latitude 5420",
  "marca": "Dell",
  "modelo": "Latitude 5420",
  "numeroSerie": "DELL123456",
  "patrimonio": "PAT-100",
  "descricao": "Notebook para desenvolvimento",
  "dataCompra": "2025-01-15"
}
```

**Resposta (201 Created):**
```json
{
  "id": "item_456def",
  "categoria": "Notebook",
  "nome": "Dell Latitude 5420",
  "marca": "Dell",
  "modelo": "Latitude 5420",
  "numeroSerie": "DELL123456",
  "patrimonio": "PAT-100",
  "descricao": "Notebook para desenvolvimento",
  "dataCompra": "2025-01-15",
  "statusItem": "DISPONIVEL",
  "usuarioAtualId": null,
  "createdAt": "2026-01-07T10:35:00Z",
  "updatedAt": "2026-01-07T10:35:00Z"
}
```

### 3. Atribuir Item

```json
POST /api/movements/assign
{
  "itemId": "item_456def",
  "paraUsuarioId": "user_123abc",
  "observacao": "Atribuição para projeto novo"
}
```

**Resposta (201 Created):**
```json
{
  "id": "mov_789ghi",
  "itemId": "item_456def",
  "itemNome": "Dell Latitude 5420",
  "itemNumeroSerie": "DELL123456",
  "paraUsuarioId": "user_123abc",
  "paraUsuarioNome": "Maria Santos",
  "tipoMovimentacao": "ATRIBUICAO",
  "statusAnterior": "DISPONIVEL",
  "statusNovo": "EM_USO",
  "dataHora": "2026-01-07T10:40:00Z",
  "observacao": "Atribuição para projeto novo",
  "createdAt": "2026-01-07T10:40:00Z"
}
```

### 4. Transferir Item

```json
POST /api/movements/transfer
{
  "itemId": "item_456def",
  "paraUsuarioId": "user_999xyz",
  "observacao": "Transferência por mudança de projeto"
}
```

### 5. Devolver Item

```json
POST /api/movements/return
{
  "itemId": "item_456def",
  "observacao": "Item devolvido em bom estado"
}
```

### 6. Filtrar Itens

```
GET /api/items/filter?status=EM_USO&categoria=Notebook&searchText=dell
```

**Resposta (200 OK):**
```json
[
  {
    "id": "item_456def",
    "categoria": "Notebook",
    "nome": "Dell Latitude 5420",
    "marca": "Dell",
    "modelo": "Latitude 5420",
    "numeroSerie": "DELL123456",
    "statusItem": "EM_USO",
    "usuarioAtualId": "user_123abc",
    "usuarioAtualNome": "Maria Santos",
    "createdAt": "2026-01-07T10:35:00Z",
    "updatedAt": "2026-01-07T10:40:00Z"
  }
]
```

### 7. Relatório de Inventário

```
GET /api/reports/inventory
```

**Resposta (200 OK):**
```json
{
  "totalItens": 50,
  "disponiveis": 15,
  "emUso": 30,
  "emManutencao": 3,
  "baixados": 2,
  "itensPorCategoria": {
    "Notebook": 20,
    "Monitor": 15,
    "Mouse": 10,
    "Teclado": 5
  },
  "itensPorUsuario": [
    {
      "usuarioId": "user_123abc",
      "usuarioNome": "Maria Santos",
      "quantidade": 5
    },
    {
      "usuarioId": "user_456def",
      "usuarioNome": "João Silva",
      "quantidade": 3
    }
  ]
}
```

---

## 🎨 Estrutura do Frontend

### Componentes

```
/components
├── Login.tsx                 - Tela de autenticação
├── Sidebar.tsx              - Menu lateral de navegação
├── Dashboard.tsx            - Dashboard com estatísticas
├── ItemsPage.tsx            - Lista e gerenciamento de itens
├── ItemForm.tsx             - Formulário de criar/editar item
├── ItemDetails.tsx          - Detalhes e histórico do item
├── ItemActions.tsx          - Menu de ações rápidas
├── MovementModal.tsx        - Modal para movimentações
├── UsersPage.tsx            - Lista e gerenciamento de usuários
├── MovementsPage.tsx        - Timeline de movimentações
└── ReportsPage.tsx          - Relatórios e gráficos
```

### Telas e Funcionalidades

#### 1. **Dashboard**
- Cards com estatísticas (total, disponíveis, em uso, manutenção)
- Gráfico de taxa de utilização
- Itens recentemente cadastrados
- Movimentações recentes

#### 2. **Itens**
- Lista com filtros (status, categoria, usuário, busca)
- Ações rápidas: Atribuir, Devolver, Transferir, Manutenção, Baixa
- Ver histórico completo
- Criar/Editar/Deletar item

#### 3. **Usuários**
- Lista com busca
- Ver itens por usuário
- Criar/Editar/Deletar usuário
- Badges de status e perfil

#### 4. **Movimentações**
- Timeline de todas as movimentações
- Filtros por tipo, data, item
- Detalhes completos de cada movimentação

#### 5. **Relatórios**
- Estatísticas gerais
- Gráfico de barras (itens por categoria)
- Gráfico de pizza (distribuição por status)
- Tabela de itens por usuário
- Resumo executivo

---

## 🚀 Roadmap

### MVP (Mínimo Produto Viável)

**Fase 1 - Core (2-3 semanas)**
- [x] Modelagem de dados
- [x] Autenticação básica
- [x] CRUD de usuários
- [x] CRUD de itens
- [x] Sistema de movimentações
- [x] Dashboard básico
- [x] Relatório de inventário

**Fase 2 - UX e Validações (1-2 semanas)**
- [x] Validações de regras de negócio
- [x] Controle de permissões por perfil
- [x] Filtros e buscas
- [x] Histórico de movimentações
- [x] Interface responsiva

### Melhorias Futuras

**Funcionalidades**
- [ ] Notificações (email/push) para movimentações
- [ ] Alertas de manutenção preventiva
- [ ] QR Code para identificação rápida
- [ ] App mobile para leitura de código de barras
- [ ] Anexos (fotos, documentos) nos itens
- [ ] Assinatura digital nas movimentações
- [ ] Workflow de aprovação para movimentações
- [ ] Reserva de itens disponíveis
- [ ] Controle de garantia e vencimento

**Relatórios Avançados**
- [ ] Dashboard customizável
- [ ] Exportação (PDF, Excel, CSV)
- [ ] Gráficos de tendências
- [ ] Previsão de necessidades
- [ ] Análise de custo total (TCO)
- [ ] Relatório de depreciação

**Integrações**
- [ ] API REST pública com documentação Swagger
- [ ] Webhooks para eventos
- [ ] Integração com sistemas de RH
- [ ] Integração com sistemas de compras
- [ ] SSO (Single Sign-On)

**Técnico**
- [ ] Testes unitários e integração
- [ ] CI/CD automatizado
- [ ] Logs de auditoria detalhados
- [ ] Backup automatizado
- [ ] Multi-tenancy (multi-empresas)
- [ ] Modo offline (PWA)

**UX/UI**
- [ ] Tema dark mode
- [ ] Customização de cores/logo
- [ ] Atalhos de teclado
- [ ] Tour guiado para novos usuários
- [ ] Dashboards por departamento

---

## 🔒 Segurança

### Implementadas
- Autenticação por email/senha
- Controle de acesso baseado em perfil (RBAC)
- Validação de permissões em todas as ações
- Senhas armazenadas com hash

### Recomendações para Produção
- Implementar JWT com refresh tokens
- HTTPS obrigatório
- Rate limiting em endpoints
- Validação de inputs (sanitização)
- CORS configurado corretamente
- Logs de auditoria
- Backup regular dos dados
- Política de senhas fortes
- 2FA (autenticação de dois fatores)
- Criptografia de dados sensíveis

---

## 📊 Métricas e KPIs Sugeridos

- Taxa de utilização de itens
- Tempo médio de posse por usuário
- Itens mais movimentados
- Tempo médio em manutenção
- Taxa de baixa de itens
- Custo médio por categoria
- ROI por item
- Tempo de resposta às solicitações

---

## 🛠️ Tecnologias Utilizadas

**Frontend:**
- React + TypeScript
- Tailwind CSS
- Recharts (gráficos)
- Lucide React (ícones)

**Backend (Sugestão):**
- Node.js + Express/Fastify
- TypeScript
- PostgreSQL/Supabase
- Prisma ORM
- JWT para autenticação
- Bcrypt para senhas

**DevOps:**
- Docker
- GitHub Actions
- Vercel/Railway para deploy

---

## 📞 Suporte e Manutenção

### Níveis de Usuário
- **LEITOR**: Apenas visualização
- **OPERADOR**: Gerencia itens e movimentações
- **ADMIN**: Controle total do sistema

### Credenciais de Teste
```
Admin:     admin@sistema.com    / admin123
Operador:  leticia@empresa.com  / leticia123
Leitor:    joao@empresa.com     / joao123
```

---

**Desenvolvido para gestão eficiente de ativos empresariais** 🎯
