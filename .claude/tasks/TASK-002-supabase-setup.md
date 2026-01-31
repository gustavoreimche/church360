# TASK-002: Configuração do Supabase e Schema Inicial

**Status:** 🔴 Não iniciado  
**Prioridade:** P0 - Crítico  
**Estimativa:** 3-4 horas  
**Requisito:** RF-AUTH-001, Foundation  
**Depende de:** TASK-001

---

## Objetivo
Configurar o projeto Supabase, criar as migrations iniciais para multi-tenancy e configurar Row Level Security.

---

## Checklist

### 1. Criar Projeto no Supabase
- [ ] Acessar [supabase.com](https://supabase.com)
- [ ] Criar novo projeto "church360"
- [ ] Anotar credenciais:
  - Project URL
  - Anon Key
  - Service Role Key
- [ ] Atualizar `.env.local`

### 2. Configurar Supabase CLI (Local Dev)
- [ ] Instalar CLI: `npm install supabase --save-dev`
- [ ] Inicializar: `npx supabase init`
- [ ] Login: `npx supabase login`
- [ ] Link projeto: `npx supabase link --project-ref [PROJECT_REF]`

### 3. Migration: Tabela Tenants
- [ ] Criar migration: `npx supabase migration new create_tenants`
- [ ] Implementar:
  ```sql
  -- Tabela de igrejas (tenants)
  CREATE TABLE public.tenants (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(255) NOT NULL,
      slug VARCHAR(100) UNIQUE NOT NULL,
      
      -- Branding
      logo_url TEXT,
      primary_color VARCHAR(7) DEFAULT '#3B82F6',
      secondary_color VARCHAR(7) DEFAULT '#1E40AF',
      
      -- Licenciamento
      plan VARCHAR(50) DEFAULT 'starter',
      member_limit INTEGER DEFAULT 100,
      
      -- Status
      status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
      
      -- Metadados
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
  );

  -- Índices
  CREATE INDEX idx_tenants_slug ON public.tenants(slug);
  CREATE INDEX idx_tenants_status ON public.tenants(status);

  -- Trigger para updated_at
  CREATE OR REPLACE FUNCTION update_updated_at()
  RETURNS TRIGGER AS $$
  BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;

  CREATE TRIGGER tenants_updated_at
      BEFORE UPDATE ON public.tenants
      FOR EACH ROW EXECUTE FUNCTION update_updated_at();
  ```

### 4. Migration: Tabela Users (Perfis)
- [ ] Criar migration: `npx supabase migration new create_users`
- [ ] Implementar:
  ```sql
  -- Tabela de perfis de usuário
  CREATE TABLE public.users (
      id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
      tenant_id UUID REFERENCES public.tenants(id) NOT NULL,
      
      -- Dados básicos
      full_name VARCHAR(255),
      avatar_url TEXT,
      
      -- Permissões
      role VARCHAR(20) NOT NULL DEFAULT 'membro' 
          CHECK (role IN ('pastor', 'admin', 'lider', 'voluntario', 'membro')),
      
      -- Vínculo com membro (opcional)
      member_id UUID, -- Será FK quando criar tabela members
      
      -- Status
      status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
      
      -- Metadados
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
  );

  -- Índices
  CREATE INDEX idx_users_tenant ON public.users(tenant_id);
  CREATE INDEX idx_users_role ON public.users(role);

  -- RLS
  ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
  ```

### 5. Configurar RLS Policies
- [ ] Policy para tenants (apenas admins do sistema):
  ```sql
  -- Tenants são visíveis apenas para usuários autenticados do tenant
  CREATE POLICY "Users can view own tenant" ON public.tenants
      FOR SELECT USING (
          id = (SELECT tenant_id FROM public.users WHERE id = auth.uid())
      );
  ```

- [ ] Policy para users:
  ```sql
  -- Usuários só veem outros usuários do mesmo tenant
  CREATE POLICY "Users can view same tenant users" ON public.users
      FOR SELECT USING (
          tenant_id = (SELECT tenant_id FROM public.users WHERE id = auth.uid())
      );

  -- Usuários podem atualizar apenas seu próprio perfil
  CREATE POLICY "Users can update own profile" ON public.users
      FOR UPDATE USING (id = auth.uid());
  ```

### 6. Function: Criar Usuário com Tenant
- [ ] Criar function para registro:
  ```sql
  CREATE OR REPLACE FUNCTION public.handle_new_user()
  RETURNS TRIGGER AS $$
  DECLARE
      _tenant_id UUID;
  BEGIN
      -- Buscar tenant_id do metadata (setado durante registro)
      _tenant_id := (NEW.raw_user_meta_data->>'tenant_id')::UUID;
      
      -- Criar perfil do usuário
      INSERT INTO public.users (id, tenant_id, full_name, role)
      VALUES (
          NEW.id,
          _tenant_id,
          COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
          COALESCE(NEW.raw_user_meta_data->>'role', 'membro')
      );
      
      RETURN NEW;
  END;
  $$ LANGUAGE plpgsql SECURITY DEFINER;

  -- Trigger após criar usuário no auth
  CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
  ```

### 7. Aplicar Migrations
- [ ] Push para Supabase: `npx supabase db push`
- [ ] Verificar no dashboard do Supabase
- [ ] Testar criação de tenant via SQL Editor

### 8. Configurar Types Gerados
- [ ] Gerar types: `npx supabase gen types typescript --local > src/types/database.types.ts`
- [ ] Verificar types gerados

### 9. Testar Conexão
- [ ] Criar script de teste em `scripts/test-db.ts`
- [ ] Testar conexão e operações básicas
- [ ] Verificar RLS funcionando

---

## Critérios de Aceite
- [ ] Tabelas `tenants` e `users` criadas
- [ ] RLS habilitado e testado
- [ ] Trigger de criação de usuário funcionando
- [ ] Types TypeScript gerados
- [ ] Conexão testada localmente

---

## Notas de Implementação
[Adicionar notas durante a implementação]

---

## SQL de Referência para Testes
```sql
-- Inserir tenant de teste
INSERT INTO public.tenants (name, slug) 
VALUES ('Igreja Teste', 'igreja-teste');

-- Verificar
SELECT * FROM public.tenants;
```

---

*Criada em: Janeiro 2025*
