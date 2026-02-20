# API Documentation

Documentação de integrações de API do projeto Empire.

## Integrações Disponíveis

| Integração | Descrição | Status |
|------------|-----------|--------|
| [ScrapeCreators](./scrapecreators/) | Instagram & YouTube scraping | ✅ Documentado |

---

## Estrutura

```
API-DOCS/
├── README.md                          # Este arquivo
├── scrapecreators/
│   ├── README.md                      # Visão geral da API
│   ├── config.md                      # Configuração no Supabase
│   ├── youtube.md                     # Endpoints YouTube
│   ├── instagram.md                   # Endpoints Instagram
│   └── examples/
│       ├── youtube.ts                 # Exemplos YouTube
│       └── instagram.ts               # Exemplos Instagram
```

---

## Padrões de Documentação

Toda documentação de API deve incluir:

1. **Visão geral** - O que a API faz
2. **Autenticação** - Como autenticar requisições
3. **Endpoints** - URLs, métodos, parâmetros, respostas
4. **Exemplos** - Código funcional com tratamento de erros
5. **Configuração** - Como configurar no Supabase

---

## Segurança

⚠️ **IMPORTANTE:** Nunca commite chaves API no código!

Sempre use:
- Supabase Secrets para Edge Functions
- Variáveis de ambiente para aplicações
- `.env` files (adicionados ao `.gitignore`)

---

## Atualizações

Quando adicionar novas integrações:

1. Crie pasta específica em `API-DOCS/[nome-da-api]/`
2. Siga a estrutura de documentação padrão
3. Atualize este README com a nova integração
4. Registre em `docs/MUDANCAS.md`
