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

# Guia do Iniciante - Glossário Completo

Este documento explica todos os termos técnicos que você vai encontrar durante o desenvolvimento, usando linguagem simples e analogias do dia a dia.

---

## A

### API (Application Programming Interface)

**O que é:** É como um garçom que leva pedidos da cozinha para a mesa.

**Como funciona:**
- Frontend (o que você vê) faz o pedido
- API leva o pedido para o backend (cozinha)
- Backend processa o pedido
- API traz a resposta de volta

**Exemplo:**
Quando você faz login:
1. Você digita email e senha no formulário (frontend)
2. O código envia esses dados para a API
3. A API verifica se está correto no banco de dados
4. A API responde "login aceito" ou "senha errada"

**Analogia:** API é como o menu de um restaurante - você escolhe o que quer (faz o pedido), e a cozinha prepara (backend).

---

## B

### Branch

**O que é:** Uma cópia do projeto para testar coisas sem quebrar o original.

**Para que serve:** Imagine que você quer testar uma nova receita. Você não vai mexer na receita original que já está funcionando. Você faz uma cópia da receita (um branch) e testa nela.

**Como funciona:**
```
main (receita original)
  └── feature/novo-botao (cópia para testar)
```

**Na prática:**
- `main` ou `master` = versão oficial do projeto
- `feature/*` = você criou para testar algo novo
- `bugfix/*` = você criou para corrigir um erro

**Analogia:** Branch é como salvar um documento como "copia-teste" antes de editar o original.

---

## C

### Commit

**O que é:** Como "salvar" uma versão do código (como salvar em Word).

**Por que é importante:** Cada commit é um ponto de salvamento. Se algo der errado, você pode voltar para qualquer commit anterior.

**Como funciona:**
```
Commit 1: Criei a página inicial
Commit 2: Adicionei o formulário de login
Commit 3: Corrigi o erro de validação
```

**Se algo der errado:** Você pode voltar para o Commit 2 e ignorar o 3.

**Analogia:** Commit é como salvar um documento do Word a cada parágrafo, assim se o computador travar você não perde nada.

---

### Component (React/Next.js)

**O que é:** Um bloco reutilizável de interface, como um bloco de LEGO.

**Exemplos de componentes:**
- Button (botão)
- Input (campo de texto)
- Card (cartão)
- Modal (janela pop-up)

**Vantagem:**
- Você cria um botão uma vez
- Reusa esse botão em todo o projeto
- Se mudar o botão, muda em todo lugar

**Analogia:** Componente é como um molde para fazer biscoitos - você usa o mesmo molde para fazer muitos biscoitos iguais.

---

## D

### Dependency (Dependência)

**O que é:** Bibliotecas prontas que o projeto usa (como add-ons ou plugins).

**Exemplos:**
- React = biblioteca para criar interfaces
- Supabase = biblioteca para conectar ao banco de dados
- Tailwind = biblioteca para estilização

**O que acontece:** Quando você instala uma dependência, está dizendo "Quero usar essa biblioteca no meu projeto".

**Analogia:** Dependência é como comprar um aparelho de TV - você não precisa inventar a TV, só compra e usa.

---

### Database Schema

**O que é:** O desenho de como seu banco de dados está organizado.

**Exemplo:**
```
Tabela: usuarios
├── id (número único)
├── email (texto)
├── senha (texto criptografado)
└── criado_em (data)
```

**Para que serve:** Para saber exatamente que informações você vai guardar e como.

**Analogia:** Schema é como a planta de uma casa - mostra quantos cômodos existem e o que cada cômodo guarda.

---

## E

### Environment Variables (Variáveis de Ambiente)

**O que é:** Dados sensíveis que não ficam no código (senhas, chaves de acesso).

**Exemplo:**
```bash
SUPABASE_URL=https://meu-projeto.supabase.co
SUPABASE_KEY=abc123xyz
```

**Por que separar:** Se você colocar senha no código, alguém pode roubar. Com environment variables, a senha fica em um arquivo separado que não é compartilhado.

**Analogia:** É como deixar sua carteira num cofre, não em cima da mesa.

---

## F

### Framework

**O que é:** Uma estrutura pronta para construir aplicações (como andaimes para construir uma casa).

**Exemplos:**
- Next.js = framework para React
- Express = framework para Node.js

**Vantagem:** Você não começa do zero. Já tem estrutura, regras e ferramentas prontas.

**Analogia:** Framework é como construir uma casa com andaimes - você tem a estrutura pronta, só precisa colocar os tijolos.

---

### Frontend

**O que é:** Tudo o que o usuário vê e interage.

**Exemplos:**
- Páginas web
- Botões
- Formulários
- Animações

**Tecnologias:** React, Next.js, HTML, CSS

**Analogia:** Frontend é a fachada de uma casa - o que as pessoas veem de fora.

---

## G

### Git

**O que é:** Ferramenta que guarda o histórico de todas as mudanças no código.

**O que faz:**
- Guarda cada versão do código
- Permite voltar para versões anteriores
- Permite trabalhar em equipe sem conflitos

**Comandos básicos:**
- `git status` = "O que mudou desde o último salvamento?"
- `git add` = "Adiciona essas mudanças ao próximo salvamento"
- `git commit` = "Salva as mudanças"
- `git push` = "Envia para o servidor (GitHub)"

**Analogia:** Git é como uma máquina do tempo para seu código - você pode voltar para qualquer momento no passado.

---

### GitHub

**O que é:** Servidor online onde seu código fica guardado (como Google Drive para programadores).

**O que faz:**
- Guarda cópias do seu projeto na nuvem
- Permite colaborar com outras pessoas
- Mantém histórico completo

**Analogia:** GitHub é como um cofre digital para seu código - seguro e acessível de qualquer lugar.

---

## H

### Hook (React)

**O que é:** Funções especiais do React que permitem adicionar funcionalidades aos componentes.

**Exemplos:**
- `useState` = guarda dados (como "lembrar" o que você digitou)
- `useEffect` = faz algo quando algo mudar
- `useContext` = compartilha dados entre componentes

**Analogia:** Hook é como um superpoder que você dá ao seu componente - ele ganha novas habilidades.

---

## I

### Interface (TypeScript)

**O que é:** Define a forma de um dado - que campos ele tem e de que tipo.

**Exemplo:**
```typescript
interface Usuario {
  nome: string
  idade: number
  email: string
}
```

**Para que serve:** Garante que o dado está correto. Se você tentar passar `idade: "vinte"` (texto em vez de número), o TypeScript vai reclamar.

**Analogia:** Interface é como um formulário pré-impresso - você sabe exatamente o que preencher em cada campo.

---

## L

### Linting

**O que é:** Verificação automática do código para encontrar erros e má formatação.

**O que faz:**
- Encontra erros de digitação
- Garante que o código segue o mesmo estilo
- Avisa sobre problemas antes de executar

**Analogia:** Linting é como um corretor ortográfico do Word - avisa quando você errou ou formatação está errada.

---

### Logging

**O que é:** Registrar eventos que acontecem no sistema para debug.

**Exemplo:**
```typescript
console.log("Usuário fez login:", user.email)
console.error("Erro ao conectar:", error)
```

**Para que serve:** Para entender o que aconteceu quando algo dá errado.

**Analogia:** Logging é como escrever um diário do que aconteceu durante o dia - você pode voltar e ler se precisar lembrar.

---

## M

### Middleware

**O que é:** Código que roda antes de cada requisição (como um porteiro).

**O que faz:**
- Verifica se o usuário está logado
- Verifica se tem permissão
- Processa dados antes de chegar no destino

**Fluxo:**
```
Usuário → Porteiro (Middleware) → Sistema
```

**Analogia:** Middleware é como o porteiro de um prédio - ele verifica seu crachá antes de você entrar.

---

### Merge

**O que é:** Juntar duas versões diferentes do código em uma só.

**Quando acontece:**
- Você trabalhou em um branch separado
- Está pronto para juntar com o projeto principal
- Dois programadores trabalharam no mesmo código

**Analogia:** Merge é como juntar dois documentos do Word em um único documento.

---

### Migration

**O que é:** Instruções para criar/modificar tabelas no banco de dados.

**Exemplo:**
```sql
-- Cria tabela de usuários
CREATE TABLE usuarios (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL,
  senha TEXT NOT NULL
);
```

**Por que usar migrations:**
- Toda mudança no banco é documentada
- Você pode recriar o banco do zero
- Vários programadores têm o mesmo banco

**Analogia:** Migration é como o histórico de alterações de um documento - mostra cada mudança feita ao longo do tempo.

---

## N

### npm (Node Package Manager)

**O que é:** Ferramenta para instalar bibliotecas (dependencies).

**Comandos básicos:**
```bash
npm install react      # Instala biblioteca React
npm install             # Instala todas as bibliotecas do projeto
npm run dev             # Roda o projeto em desenvolvimento
```

**Analogia:** npm é como uma loja de aplicativos - você baixa o que precisa e instala no seu projeto.

---

## P

### Props (React)

**O que é:** Dados que você passa de um componente para outro.

**Exemplo:**
```tsx
// Componente pai passa nome para o componente filho
<Button texto="Clique aqui" />
```

**Analogia:** Props é como passar um prato de comida da cozinha para a mesa - a comida (dado) vai de um lugar para outro.

---

### Pull Request (PR)

**O que é:** Solicitação para juntar seu código ao projeto principal.

**Fluxo:**
1. Você trabalha em um branch
2. Faz PR pedindo para juntar
3. Outras pessoas revisam seu código
4. Se aprovado, junta ao projeto principal

**Analogia:** PR é como pedir permissão para colocar seu trabalho no mural principal da empresa - alguém revisa antes de aprovar.

---

## R

### Repository (Repositório)

**O que é:** Uma pasta especial que guarda todo o histórico das mudanças.

**O que tem:**
- Todo o código do projeto
- Histórico completo de mudanças
- Branches (cópias para testar)
- Issues (tarefas/problemas)

**Analogia:** Repositório é como uma caixa organizada que guarda tudo do seu projeto, inclusive cada versão já feita.

---

### RLS Policy (Row Level Security)

**O que é:** Regras de segurança no banco (quem pode ver o que).

**Exemplo:**
- Usuário A só vê seus próprios dados
- Admin pode ver tudo
- Usuário sem login não vê nada

**Analogia:** RLS é como um porteiro que verifica seu crachá antes de deixar você ver algo.

---

### Route (Rota)

**O que é:** Cada página do seu site tem um endereço único.

**Exemplos:**
- `/` = página inicial
- `/login` = página de login
- `/dashboard` = painel do usuário

**Analogia:** Route é como o endereço de uma casa - cada página tem seu endereço único.

---

## S

### Server-Side Rendering (SSR)

**O que é:** O servidor gera o HTML antes de enviar para o navegador.

**Vantagens:**
- Melhor para SEO (Google entende melhor)
- Carrega mais rápido no início
- Conteúdo aparece mesmo sem JavaScript

**Analogia:** SSR é como receber um prato pronto do restaurante vs ter que montar você mesmo na mesa.

---

### State (Estado)

**O que é:** Dados que mudam durante o uso da aplicação.

**Exemplos:**
- Nome do usuário
- Se está logado ou não
- Lista de produtos no carrinho
- Tema claro/escuro

**Analogia:** State é como a memória de curto prazo - lembra o que está acontecendo agora.

---

### Stateless (Sem Estado)

**O que é:** Não lembra nada de uma requisição para outra.

**Exemplo:** Cada vez que você acessa uma página, é como se fosse a primeira vez.

**Analogia:** Stateless é como alguém com amnésia - não lembra o que aconteceu antes.

---

## T

### Terminal

**O que é:** Janela de comandos onde você digita instruções para o computador.

**O que faz:**
- Rodar comandos do Git
- Instalar bibliotecas com npm
- Executar testes
- Rodar o projeto

**Analogia:** Terminal é como conversar com o computador através de comandos em vez de clicar em botões.

---

### TypeScript

**O que é:** JavaScript com tipos (mais seguro).

**Diferença:**
- JavaScript = qualquer valor pode ser qualquer coisa
- TypeScript = você define o tipo de cada dado

**Exemplo:**
```typescript
// TypeScript
function saudacao(nome: string) {
  return "Olá, " + nome
}

// Se chamar saudacao(123), TypeScript reclama
// Porque 123 é número, não texto
```

**Analogia:** TypeScript é como ter uma vasilha etiquetada "só açúcar" - você não pode colocar sal nela.

---

## V

### Version Control (Controle de Versão)

**O que é:** Sistema que guarda histórico de todas as mudanças.

**O que faz:**
- Cada mudança é registrada
- Você pode voltar para qualquer versão
- Várias pessoas podem trabalhar juntas

**Analogia:** Version control é como ter uma máquina do tempo para seu código.

---

## Comandos do Terminal Explicados

### Git

```bash
git status
# Pergunta: "O que mudou desde o último salvamento?"

git add .
# Diz: "Essas mudanças fazem parte do próximo salvamento"

git commit -m "descrição"
# Registra: "Na versão X, fizemos Y"

git push
# Upload: "Envia suas mudanças para o servidor"

git pull
# Download: "Baixa mudanças do servidor"

git checkout -b nome-do-branch
# Cria: "Uma cópia do projeto para testar"

git merge nome-do-branch
# Junta: "Traz as mudanças do branch para o principal"
```

### npm

```bash
npm install nome-da-biblioteca
# Baixa: "Instala essa biblioteca no projeto"

npm install
# Instala todas as bibliotecas listadas no package.json

npm run dev
# Roda: "Inicia o projeto em modo desenvolvimento"

npm run build
# Compila: "Prepara o projeto para produção"

npm test
# Roda: "Executa os testes do projeto"
```

### Supabase CLI

```bash
supabase db push
# Envia: "Envia as mudanças do banco para o servidor"

supabase db diff
# Mostra: "O que mudou no banco de dados"

supabase gen types typescript
# Gera: "Cria tipos TypeScript baseados no banco"
```

---

## Perguntas Frequentes

### "O que acontece se eu não fizer commits frequentes?"

Você perde trabalho. Se algo der errado e você não tem commit recente, não consegue voltar.

**Regra:** Faça commit a cada funcionalidade que terminar.

---

### "O que é um erro 'red' no terminal?"

Erros vermelhos geralmente significam que:
- Alguma biblioteca está faltando
- Há um erro no código
- Alguma configuração está errada

**O que fazer:** Copie o erro completo e pergunte à IA.

---

### "Preciso entender Git para usar o projeto?"

Para vibe coding, você precisa entender o básico:
- Commit = salvar versão
- Push = enviar para servidor
- Branch = cópia para testar

O resto você aprende com o tempo.

---

### "O que é um 'dependency hell'?"

É quando as bibliotecas do projeto entram em conflito (uma precisa de versão X, outra precisa de versão Y).

**Como evitar:** Siga as recomendações de versões do projeto.

---

### "Por que às vezes o código funciona local mas não no servidor?"

Geralmente é:
- Environment variables faltando
- Caminhos de arquivos diferentes
- Versões de bibliotecas diferentes

**O que fazer:** Verifique as mensagens de erro - elas sempre dão uma dica.

---

## Próximos Passos

Agora que você entende os termos básicos:

1. **Leia BANDEIRAS-VERMELHAS.md** para saber o que NÃO fazer
2. **Vá para 00-COMEÇAR.md** quando estiver pronto para criar seu projeto
3. **Pergunte à IA sempre que não entender algo**

---

**Versão:** 1.0.0
**Última atualização:** 2026-02-11
**Responsável:** Claude Code
