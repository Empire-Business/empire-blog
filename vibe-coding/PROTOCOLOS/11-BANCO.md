---
## PARA CLAUDE (AI INSTRUCTIONS)

Este protocolo é invocado pelo comando `*banco` no CLAUDE.md.
Execute conforme as regras definidas no CLAUDE.md e em COMUNICACAO.md.
---

# Protocolo de Saúde do Banco de Dados (*banco)

## Quando Usar

- O aplicativo está lento
- Antes de deploy em produção
- Monitoramento regular (mensal)
- Após mudanças em queries
- Quando o banco cresceu muito

---

## Diagnóstico Rápido

### Queries de Saúde (PostgreSQL/Supabase)

```sql
-- 1. Tamanho das tabelas
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS tamanho
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- 2. Tabelas com muitos dead tuples (precisam de VACUUM)
SELECT
  schemaname,
  tablename,
  n_dead_tup as dead_tuples,
  n_live_tup as live_tuples,
  ROUND(n_dead_tup::numeric / NULLIF(n_live_tup, 0) * 100, 2) as ratio
FROM pg_stat_user_tables
WHERE n_dead_tup > 1000
ORDER BY n_dead_tup DESC;

-- 3. Índices não utilizados (último mês)
SELECT
  schemaname,
  tablename,
  indexname,
  idx_scan as usos,
  pg_size_pretty(pg_relation_size(indexrelid)) as tamanho
FROM pg_stat_user_indexes
WHERE idx_scan = 0
  AND pg_relation_size(indexrelid) > 1024 * 1024
ORDER BY pg_relation_size(indexrelid) DESC;

-- 4. Queries mais lentas (requer pg_stat_statements)
SELECT
  query,
  calls,
  ROUND(total_exec_time::numeric, 2) as tempo_total_ms,
  ROUND(mean_exec_time::numeric, 2) as tempo_medio_ms,
  rows
FROM pg_stat_statements
ORDER BY total_exec_time DESC
LIMIT 10;

-- 5. Conexões ativas
SELECT
  state,
  COUNT(*) as total,
  MAX(query_start) as ultima_query
FROM pg_stat_activity
WHERE state IS NOT NULL
GROUP BY state;
```

---

## Índices

### Quando Criar Índice

```
✓ Coluna muito usada em WHERE
✓ Coluna usada em JOIN
✓ Coluna usada em ORDER BY
✓ Combinações de colunas (índice composto)
```

### Quando NÃO Criar

```
✗ Tabela pequena (< 1000 linhas)
✗ Coluna com poucos valores únicos (boolean, status)
✗ Tabela com muitas escritas, poucas leituras
✗ Dados muito voláteis
```

### Tipos de Índice

```sql
-- B-Tree (padrão, serve para maioria)
CREATE INDEX idx_usuarios_email ON usuarios(email);

-- Índice composto (ordem importa!)
CREATE INDEX idx_pedidos_usuario_data ON pedidos(usuario_id, created_at);

-- Índice parcial (só parte dos dados)
CREATE INDEX idx_pedidos_ativos ON pedidos(usuario_id) WHERE status = 'ativo';

-- Índice único
CREATE UNIQUE INDEX idx_usuarios_email_unique ON usuarios(email);

-- GIN (para busca em JSON/arrays)
CREATE INDEX idx_produtos_tags ON produtos USING GIN(tags);
```

### Verificar Uso de Índice

```sql
-- Ver se query está usando índice
EXPLAIN ANALYZE SELECT * FROM usuarios WHERE email = 'teste@email.com';

-- Resultado bom: "Index Scan"
-- Resultado ruim: "Seq Scan" (scan completo da tabela)
```

---

## VACUUM e Limpeza

### O que são Dead Tuples?

```
Quando você DELETA ou UPDATE:
- O dado antigo não é removido imediatamente
- Fica marcado como "dead tuple"
- Ocupa espaço desnecessário
- Deixa queries mais lentas

VACUUM remove esses "restos"
```

### Tipos de VACUUM

```sql
-- VACUUM normal (não bloqueia, roda em background)
VACUUM tabela_name;

-- VACUUM ANALYZE (atualiza estatísticas também)
VACUUM ANALYZE tabela_name;

-- VACUUM FULL (recupera espaço, mas BLOQUEIA a tabela!)
-- CUIDADO: Usa só em manutenção programada
VACUUM FULL tabela_name;
```

### Autovacuum

```sql
-- Verificar se autovacuum está ativo
SHOW autovacuum;

-- Ver quando foi rodado pela última vez
SELECT
  tablename,
  last_vacuum,
  last_autovacuum,
  last_analyze,
  last_autoanalyze
FROM pg_stat_user_tables;
```

---

## Conexões

### Verificar Conexões

```sql
-- Conexões ativas
SELECT
  pid,
  usename,
  state,
  query,
  query_start,
  EXTRACT(EPOCH FROM (now() - query_start)) as segundos
FROM pg_stat_activity
WHERE state = 'active';

-- Quantas conexões por estado
SELECT state, COUNT(*) FROM pg_stat_activity GROUP BY state;

-- Limite de conexões
SHOW max_connections;
```

### Matar Conexão Travada

```sql
-- CUIDADO: Só usar se realmente necessário
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE pid = 12345 -- substituir pelo PID
  AND state = 'active';
```

### Pool de Conexões

```
Problema:
- Cada conexão consome ~10MB de RAM
- Limite típico: 100 conexões
- Estourou = app para

Solução:
- Usar connection pooler (PgBouncer, Supabase pooler)
- Manter conexões abertas e reutilizar
- Configurar min/max conexões no app
```

---

## Performance de Queries

### EXPLAIN ANALYZE

```sql
-- SEMPRE use antes de otimizar
EXPLAIN ANALYZE SELECT ...;

-- Sinais de problema:
-- "Seq Scan" em tabela grande → precisa de índice
-- "Hash Join" com muitas linhas → pode otimizar
-- "Sort Method: external merge" → aumentar work_mem
-- "Actual time" alto → query precisa de otimização
```

### Otimizações Comuns

```sql
-- 1. SELECT * → Selecione só o necessário
❌ SELECT * FROM usuarios
✓ SELECT id, nome, email FROM usuarios

-- 2. LIMIT em queries grandes
❌ SELECT * FROM logs
✓ SELECT * FROM logs ORDER BY created_at DESC LIMIT 100

-- 3. EXISTS em vez de IN para subqueries
❌ WHERE id IN (SELECT usuario_id FROM pedidos)
✓ WHERE EXISTS (SELECT 1 FROM pedidos WHERE pedidos.usuario_id = usuarios.id)

-- 4. PARTITIONING para tabelas grandes
-- (tabelas com milhões de linhas)
```

---

## Supabase Específico

### Dashboard de Métricas

```
1. Acesse: supabase.com/dashboard
2. Selecione o projeto
3. Vá em "Reports" → "Database"
4. Monitore:
   - Connection usage
   - Query performance
   - Cache hit ratio
   - Disk usage
```

### Pooler do Supabase

```javascript
// Usar connection string do pooler (porta 6543)
// Em vez da direta (porta 5432)

// Direta (usar para migrations)
DATABASE_URL="postgresql://...:5432/postgres"

// Pooler (usar no app)
DATABASE_URL="postgresql://...:6543/postgres"
```

### RLS e Performance

```sql
-- RLS mal escrito pode matar performance

-- ❌ Ruim: subquery para cada linha
CREATE POLICY "posts_visiveis" ON posts
  USING (autor_id IN (SELECT seguido_id FROM seguindo WHERE seguidor_id = auth.uid()));

-- ✅ Bom: join otimizado
CREATE POLICY "posts_visiveis" ON posts
  USING (
    EXISTS (
      SELECT 1 FROM seguindo
      WHERE seguidor_id = auth.uid()
      AND seguido_id = posts.autor_id
    )
    OR publico = true
  );
```

---

## Checklist de Saúde Mensal

### Executar mensalmente:

```
□ Verificar tamanho das tabelas
□ Identificar dead tuples altos
□ Ver índices não utilizados
□ Analisar queries mais lentas
□ Verificar conexões ativas
□ Checar uso de disco
□ Atualizar estatísticas (ANALYZE)
```

### Executar trimestralmente:

```
□ REINDEX em índices fragmentados
□ VACUUM FULL em tabelas problemáticas (com downtime)
□ Revisar configurações do PostgreSQL
□ Analisar crescimento projetado
```

---

## Alertas Comuns

### "Too many connections"

```
Causa: Mais conexões que o limite
Solução:
1. Verificar connection leak no código
2. Implementar pool de conexões
3. Aumentar limite (se necessário)
```

### "Out of memory"

```
Causa: Query muito grande ou work_mem baixo
Solução:
1. Otimizar a query
2. Aumentar work_mem (cuidado!)
3. Processar em lotes
```

### "Slow queries"

```
Causa: Falta de índice ou query mal escrita
Solução:
1. EXPLAIN ANALYZE
2. Criar índice apropriado
3. Reescrever query
```

### "Disk full"

```
Causa: Banco cresceu demais ou logs
Solução:
1. VACUUM FULL para recuperar espaço
2. Limpar logs antigos
3. Partitioning para dados históricos
```

---

## Comandos de Emergência

```sql
-- Ver o que está travando o banco
SELECT blocked_locks.pid AS blocked_pid,
       blocking_locks.pid AS blocking_pid,
       blocked_activity.query AS blocked_query
FROM pg_catalog.pg_locks blocked_locks
JOIN pg_catalog.pg_locks blocking_locks
  ON blocking_locks.locktype = blocked_locks.locktype
  AND blocking_locks.DATABASE IS NOT DISTINCT FROM blocked_locks.DATABASE
  AND blocking_locks.relation IS NOT DISTINCT FROM blocked_locks.relation
  AND blocking_locks.pid != blocked_locks.pid
JOIN pg_catalog.pg_stat_activity blocked_activity
  ON blocked_activity.pid = blocked_locks.pid;

-- Matar todas as conexões de um usuário (CUIDADO!)
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE usename = 'app_user'
  AND pid <> pg_backend_pid();
```

---

## Resumo para Iniciantes

| Problema | Sintoma | Solução |
|----------|---------|---------|
| Sem índice | Query lenta | Criar índice na coluna do WHERE |
| Dead tuples | Banco grande | Rodar VACUUM |
| Muitas conexões | "Too many connections" | Usar pooler |
| Query pesada | Timeout | EXPLAIN ANALYZE + otimizar |

**Lembre-se:** Um banco saudável é a base de um app rápido. Monitore regularmente!
