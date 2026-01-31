# Church360 - Documentação do Projeto

Este repositório contém toda a documentação necessária para implementar o Church360, um SaaS multi-tenant para administração de igrejas.

---

## 📁 Estrutura dos Arquivos

```
church360-docs/
├── README.md                    # Este arquivo
├── REQUIREMENTS.md              # Documento de requisitos completo (SRS)
├── CLAUDE_CODE_PROMPT.md        # Prompts para usar com Claude Code
└── .claude/                     # Arquivos de controle de implementação
    ├── RULES.md                 # Regras obrigatórias de desenvolvimento
    ├── PROGRESS.md              # Tracking de progresso
    ├── DECISIONS.md             # Registro de decisões técnicas (ADR)
    └── tasks/                   # Tasks individuais
        ├── TASK-001-setup-inicial.md
        ├── TASK-002-supabase-setup.md
        └── TASK-003-autenticacao.md
```

---

## 🚀 Como Usar

### 1. Entenda o Projeto
Comece lendo o `REQUIREMENTS.md` para entender completamente o escopo e funcionalidades do Church360.

### 2. Configure o Ambiente
Siga a `TASK-001` em `.claude/tasks/` para fazer o setup inicial do projeto.

### 3. Use o Claude Code
Copie o prompt de `CLAUDE_CODE_PROMPT.md` e cole no Claude Code para iniciar ou continuar a implementação.

### 4. Mantenha o Tracking
Sempre atualize `PROGRESS.md` ao final de cada sessão de desenvolvimento.

---

## 📋 Documentos Principais

### REQUIREMENTS.md
Documento de requisitos completo no padrão SRS (Software Requirements Specification) contendo:
- Requisitos funcionais por módulo
- Requisitos não funcionais
- Arquitetura técnica
- User stories
- Roadmap de implementação

### RULES.md
Regras obrigatórias que devem ser seguidas durante toda a implementação:
- Padrões de código
- Estrutura de arquivos
- Convenções de nomenclatura
- Checklist de segurança

### PROGRESS.md
Tracking de progresso com:
- Visão geral das fases
- Checklist detalhado por funcionalidade
- Histórico de sessões de desenvolvimento

### DECISIONS.md
Registro de decisões técnicas (Architecture Decision Records):
- Stack tecnológica
- Estratégia multi-tenant
- Outras decisões importantes

---

## 🎯 Ordem de Implementação

### Fase 1: Foundation (Prioridade P0)
1. Setup do projeto Next.js
2. Configuração Supabase
3. Sistema de autenticação
4. Multi-tenancy

### Fase 2: Core (Prioridade P1)
1. CRUD de membros
2. Sistema financeiro
3. Layout e navegação

### Fase 3: Features (Prioridade P2)
1. Voluntários e escalas
2. Células
3. Notificações

### Fase 4: Avançado (Prioridade P3)
1. Kids check-in
2. Branding personalizado
3. Relatórios avançados

---

## 🛠 Stack Tecnológica

| Camada | Tecnologia |
|--------|------------|
| Frontend | Next.js 14 (App Router) |
| Backend | Next.js API Routes + Server Actions |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| UI | shadcn/ui + Tailwind CSS |
| Deploy | Vercel |

---

## 📞 Comandos Úteis

```bash
# Desenvolvimento
npm run dev

# Supabase
npx supabase start           # Iniciar local
npx supabase migration new   # Nova migration
npx supabase db push         # Aplicar migrations
npx supabase gen types       # Gerar types

# Testes
npm run test
npm run test:e2e

# Build
npm run build
npm run lint
```

---

## 🔗 Links Úteis

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Vercel Docs](https://vercel.com/docs)

---

## 📝 Notas

- Todos os arquivos `.claude/` devem ser commitados junto com o código
- Mantenha o `PROGRESS.md` sempre atualizado
- Documente decisões importantes em `DECISIONS.md`
- Crie tasks detalhadas antes de implementar features complexas

---

*Documentação criada em Janeiro 2025*
