# Design Tokens - Empire Blog

## O que são Design Tokens?

Design tokens são valores visuais padronizados (cores, espaçamentos, tipografia) que garantem consistência em todo o projeto.

---

## Cores

### Paleta Principal (Empire Business)

```javascript
// tailwind.config.ts
colors: {
  // Primary (Azul)
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',   // Primary Light
    500: '#3b82f6',   // Primary (Base)
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
    950: '#1e293b',   // Primary Dark
  },

  // Accent (Verde/Esmeralda)
  accent: {
    50: '#ecfdf5',
    100: '#d1fae5',
    200: '#a7f3d0',
    300: '#6ee7b7',
    400: '#34d399',
    500: '#10b981',   // Accent (Base)
    600: '#059669',
    700: '#047857',
    800: '#065f46',
    900: '#064e3b',
  },

  // Slate (Neutros)
  slate: {
    50: '#f8fafc',    // Background
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',   // Text Secondary
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',   // Text Primary
    950: '#020617',
  },
}
```

### Cores Semânticas

```javascript
// Cores com significado específico
semantic: {
  background: '#f8fafc',
  surface: '#ffffff',
  text: {
    primary: '#0f172a',
    secondary: '#64748b',
    muted: '#94a3b8',
  },
  border: '#e2e8f0',
  divider: '#f1f5f9',
}
```

### Cores de Feedback

```javascript
feedback: {
  success: {
    light: '#d1fae5',
    DEFAULT: '#10b981',
    dark: '#059669',
  },
  warning: {
    light: '#fef3c7',
    DEFAULT: '#f59e0b',
    dark: '#d97706',
  },
  error: {
    light: '#fee2e2',
    DEFAULT: '#ef4444',
    dark: '#dc2626',
  },
  info: {
    light: '#dbeafe',
    DEFAULT: '#3b82f6',
    dark: '#2563eb',
  },
}
```

### Uso por Contexto

| Contexto | Cor | Classe Tailwind |
|----------|-----|-----------------|
| Botão primário | Primary 500 | `bg-primary-500` |
| Botão hover | Primary 600 | `hover:bg-primary-600` |
| Link | Primary 500 | `text-primary-500` |
| Sucesso | Accent 500 | `text-accent-500` |
| Erro | Red 500 | `text-red-500` |
| Background página | Slate 50 | `bg-slate-50` |
| Card | White | `bg-white` |
| Texto principal | Slate 900 | `text-slate-900` |
| Texto secundário | Slate 500 | `text-slate-500` |

---

## Tipografia

### Fontes

```javascript
fontFamily: {
  // Headings - Elegante, com serifa
  heading: ['Playfair Display', 'Georgia', 'serif'],

  // Body - Limpo, sem serifa
  sans: ['Inter', 'system-ui', 'sans-serif'],

  // Código - Monospace
  mono: ['JetBrains Mono', 'Consolas', 'monospace'],
}
```

### Escala Tipográfica

```javascript
fontSize: {
  // Micro
  'xs': ['0.75rem', { lineHeight: '1rem' }],      // 12px - Captions, badges
  'sm': ['0.875rem', { lineHeight: '1.25rem' }],  // 14px - Labels, small text

  // Body
  'base': ['1rem', { lineHeight: '1.5rem' }],     // 16px - Parágrafos
  'lg': ['1.125rem', { lineHeight: '1.75rem' }],  // 18px - Lead text

  // Headings
  'xl': ['1.25rem', { lineHeight: '1.75rem' }],   // 20px - H4
  '2xl': ['1.5rem', { lineHeight: '2rem' }],      // 24px - H3
  '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px - H2
  '4xl': ['2.25rem', { lineHeight: '2.5rem' }],   // 36px - H1
  '5xl': ['3rem', { lineHeight: '1' }],           // 48px - Hero
  '6xl': ['3.75rem', { lineHeight: '1' }],        // 60px - Hero large
}
```

### Pesos de Fonte

```javascript
fontWeight: {
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
}
```

### Uso por Elemento

| Elemento | Fonte | Tamanho | Peso |
|----------|-------|---------|------|
| H1 (Hero) | heading | text-5xl | font-bold |
| H1 (Página) | heading | text-4xl | font-bold |
| H2 (Seção) | sans | text-2xl | font-bold |
| H3 (Card) | sans | text-xl | font-semibold |
| H4 | sans | text-lg | font-semibold |
| Body | sans | text-base | font-normal |
| Small/Caption | sans | text-sm | font-normal |
| Label | sans | text-sm | font-medium |
| Code | mono | text-sm | font-normal |

---

## Espaçamento

### Sistema de Spacing (Base: 4px)

```javascript
spacing: {
  '0': '0',
  '0.5': '0.125rem',  // 2px
  '1': '0.25rem',     // 4px  - xs
  '1.5': '0.375rem',  // 6px
  '2': '0.5rem',      // 8px  - sm
  '2.5': '0.625rem',  // 10px
  '3': '0.75rem',     // 12px
  '3.5': '0.875rem',  // 14px
  '4': '1rem',        // 16px - md
  '5': '1.25rem',     // 20px
  '6': '1.5rem',      // 24px - lg
  '8': '2rem',        // 32px - xl
  '10': '2.5rem',     // 40px
  '12': '3rem',       // 48px - 2xl
  '16': '4rem',       // 64px
  '20': '5rem',       // 80px
  '24': '6rem',       // 96px
}
```

### Uso por Contexto

| Contexto | Token | Valor |
|----------|-------|-------|
| Padding botão pequeno | p-2 | 8px |
| Padding botão médio | p-3 | 12px |
| Padding botão grande | p-4 | 16px |
| Padding card | p-6 | 24px |
| Padding container | p-4 md:p-8 | 16px/32px |
| Gap entre elementos | gap-4 | 16px |
| Gap entre seções | gap-8 | 32px |
| Margin entre seções | mb-12 | 48px |
| Margin entre blocos | mb-6 | 24px |

---

## Border Radius

```javascript
borderRadius: {
  'none': '0',
  'sm': '0.25rem',     // 4px - Tags, badges
  'DEFAULT': '0.375rem', // 6px
  'md': '0.5rem',      // 8px - Botões, inputs
  'lg': '0.75rem',     // 12px - Cards
  'xl': '1rem',        // 16px - Cards grandes
  '2xl': '1.5rem',     // 24px - Modais
  'full': '9999px',    // Totalmente redondo
}
```

### Uso por Componente

| Componente | Radius | Classe |
|------------|--------|--------|
| Badge/Tag | sm | rounded-sm |
| Button | md | rounded-md |
| Input | md | rounded-md |
| Card | lg | rounded-lg |
| Modal | 2xl | rounded-2xl |
| Avatar | full | rounded-full |
| Pill | full | rounded-full |

---

## Sombras

```javascript
boxShadow: {
  'none': 'none',
  'sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  'DEFAULT': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  'md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  'lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  'xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  'inner': 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
}
```

### Uso por Contexto

| Contexto | Sombra | Classe |
|----------|--------|--------|
| Card padrão | sm | shadow-sm |
| Card hover | md | hover:shadow-md |
| Dropdown | lg | shadow-lg |
| Modal | xl | shadow-xl |
| Elemento flutuante | 2xl | shadow-2xl |

---

## Transições

```javascript
transitionDuration: {
  DEFAULT: '150ms',
  fast: '75ms',
  normal: '150ms',
  slow: '300ms',
}

transitionTimingFunction: {
  DEFAULT: 'cubic-bezier(0.4, 0, 0.2, 1)',
  ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
}
```

### Uso

| Contexto | Duração | Classe |
|----------|---------|--------|
| Hover botão | 150ms | duration-150 |
| Hover card | 200ms | duration-200 |
| Modal open | 300ms | duration-300 |
| Sidebar toggle | 300ms | duration-300 |

---

## Z-Index

```javascript
zIndex: {
  '0': '0',
  '10': '10',     // Dropdown
  '20': '20',     // Sticky header
  '30': '30',     // Modal backdrop
  '40': '40',     // Modal
  '50': '50',     // Toast/Notification
}
```

---

## Breakpoints

```javascript
screens: {
  'sm': '640px',   // Mobile landscape
  'md': '768px',   // Tablet
  'lg': '1024px',  // Desktop
  'xl': '1280px',  // Desktop large
  '2xl': '1536px', // Desktop extra large
}
```

---

## Dark Mode

### CSS Variables

```css
/* globals.css */
:root {
  --background: 248 250 252;     /* slate-50 */
  --foreground: 15 23 42;        /* slate-900 */
  --card: 255 255 255;           /* white */
  --card-foreground: 15 23 42;   /* slate-900 */
  --primary: 59 130 246;         /* primary-500 */
  --primary-foreground: 255 255 255;
  --secondary: 241 245 249;      /* slate-100 */
  --secondary-foreground: 15 23 42;
  --muted: 241 245 249;          /* slate-100 */
  --muted-foreground: 100 116 139; /* slate-500 */
  --accent: 16 185 129;          /* accent-500 */
  --accent-foreground: 255 255 255;
  --border: 226 232 240;         /* slate-200 */
  --input: 226 232 240;          /* slate-200 */
  --ring: 59 130 246;            /* primary-500 */
}

.dark {
  --background: 15 23 42;        /* slate-900 */
  --foreground: 248 250 252;     /* slate-50 */
  --card: 30 41 59;              /* slate-800 */
  --card-foreground: 248 250 252;
  --primary: 96 165 250;         /* primary-400 */
  --primary-foreground: 15 23 42;
  --secondary: 51 65 85;         /* slate-700 */
  --secondary-foreground: 248 250 252;
  --muted: 51 65 85;             /* slate-700 */
  --muted-foreground: 148 163 184; /* slate-400 */
  --accent: 52 211 153;          /* accent-400 */
  --accent-foreground: 15 23 42;
  --border: 51 65 85;            /* slate-700 */
  --input: 51 65 85;             /* slate-700 */
  --ring: 96 165 250;            /* primary-400 */
}
```

---

## Resumo Rápido

| Token | Valor | Uso |
|-------|-------|-----|
| Primary | `#3b82f6` | Ações principais |
| Accent | `#10b981` | Sucesso, CTAs |
| Background | `#f8fafc` | Fundo página |
| Text | `#0f172a` | Texto principal |
| Font heading | Playfair Display | Títulos |
| Font body | Inter | Corpo do texto |
| Radius card | 12px | Cards |
| Radius button | 8px | Botões |
| Shadow card | sm | Cards |
| Transition | 150ms | Hover effects |

---

**Documento criado em:** 2026-02-19
**Última atualização:** 2026-02-19
