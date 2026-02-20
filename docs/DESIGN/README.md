# Design System - Empire Blog

## Visão Geral

Este documento define a identidade visual do Empire Blog Platform, inspirada no estilo premium do Empire Business.

---

## Princípios de Design

### 1. Elegante e Profissional
- Cores sóbrias com acentos estratégicos
- Tipografia hierárquica e legível
- Espaçamento generoso

### 2. Moderno e Limpo
- Cards com sombras suaves
- Bordas arredondadas consistentes
- Ícones minimalistas

### 3. Alto Contraste e Legibilidade
- Texto escuro em fundos claros
- Contraste mínimo 4.5:1 (WCAG AA)
- Hierarquia visual clara

---

## Documentação

| Arquivo | Conteúdo |
|---------|----------|
| [tokens.md](tokens.md) | Cores, tipografia, espaçamento, radius, sombras |
| [components.md](components.md) | Componentes base (Button, Input, Card, etc) |

---

## Paleta de Cores (Resumo)

| Nome | Hex | Uso |
|------|-----|-----|
| Primary Dark | `#1e293b` | Header, footer, textos importantes |
| Primary | `#3b82f6` | Botões primários, links, destaques |
| Primary Light | `#60a5fa` | Hover states, backgrounds suaves |
| Accent | `#10b981` | Sucesso, CTAs secundários |
| Background | `#f8fafc` | Fundo da página |
| Surface | `#ffffff` | Cards, modais |
| Text Primary | `#0f172a` | Texto principal |
| Text Secondary | `#64748b` | Texto secundário, labels |

---

## Tipografia (Resumo)

| Elemento | Fonte | Tamanho | Peso |
|----------|-------|---------|------|
| Headings | Playfair Display | 24-48px | Bold |
| Body | Inter | 16px | Regular |
| Small/Caption | Inter | 14px | Regular |
| Code | JetBrains Mono | 14px | Regular |

---

## Espaçamento

Base: 4px (0.25rem)

| Token | Valor | Uso |
|-------|-------|-----|
| xs | 4px | Micro espaçamentos |
| sm | 8px | Padding interno pequeno |
| md | 16px | Padding padrão |
| lg | 24px | Entre seções |
| xl | 32px | Entre blocos grandes |
| 2xl | 48px | Hero, features |

---

## Border Radius

| Token | Valor | Uso |
|-------|-------|-----|
| sm | 4px | Badges, tags |
| md | 8px | Botões, inputs |
| lg | 12px | Cards |
| xl | 16px | Modais |
| full | 9999px | Avatares, pills |

---

## Sombras

| Token | Uso |
|-------|-----|
| sm | Cards sutis |
| md | Cards hover, dropdowns |
| lg | Modais, popovers |
| xl | Elementos flutuantes |

---

## Componentes Principais

| Componente | Arquivo | Descrição |
|------------|---------|-----------|
| Button | components/ui/button.tsx | Botões com variantes |
| Input | components/ui/input.tsx | Campos de texto |
| Card | components/ui/card.tsx | Containers visuais |
| Badge | components/ui/badge.tsx | Tags e status |
| Toast | components/ui/toast.tsx | Notificações |
| Dialog | components/ui/dialog.tsx | Modais |

> Base: shadcn/ui com customizações do Empire Business

---

## Modo Escuro

O sistema suporta modo escuro automático ou manual.

### Cores Dark Mode

| Elemento | Light | Dark |
|----------|-------|------|
| Background | `#f8fafc` | `#0f172a` |
| Surface | `#ffffff` | `#1e293b` |
| Text Primary | `#0f172a` | `#f8fafc` |
| Text Secondary | `#64748b` | `#94a3b8` |

---

## Referências Visuais

### Inspiração
- Empire Business (estilo premium)
- Linear (UI limpa)
- Stripe (profissionalismo)
- Vercel (moderno)

### Mockups
Ver pasta `docs/mockups/` se disponível.

---

## Checklist de Implementação

- [ ] Configurar Tailwind com tokens
- [ ] Instalar fontes (Playfair Display, Inter)
- [ ] Configurar shadcn/ui
- [ ] Criar componentes base
- [ ] Implementar dark mode
- [ ] Testar acessibilidade (contraste)

---

**Documento criado em:** 2026-02-19
**Última atualização:** 2026-02-19
