# TASK-003: Sistema de Autenticação

**Status:** 🔴 Não iniciado  
**Prioridade:** P0 - Crítico  
**Estimativa:** 4-5 horas  
**Requisito:** RF-AUTH-001, RF-AUTH-002  
**Depende de:** TASK-002

---

## Objetivo
Implementar o sistema completo de autenticação incluindo login, registro de igreja, recuperação de senha e proteção de rotas.

---

## Checklist

### 1. Configurar Supabase Auth Helpers
- [ ] Criar `lib/supabase/client.ts`:
  ```typescript
  import { createBrowserClient } from '@supabase/ssr';
  import { Database } from '@/types/database.types';

  export const createClient = () =>
    createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  ```

- [ ] Criar `lib/supabase/server.ts`:
  ```typescript
  import { createServerClient } from '@supabase/ssr';
  import { cookies } from 'next/headers';
  import { Database } from '@/types/database.types';

  export const createClient = () => {
    const cookieStore = cookies();
    return createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          },
        },
      }
    );
  };
  ```

- [ ] Criar `lib/supabase/middleware.ts`

### 2. Middleware de Autenticação
- [ ] Criar `middleware.ts` na raiz:
  ```typescript
  import { NextResponse } from 'next/server';
  import type { NextRequest } from 'next/server';
  import { createClient } from '@/lib/supabase/middleware';

  export async function middleware(request: NextRequest) {
    const { supabase, response } = createClient(request);
    
    // Extrair subdomain
    const hostname = request.headers.get('host') || '';
    const subdomain = hostname.split('.')[0];
    
    // Refresh session
    const { data: { session } } = await supabase.auth.getSession();
    
    // Rotas públicas
    const publicPaths = ['/login', '/register', '/forgot-password'];
    const isPublicPath = publicPaths.some(path => 
      request.nextUrl.pathname.startsWith(path)
    );
    
    // Redirecionar se não autenticado
    if (!session && !isPublicPath) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    // Adicionar tenant ao header
    response.headers.set('x-tenant-slug', subdomain);
    
    return response;
  }

  export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico|api/auth).*)'],
  };
  ```

### 3. Página de Login
- [ ] Criar `app/(auth)/login/page.tsx`
- [ ] Implementar formulário com:
  - Email
  - Senha
  - Lembrar-me
  - Link "Esqueci senha"
- [ ] Server Action para login:
  ```typescript
  'use server';
  
  export async function login(formData: FormData) {
    const supabase = createClient();
    
    const { error } = await supabase.auth.signInWithPassword({
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    });
    
    if (error) {
      return { error: error.message };
    }
    
    redirect('/dashboard');
  }
  ```
- [ ] Validação com Zod
- [ ] Feedback de erro/sucesso
- [ ] Loading state

### 4. Página de Registro de Igreja
- [ ] Criar `app/(auth)/register/page.tsx`
- [ ] Implementar formulário multi-step:
  
  **Step 1: Dados da Igreja**
  - Nome da igreja
  - Slug (subdomínio) - com validação de disponibilidade
  
  **Step 2: Dados do Pastor**
  - Nome completo
  - Email
  - Telefone
  
  **Step 3: Senha**
  - Senha
  - Confirmar senha
  
- [ ] Server Action para registro:
  ```typescript
  'use server';
  
  export async function registerChurch(data: RegisterData) {
    const supabase = createServerClient(); // Admin client
    
    // 1. Verificar slug disponível
    const { data: existing } = await supabase
      .from('tenants')
      .select('id')
      .eq('slug', data.slug)
      .single();
    
    if (existing) {
      return { error: 'Este subdomínio já está em uso' };
    }
    
    // 2. Criar tenant
    const { data: tenant, error: tenantError } = await supabase
      .from('tenants')
      .insert({
        name: data.churchName,
        slug: data.slug,
      })
      .select()
      .single();
    
    if (tenantError) {
      return { error: 'Erro ao criar igreja' };
    }
    
    // 3. Criar usuário auth
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
      user_metadata: {
        tenant_id: tenant.id,
        full_name: data.pastorName,
        role: 'pastor',
      },
    });
    
    if (authError) {
      // Rollback: deletar tenant
      await supabase.from('tenants').delete().eq('id', tenant.id);
      return { error: 'Erro ao criar usuário' };
    }
    
    // 4. Redirecionar para login no novo subdomínio
    return { 
      success: true, 
      redirectUrl: `https://${data.slug}.church360.com.br/login` 
    };
  }
  ```
- [ ] Validação em tempo real do slug
- [ ] Termos de uso e privacidade

### 5. Página de Recuperação de Senha
- [ ] Criar `app/(auth)/forgot-password/page.tsx`
- [ ] Implementar formulário de email
- [ ] Server Action para envio:
  ```typescript
  'use server';
  
  export async function forgotPassword(email: string) {
    const supabase = createClient();
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`,
    });
    
    // Sempre retornar sucesso (segurança)
    return { success: true };
  }
  ```
- [ ] Criar `app/(auth)/reset-password/page.tsx` para nova senha

### 6. Layout de Autenticação
- [ ] Criar `app/(auth)/layout.tsx`
- [ ] Design clean com logo Church360
- [ ] Responsivo (mobile-first)
- [ ] Animações sutis

### 7. Componentes Reutilizáveis
- [ ] `AuthCard` - container para formulários
- [ ] `PasswordInput` - input com show/hide
- [ ] `SlugInput` - input com validação e preview

### 8. Hooks de Autenticação
- [ ] Criar `hooks/useAuth.ts`:
  ```typescript
  export function useAuth() {
    const supabase = createClient();
    
    return {
      signIn: async (email: string, password: string) => {...},
      signOut: async () => {...},
      getUser: async () => {...},
    };
  }
  ```
- [ ] Criar `hooks/useUser.ts` para dados do usuário logado

### 9. Proteção de Rotas (Client-side)
- [ ] Criar `components/AuthGuard.tsx`
- [ ] Redirect automático se não autenticado
- [ ] Loading state durante verificação

### 10. Testes
- [ ] Testar fluxo de login
- [ ] Testar registro de nova igreja
- [ ] Testar recuperação de senha
- [ ] Testar redirecionamentos
- [ ] Testar isolamento multi-tenant

---

## Critérios de Aceite
- [ ] Login funcionando com email/senha
- [ ] Registro cria tenant + usuário pastor
- [ ] Recuperação de senha enviando email
- [ ] Rotas protegidas redirecionam para login
- [ ] Sessão persistida (7 dias)
- [ ] Logout funcionando

---

## Wireframes de Referência

### Login
```
┌─────────────────────────────────────┐
│                                     │
│          [Logo Church360]           │
│                                     │
│    ┌─────────────────────────┐      │
│    │ Email                   │      │
│    └─────────────────────────┘      │
│    ┌─────────────────────────┐      │
│    │ Senha              [👁] │      │
│    └─────────────────────────┘      │
│                                     │
│    [ ] Lembrar-me                   │
│                                     │
│    [        Entrar        ]         │
│                                     │
│    Esqueceu a senha?                │
│                                     │
│    ─────────────────────────        │
│                                     │
│    Ainda não tem conta?             │
│    Cadastre sua igreja              │
│                                     │
└─────────────────────────────────────┘
```

---

## Notas de Implementação
[Adicionar notas durante a implementação]

---

*Criada em: Janeiro 2025*
