# 📦 Sistema de Gerenciamento de Estoque

Sistema completo para controle de ativos físicos com número de série, rastreamento de responsável e histórico de movimentações.

## 🚀 Como Usar

### Credenciais de Teste

```
Admin:     admin@sistema.com    / admin123
Operador:  leticia@empresa.com  / leticia123
Leitor:    joao@empresa.com     / joao123
```

## ✨ Funcionalidades Principais

### 📋 Gestão de Itens
- ✅ Cadastro completo de itens com número de série único
- ✅ Controle de status (Disponível, Em Uso, Manutenção, Baixado)
- ✅ Filtros avançados (status, categoria, usuário, busca)
- ✅ Histórico completo de cada item

### 👥 Gestão de Usuários
- ✅ Cadastro de usuários com perfis (Admin, Operador, Leitor)
- ✅ Controle de acesso baseado em permissões
- ✅ Visualização de itens por usuário

### 🔄 Movimentações
- ✅ **Atribuir**: Atribui item a um usuário
- ✅ **Devolver**: Devolve item (volta para disponível)
- ✅ **Transferir**: Transfere item entre usuários
- ✅ **Manutenção**: Envia item para manutenção
- ✅ **Baixa**: Descarta item definitivamente

### 📊 Relatórios
- ✅ Dashboard com estatísticas em tempo real
- ✅ Gráficos de distribuição por categoria e status
- ✅ Relatório de itens por usuário
- ✅ Taxa de utilização do inventário

## 🎯 Casos de Uso

### Exemplo 1: Atribuir Notebook para a Letícia

1. Acesse a tela de **Itens**
2. Busque pelo item desejado (ex: "MacBook")
3. Clique no menu de ações (⋮) → **Atribuir**
4. Selecione "Letícia Silva"
5. Adicione observação (opcional)
6. Confirme

✅ Item agora está com status "Em Uso" e atribuído à Letícia

### Exemplo 2: Consultar "Quem está com este item?"

**Opção 1 - Por Número de Série:**
1. Acesse **Itens**
2. Use a busca: digite o número de série (ex: "0000001")
3. Veja o responsável atual na coluna "Responsável"

**Opção 2 - Ver Histórico:**
1. Na lista de itens, clique no ícone de histórico (🕐)
2. Veja todas as movimentações do item
3. Visualize quem teve o item e quando

### Exemplo 3: Ver Todos os Itens de um Usuário

**Opção 1 - Filtro:**
1. Acesse **Itens**
2. Clique em "Filtros"
3. Selecione o usuário desejado
4. Ver lista filtrada

**Opção 2 - Pela Tela de Usuários:**
1. Acesse **Usuários**
2. Clique no número de itens do usuário (ex: "5")
3. Ver lista de itens daquele usuário

## 🔐 Controle de Permissões

### 👑 ADMIN
- ✅ Gerenciar usuários
- ✅ Gerenciar itens
- ✅ Todas as movimentações
- ✅ Deletar itens e usuários

### 🛠️ OPERADOR
- ❌ Não pode gerenciar usuários
- ✅ Criar e editar itens
- ✅ Todas as movimentações
- ❌ Não pode deletar itens

### 👁️ LEITOR
- ❌ Não pode criar ou editar
- ✅ Visualizar tudo
- ✅ Acessar relatórios

## 📐 Regras do Sistema

### Número de Série
- ✅ Obrigatório
- ✅ Único no sistema
- ❌ Não pode ser alterado após criação

### Movimentações

**ATRIBUIÇÃO:**
- Item deve estar Disponível ou Em Manutenção
- Usuário deve estar Ativo

**DEVOLUÇÃO:**
- Item deve ter usuário atual
- Item volta para status Disponível

**TRANSFERÊNCIA:**
- Item deve estar Em Uso
- Mantém status Em Uso

**MANUTENÇÃO:**
- Remove usuário atual
- Item fica indisponível

**BAIXA:**
- Observação obrigatória
- Item não pode mais ser usado

## 📁 Estrutura do Projeto

```
/
├── App.tsx                    # Componente principal
├── /types
│   └── index.ts              # Definições TypeScript
├── /services
│   ├── storage.ts            # Persistência de dados
│   ├── auth.ts               # Autenticação
│   ├── users.ts              # Lógica de usuários
│   ├── items.ts              # Lógica de itens
│   ├── movements.ts          # Lógica de movimentações
│   └── reports.ts            # Relatórios
└── /components
    ├── Login.tsx             # Tela de login
    ├── Sidebar.tsx           # Menu lateral
    ├── Dashboard.tsx         # Dashboard
    ├── ItemsPage.tsx         # Gestão de itens
    ├── ItemForm.tsx          # Formulário de item
    ├── ItemDetails.tsx       # Detalhes e histórico
    ├── ItemActions.tsx       # Menu de ações
    ├── MovementModal.tsx     # Modal de movimentação
    ├── UsersPage.tsx         # Gestão de usuários
    ├── MovementsPage.tsx     # Timeline de movimentações
    └── ReportsPage.tsx       # Relatórios
```

## 📚 Documentação Completa

Para mais detalhes, consulte:

- **[DOCUMENTATION.md](./DOCUMENTATION.md)** - Documentação técnica completa com:
  - Modelagem de banco de dados
  - Endpoints REST API
  - Exemplos de payloads JSON
  - Regras de negócio detalhadas
  - Roadmap de melhorias

## 🎨 Fluxo de Trabalho Típico

### Dia a Dia do Operador

1. **Manhã**: Acessar Dashboard para ver status geral
2. **Atribuir**: Funcionário novo → atribuir notebook, mouse, monitor
3. **Transferir**: Funcionário mudou de projeto → transferir equipamentos
4. **Manutenção**: Mouse com defeito → enviar para manutenção
5. **Devolver**: Funcionário férias → devolver itens temporariamente
6. **Relatório**: Fim do dia → verificar utilização e disponibilidade

### Fluxo de Auditoria

1. Acesse **Movimentações** para ver timeline completa
2. Use filtros para período específico
3. Exporte relatório (futuro)
4. Visualize quem fez o quê e quando

## 🔄 Próximas Melhorias

### Em Breve
- [ ] Anexar fotos aos itens
- [ ] QR Code para identificação rápida
- [ ] Notificações por email
- [ ] Exportação de relatórios (PDF/Excel)

### Futuro
- [ ] App mobile
- [ ] Leitura de código de barras
- [ ] Workflow de aprovação
- [ ] Multi-localidades

## 💡 Dicas

- Use a **busca global** para encontrar itens rapidamente
- O **histórico** mostra todas as movimentações de um item
- **Filtros** podem ser combinados para buscas precisas
- **Dashboard** atualiza em tempo real

## ⚠️ Importante

Este sistema foi desenvolvido para:
- ✅ Controle interno de ativos
- ✅ Rastreamento de responsabilidades
- ✅ Histórico de movimentações

**Não é destinado para:**
- ❌ Dados extremamente sensíveis
- ❌ PII (informações pessoais identificáveis) críticas
- ❌ Sistemas financeiros críticos

Para uso em produção com dados sensíveis, implemente medidas adicionais de segurança.

---

**Desenvolvido com ❤️ para gestão eficiente de ativos**
