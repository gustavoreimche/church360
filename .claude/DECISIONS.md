# Church360 - Registro de Decisões Técnicas (ADR)

> Documento para registrar decisões arquiteturais e técnicas importantes.

---

## Índice de Decisões

| ID | Título | Status | Data |
|----|--------|--------|------|
| ADR-001 | Stack tecnológica | Aceito | Jan/2025 |
| ADR-002 | Estratégia Multi-Tenant | Aceito | Jan/2025 |
| ADR-003 | Gerenciamento de Estado | Pendente | - |

---

## ADR-001: Stack Tecnológica

### Status
Aceito

### Contexto
Precisamos definir a stack tecnológica para o desenvolvimento do Church360, considerando:
- Facilidade de desenvolvimento
- Performance
- Custo de infraestrutura
- Escalabilidade
- Time to market

### Decisão
Utilizar:
- **Frontend/Backend:** Next.js 14+ (App Router)
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth
- **Deploy:** Vercel
- **UI:** shadcn/ui + Tailwind CSS

### Justificativa
1. **Next.js + Vercel:** Integração perfeita, deploy simplificado, edge functions
2. **Supabase:** Inclui DB, Auth, Storage, Realtime em um só serviço
3. **RLS nativo:** Segurança multi-tenant no nível do banco
4. **shadcn/ui:** Componentes acessíveis e customizáveis

### Consequências
- **Positivas:** Desenvolvimento rápido, custos iniciais baixos, boa DX
- **Negativas:** Lock-in parcial com Vercel/Supabase

---

## ADR-002: Estratégia Multi-Tenant

### Status
Aceito

### Contexto
O sistema precisa suportar múltiplas igrejas (tenants) com isolamento total de dados.

### Opções Consideradas

#### Opção A: Database por Tenant
- Um banco de dados separado para cada igreja
- **Prós:** Isolamento total, fácil backup/restore por tenant
- **Contras:** Complexidade de gestão, custo elevado, difícil manutenção

#### Opção B: Schema por Tenant
- Um schema PostgreSQL por igreja
- **Prós:** Bom isolamento, migrations mais simples
- **Contras:** Limite de schemas, complexidade de conexão

#### Opção C: Tenant Column + RLS ✅
- Coluna `tenant_id` em todas as tabelas
- Row Level Security para isolamento
- **Prós:** Simples, econômico, escala bem
- **Contras:** Requer disciplina para não esquecer RLS

### Decisão
**Opção C: Tenant Column + RLS**

### Implementação
```sql
-- Todas as tabelas terão
tenant_id UUID REFERENCES tenants(id) NOT NULL

-- RLS obrigatório
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tenant_isolation" ON table_name
    FOR ALL USING (
        tenant_id = (auth.jwt() -> 'app_metadata' ->> 'tenant_id')::uuid
    );
```

### Consequências
- Toda query automaticamente filtrada por tenant
- Impossível vazamento de dados entre tenants
- Precisa de cuidado ao criar novas tabelas

---

## ADR-003: Gerenciamento de Estado

### Status
Pendente

### Contexto
Definir como gerenciar estado no frontend.

### Opções
1. **React Query + Context:** Para server state e estado global simples
2. **Zustand:** Estado global leve
3. **Jotai:** Estado atômico

### Decisão
[A definir durante implementação]

---

## Template para Novas Decisões

```markdown
## ADR-XXX: [Título]

### Status
[Proposto | Aceito | Depreciado | Substituído por ADR-XXX]

### Contexto
[Descreva o contexto e o problema]

### Opções Consideradas
[Liste as opções avaliadas]

### Decisão
[Qual opção foi escolhida]

### Justificativa
[Por que esta opção]

### Consequências
[Impactos positivos e negativos]
```

---

*Documento vivo - atualizar conforme novas decisões são tomadas.*
