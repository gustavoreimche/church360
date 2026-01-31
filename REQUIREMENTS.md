# Church360 - Software Requirements Specification (SRS)

**Versão:** 1.0.0  
**Data:** Janeiro 2025  
**Status:** Draft  

---

## 1. Introdução

### 1.1 Propósito
Este documento especifica os requisitos completos para o desenvolvimento do **Church360**, uma plataforma SaaS multi-tenant para administração de igrejas. O documento serve como referência única para todas as decisões de implementação e validação do sistema.

### 1.2 Escopo do Produto
O Church360 é uma solução completa de gestão eclesiástica que engloba:
- Gestão de membros e famílias
- Controle financeiro (dízimos, ofertas, despesas)
- Administração de voluntários e ministérios
- Sistema de escalas com notificações
- Gestão de células/grupos familiares
- Módulo Kids com check-in
- Multi-tenancy com branding personalizado

### 1.3 Definições e Acrônimos

| Termo | Definição |
|-------|-----------|
| **Tenant** | Uma igreja cadastrada no sistema |
| **Membro** | Pessoa cadastrada como membro ativo da igreja |
| **Visitante** | Pessoa que participa de atividades mas não é membro |
| **Célula** | Grupo familiar/pequeno grupo de comunhão |
| **Ministério** | Departamento de serviço da igreja (ex: Louvor, Kids) |
| **Escala** | Distribuição de voluntários para atividades/cultos |
| **Check-in** | Registro de presença de criança no culto |

### 1.4 Stack Tecnológica

| Camada | Tecnologia |
|--------|------------|
| Frontend | Next.js 14+ (App Router) |
| Backend | Next.js API Routes + Server Actions |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Storage | Supabase Storage |
| Deploy | Vercel |
| DNS | Vercel (subdomínios dinâmicos) |
| Notificações | Email (Resend) + Push (opcional) |

---

## 2. Descrição Geral

### 2.1 Perspectiva do Produto
O Church360 opera como SaaS multi-tenant onde cada igreja possui:
- Subdomínio próprio: `{slug}.church360.com.br`
- Branding personalizado (logo, cores)
- Dados completamente isolados
- Licenciamento por quantidade de membros

### 2.2 Modelo de Licenciamento

| Plano | Membros | Funcionalidades |
|-------|---------|-----------------|
| Starter | Até 100 | Básico (membros, financeiro) |
| Growth | Até 500 | + Células, Voluntários |
| Pro | Até 2000 | + Kids, Escalas avançadas |
| Enterprise | Ilimitado | + API, Integrações, Suporte dedicado |

> **Nota:** Visitantes de células NÃO contam para o limite de membros.

### 2.3 Classes de Usuários e Características

```
┌─────────────────────────────────────────────────────────────────┐
│                         PASTOR (Admin Total)                     │
│  - Acesso completo a todas as funcionalidades                   │
│  - Gerencia todos os usuários e permissões                      │
│  - Visualiza dashboards executivos                              │
└─────────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    ADMIN (Administrativo/Financeiro)             │
│  - Gestão financeira completa                                   │
│  - Cadastro e manutenção de membros                             │
│  - Relatórios administrativos                                   │
│  - NÃO gerencia permissões de outros admins                     │
└─────────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    LÍDER (Ministério/Célula)                     │
│  - Monta escalas do seu ministério                              │
│  - Gerencia sua célula (participantes, relatórios)              │
│  - Visualiza voluntários do seu ministério                      │
│  - Registra visitantes na célula                                │
└─────────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────┐
│                         VOLUNTÁRIO                               │
│  - Visualiza suas escalas                                       │
│  - Informa datas de indisponibilidade                           │
│  - Recebe notificações de escalas                               │
│  - Confirma/recusa participação                                 │
└─────────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────┐
│                           MEMBRO                                 │
│  - Visualiza pregações/conteúdos                                │
│  - Acessa área Kids (check-in de filhos)                        │
│  - Visualiza eventos da igreja                                  │
│  - Atualiza dados pessoais                                      │
└─────────────────────────────────────────────────────────────────┘
```

### 2.4 Ambiente Operacional
- **Browsers:** Chrome, Firefox, Safari, Edge (últimas 2 versões)
- **Mobile:** PWA responsivo (iOS Safari, Android Chrome)
- **Resolução mínima:** 320px (mobile) / 1024px (desktop)

### 2.5 Restrições de Design e Implementação
- Arquitetura serverless (Vercel Edge Functions)
- Row Level Security (RLS) obrigatório no Supabase
- LGPD compliance para dados pessoais
- Isolamento total entre tenants
- Tempo de resposta < 200ms para operações comuns

---

## 3. Requisitos Funcionais

### 3.1 Módulo: Multi-Tenancy e Autenticação

#### RF-AUTH-001: Registro de Nova Igreja
**Prioridade:** Alta  
**Descrição:** O sistema deve permitir o cadastro de uma nova igreja (tenant).

**Critérios de Aceite:**
- [ ] Formulário com: Nome da igreja, Slug (subdomínio), Email do pastor, Senha
- [ ] Validação de slug único e formato válido (apenas letras, números, hífen)
- [ ] Criação automática do tenant e usuário PASTOR
- [ ] Envio de email de confirmação
- [ ] Redirecionamento para `{slug}.church360.com.br`

**Dados de Entrada:**
```typescript
interface ChurchRegistration {
  name: string;           // Nome da igreja
  slug: string;           // Subdomínio (3-50 chars, alphanumeric + hyphen)
  pastor_name: string;    // Nome do pastor
  pastor_email: string;   // Email (será o login)
  pastor_password: string;// Senha (min 8 chars)
  phone?: string;         // Telefone opcional
  plan: 'starter' | 'growth' | 'pro' | 'enterprise';
}
```

#### RF-AUTH-002: Login Multi-Tenant
**Prioridade:** Alta  
**Descrição:** Usuários devem fazer login no subdomínio correto de sua igreja.

**Critérios de Aceite:**
- [ ] Login via email/senha
- [ ] Validação do usuário pertence ao tenant atual
- [ ] Suporte a "Esqueci minha senha"
- [ ] Sessão com refresh token (7 dias)
- [ ] Logout em todos os dispositivos (opcional)

#### RF-AUTH-003: Gestão de Usuários
**Prioridade:** Alta  
**Descrição:** PASTOR e ADMIN podem criar/editar/desativar usuários.

**Critérios de Aceite:**
- [ ] PASTOR pode criar usuários de qualquer nível
- [ ] ADMIN pode criar LÍDER, VOLUNTÁRIO, MEMBRO
- [ ] Usuário vinculado a um membro existente (opcional)
- [ ] Envio de convite por email com link de ativação
- [ ] Histórico de ações do usuário (audit log)

#### RF-AUTH-004: Branding Personalizado
**Prioridade:** Média  
**Descrição:** Cada igreja pode personalizar a aparência do sistema.

**Critérios de Aceite:**
- [ ] Upload de logo (PNG/SVG, max 2MB)
- [ ] Definição de cor primária e secundária
- [ ] Preview em tempo real
- [ ] CSS variables aplicadas dinamicamente
- [ ] Favicon personalizado

---

### 3.2 Módulo: Gestão de Membros

#### RF-MEM-001: Cadastro de Membro
**Prioridade:** Alta  
**Descrição:** Sistema deve permitir cadastro completo de membros.

**Dados do Membro:**
```typescript
interface Member {
  id: uuid;
  tenant_id: uuid;
  
  // Dados Pessoais
  full_name: string;
  birth_date: date;
  gender: 'M' | 'F';
  marital_status: 'solteiro' | 'casado' | 'divorciado' | 'viuvo';
  photo_url?: string;
  
  // Contato
  email?: string;
  phone: string;
  whatsapp?: string;
  
  // Endereço
  address?: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zip_code: string;
  };
  
  // Dados Eclesiásticos
  membership_date?: date;      // Data de membresia
  baptism_date?: date;         // Data de batismo
  conversion_date?: date;      // Data de conversão
  previous_church?: string;    // Igreja anterior
  
  // Família
  family_id?: uuid;            // Vínculo familiar
  family_role: 'head' | 'spouse' | 'child' | 'other';
  
  // Status
  status: 'active' | 'inactive' | 'transferred' | 'deceased';
  notes?: string;
  
  // Metadados
  created_at: timestamp;
  updated_at: timestamp;
  created_by: uuid;
}
```

**Critérios de Aceite:**
- [ ] Formulário com validação de campos obrigatórios
- [ ] Busca de CEP para preenchimento automático de endereço
- [ ] Upload de foto com crop
- [ ] Verificação de duplicidade (nome + data nascimento)
- [ ] Contagem atualizada para verificar limite do plano

#### RF-MEM-002: Gestão de Famílias
**Prioridade:** Alta  
**Descrição:** Membros podem ser agrupados em unidades familiares.

**Critérios de Aceite:**
- [ ] Criar família com nome identificador
- [ ] Definir "cabeça" da família (pai/mãe)
- [ ] Adicionar cônjuge
- [ ] Adicionar filhos (vincula automaticamente)
- [ ] Visualização em árvore genealógica simplificada
- [ ] Ao cadastrar filho menor, herda endereço da família

#### RF-MEM-003: Busca e Filtros de Membros
**Prioridade:** Alta  
**Descrição:** Sistema deve oferecer busca avançada de membros.

**Critérios de Aceite:**
- [ ] Busca por nome (parcial, case-insensitive)
- [ ] Filtros: status, gênero, faixa etária, bairro
- [ ] Filtro por data de aniversário (mês)
- [ ] Filtro por tempo de membresia
- [ ] Exportação para Excel/CSV
- [ ] Paginação (50 por página)

#### RF-MEM-004: Relatórios de Membros
**Prioridade:** Média  
**Descrição:** Geração de relatórios estatísticos.

**Relatórios Disponíveis:**
- [ ] Aniversariantes do mês
- [ ] Novos membros (período)
- [ ] Membros por bairro/região
- [ ] Pirâmide etária
- [ ] Crescimento mensal (gráfico)

---

### 3.3 Módulo: Financeiro

#### RF-FIN-001: Registro de Entradas
**Prioridade:** Alta  
**Descrição:** Registro de dízimos, ofertas e outras receitas.

**Estrutura de Entrada:**
```typescript
interface FinancialEntry {
  id: uuid;
  tenant_id: uuid;
  
  type: 'dizimo' | 'oferta' | 'campanha' | 'doacao' | 'outro';
  amount: decimal(10,2);
  date: date;
  
  // Identificação (opcional para manter privacidade)
  member_id?: uuid;        // Pode ser anônimo
  anonymous: boolean;
  
  // Categorização
  category_id?: uuid;      // Ex: Oferta missionária, Construção
  campaign_id?: uuid;      // Se vinculado a campanha específica
  
  // Forma de pagamento
  payment_method: 'dinheiro' | 'pix' | 'cartao' | 'transferencia' | 'cheque';
  reference?: string;      // Número do cheque, ID do PIX, etc.
  
  notes?: string;
  
  created_at: timestamp;
  created_by: uuid;
}
```

**Critérios de Aceite:**
- [ ] Formulário rápido para lançamento em lote (culto)
- [ ] Opção de entrada anônima
- [ ] Vinculação opcional a membro
- [ ] Categorias personalizáveis
- [ ] Cálculo automático de totais

#### RF-FIN-002: Registro de Saídas
**Prioridade:** Alta  
**Descrição:** Registro de despesas e pagamentos.

**Estrutura de Saída:**
```typescript
interface FinancialExpense {
  id: uuid;
  tenant_id: uuid;
  
  description: string;
  amount: decimal(10,2);
  date: date;
  due_date?: date;         // Vencimento
  paid_date?: date;        // Data do pagamento efetivo
  
  // Categorização
  category_id: uuid;       // Ex: Aluguel, Água, Luz, Salários
  cost_center_id?: uuid;   // Ex: Ministério Kids, Missões
  
  // Fornecedor
  supplier_name?: string;
  supplier_document?: string;  // CNPJ/CPF
  
  // Nota Fiscal
  has_invoice: boolean;
  invoice_number?: string;
  invoice_file_url?: string;   // Upload do arquivo
  
  // Pagamento
  payment_method?: 'dinheiro' | 'pix' | 'cartao' | 'transferencia' | 'boleto';
  payment_proof_url?: string;  // Comprovante
  
  status: 'pendente' | 'pago' | 'cancelado';
  
  notes?: string;
  
  created_at: timestamp;
  created_by: uuid;
  approved_by?: uuid;      // Aprovação para valores altos
}
```

**Critérios de Aceite:**
- [ ] Formulário com campos de NF opcionais
- [ ] Upload de nota fiscal (PDF/imagem, max 5MB)
- [ ] Upload de comprovante de pagamento
- [ ] Status de pagamento (pendente/pago)
- [ ] Alerta de contas a vencer
- [ ] Workflow de aprovação para valores > X (configurável)

#### RF-FIN-003: Categorias Financeiras
**Prioridade:** Média  
**Descrição:** Gestão de categorias de receitas e despesas.

**Critérios de Aceite:**
- [ ] Categorias pré-definidas (editáveis)
- [ ] Criação de novas categorias
- [ ] Hierarquia (categoria pai/filha)
- [ ] Categorias separadas para entrada/saída
- [ ] Inativação (não exclusão) de categorias em uso

#### RF-FIN-004: Dashboard Financeiro
**Prioridade:** Alta  
**Descrição:** Visão consolidada das finanças.

**Critérios de Aceite:**
- [ ] Saldo atual
- [ ] Entradas vs Saídas (período)
- [ ] Gráfico de evolução mensal
- [ ] Top categorias de despesa
- [ ] Comparativo com mês/ano anterior
- [ ] Contas a pagar próximos 30 dias

#### RF-FIN-005: Relatórios Financeiros
**Prioridade:** Alta  
**Descrição:** Geração de relatórios financeiros.

**Relatórios Disponíveis:**
- [ ] Balancete mensal
- [ ] Demonstrativo de entradas por tipo
- [ ] Demonstrativo de saídas por categoria
- [ ] Relatório de dízimos por membro (restrito)
- [ ] Fluxo de caixa projetado
- [ ] Exportação para PDF e Excel

---

### 3.4 Módulo: Voluntários e Ministérios

#### RF-VOL-001: Cadastro de Ministérios
**Prioridade:** Alta  
**Descrição:** Criação e gestão de ministérios/departamentos.

**Estrutura de Ministério:**
```typescript
interface Ministry {
  id: uuid;
  tenant_id: uuid;
  
  name: string;            // Ex: "Louvor", "Kids", "Recepção"
  description?: string;
  color: string;           // Para identificação visual
  icon?: string;           // Ícone do ministério
  
  // Liderança
  leader_ids: uuid[];      // Líderes do ministério
  
  // Configurações de escala
  schedule_config: {
    requires_confirmation: boolean;  // Voluntário deve confirmar
    min_volunteers?: number;         // Mínimo por escala
    max_volunteers?: number;         // Máximo por escala
    advance_notice_days: number;     // Dias de antecedência para notificar
  };
  
  status: 'active' | 'inactive';
  
  created_at: timestamp;
}
```

**Critérios de Aceite:**
- [ ] CRUD de ministérios
- [ ] Atribuição de líderes
- [ ] Configuração de regras de escala
- [ ] Visualização de voluntários por ministério

#### RF-VOL-002: Vinculação de Voluntários
**Prioridade:** Alta  
**Descrição:** Vincular membros como voluntários de ministérios.

**Critérios de Aceite:**
- [ ] Membro pode participar de múltiplos ministérios
- [ ] Definir função dentro do ministério
- [ ] Data de início no ministério
- [ ] Status: ativo, afastado, desligado
- [ ] Histórico de participação

#### RF-VOL-003: Sistema de Escalas
**Prioridade:** Alta  
**Descrição:** Criação e gestão de escalas de voluntários.

**Estrutura de Escala:**
```typescript
interface Schedule {
  id: uuid;
  tenant_id: uuid;
  ministry_id: uuid;
  
  title: string;           // Ex: "Culto Domingo Manhã"
  date: date;
  start_time: time;
  end_time?: time;
  
  // Voluntários escalados
  assignments: {
    volunteer_id: uuid;
    function?: string;     // Função específica nesta escala
    status: 'pending' | 'confirmed' | 'declined' | 'no_response';
    confirmed_at?: timestamp;
    notes?: string;
  }[];
  
  notes?: string;
  
  created_at: timestamp;
  created_by: uuid;
  published: boolean;      // Só notifica quando publicar
  published_at?: timestamp;
}
```

**Critérios de Aceite:**
- [ ] Criação de escala com data e horário
- [ ] Seleção de voluntários disponíveis
- [ ] Validação de indisponibilidades
- [ ] Alerta de conflito (mesmo voluntário em 2 escalas)
- [ ] Publicação da escala (dispara notificações)
- [ ] Voluntário pode confirmar/recusar
- [ ] Líder vê status de confirmação

#### RF-VOL-004: Indisponibilidades
**Prioridade:** Alta  
**Descrição:** Voluntários podem informar datas indisponíveis.

**Critérios de Aceite:**
- [ ] Voluntário cadastra períodos de indisponibilidade
- [ ] Pode ser dia específico ou período
- [ ] Motivo opcional
- [ ] Visível para líder ao montar escala
- [ ] Destaque visual no calendário
- [ ] Não permite escalar em datas marcadas

#### RF-VOL-005: Notificações de Escala
**Prioridade:** Alta  
**Descrição:** Sistema de notificações para voluntários.

**Critérios de Aceite:**
- [ ] Notificação quando escalado (email)
- [ ] Lembrete X dias antes (configurável)
- [ ] Notificação de alteração de escala
- [ ] Resumo semanal de escalas (opcional)
- [ ] Push notification (PWA - opcional)

---

### 3.5 Módulo: Células/Grupos

#### RF-CEL-001: Cadastro de Células
**Prioridade:** Alta  
**Descrição:** Criação e gestão de células/grupos familiares.

**Estrutura de Célula:**
```typescript
interface Cell {
  id: uuid;
  tenant_id: uuid;
  
  name: string;
  description?: string;
  
  // Liderança
  leader_ids: uuid[];      // Líderes da célula
  
  // Localização
  meeting_address?: {
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    reference?: string;
  };
  
  // Agenda
  meeting_day: 'domingo' | 'segunda' | 'terca' | 'quarta' | 'quinta' | 'sexta' | 'sabado';
  meeting_time: time;
  
  // Rede/Supervisão
  network_id?: uuid;       // Rede de células
  supervisor_id?: uuid;    // Supervisor
  
  status: 'active' | 'inactive' | 'multiplying';
  
  created_at: timestamp;
}
```

**Critérios de Aceite:**
- [ ] CRUD de células
- [ ] Atribuição de líderes (pode ter co-líder)
- [ ] Definição de dia/horário de reunião
- [ ] Endereço da célula
- [ ] Agrupamento em redes (opcional)

#### RF-CEL-002: Participantes de Célula
**Prioridade:** Alta  
**Descrição:** Gestão de participantes da célula.

**Critérios de Aceite:**
- [ ] Adicionar membros à célula
- [ ] Membro só pode participar de 1 célula
- [ ] Registrar visitantes (dados básicos)
- [ ] Visitantes em lista separada
- [ ] Visitantes NÃO contam para licença
- [ ] Converter visitante em membro

#### RF-CEL-003: Relatório de Célula
**Prioridade:** Média  
**Descrição:** Líder registra relatório semanal.

**Estrutura de Relatório:**
```typescript
interface CellReport {
  id: uuid;
  cell_id: uuid;
  
  date: date;
  
  // Presença
  members_present: uuid[];
  visitors: {
    name: string;
    phone?: string;
    is_first_time: boolean;
  }[];
  
  // Métricas
  total_present: number;
  offering_amount?: decimal;
  
  // Conteúdo
  theme?: string;
  notes?: string;
  prayer_requests?: string[];
  
  created_at: timestamp;
  created_by: uuid;
}
```

**Critérios de Aceite:**
- [ ] Formulário de relatório semanal
- [ ] Lista de presença (membros)
- [ ] Registro de visitantes
- [ ] Oferta da célula
- [ ] Pedidos de oração
- [ ] Dashboard de células para supervisão

---

### 3.6 Módulo: Kids (Ministério Infantil)

#### RF-KIDS-001: Cadastro de Turmas
**Prioridade:** Alta  
**Descrição:** Criação de turmas do ministério infantil.

**Estrutura de Turma:**
```typescript
interface KidsClass {
  id: uuid;
  tenant_id: uuid;
  
  name: string;            // Ex: "Berçário", "3-5 anos", "6-8 anos"
  age_min: number;
  age_max: number;
  
  capacity: number;        // Limite de crianças
  
  room?: string;           // Sala/local
  
  // Professores/Monitores
  teachers: uuid[];        // Voluntários responsáveis
  
  status: 'active' | 'inactive';
}
```

**Critérios de Aceite:**
- [ ] CRUD de turmas
- [ ] Definição de faixa etária
- [ ] Limite de capacidade
- [ ] Atribuição de professores/monitores
- [ ] Alerta quando atingir capacidade

#### RF-KIDS-002: Cadastro de Crianças
**Prioridade:** Alta  
**Descrição:** Registro de crianças vinculadas aos membros.

**Estrutura de Criança:**
```typescript
interface Child {
  id: uuid;
  tenant_id: uuid;
  
  name: string;
  birth_date: date;
  gender: 'M' | 'F';
  photo_url?: string;
  
  // Responsáveis (membros)
  guardians: {
    member_id: uuid;
    relationship: 'pai' | 'mae' | 'avo' | 'tio' | 'responsavel';
    can_pickup: boolean;   // Autorizado a retirar
  }[];
  
  // Informações médicas
  allergies?: string;
  medical_notes?: string;
  special_needs?: string;
  
  // Turma atual (baseada na idade)
  current_class_id?: uuid;
  
  // Contato emergência
  emergency_contact: string;
  emergency_phone: string;
  
  status: 'active' | 'inactive';
}
```

**Critérios de Aceite:**
- [ ] Cadastro vinculado a membro (pai/mãe)
- [ ] Informações médicas/alergias
- [ ] Lista de autorizados a retirar
- [ ] Atribuição automática de turma por idade
- [ ] Foto da criança

#### RF-KIDS-003: Check-in de Crianças
**Prioridade:** Alta  
**Descrição:** Sistema de check-in para cultos.

**Fluxo de Check-in:**
```
1. Pai/Mãe acessa área Kids no app
2. Seleciona criança(s) para check-in
3. Sistema valida:
   - Criança está ativa
   - Turma tem vaga
   - Não há check-in ativo
4. Gera etiqueta com:
   - Nome da criança
   - Turma
   - Código único (para checkout)
   - Alertas (alergias)
5. Notifica professor da turma
```

**Estrutura de Check-in:**
```typescript
interface KidsCheckin {
  id: uuid;
  tenant_id: uuid;
  
  child_id: uuid;
  class_id: uuid;
  
  checkin_at: timestamp;
  checkin_by: uuid;        // Membro que fez check-in
  
  checkout_at?: timestamp;
  checkout_by?: uuid;
  
  // Segurança
  security_code: string;   // 4 dígitos para checkout
  
  // Evento
  event_date: date;
  event_name?: string;     // Ex: "Culto Domingo Manhã"
  
  notes?: string;          // Observações do dia
}
```

**Critérios de Aceite:**
- [ ] Pai/mãe faz check-in pelo app
- [ ] Validação de capacidade da turma
- [ ] Geração de código de segurança
- [ ] Etiqueta para impressão (opcional)
- [ ] Checkout apenas com código
- [ ] Histórico de presenças
- [ ] Dashboard em tempo real para professores

#### RF-KIDS-004: Controle de Presença Kids
**Prioridade:** Média  
**Descrição:** Relatórios de frequência do ministério infantil.

**Critérios de Aceite:**
- [ ] Lista de presença por data/turma
- [ ] Frequência por criança
- [ ] Média de presença por turma
- [ ] Alertas de ausência prolongada

---

### 3.7 Módulo: Conteúdo e Comunicação

#### RF-COM-001: Cadastro de Pregações
**Prioridade:** Média  
**Descrição:** Registro de pregações/sermões.

**Critérios de Aceite:**
- [ ] Título, pregador, data
- [ ] Texto bíblico base
- [ ] Link para vídeo (YouTube, etc.)
- [ ] Upload de áudio (opcional)
- [ ] Esboço/notas (markdown)
- [ ] Série de mensagens (agrupamento)

#### RF-COM-002: Eventos
**Prioridade:** Média  
**Descrição:** Calendário de eventos da igreja.

**Critérios de Aceite:**
- [ ] Criação de eventos
- [ ] Data, horário, local
- [ ] Descrição e imagem
- [ ] Visibilidade: público, membros, líderes
- [ ] Integração com Google Calendar (opcional)

---

## 4. Requisitos Não Funcionais

### 4.1 Desempenho

| Requisito | Especificação |
|-----------|---------------|
| RNF-PERF-001 | Tempo de resposta < 200ms para 95% das requisições |
| RNF-PERF-002 | Suportar 1000 usuários simultâneos por tenant |
| RNF-PERF-003 | Tempo de carregamento inicial < 3s (LCP) |
| RNF-PERF-004 | Paginação obrigatória para listas > 50 itens |

### 4.2 Segurança

| Requisito | Especificação |
|-----------|---------------|
| RNF-SEC-001 | Autenticação via JWT com refresh tokens |
| RNF-SEC-002 | Row Level Security (RLS) em todas as tabelas |
| RNF-SEC-003 | HTTPS obrigatório (TLS 1.3) |
| RNF-SEC-004 | Senhas com bcrypt (cost factor 12) |
| RNF-SEC-005 | Rate limiting: 100 req/min por IP |
| RNF-SEC-006 | Sanitização de inputs (XSS prevention) |
| RNF-SEC-007 | CORS restrito por tenant |
| RNF-SEC-008 | Audit log de ações sensíveis |

### 4.3 Disponibilidade

| Requisito | Especificação |
|-----------|---------------|
| RNF-AVL-001 | Uptime 99.9% (exceto manutenção programada) |
| RNF-AVL-002 | Backup diário automático |
| RNF-AVL-003 | Recovery Point Objective (RPO) < 24h |
| RNF-AVL-004 | Recovery Time Objective (RTO) < 4h |

### 4.4 Escalabilidade

| Requisito | Especificação |
|-----------|---------------|
| RNF-ESC-001 | Arquitetura serverless auto-escalável |
| RNF-ESC-002 | Database connection pooling |
| RNF-ESC-003 | CDN para assets estáticos |
| RNF-ESC-004 | Lazy loading de módulos |

### 4.5 Usabilidade

| Requisito | Especificação |
|-----------|---------------|
| RNF-USA-001 | Interface responsiva (mobile-first) |
| RNF-USA-002 | Suporte a PWA (installable) |
| RNF-USA-003 | Acessibilidade WCAG 2.1 AA |
| RNF-USA-004 | Feedback visual em todas as ações |
| RNF-USA-005 | Mensagens de erro claras e acionáveis |

### 4.6 Manutenibilidade

| Requisito | Especificação |
|-----------|---------------|
| RNF-MAN-001 | Cobertura de testes > 70% |
| RNF-MAN-002 | Documentação de API (OpenAPI) |
| RNF-MAN-003 | Logs estruturados (JSON) |
| RNF-MAN-004 | Versionamento semântico |
| RNF-MAN-005 | CI/CD automatizado |

### 4.7 Conformidade

| Requisito | Especificação |
|-----------|---------------|
| RNF-CONF-001 | LGPD compliance |
| RNF-CONF-002 | Termo de consentimento obrigatório |
| RNF-CONF-003 | Direito ao esquecimento implementado |
| RNF-CONF-004 | Exportação de dados pessoais |

---

## 5. Arquitetura Técnica

### 5.1 Estrutura de Diretórios (Next.js App Router)

```
church360/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   ├── register/
│   │   └── forgot-password/
│   ├── (dashboard)/
│   │   ├── layout.tsx          # Layout com sidebar
│   │   ├── page.tsx            # Dashboard home
│   │   ├── members/
│   │   ├── financial/
│   │   ├── volunteers/
│   │   ├── cells/
│   │   ├── kids/
│   │   ├── content/
│   │   └── settings/
│   ├── api/
│   │   └── [...routes]
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/                     # shadcn/ui components
│   ├── forms/
│   ├── tables/
│   └── charts/
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── admin.ts
│   ├── utils/
│   └── validations/
├── hooks/
├── types/
├── middleware.ts               # Multi-tenant routing
└── supabase/
    ├── migrations/
    └── seed.sql
```

### 5.2 Schema do Banco de Dados (Resumo)

```sql
-- Tenants (Igrejas)
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    logo_url TEXT,
    primary_color VARCHAR(7) DEFAULT '#3B82F6',
    secondary_color VARCHAR(7) DEFAULT '#1E40AF',
    plan VARCHAR(50) DEFAULT 'starter',
    member_limit INTEGER DEFAULT 100,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users (com RLS por tenant)
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    tenant_id UUID REFERENCES tenants(id) NOT NULL,
    member_id UUID REFERENCES members(id),
    role VARCHAR(20) NOT NULL, -- pastor, admin, lider, voluntario, membro
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policy Example
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only see their tenant" ON users
    FOR ALL USING (tenant_id = current_setting('app.current_tenant')::uuid);
```

### 5.3 Middleware Multi-Tenant

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const subdomain = hostname.split('.')[0];
  
  // Ignorar domínio principal
  if (subdomain === 'www' || subdomain === 'church360') {
    return NextResponse.next();
  }
  
  // Validar tenant existe
  // ... buscar no cache ou DB
  
  // Adicionar tenant ao header para RLS
  const response = NextResponse.next();
  response.headers.set('x-tenant-slug', subdomain);
  
  return response;
}
```

---

## 6. Histórias de Usuário

### Epic: Gestão de Membros

#### US-MEM-001: Cadastrar novo membro
**Como** ADMIN  
**Quero** cadastrar um novo membro  
**Para** manter o registro atualizado da igreja

**Critérios de Aceite:**
- Dado que estou na tela de membros
- Quando clico em "Novo Membro"
- Então vejo um formulário com campos obrigatórios destacados
- E posso preencher todos os dados do membro
- E ao salvar, o membro aparece na lista

**Story Points:** 5

---

#### US-MEM-002: Criar família
**Como** ADMIN  
**Quero** agrupar membros em famílias  
**Para** facilitar a gestão e comunicação

**Critérios de Aceite:**
- Posso criar uma família a partir de um membro existente
- Posso adicionar cônjuge e filhos
- A visualização mostra a estrutura familiar
- Filhos menores herdam endereço da família

**Story Points:** 8

---

### Epic: Voluntários

#### US-VOL-001: Montar escala
**Como** LÍDER de ministério  
**Quero** criar uma escala de voluntários  
**Para** organizar o serviço do próximo culto

**Critérios de Aceite:**
- Vejo apenas voluntários do meu ministério
- Voluntários indisponíveis aparecem destacados
- Sistema alerta sobre conflitos
- Posso publicar a escala e notificar todos

**Story Points:** 13

---

#### US-VOL-002: Informar indisponibilidade
**Como** VOLUNTÁRIO  
**Quero** informar minhas datas indisponíveis  
**Para** não ser escalado quando não puder servir

**Critérios de Aceite:**
- Posso marcar dias específicos ou períodos
- Minhas indisponibilidades são visíveis para o líder
- Não sou escalado nessas datas

**Story Points:** 3

---

### Epic: Kids

#### US-KIDS-001: Fazer check-in do filho
**Como** MEMBRO (pai/mãe)  
**Quero** fazer o check-in do meu filho pelo celular  
**Para** deixá-lo no ministério infantil com segurança

**Critérios de Aceite:**
- Vejo meus filhos cadastrados
- Posso fazer check-in com 1 clique
- Recebo um código de segurança
- Professor é notificado

**Story Points:** 8

---

## 7. Roadmap de Implementação

### Fase 1: Foundation (Semanas 1-3)
- [ ] Setup do projeto Next.js
- [ ] Configuração Supabase
- [ ] Sistema de autenticação
- [ ] Multi-tenancy básico
- [ ] Layout base e navegação

### Fase 2: Core Members (Semanas 4-6)
- [ ] CRUD de membros
- [ ] Gestão de famílias
- [ ] Busca e filtros
- [ ] Relatórios básicos

### Fase 3: Financial (Semanas 7-9)
- [ ] Entradas (dízimos, ofertas)
- [ ] Saídas com NF
- [ ] Dashboard financeiro
- [ ] Relatórios

### Fase 4: Volunteers (Semanas 10-12)
- [ ] Ministérios
- [ ] Voluntários
- [ ] Sistema de escalas
- [ ] Indisponibilidades
- [ ] Notificações

### Fase 5: Cells (Semanas 13-14)
- [ ] Células
- [ ] Participantes e visitantes
- [ ] Relatórios de célula

### Fase 6: Kids (Semanas 15-17)
- [ ] Turmas e crianças
- [ ] Sistema de check-in
- [ ] Área do responsável

### Fase 7: Polish (Semanas 18-20)
- [ ] Branding personalizado
- [ ] Conteúdo e eventos
- [ ] Testes e QA
- [ ] Documentação

---

## 8. Glossário de Termos de Negócio

| Termo | Definição |
|-------|-----------|
| **Dízimo** | Contribuição de 10% da renda do membro |
| **Oferta** | Contribuição voluntária de qualquer valor |
| **Célula** | Pequeno grupo que se reúne semanalmente em casas |
| **Ministério** | Departamento de serviço (Louvor, Kids, Recepção, etc.) |
| **Escala** | Distribuição de voluntários para atividades |
| **Check-in** | Registro de entrada de criança no culto |
| **Checkout** | Retirada da criança com código de segurança |
| **Membresia** | Data de filiação oficial à igreja |
| **Batismo** | Sacramento que marca conversão |

---

## Apêndice A: Wireframes de Referência

> Wireframes serão criados na ferramenta Figma e linkados aqui.

## Apêndice B: Matriz de Permissões

| Funcionalidade | PASTOR | ADMIN | LÍDER | VOLUNTÁRIO | MEMBRO |
|----------------|--------|-------|-------|------------|--------|
| Dashboard Geral | ✅ | ✅ | 📊 | ❌ | ❌ |
| Gestão Usuários | ✅ | ⚠️ | ❌ | ❌ | ❌ |
| Membros - Ver | ✅ | ✅ | ⚠️ | ❌ | ❌ |
| Membros - Editar | ✅ | ✅ | ❌ | ❌ | ❌ |
| Financeiro | ✅ | ✅ | ❌ | ❌ | ❌ |
| Ministérios - Config | ✅ | ✅ | ❌ | ❌ | ❌ |
| Escalas - Criar | ✅ | ✅ | ✅* | ❌ | ❌ |
| Escalas - Ver | ✅ | ✅ | ✅ | ✅* | ❌ |
| Indisponibilidade | ✅ | ✅ | ✅ | ✅ | ❌ |
| Células - Config | ✅ | ✅ | ✅* | ❌ | ❌ |
| Células - Relatório | ✅ | ✅ | ✅* | ❌ | ❌ |
| Kids - Config | ✅ | ✅ | ❌ | ❌ | ❌ |
| Kids - Check-in | ✅ | ✅ | ✅ | ✅ | ✅* |
| Pregações - Ver | ✅ | ✅ | ✅ | ✅ | ✅ |
| Eventos - Ver | ✅ | ✅ | ✅ | ✅ | ✅ |
| Configurações Igreja | ✅ | ⚠️ | ❌ | ❌ | ❌ |

**Legenda:**
- ✅ Acesso total
- ⚠️ Acesso parcial/restrito
- ❌ Sem acesso
- 📊 Apenas visualização
- \* Apenas seus próprios dados/ministério

---

*Documento gerado em Janeiro 2025. Versão 1.0.0*
