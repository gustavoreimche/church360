# Church360 - Regras de Implementação para Claude Code

> **LEIA ESTE ARQUIVO ANTES DE QUALQUER AÇÃO**
> Este documento contém as regras obrigatórias para implementação do projeto Church360.

---

## 🎯 Objetivo
Implementar o SaaS Church360 seguindo o documento de requisitos (`REQUIREMENTS.md`) de forma incremental, mantendo rastreabilidade e permitindo continuidade entre sessões.

---

## 📋 Regras Obrigatórias

### 1. Sempre Ler Primeiro
Antes de qualquer implementação, SEMPRE leia:
1. Este arquivo (`RULES.md`)
2. O arquivo de progresso (`PROGRESS.md`)
3. As tasks pendentes em `tasks/`
4. O requisito específico em `REQUIREMENTS.md`

### 2. Atualizar Progresso
Após CADA implementação concluída:
1. Marque como ✅ no `PROGRESS.md`
2. Atualize a task correspondente em `tasks/`
3. Documente decisões técnicas relevantes

### 3. Commits Semânticos
Use o padrão de commits:
```
feat: nova funcionalidade
fix: correção de bug
docs: documentação
style: formatação
refactor: refatoração
test: testes
chore: manutenção
```

### 4. Estrutura de Código

#### Padrões Next.js
```typescript
// Sempre usar App Router
// Componentes Server por padrão
// Client Components apenas quando necessário ('use client')
// Server Actions para mutações
```

#### Nomenclatura
```
Componentes: PascalCase (MemberForm.tsx)
Hooks: camelCase com 'use' (useMember.ts)
Utils: camelCase (formatDate.ts)
Types: PascalCase (Member.ts)
API Routes: kebab-case (route.ts em /api/members)
```

#### Arquivos por Módulo
```
app/(dashboard)/members/
├── page.tsx              # Lista de membros
├── [id]/
│   ├── page.tsx          # Detalhes do membro
│   └── edit/
│       └── page.tsx      # Edição
├── new/
│   └── page.tsx          # Novo membro
├── _components/          # Componentes específicos
│   ├── MemberForm.tsx
│   ├── MemberTable.tsx
│   └── MemberFilters.tsx
├── _actions/             # Server Actions
│   └── memberActions.ts
└── _lib/                 # Utils específicos
    └── memberValidation.ts
```

### 5. Supabase

#### Row Level Security (RLS) - OBRIGATÓRIO
```sql
-- TODA tabela deve ter RLS habilitado
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;

-- Policies por tenant
CREATE POLICY "tenant_isolation" ON table_name
    FOR ALL USING (tenant_id = auth.jwt() ->> 'tenant_id');
```

#### Migrations
```bash
# Criar migration
supabase migration new nome_da_migration

# Aplicar
supabase db push
```

### 6. Autenticação e Multi-Tenancy

```typescript
// Sempre extrair tenant do middleware
// Nunca confiar em tenant_id do cliente
// Validar permissões em Server Actions

// middleware.ts - extrair subdomain
// lib/supabase/server.ts - injetar tenant_id
```

### 7. Validação

```typescript
// Usar Zod para validação
import { z } from 'zod';

const MemberSchema = z.object({
  full_name: z.string().min(3),
  email: z.string().email().optional(),
  // ...
});
```

### 8. Tratamento de Erros

```typescript
// Server Actions devem retornar resultado tipado
type ActionResult<T> = 
  | { success: true; data: T }
  | { success: false; error: string };

// Nunca expor erros internos ao usuário
// Logar erros para debugging
```

### 9. Testes

```typescript
// Testes unitários para utils
// Testes de integração para Server Actions
// Testes E2E para fluxos críticos
```

### 10. Performance

```typescript
// Usar Suspense para loading states
// Implementar paginação cursor-based
// Lazy load módulos pesados
// Otimizar queries Supabase
```

---

## 🔄 Fluxo de Trabalho

### Ao Iniciar Sessão
```
1. Ler RULES.md (este arquivo)
2. Ler PROGRESS.md para ver onde parou
3. Verificar tasks/ para próxima task
4. Implementar seguindo REQUIREMENTS.md
5. Testar localmente
6. Atualizar PROGRESS.md
7. Commit com mensagem semântica
```

### Ao Criar Nova Feature
```
1. Criar task em tasks/TASK-XXX.md
2. Definir critérios de aceite
3. Implementar incrementalmente
4. Marcar subtasks como concluídas
5. Atualizar PROGRESS.md
```

### Ao Encontrar Problema
```
1. Documentar em DECISIONS.md
2. Propor solução
3. Implementar
4. Atualizar documentação
```

---

## 📁 Estrutura do Projeto

```
church360/
├── .claude/                    # Arquivos de controle
│   ├── RULES.md               # Este arquivo
│   ├── PROGRESS.md            # Progresso geral
│   ├── DECISIONS.md           # Decisões técnicas
│   └── tasks/                 # Tasks individuais
│       ├── TASK-001.md
│       └── ...
├── docs/
│   └── REQUIREMENTS.md        # Requisitos completos
├── app/                       # Next.js App Router
├── components/                # Componentes reutilizáveis
├── lib/                       # Utilitários e configs
├── hooks/                     # Custom hooks
├── types/                     # TypeScript types
├── supabase/                  # Migrations e seeds
└── tests/                     # Testes
```

---

## 🚦 Prioridades de Implementação

### P0 - Crítico (fazer primeiro)
- Setup inicial do projeto
- Autenticação
- Multi-tenancy
- RLS no Supabase

### P1 - Alto
- CRUD de membros
- Sistema financeiro básico
- Layout e navegação

### P2 - Médio
- Voluntários e escalas
- Células
- Notificações

### P3 - Baixo
- Kids check-in
- Branding
- Relatórios avançados

---

## ⚠️ Não Fazer

- ❌ Implementar feature sem task documentada
- ❌ Pular RLS em qualquer tabela
- ❌ Hardcodar tenant_id
- ❌ Expor dados de um tenant para outro
- ❌ Ignorar validação de inputs
- ❌ Fazer commit sem atualizar PROGRESS.md
- ❌ Implementar fora da ordem de prioridade sem justificativa

---

## 🔐 Segurança - Checklist

Antes de cada commit, verificar:
- [ ] RLS habilitado em novas tabelas?
- [ ] Tenant isolation implementado?
- [ ] Inputs validados com Zod?
- [ ] Permissões verificadas em Server Actions?
- [ ] Dados sensíveis não expostos em logs?
- [ ] CORS configurado corretamente?

---

## 📞 Comandos Úteis

```bash
# Desenvolvimento
npm run dev

# Supabase local
supabase start
supabase db reset

# Testes
npm run test
npm run test:e2e

# Build
npm run build

# Lint
npm run lint
```

---

## 🎨 Stack de UI

- **shadcn/ui** - Componentes base
- **Tailwind CSS** - Estilização
- **Lucide Icons** - Ícones
- **Recharts** - Gráficos
- **React Hook Form** - Formulários
- **Zod** - Validação

---

*Última atualização: Janeiro 2025*
