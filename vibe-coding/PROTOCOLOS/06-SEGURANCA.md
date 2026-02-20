---
## PARA CLAUDE (AI INSTRUCTIONS)

Este protocolo é invocado pelo comando `*seguranca` no CLAUDE.md.
Execute conforme as regras definidas no CLAUDE.md e em COMUNICACAO.md.
---

# Protocolo de Segurança (*seguranca)

## Quando Usar

- Antes de lançar o projeto (*lançar)
- Quando suspeitar de vulnerabilidade
- Após adicionar autenticação/autorização
- Durante revisão de código sensível
- Periodicamente (auditoria mensal)

---

## OWASP Top 10 - Checklist

### 1. Injection (SQL, NoSQL, Command)

```
□ Todos os inputs são validados e sanitizados
□ Uso de prepared statements/ORM (não concatenação)
□ Queries parametrizadas em todo lugar
□ Inputs de usuário NUNCA em comandos shell
```

**Verificar:**
```bash
# Procurar concatenação perigosa
grep -r "f\".*SELECT.*{.*}\"" --include="*.py" --include="*.js"
grep -r "\+.*SELECT" --include="*.py" --include="*.js"
```

### 2. Broken Authentication

```
□ Senhas hasheadas (bcrypt, argon2) - NUNCA texto plano
□ Rate limiting em login
□ Session timeout configurado
□ MFA disponível para contas sensíveis
□ Tokens JWT com expiração curta
```

**Verificar:**
```bash
# Verificar se usa bcrypt/argon2
grep -r "bcrypt\|argon2\|scrypt" --include="*.py" --include="*.js"
```

### 3. Sensitive Data Exposure

```
□ Dados sensíveis criptografados em trânsito (HTTPS)
□ Dados sensíveis criptografados em repouso
□ Credenciais NUNCA no código (usar .env)
□ Logs não contêm dados sensíveis
```

**Verificar:**
```bash
# Verificar se há senhas no código
grep -rE "password\s*=\s*[\"']" --include="*.py" --include="*.js" --include="*.ts"
grep -rE "api_key\s*=\s*[\"']" --include="*.py" --include="*.js" --include="*.ts"
```

### 4. XML External Entities (XXE)

```
□ Parser XML desabilita entidades externas
□ JSON preferido sobre XML quando possível
```

### 5. Broken Access Control

```
□ Autorização verificada em CADA requisição
□ Usuário só acessa seus próprios recursos
□ RLS (Row Level Security) no banco se usar Supabase
□ Tokens não expostos em URLs
```

### 6. Security Misconfiguration

```
□ Debug mode DESLIGADO em produção
□ Headers de segurança configurados
□ CORS restrito aos domínios necessários
□ Versões de software atualizadas
```

**Headers recomendados:**
```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Content-Security-Policy: default-src 'self'
Strict-Transport-Security: max-age=31536000
```

### 7. Cross-Site Scripting (XSS)

```
□ Output encoding em todos os lugares
□ Content Security Policy configurado
□ Inputs sanitizados antes de exibir
□ React/Vue usados corretamente (não dangerouslySetInnerHTML)
```

### 8. Insecure Deserialization

```
□ NUNCA deserializar dados não confiáveis
□ Validação de schema antes de processar
```

### 9. Using Components with Known Vulnerabilities

```
□ npm audit executado regularmente
□ Dependências atualizadas
□ CVEs monitorados
```

**Comando:**
```bash
npm audit
npm outdated
```

### 10. Insufficient Logging & Monitoring

```
□ Log de tentativas de login falhas
□ Log de ações sensíveis
□ Alertas para atividades suspeitas
□ Logs protegidos contra alteração
```

---

## Supabase - Segurança Específica

### Row Level Security (RLS)

```sql
-- SEMPRE ativar RLS em tabelas com dados de usuário
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;

-- Política: usuário só vê seus dados
CREATE POLICY "usuarios_proprios_dados" ON usuarios
  FOR ALL USING (auth.uid() = id);

-- Política: dados públicos podem ser lidos por todos
CREATE POLICY "dados_publicos_leitura" ON posts
  FOR SELECT USING (publico = true);
```

### Políticas Comuns

```sql
-- Usuário autenticado pode inserir
CREATE POLICY "auth_insert" ON tabela
  FOR INSERT WITH (auth.role() = 'authenticated');

-- Apenas owner pode atualizar
CREATE POLICY "owner_update" ON tabela
  FOR UPDATE USING (user_id = auth.uid());

-- Apenas admin pode deletar
CREATE POLICY "admin_delete" ON tabela
  FOR DELETE USING (auth.jwt() ->> 'role' = 'admin');
```

---

## Checklist de Auditoria

### Antes de cada deploy:

```
□ npm audit --audit-level=high
□ Variáveis sensíveis em .env (não no código)
□ RLS ativado em todas as tabelas Supabase
□ HTTPS obrigatório
□ Debug mode = false
□ Rate limiting ativo
```

### Mensalmente:

```
□ Atualizar dependências (npm update)
□ Verificar CVEs novos
□ Revisar logs de segurança
□ Testar endpoints de autenticação
□ Verificar permissões de banco
```

---

## Comandos de Verificação

```bash
# Auditoria de dependências
npm audit

# Verificar dependências desatualizadas
npm outdated

# Listar vulnerabilidades conhecidas
npm audit --json | jq '.advisories'

# Verificar arquivos sensíveis no git
git log --all --full-history -- "*.env*" "*password*" "*secret*"
```

---

## Resposta a Incidentes

### Se descobrir vulnerabilidade:

1. **NÃO FAÇA COMMIT** da correção imediatamente
2. Documente a vulnerabilidade em `docs/SEGURANCA.md`
3. Corrija o problema
4. Teste a correção
5. Verifique se há outros pontos vulneráveis
6. Documente a correção em `docs/MUDANCAS.md`
7. **SÓ ENTÃO** faça o deploy

### Vulnerabilidades críticas exigem:

- Rotação de credenciais expostas
- Notificação de usuários afetados (se dados vazados)
- Post-mortem em `docs/INCIDENTES.md`

---

## Resumo para Iniciantes

| Termo | Significado Simples |
|-------|---------------------|
| Injection | Alguém tenta "injetar" código malicioso nos seus formulários |
| XSS | Código malicioso rodando no navegador dos seus usuários |
| RLS | Cada usuário só vê seus próprios dados no banco |
| HTTPS | Conversa criptografada entre navegador e servidor |
| .env | Arquivo onde guardamos senhas (NUNCA no código) |

**Lembre-se:** Segurança não é opcional. Um projeto inseguro pode ser hackeado em minutos.
