---
## PARA CLAUDE (AI INSTRUCTIONS)

Este protocolo é invocado pelo comando `*design` no CLAUDE.md.
Execute conforme as regras definidas no CLAUDE.md e em COMUNICACAO.md.
---

# Protocolo de Design System (*design)

## Quando Usar

- Criando componentes visuais
- Definindo identidade visual
- Padronizando estilos do projeto
- Configurando Tailwind CSS
- Criando tokens de design

---

## Elementos do Design System

### 1. Paleta de Cores

#### Estrutura de Cores

```javascript
// tailwind.config.js
colors: {
  // Cor principal (brand)
  primary: {
    50: '#eff6ff',   // Mais claro
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',  // Base
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',  // Mais escuro
  },

  // Cores semânticas
  success: { /* verde */ },
  warning: { /* amarelo */ },
  error: { /* vermelho */ },
  info: { /* azul claro */ },

  // Neutros
  gray: { /* escala de cinza */ },
}
```

#### Escolhendo Cores

```
PRIMARY → Ação principal (botões, links)
SECONDARY → Ação secundária
ACCENT → Destaques especiais
SUCCESS → Confirmações, sucesso
WARNING → Alertas, atenção
ERROR → Erros, perigo
NEUTRAL → Textos, fundos, bordas
```

### 2. Tipografia

#### Escala Tipográfica

```javascript
// tailwind.config.js
fontSize: {
  'xs': ['0.75rem', { lineHeight: '1rem' }],      // 12px
  'sm': ['0.875rem', { lineHeight: '1.25rem' }], // 14px
  'base': ['1rem', { lineHeight: '1.5rem' }],    // 16px
  'lg': ['1.125rem', { lineHeight: '1.75rem' }], // 18px
  'xl': ['1.25rem', { lineHeight: '1.75rem' }],  // 20px
  '2xl': ['1.5rem', { lineHeight: '2rem' }],     // 24px
  '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
  '4xl': ['2.25rem', { lineHeight: '2.5rem' }],  // 36px
  '5xl': ['3rem', { lineHeight: '1' }],          // 48px
}
```

#### Uso por Contexto

```
H1 (Hero/Título)    → text-4xl ou text-5xl, font-bold
H2 (Seção)          → text-2xl ou text-3xl, font-bold
H3 (Subseção)       → text-xl ou text-2xl, font-semibold
H4 (Card title)     → text-lg, font-semibold
Body                → text-base, font-normal
Small/Caption       → text-sm, font-normal
Label               → text-sm, font-medium
```

### 3. Espaçamento

#### Sistema de Spacing

```javascript
// Tailwind padrão (use sempre estes)
spacing: {
  '0': '0',
  '1': '0.25rem',   // 4px
  '2': '0.5rem',    // 8px
  '3': '0.75rem',   // 12px
  '4': '1rem',      // 16px
  '5': '1.25rem',   // 20px
  '6': '1.5rem',    // 24px
  '8': '2rem',      // 32px
  '10': '2.5rem',   // 40px
  '12': '3rem',     // 48px
  '16': '4rem',     // 64px
  '20': '5rem',     // 80px
  '24': '6rem',     // 96px
}
```

#### Regras de Uso

```
Padding interno de botão    → p-2 ou p-3
Gap entre elementos         → gap-4
Margin entre seções         → mb-8 ou mb-12
Padding de container        → p-4 (mobile) / p-6 (desktop)
```

### 4. Border Radius

```javascript
borderRadius: {
  'none': '0',
  'sm': '0.125rem',   // 2px - sutil
  'DEFAULT': '0.25rem', // 4px - padrão
  'md': '0.375rem',   // 6px - botões
  'lg': '0.5rem',     // 8px - cards
  'xl': '0.75rem',    // 12px - cards grandes
  '2xl': '1rem',      // 16px - modais
  'full': '9999px',   // totalmente redondo
}
```

### 5. Sombras

```javascript
boxShadow: {
  'sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',      // sutil
  'DEFAULT': '0 1px 3px 0 rgb(0 0 0 / 0.1)',  // padrão
  'md': '0 4px 6px -1px rgb(0 0 0 / 0.1)',    // cards
  'lg': '0 10px 15px -3px rgb(0 0 0 / 0.1)',  // dropdowns
  'xl': '0 20px 25px -5px rgb(0 0 0 / 0.1)',  // modais
}
```

---

## Tokens de Design

### Arquivo de Tokens

```typescript
// src/design/tokens.ts
export const tokens = {
  colors: {
    brand: {
      primary: '#3b82f6',
      secondary: '#8b5cf6',
    },
    feedback: {
      success: '#22c55e',
      warning: '#eab308',
      error: '#ef4444',
      info: '#3b82f6',
    },
  },
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['JetBrains Mono', 'monospace'],
    },
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
  radius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    full: '9999px',
  },
}
```

---

## Componentes Base

### Botão

```tsx
// Variantes de botão
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

const buttonStyles = {
  base: 'font-medium rounded-lg transition-colors inline-flex items-center justify-center',

  variants: {
    primary: 'bg-primary-600 text-white hover:bg-primary-700',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
    outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50',
    ghost: 'text-gray-600 hover:bg-gray-100',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  },

  sizes: {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  },
}
```

### Input

```tsx
const inputStyles = {
  base: 'w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none',

  states: {
    error: 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
    disabled: 'bg-gray-100 cursor-not-allowed',
  },
}
```

### Card

```tsx
const cardStyles = {
  base: 'bg-white rounded-xl border border-gray-200 shadow-sm',
  padding: {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  },
}
```

---

## Tema Claro/Escuro

### Configuração

```javascript
// tailwind.config.js
module.exports = {
  darkMode: 'class', // ou 'media' para automático

  theme: {
    extend: {
      colors: {
        // Cores que mudam no dark mode
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
    },
  },
}
```

### CSS Variables

```css
/* globals.css */
:root {
  --background: #ffffff;
  --foreground: #111827;
}

.dark {
  --background: #111827;
  --foreground: #f9fafb;
}
```

### Toggle de Tema

```tsx
function ThemeToggle() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  return (
    <button onClick={() => setDark(!dark)}>
      {dark ? '☀️' : '🌙'}
    </button>
  )
}
```

---

## Checklist de Design

### Antes de criar componente:

```
□ Defini as cores (primary, secondary, etc)
□ Defini a tipografia (fontes, tamanhos)
□ Defini espaçamentos consistentes
□ Defini border radius padrão
□ Defini sombras (se necessário)
```

### Ao criar componente:

```
□ Usa tokens do design system
□ Tem variantes (primary, secondary, etc)
□ Tem tamanhos (sm, md, lg)
□ Tem estados (hover, focus, disabled, error)
□ Funciona em dark mode (se aplicável)
□ É responsivo (mobile-first)
```

### Antes de aprovar:

```
□ Consistente com resto do app
□ Cores seguem padrão
□ Tipografia consistente
□ Espaçamentos uniformes
□ Bordas arredondadas consistentes
□ Acessível (contraste, focus visible)
```

---

## Ferramentas Úteis

### Paletas de Cores

- [Coolors](https://coolors.co/) - Gerador de paletas
- [Adobe Color](https://color.adobe.com/) - Roda de cores
- [Tailwind Color Generator](https://uicolors.app/)

### Tipografia

- [Google Fonts](https://fonts.google.com/) - Fontes gratuitas
- [Font Pair](https://fontpair.co/) - Combinações de fontes

### Contraste

- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- WCAG AA: mínimo 4.5:1 para texto normal

---

## Resumo para Iniciantes

| Elemento | Regra de Ouro |
|----------|---------------|
| Cores | Máximo 3-4 cores principais |
| Tipografia | Máximo 2 fontes (1 para títulos, 1 para corpo) |
| Espaçamento | Use a escala (4, 8, 12, 16, 24, 32...) |
| Border Radius | Mantenha consistente (ex: todos os cards com lg) |
| Sombra | Quanto mais "acima", mais sombra |

**Lembre-se:** Consistência é mais importante que "bonito". Um design consistente parece profissional.
