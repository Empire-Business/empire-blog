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

# Troubleshooting - O Que Fazer Quando Der Erro

Este documento é seu guia de emergência quando algo der errado no desenvolvimento.

---

## ALGO DEU ERRADO. O QUE FAZER?

### Passo 1: Identifique Onde Está o Erro

#### Erro no Terminal (Vermelho) 💻
**Provável causa:** Problema com código ou bibliotecas

**O que fazer:**
1. Leia a mensagem de erro do início ao fim
2. Procure por palavras como "error", "failed", "not found"
3. Copie o erro completo

**Exemplo de erro terminal:**
```
Module not found: Can't resolve '@/components/Button'
```

---

#### Erro no Navegador 🌐
**Provável causa:** Problema de lógica ou validação no código

**O que fazer:**
1. Abra o console do navegador (F12)
2. Clique na aba "Console"
3. Veja se há erros vermelhos
4. Clique no erro para ver a linha do código

**Exemplo de erro navegador:**
```
Uncaught ReferenceError: myFunction is not defined
```

---

#### Tela Branca ⬜
**Provável causa:** Erro fatal no código

**O que fazer:**
1. Abra o console do navegador (F12)
2. Veja qual erro aparece
3. Geralmente é um erro de importação ou variável não definida

---

#### Nada Acontece (Silêncio Mortal) 🤫
**Provável causa:** O código está rodando mas não faz nada esperado

**O que fazer:**
1. Verifique se tem `console.log` no código para debug
2. Veja se tem loading states que estão escondendo o conteúdo
3. Verifique o terminal para ver se há mensagens

---

### Passo 2: Colete Informações para a IA

Antes de pedir ajuda, prepare estas informações:

1. **O que você estava tentando fazer:**
   > "Tentei adicionar um botão na página inicial"

2. **O erro completo (copie tudo):**
   ```
   Cole o erro aqui inteiro, desde o início
   ```

3. **Tire um print (opcional):**
   - Mostra o código e o erro juntos
   - A IA pode visualizar o contexto

4. **O que você já tentou:**
   > "Já tentei reiniciar o servidor, mas não resolveu"

---

### Passo 3: Use o Template de Pergunta

Ao pedir ajuda à IA, use este template:

```
Estou seguindo o guia de desenvolvimento.

Tentei fazer: [o que você estava tentando fazer]

Apareceu este erro:
[cole o erro completo aqui]

O que eu já tentei:
[liste o que já fez para resolver]

O que devo fazer para resolver?
```

---

## ERROS COMUNS E SOLUÇÕES RÁPIDAS

### Erro: "Module not found"

**O que significa:**
O projeto não consegue encontrar uma biblioteca ou arquivo.

**Exemplo:**
```
Module not found: Can't resolve '@/components/Button'
```

**Possíveis causas:**
1. Arquivo não existe naquele caminho
2. Nome do arquivo está errado (maiúscula/minúscula)
3. Biblioteca não foi instalada

**Soluções:**

```bash
# Se for uma biblioteca que falta
npm install nome-da-biblioteca

# Se for um arquivo, verifique o caminho
# O erro mostra qual caminho está tentando acessar
# Verifique se o arquivo realmente existe lá
```

**Exemplo prático:**
```typescript
// ❌ Errado - caminho não existe
import { Button } from '@/components/Button'
// Mas o arquivo está em /components/ui/Button.tsx

// ✅ Certo - caminho correto
import { Button } from '@/components/ui/Button'
```

---

### Erro: "Invalid hook call"

**O que significa:**
Um Hook do React está sendo usado fora de um componente React.

**Exemplo:**
```
Error: Invalid hook call. Hooks can only be called inside of the body of a function component.
```

**Possíveis causas:**
1. Hook chamado fora de componente
2. Hook chamado dentro de loop ou condicional
3. Usando duas versões diferentes do React

**Soluções:**

```typescript
// ❌ Errado - hook fora de componente
const [count, setCount] = useState(0)  // Fora do componente!

function MyComponent() {
  return <div>{count}</div>
}

// ✅ Certo - hook dentro de componente
function MyComponent() {
  const [count, setCount] = useState(0)
  return <div>{count}</div>
}

// ❌ Errado - hook dentro de condicional
function MyComponent() {
  if (someCondition) {
    const [count, setCount] = useState(0)  // Não pode!
  }
}

// ❌ Errado - hook dentro de loop
function MyComponent() {
  items.forEach(item => {
    const [value, setValue] = useState(item)  // Não pode!
  })
}

// ✅ Certo - hooks sempre no topo do componente
function MyComponent() {
  const [count, setCount] = useState(0)
  const [name, setName] = useState('')

  if (someCondition) {
    // Lógica do componente aqui
  }
}
```

---

### Erro: "Access denied" / "403 Forbidden"

**O que significa:**
Sem permissão para acessar um recurso.

**Exemplo:**
```
403: You don't have permission to access this resource
```

**Possíveis causas:**
1. Não está logado
2. Não tem permissão para aquele recurso
3. Token de autenticação expirou

**Soluções:**

```typescript
// Verifique se está autenticado
const { data: { session } } = await supabase.auth.getSession()

if (!session) {
  // Redirecione para login
  router.push('/login')
  return
}

// Verifique permissões (RLS Policy)
// O banco de dados deve ter regras configuradas
// Veja docs/ARQUITETURA/03-rls-policies.md
```

---

### Erro: "Database connection failed"

**O que significa:**
Não consegue conectar ao Supabase.

**Exemplo:**
```
Error: Could not connect to database
```

**Possíveis causas:**
1. Environment variables não configuradas
2. Projeto Supabase não está ativo
3. Sem conexão com internet
4. URL ou chave estão errados

**Soluções:**

```bash
# 1. Verifique se tem arquivo .env.local
ls -la .env.local

# 2. Abra o arquivo e verifique se tem as variáveis
cat .env.local

# 3. As variáveis devem existir:
# NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key

# 4. Reinicie o servidor após mudar .env.local
npm run dev
```

**Se mesmo assim não funcionar:**
1. Acesse o painel do Supabase
2. Verifique se o projeto está ativo (não pausado)
3. Copie a URL e a chave novamente
4. Verifique sua conexão com internet

---

### Erro: "Cannot find module"

**O que significa:**
Um arquivo que você está importando não existe ou está com o nome errado.

**Exemplo:**
```
Error: Cannot find module '@/components/Header' or its corresponding type declarations
```

**Possíveis causas:**
1. Caminho do import está errado
2. Nome do arquivo está errado (maiúscula/minúscula)
3. Arquivo não existe
4. Extensão do arquivo não está especificada

**Soluções:**

```typescript
// ❌ Errado - arquivo não existe
import { Header } from '@/components/Header'

// ✅ Certo - verifique onde o arquivo realmente está
// Onde está o arquivo?
// src/components/Header.tsx? Ou src/components/ui/Header.tsx?

// Verifique a estrutura de pastas
// Use 'find' para localizar arquivos no terminal:
find src -name "*.tsx" | grep -i header
```

---

### Erro: "Type ... is not assignable to type ..."

**O que significa:**
TypeScript reclamando que um dado não é do tipo esperado.

**Exemplo:**
```
Type 'string' is not assignable to type 'number'
```

**Possíveis causas:**
1. Você está passando o tipo errado
2. Definição de tipo está incorreta
3. Conversão de tipo é necessária

**Soluções:**

```typescript
// ❌ Errado - passando string onde espera número
function calculaIdade(anoNascimento: number) {
  return 2024 - anoNascimento
}

calculaIdade("2000")  // Erro: string não é number

// ✅ Certo - passe o tipo correto
calculaIdade(2000)

// Ou faça conversão se necessário
calculaIdade(Number("2000"))

// Outro exemplo com objetos
interface Usuario {
  nome: string
  idade: number
}

// ❌ Errado - idade como string
const usuario: Usuario = {
  nome: "João",
  idade: "25"  // Erro: string não é number
}

// ✅ Certo
const usuario: Usuario = {
  nome: "João",
  idade: 25
}
```

---

### Erro: "Too many re-renders"

**O que significa:**
O componente está renderizando infinitamente.

**Exemplo:**
```
Error: Too many re-renders. React limits the number of renders to prevent an infinite loop.
```

**Possíveis causas:**
1. Atualizando state dentro do render
2. Função sendo chamada no corpo do componente

**Soluções:**

```typescript
// ❌ Errado - setState dentro do render
function MyComponent() {
  const [count, setCount] = useState(0)

  setCount(count + 1)  // Isso causa loop infinito!

  return <div>{count}</div>
}

// ✅ Certo - setState dentro de useEffect ou evento
function MyComponent() {
  const [count, setCount] = useState(0)

  // Usando evento
  const handleClick = () => {
    setCount(count + 1)
  }

  return <button onClick={handleClick}>{count}</button>
}

// ✅ Certo - useEffect com dependência
function MyComponent() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    setCount(1)  // Só executa quando o componente monta
  }, [])  // Array vazio = só executa uma vez

  return <div>{count}</div>
}
```

---

### Erro: "Cannot read property of undefined"

**O que significa:**
Tentando acessar uma propriedade de algo que não existe (undefined).

**Exemplo:**
```
TypeError: Cannot read properties of undefined (reading 'nome')
```

**Possíveis causas:**
1. Dados ainda não carregaram
2. Variável é undefined
3. Objeto não tem essa propriedade

**Soluções:**

```typescript
// ❌ Errado - assume que sempre tem dados
function Profile({ usuario }) {
  return <div>{usuario.nome}</div>  // Se usuario é undefined, erro!
}

// ✅ Certo 1 - verifique se existe
function Profile({ usuario }) {
  if (!usuario) {
    return <div>Carregando...</div>
  }

  return <div>{usuario.nome}</div>
}

// ✅ Certo 2 - optional chaining
function Profile({ usuario }) {
  return <div>{usuario?.nome}</div>  // Se usuario é undefined, mostra undefined, não erro
}

// ✅ Certo 3 - default value
function Profile({ usuario = {} }) {
  return <div>{usuario.nome || 'Sem nome'}</div>
}
```

---

### Erro: "Port 3000 is already in use"

**O que significa:**
A porta 3000 já está sendo usada por outro processo.

**Exemplo:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Soluções:**

```bash
# Opção 1: Matar o processo usando a porta
# No Mac/Linux:
lsof -ti:3000 | xargs kill -9

# No Windows:
netstat -ano | findstr :3000
# Pegue o PID e execute:
taskkill /PID <PID> /F

# Opção 2: Usar outra porta
npm run dev -- -p 3001

# Opção 3: Achar qual processo está usando
lsof -i :3000
```

---

### Erro: "npm ERR! code ERESOLVE"

**O que significa:**
Conflito de versões entre bibliotecas.

**Exemplo:**
```
npm ERR! code ERESOLVE
npm ERR! ERESOLVE unable to resolve dependency tree
```

**Soluções:**

```bash
# Opção 1: Usar --force (cuidado - pode quebrar)
npm install --force

# Opção 2: Usar --legacy-peer-deps (mais seguro)
npm install --legacy-peer-deps

# Opção 3: Verificar qual biblioteca está causando conflito
npm install nome-da-biblioteca@versao-especifica

# Exemplo:
npm install react@18.2.0
```

---

## DEBUG - COMO ENCONTRAR O PROBLEMA

### 1. Use console.log

```typescript
function MeuComponente() {
  const usuario = useUsuario()

  console.log('Dados do usuário:', usuario)  // Veja o que está chegando

  if (!usuario) {
    return <div>Carregando...</div>
  }

  return <div>{usuario.nome}</div>
}
```

### 2. Use React DevTools

1. Instale a extensão "React Developer Tools"
2. Abra o navegador
3. Clique na aba "Components"
4. Veja o estado e props de cada componente

### 3. Veja o Terminal

- O terminal mostra avisos e erros
- Ajustes que precisam ser feitos
- Versões incompatíveis

### 4. Tire Print

- Se a IA não conseguir resolver só com o erro
- Tire um print da tela inteira
- Mostre o código + erro

---

## QUANDO PEDIR AJUDA

### Pergunte à IA quando:

1. **Não entendeu a mensagem de erro**
   > "Apareceu este erro: [cole]. O que isso significa em português simples?"

2. **Tentou as soluções e não funcionou**
   > "Tentei [o que você tentou] mas ainda aparece o erro. O que mais posso fazer?"

3. **A mensagem de erro é muito técnica**
   > "Isso é muito técnico. Pode me explicar usando uma analogia?"

4. **Não sabe como começar a resolver**
   > "Não tenho ideia do porquê desse erro. Como começo a investigar?"

---

## COMO PEGAR O ERRO INTEIRO

### No Terminal

1. Selecione o texto do erro
2. Copie (Cmd+C no Mac, Ctrl+C no Windows)
3. Cole na mensagem para a IA

### No Navegador

1. Abra o console (F12)
2. Clique no erro para expandir
3. Copie a mensagem completa
4. Se tiver stack trace, copie também

### Stack Trace

O stack trace mostra:
- Onde o erro aconteceu
- Qual arquivo
- Qual linha
- O caminho até o erro

**Exemplo:**
```
Error: Cannot read properties of undefined
    at MeuComponente (src/components/MeuComponente.tsx:15:25)
    at renderWithHooks (node_modules/react-dom/cjs/react-dom.development.js:...)
```

Isso mostra que o erro está no arquivo `MeuComponente.tsx`, linha 15.

---

## ANTES DE PEDIR AJUDA - CHECKLIST

- [ ] Li a mensagem de erro completa
- [ ] Tentei entender o que diz
- [ ] Procurei palavras-chave no erro (error, failed, not found)
- [ ] Copiei o erro inteiro (não só a primeira linha)
- [ ] Verifiquei se o erro está no terminal ou navegador
- [ ] Tentei as soluções deste documento
- [ ] Sei o que eu estava tentando fazer quando deu erro

**Se respondeu SIM para tudo:** Pronto para pedir ajuda à IA!

---

## RECURSOS ADICIONAIS

### Documentação do Stack Overflow
https://stackoverflow.com/

Procurar por mensagens de erro específicas muitas vezes traz soluções de outros programadores.

### Google
Cole o erro entre aspas:
`"Module not found: Can't resolve"`

### Documentação Oficial
Se for erro de biblioteca específica:
- React: https://react.dev/
- Next.js: https://nextjs.org/docs
- Supabase: https://supabase.com/docs

---

**Versão:** 1.0.0
**Última atualização:** 2026-02-11
**Responsável:** Claude Code
