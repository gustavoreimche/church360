# TASK-001: Setup Inicial do Projeto

**Status:** 🔴 Não iniciado  
**Prioridade:** P0 - Crítico  
**Estimativa:** 2-3 horas  
**Requisito:** Foundation  

---

## Objetivo
Criar a estrutura inicial do projeto Next.js com todas as dependências e configurações necessárias.

---

## Checklist

### 1. Criar Projeto Next.js
- [ ] `npx create-next-app@latest church360 --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"`
- [ ] Verificar estrutura de pastas criada
- [ ] Fazer commit inicial

### 2. Configurar ESLint e Prettier
- [ ] Instalar dependências:
  ```bash
  npm install -D prettier eslint-config-prettier eslint-plugin-prettier
  ```
- [ ] Criar `.prettierrc`:
  ```json
  {
    "semi": true,
    "singleQuote": true,
    "tabWidth": 2,
    "trailingComma": "es5"
  }
  ```
- [ ] Atualizar `.eslintrc.json`

### 3. Instalar shadcn/ui
- [ ] `npx shadcn-ui@latest init`
- [ ] Selecionar estilo: Default
- [ ] Cor base: Slate
- [ ] CSS variables: Yes
- [ ] Instalar componentes base:
  ```bash
  npx shadcn-ui@latest add button card input label form dialog dropdown-menu avatar toast
  ```

### 4. Estrutura de Pastas
- [ ] Criar estrutura:
  ```
  src/
  ├── app/
  │   ├── (auth)/
  │   ├── (dashboard)/
  │   └── api/
  ├── components/
  │   ├── ui/          (shadcn)
  │   ├── forms/
  │   └── layout/
  ├── lib/
  │   ├── supabase/
  │   ├── utils/
  │   └── validations/
  ├── hooks/
  ├── types/
  └── styles/
  ```

### 5. Configurar Variáveis de Ambiente
- [ ] Criar `.env.local`:
  ```env
  NEXT_PUBLIC_SUPABASE_URL=
  NEXT_PUBLIC_SUPABASE_ANON_KEY=
  SUPABASE_SERVICE_ROLE_KEY=
  ```
- [ ] Criar `.env.example` sem valores sensíveis

### 6. Instalar Dependências Adicionais
- [ ] Executar:
  ```bash
  npm install @supabase/supabase-js @supabase/ssr
  npm install zod react-hook-form @hookform/resolvers
  npm install lucide-react
  npm install date-fns
  ```

### 7. Configurar Supabase Client
- [ ] Criar `lib/supabase/client.ts` (browser)
- [ ] Criar `lib/supabase/server.ts` (server components)
- [ ] Criar `lib/supabase/middleware.ts` (middleware)

### 8. README do Projeto
- [ ] Criar README.md com:
  - Descrição do projeto
  - Requisitos
  - Como rodar localmente
  - Estrutura de pastas
  - Comandos úteis

### 9. Commit e Push
- [ ] Revisar alterações
- [ ] Commit: `chore: initial project setup with Next.js 14, shadcn/ui, and Supabase`
- [ ] Push para repositório

---

## Critérios de Aceite
- [ ] Projeto roda localmente sem erros
- [ ] shadcn/ui componentes funcionando
- [ ] Estrutura de pastas criada
- [ ] Variáveis de ambiente configuradas
- [ ] README atualizado

---

## Notas de Implementação
[Adicionar notas durante a implementação]

---

## Referências
- [Next.js Docs](https://nextjs.org/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [Supabase SSR](https://supabase.com/docs/guides/auth/server-side-rendering)

---

*Criada em: Janeiro 2025*
