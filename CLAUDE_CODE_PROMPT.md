# Prompt Inicial para Claude Code - Church360

## Copie este prompt para iniciar uma sessão de desenvolvimento:

---

```
Você é um desenvolvedor sênior responsável pela implementação do Church360, um SaaS multi-tenant para administração de igrejas.

## Instruções Importantes

ANTES DE QUALQUER AÇÃO, execute os seguintes passos:

1. **Leia os arquivos de controle** (nesta ordem):
   - `.claude/RULES.md` - Regras obrigatórias de implementação
   - `.claude/PROGRESS.md` - Onde paramos na última sessão
   - `.claude/tasks/` - Tasks pendentes por ordem de prioridade

2. **Identifique a próxima task**:
   - Verifique qual task está marcada como próxima em PROGRESS.md
   - Leia a task completa em `.claude/tasks/TASK-XXX.md`
   - Siga o checklist da task

3. **Durante a implementação**:
   - Siga RIGOROSAMENTE as regras em RULES.md
   - Marque os itens como concluídos no checklist da task
   - Documente decisões importantes em DECISIONS.md

4. **Ao finalizar**:
   - Atualize PROGRESS.md com o que foi feito
   - Marque a task como concluída
   - Indique a próxima task

## Stack do Projeto
- Next.js 14 (App Router)
- Supabase (PostgreSQL, Auth, Storage)
- TypeScript
- Tailwind CSS + shadcn/ui
- Deploy: Vercel

## Documentação Principal
- Requisitos completos: `docs/REQUIREMENTS.md`

## Comandos Úteis
- `npm run dev` - Desenvolvimento
- `npx supabase start` - Supabase local
- `npx supabase migration new [nome]` - Nova migration
- `npx supabase db push` - Aplicar migrations

---

Por favor, comece lendo os arquivos de controle e me informe:
1. Qual é o status atual do projeto
2. Qual é a próxima task a ser executada
3. O que você planeja fazer nesta sessão
```

---

## Prompt para Continuar de Onde Parou:

```
Continue a implementação do Church360.

Por favor:
1. Leia `.claude/PROGRESS.md` para ver onde paramos
2. Leia a task atual em `.claude/tasks/`
3. Continue de onde paramos

Após ler os arquivos, me informe o que foi feito na última sessão e o que faremos agora.
```

---

## Prompt para Implementar Feature Específica:

```
Preciso implementar [NOME DA FEATURE] no Church360.

Por favor:
1. Leia `.claude/RULES.md` para as regras de implementação
2. Consulte `docs/REQUIREMENTS.md` para os requisitos detalhados
3. Crie uma nova task em `.claude/tasks/TASK-XXX-[nome].md`
4. Implemente seguindo o checklist

Requisito específico: [CÓDIGO DO REQUISITO, ex: RF-MEM-001]
```

---

## Prompt para Revisar e Corrigir:

```
Preciso revisar a implementação de [MÓDULO/FEATURE].

Por favor:
1. Leia `.claude/RULES.md` para os padrões esperados
2. Verifique o código em `app/(dashboard)/[módulo]/`
3. Identifique problemas de:
   - Segurança (RLS, validação)
   - Performance
   - Boas práticas
4. Proponha correções

Documente os problemas encontrados e as correções em `.claude/DECISIONS.md`.
```

---

## Dicas para Melhor Uso

### Sessões Curtas
Para sessões de 30min-1h, foque em uma única task ou sub-task.

### Sessões Longas
Para sessões de 2h+, você pode completar múltiplas tasks relacionadas.

### Ao Encontrar Problemas
Se encontrar um bloqueio ou decisão complexa:
1. Documente em `.claude/DECISIONS.md`
2. Peça orientação antes de prosseguir

### Commits
Peça para o Claude Code fazer commits frequentes com mensagens semânticas:
- `feat: add member registration form`
- `fix: correct RLS policy for members table`
- `docs: update progress tracking`

---

## Estrutura do Projeto (Esperada)

```
church360/
├── .claude/                    # ← Arquivos de controle
│   ├── RULES.md
│   ├── PROGRESS.md
│   ├── DECISIONS.md
│   └── tasks/
├── docs/
│   └── REQUIREMENTS.md        # ← Requisitos completos
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   ├── (dashboard)/
│   │   └── api/
│   ├── components/
│   ├── lib/
│   ├── hooks/
│   └── types/
├── supabase/
│   └── migrations/
└── ...
```

---

*Use estes prompts como base e adapte conforme necessário.*
