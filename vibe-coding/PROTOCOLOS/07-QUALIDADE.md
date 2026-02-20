---
## PARA CLAUDE (AI INSTRUCTIONS)

Este protocolo é invocado pelo comando `*qualidade` no CLAUDE.md.
Execute conforme as regras definidas no CLAUDE.md e em COMUNICACAO.md.
---

# Protocolo de Qualidade (*qualidade)

## Quando Usar

- Antes de code review
- Quando o código está difícil de manter
- Antes de refatorações grandes
- Durante o desenvolvimento (check contínuo)
- Após sprint completar

---

## Code Smells - Sinais de Código Ruim

### 1. Long Method (Método Longo)

```
❌ FUNÇÃO COM 50+ LINHAS
✓ Funções com no máximo 20-30 linhas
✓ Cada função faz UMA coisa só
```

**Detectar:**
```bash
# Encontrar funções longas (Python)
grep -rE "^def " --include="*.py" -A 30 | wc -l
```

### 2. Large Class (Classe Grande)

```
❌ CLASSE COM 10+ MÉTODOS OU 300+ LINHAS
✓ Classes com responsabilidade única
✓ Dividir em classes menores
```

### 3. Duplicate Code (Código Duplicado)

```
❌ MESMO CÓDIGO EM 2+ LUGARES
✓ Extrair para função reutilizável
✓ "Don't Repeat Yourself" (DRY)
```

**Detectar:**
```bash
# Encontrar blocos similares
# Ferramenta: cpd (Copy-Paste Detector) ou jscpd
npx jscpd src/
```

### 4. Long Parameter List

```
❌ FUNÇÃO COM 5+ PARÂMETROS
✓ Máximo 3-4 parâmetros
✓ Usar objeto/config para múltiplos parâmetros
```

**Exemplo:**
```javascript
// ❌ Ruim
function criarUsuario(nome, email, senha, telefone, endereco, cidade, estado) {}

// ✅ Bom
function criarUsuario(dadosUsuario) {
  const { nome, email, senha, telefone, endereco } = dadosUsuario
}
```

### 5. Dead Code (Código Morto)

```
❌ CÓDIGO NUNCA CHAMADO
❌ VARIÁVEIS NÃO USADAS
❌ COMENTÁRIOS DE CÓDIGO ANTIGO
✓ Deletar código não utilizado
✓ Git guarda o histórico
```

**Detectar:**
```bash
# ESLint detecta variáveis não usadas
npx eslint src/ --rule 'no-unused-vars: error'
```

### 6. Magic Numbers

```
❌ if (status === 3)
✓ if (status === STATUS.CANCELADO)

❌ setTimeout(() => {}, 86400000)
✓ const UM_DIA_EM_MS = 24 * 60 * 60 * 1000
```

### 7. Deep Nesting

```
❌ if () { if () { if () { if () {}}}}
✓ Early returns
✓ Extrair condições para funções
```

**Exemplo:**
```javascript
// ❌ Ruim
function processar(usuario) {
  if (usuario) {
    if (usuario.ativo) {
      if (usuario.premium) {
        return "VIP"
      }
    }
  }
  return null
}

// ✅ Bom
function processar(usuario) {
  if (!usuario) return null
  if (!usuario.ativo) return null
  if (!usuario.premium) return null
  return "VIP"
}
```

---

## Princípios SOLID

### S - Single Responsibility (Responsabilidade Única)

```
Cada classe/função tem UM motivo para mudar

❌ Classe Usuario com métodos:
   - salvar()
   - enviarEmail()
   - gerarRelatorio()

✓ Classes separadas:
   - Usuario (dados)
   - UsuarioRepository (salvar)
   - EmailService (enviar)
   - RelatorioService (gerar)
```

### O - Open/Closed (Aberto/Fechado)

```
Aberto para extensão, fechado para modificação

❌ Modificar função existente para adicionar feature
✓ Usar herança/composição para extender
```

### L - Liskov Substitution

```
Classes filhas podem substituir a pai sem quebrar

❌ Classe Filha que lança erro em método da Pai
✓ Filha respeita contrato da Pai
```

### I - Interface Segregation

```
Interfaces específicas são melhores que uma geral

❌ Interface com 10 métodos onde cliente usa 2
✓ Interfaces pequenas e específicas
```

### D - Dependency Inversion

```
Depender de abstrações, não de implementações

❌ new Database() dentro da função
✓ Receber database como parâmetro
```

---

## Métricas de Qualidade

### Complexidade Ciclomática

```
< 10  → Simples, fácil de testar
10-20 → Moderada, considere refatorar
> 20  → Complexa, PRECISA refatorar
```

**Ferramentas:**
```bash
# ESLint com complexidade
npx eslint src/ --rule 'complexity: ["error", 10]'

# SonarQube (projetos maiores)
```

### Cobertura de Testes

```
> 80% → Bom
60-80% → Aceitável
< 60%  → Precisa melhorar
```

**Verificar:**
```bash
# Jest
npm test -- --coverage

# Vitest
npm run test -- --coverage
```

### Duplicação de Código

```
< 3%  → Excelente
3-5%  → Aceitável
> 5%   → Precisa atenção
```

---

## Checklist de Qualidade

### Antes de cada commit:

```
□ Funções têm nomes descritivos (não processar1, processar2)
□ Não há código comentado
□ Não há console.logs esquecidos
□ Complexidade ciclomática < 10
□ Sem magic numbers
□ Early returns usados
```

### Antes de code review:

```
□ Li meu próprio código (self-review)
□ Testei manualmente
□ Adicionei testes se necessário
□ Documentação atualizada
□ Passa lint sem warnings
```

### Por sprint:

```
□ Cobertura de testes >= 70%
□ Sem duplicação significativa
□ Dívida técnica documentada
□ Dependências atualizadas
```

---

## Ferramentas Recomendadas

### JavaScript/TypeScript

```bash
# ESLint - Linting
npm install -D eslint @typescript-eslint/eslint-plugin

# Prettier - Formatação
npm install -D prettier eslint-config-prettier

# Jest/Vitest - Testes
npm install -D vitest @vitest/coverage-v8
```

### Python

```bash
# Black - Formatação
pip install black

# Ruff - Linting
pip install ruff

# Pytest - Testes
pip install pytest pytest-cov
```

### Análise de Código

- **SonarQube** - Análise completa
- **CodeClimate** - Qualidade contínua
- **Codacy** - Automatizado no CI

---

## Exemplos de Refatoração

### Extrair Função

```javascript
// ANTES
function calcularTotal(pedidos) {
  let total = 0
  for (const pedido of pedidos) {
    const subtotal = pedido.quantidade * pedido.preco
    const desconto = subtotal * (pedido.desconto / 100)
    total += subtotal - desconto
  }
  return total
}

// DEPOIS
function calcularSubtotal(pedido) {
  return pedido.quantidade * pedido.preco
}

function aplicarDesconto(valor, percentual) {
  return valor * (1 - percentual / 100)
}

function calcularTotal(pedidos) {
  return pedidos.reduce((total, pedido) => {
    const subtotal = calcularSubtotal(pedido)
    return total + aplicarDesconto(subtotal, pedido.desconto)
  }, 0)
}
```

### Substituir Condicionais por Polimorfismo

```javascript
// ANTES
function calcularArea(forma) {
  if (forma.tipo === 'circulo') {
    return Math.PI * forma.raio ** 2
  } else if (forma.tipo === 'retangulo') {
    return forma.largura * forma.altura
  } else if (forma.tipo === 'triangulo') {
    return (forma.base * forma.altura) / 2
  }
}

// DEPOIS
class Circulo {
  calcularArea() { return Math.PI * this.raio ** 2 }
}

class Retangulo {
  calcularArea() { return this.largura * this.altura }
}

class Triangulo {
  calcularArea() { return (this.base * this.altura) / 2 }
}
```

---

## Resumo para Iniciantes

| Code Smell | O que é | Como resolver |
|------------|---------|---------------|
| Função longa | Muitas linhas | Dividir em funções menores |
| Código duplicado | Mesma coisa em vários lugares | Criar função reutilizável |
| Magic number | Número sem explicação | Criar constante com nome |
| Deep nesting | Muitos if dentro de if | Usar early return |

**Lembre-se:** Código limpo é código que outro desenvolvedor consegue entender em 5 minutos.
