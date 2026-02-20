---
## PARA CLAUDE (AI INSTRUCTIONS)

Ao guiar o usuário através deste documento:
1. Leia as instruções completamente
2. Explique cada passo em português simples
3. Antes de executar comandos, explique O QUE o comando faz
4. Antes de deletar/modificar dados, CONFIRME com o usuário
5. Use analogias do dia a dia quando possível
6. Se o usuário perguntar sobre um termo técnico, verifique o glossário em GLOSSARIO.md
7. Nunca execute comandos da lista de BANDEIRAS-VERMELHAS.md sem explicar primeiro
8. Pergunte ao usuário se ele entendeu antes de prosseguir
9. Se algo der errado, consulte TROUBLESHOOTING.md
10. Seja paciente - o usuário está aprendendo enquanto constrói
---

# Bandeiras Vermelhas - Comandos Perigosos

⚠️ **ATENÇÃO:** Este documento lista comandos que podem causar perda de dados ou quebrar seu projeto.

**Regra de Ouro:** Nunca execute um comando que você não entende sem perguntar primeiro.

---

## COMANDOS PERIGOSOS - NÃO EXECUTAR SEM ENTENDER

### Git (Pode apagar código)

---

#### ❌ `git push --force origin main`

**O que faz:** Apaga o histórico do projeto no servidor e substitui pelo seu.

**Perigo:**
- Apaga todo o histórico que outras pessoas fizeram
- Irreversível
- Você perde commits que ainda não tem localmente

**Alternativa segura:**
```bash
git push origin minha-branch
```

**Analogia:** É como jogar todo o histórico de documentos de uma empresa na lixeira e só deixar o seu.

---

#### ❌ `git reset --hard HEAD~10`

**O que faz:** Volta 10 commits e descarta todas as mudanças depois disso.

**Perigo:**
- Apaga tudo o que você fez nos últimos 10 commits
- Irreversível (a menos que você tenha backup)
- Perda de trabalho

**Alternativa segura:**
```bash
git checkout <hash-do-commit>
```

**Analogia:** É como voltar no tempo e apagar todo o progresso feito nos últimos dias.

---

#### ❌ `git clean -fd`

**O que faz:** Apaga todos os arquivos não rastreados (pastas e arquivos).

**Perigo:**
- Apaga arquivos que você criou mas não salvou
- Pode apagar arquivos importantes não commitados

**Alternativa segura:**
```bash
git clean -fd --dry-run
# Mostra o que seria apagado antes de apagar
```

**Analogia:** É como limpar sua casa jogando tudo que não está etiquetado no lixo.

---

### Banco de Dados (Pode apagar dados)

---

#### ❌ `DROP TABLE usuarios;`

**O que faz:** Apaga a tabela e TODOS os dados dentro dela.

**Perigo:**
- Apaga todos os registros permanentemente
- Irreversível sem backup
- Perda total de dados

**Alternativa segura:**
```sql
-- Verifica se existe antes de criar
CREATE TABLE IF NOT EXISTS usuarios (...);

-- Ou renomear ao invés de apagar
ALTER TABLE usuarios RENAME TO usuarios_backup;
```

**Analogia:** É como demolir um prédio inteiro com tudo dentro.

---

#### ❌ `DELETE FROM usuarios WHERE 1=1;`

**O que faz:** Apaga TODOS os registros da tabela.

**Perigo:**
- Apaga todos os dados mas mantém a tabela
- Pode ser acidental se você digitou `1=1` sem querer

**Alternativa segura:**
```sql
DELETE FROM usuarios WHERE id = 'xxx';
```

**Analogia:** É como limpar uma sala inteira quando você só queria limpar uma cadeira.

---

#### ❌ `TRUNCATE TABLE usuarios;`

**O que faz:** Apaga todos os dados da tabela rapidamente.

**Perigo:**
- Apaga tudo instantaneamente
- Irreversível
- Não consegue desfazer

**Alternativa segura:**
```sql
-- Primeiro verifique quantos registros tem
SELECT COUNT(*) FROM usuarios;

-- Depois delete com WHERE se necessário
DELETE FROM usuarios WHERE <condição>;
```

**Analogia:** É como apagar todo o conteúdo de um documento de texto com um clique.

---

#### ❌ `DROP DATABASE meu_banco;`

**O que faz:** Apaga o banco de dados inteiro com todas as tabelas.

**Perigo:**
- Apaga tudo permanentemente
- Perda total do projeto
- Irreversível sem backup

**Alternativa segura:**
```bash
# Sempre faça backup primeiro
pg_dump meu_banco > backup.sql

# Depois pode deletar se tiver certeza
```

**Analogia:** É como queimar um arquivo inteiro com todos os papéis.

---

#### ❌ `UPDATE usuarios SET email = 'erro' WHERE 1=1;`

**O que faz:** Atualiza todos os registros com o mesmo valor.

**Perigo:**
- Corrompe todos os dados
- Perde as informações originais
- Difícil de recuperar

**Alternativa segura:**
```sql
-- Primeiro verifique quais registros serão afetados
SELECT * FROM usuarios WHERE <condição>;

-- Depois faça o update
UPDATE usuarios SET email = 'novo@email.com' WHERE id = 'xxx';
```

**Analogia:** É como trocar todas as portas de uma casa pela mesma chave.

---

### Sistema (Pode apagar arquivos do computador)

---

#### ❌ `rm -rf ~/Documents/Projetos`

**O que faz:** Apaga toda a pasta de projetos recursivamente.

**Perigo:**
- Apaga TODOS os seus projetos
- Perda total de trabalho
- Irreversível sem backup

**Alternativa segura:**
```bash
# Apaga apenas uma pasta específica
rm -rf nome-da-pasta-específica

# Primeiro verifique onde está
pwd
ls -la
```

**Analogia:** É como jogar toda sua gaveta de documentos na lixeira.

---

#### ❌ `rm -rf /`

**O que faz:** Apaga TODO o sistema operacional.

**Perigo:**
- Apaga o sistema inteiro
- Computador não liga mais
- Perda total de tudo

**Alternativa segura:**
```bash
# NUNCA USE ESSE COMANDO!
# Se precisar apagar algo, apague arquivos específicos
rm nome-do-arquivo
```

**Analogia:** É como explodir sua casa. **PERIGO REAL - NUNCA EXECUTE!**

---

#### ❌ `rm -rf node_modules`

**O que faz:** Apaga todas as bibliotecas instaladas do projeto.

**Perigo:**
- Projeto para de funcionar
- Precisa reinstalar tudo
- Pode demorar muito para reinstalar

**Quando usar:** Só se você sabe que precisa reinstalar as bibliotecas.

**Alternativa segura:**
```bash
# Se realmente precisa, primeiro verifique o tamanho
du -sh node_modules

# Depois reinstale
npm install
```

**Analogia:** É como jogar todas as ferramentas de uma caixa no lixo.

---

### NPM (Pode quebrar o projeto)

---

#### ❌ `npm update --latest`

**O que faz:** Atualiza TODAS as bibliotecas para a versão mais recente.

**Perigo:**
- Pode quebrar o projeto (mudanças incompatíveis)
- Versões recentes podem ter bugs
- Difícil de voltar para versões anteriores

**Alternativa segura:**
```bash
# Atualiza apenas uma biblioteca específica
npm install nome-da-biblioteca@latest

# Ou veja quais atualizações estão disponíveis
npm outdated
```

**Analogia:** É como trocar todas as peças de um carro de uma vez - pode não funcionar mais.

---

#### ❌ `npm install --force`

**O que faz:** Força a instalação ignorando conflitos.

**Perigo:**
- Pode instalar versões incompatíveis
- Pode quebrar o projeto
- Erros silenciosos

**Alternativa segura:**
```bash
# Primeiro tente resolver o conflito
npm install

# Se der erro, leia a mensagem de erro
# Ela geralmente diz como resolver
```

**Analogia:** É como forçar uma peça quadrada num buraco redondo - vai ficar torto.

---

### Supabase

---

#### ❌ `supabase db reset`

**O que faz:** Reinicia o banco de dados do zero.

**Perigo:**
- Apaga TODOS os dados
- Volta para estado inicial
- Perda total de dados

**Alternativa segura:**
```bash
# Faça backup antes
supabase db dump > backup.sql

# Depois pode resetar se tiver certeza
```

**Analogia:** É como formatar o computador - perde tudo.

---

#### ❌ Deletar dados direto no painel do Supabase sem backup

**O que faz:** Você clica em "Delete" e apaga registros.

**Perigo:**
- Não tem "desfazer"
- Perda imediata
- Irreversível

**Alternativa segura:**
```sql
-- Primeiro faça backup
SELECT * FROM tabela INTO OUTFILE 'backup.csv';

-- Depois delete com WHERE
DELETE FROM tabela WHERE id = 'xxx';
```

**Analogia:** É como rasgar uma foto - você não pode "desrasgar" depois.

---

## REGRAS DE SEGURANÇA

### 1. SEMPER Confirme Antes de Deletar

Se qualquer comando ou ação incluir as palavras:
- delete
- drop
- truncate
- remove
- apagar
- deletar

**PARE E PERGUNTE:**
> "Isso vai apagar dados? Quais dados?"

---

### 2. Verifique Antes de Executar

Antes de qualquer comando perigoso:

```bash
# Verifique o diretório atual
pwd

# Liste os arquivos
ls -la

# Veja o que o comando faria
# (alguns comandos têm --dry-run ou similar)
```

---

### 3. Faça Backup Sempre

Antes de qualquer alteração no banco de dados:

```sql
-- Backup da tabela
CREATE TABLE usuarios_backup AS SELECT * FROM usuarios;

-- Backup do banco
pg_dump meu_banco > backup.sql
```

---

### 4. Use WHERE em Operações de Dados

Sempre que for deletar ou atualizar:

```sql
-- ❌ ERRADO: Afeta tudo
DELETE FROM usuarios;

-- ✅ CERTO: Afeta apenas um registro
DELETE FROM usuarios WHERE id = 'abc123';

-- ❌ ERRADO: Atualiza tudo
UPDATE usuarios SET status = 'inativo';

-- ✅ CERTO: Atualiza apenas registros específicos
UPDATE usuarios SET status = 'inativo' WHERE created_at < '2024-01-01';
```

---

## COMO IDENTIFICAR UM COMANDO PERIGOSO

### Palavras de Alerta

Se o comando tiver estas palavras, seja extra cuidadoso:

| Palavra | Significado | Perigo |
|---------|-------------|--------|
| `--force` ou `-f` | Forçar execução | Pode quebrar |
| `--recursive` ou `-r` | Fazer em tudo | Pode afetar mais do que espera |
| `--all` | Fazer em tudo | Pode afetar o errado |
| `DROP` | Apagar estrutura | Perda de dados |
| `DELETE` | Apagar dados | Perda de dados |
| `TRUNCATE` | Limpar tabela | Perda de dados |
| `RESET` | Reiniciar | Perda de dados |
| `rm -rf` | Apagar recursivamente | Perda total |

---

### Checklist de Segurança

Antes de executar qualquer comando:

- [ ] Eu entendo o que esse comando faz?
- [ ] Eu sei quais arquivos/dados serão afetados?
- [ ] Eu tenho um backup se algo der errado?
- [ ] Eu posso desfazer se necessário?
- [ ] Eu perguntei à IA se não tenho certeza?

**Se respondeu NÃO para qualquer pergunta:** NÃO EXECUTE! Pergunte primeiro.

---

## O QUE FAZER SE EXECUTOU ALGO ERRADO

### 1. Para de Tudo
Pare imediatamente. Não execute mais nada.

### 2. Verifique o Backup
```bash
# Verifique se tem backup
ls -la *.sql
ls -la backup*
```

### 3. Restaurar Backup
```bash
# Restaurar banco de dados
psql meu_banco < backup.sql

# Ou via Supabase CLI
supabase db reset < backup.sql
```

### 4. Pergunte à IA
Copie o erro e pergunte:
> "Executei esse comando [cole o comando] e algo deu errado. Apareceu isso [cole o erro]. Como recupero?"

---

## PROMPTS SEGUROS PARA PEDIR À IA

### ✅ BOM
> "Vou deletar a tabela usuarios. Isso vai apagar todos os dados? Me explique o que vai acontecer."

> "Quero atualizar o email do usuário com ID 123. Qual comando devo usar?"

> "Preciso apagar o arquivo teste.txt. O comando `rm teste.txt` está correto?"

### ❌ RUIM
> "Deleta a tabela usuarios" (Não explica o que vai acontecer)

> "Otimiza o banco de dados" (Muito vago, pode quebrar)

> "Refaz o banco do zero" (Perde tudo)

---

## EXEMPLO DE FLUXO SEGURO

### Antes de Deletar Algo

**1. Pergunte:**
> "Vou executar o comando `DROP TABLE usuarios`. Isso vai apagar a tabela e todos os dados. Tem certeza que quer continuar?"

**2. Explicação:**
> "Isso significa que todos os usuários cadastrados serão apagados permanentemente. Se você não tem backup, não vai conseguir recuperar."

**3. Confirmação:**
> "Se você quer continuar, responda 'SIM, EU QUERO APAGAR'. Se não, responda 'NÃO' e vou te dar alternativas seguras."

---

## LEMBRETE FINAL

**Computadores não têm "desfazer" universal.**

Antes de clicar, execute ou confirmar qualquer coisa que apague, modifique ou delete:

1. **PARE**
2. **PERGUNTE** "O que isso vai fazer?"
3. **EXPLIQUE** em português simples
4. **CONFIRME** com você mesmo ou com a IA
5. **BACKUP** se possível

> "É melhor perguntar e parecer iniciante do que apagar sem saber e perder tudo."

---

**Versão:** 1.0.0
**Última atualização:** 2026-02-11
**Responsável:** Claude Code
