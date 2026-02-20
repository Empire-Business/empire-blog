# ScrapeCreators API Integration

## Overview

Documentação completa para integração com a API do ScrapeCreators, serviço de scraping para Instagram e YouTube.

**Base URL:** `https://api.scrapecreators.com`

**Autenticação:** Todas as requisições requerem o header `x-api-key`

---

## Recursos Disponíveis

### YouTube
- `GET /v1/youtube/video` - Informações completas do vídeo
- `GET /v1/youtube/video/transcript` - Transcrição do vídeo

### Instagram
- `GET /v1/instagram/profile` - Perfil público completo
- `GET /v2/instagram/user/posts` - Posts públicos do usuário
- `GET /v1/instagram/user/reels` - Reels públicos do usuário
- `GET /v1/instagram/user/embed` - Embed HTML do perfil
- `GET /v1/instagram/post` - Detalhes de post/reel específico
- `GET /v2/instagram/media/transcript` - Transcrição de post/reel

---

## Configuração da Chave API

A chave API deve ser configurada no Supabase Secrets para segurança.

**Nome da variável:** `SCRAPECREATORS_API_KEY`

Veja detalhes em [config.md](./config.md)

---

## Documentação por Recurso

- [Configuração](./config.md) - Setup da chave API no Supabase
- [YouTube](./youtube.md) - Endpoints do YouTube
- [Instagram](./instagram.md) - Endpoints do Instagram
- [Exemplos de Código](./examples/) - Implementações práticas

---

## Rate Limits e Considerações

- A API tem limites de requisições baseados no plano contratado
- O endpoint de transcrição do Instagram pode levar 10-30 segundos (processamento com IA)
- Sempre implemente retry logic com exponential backoff
- Use paginação quando disponível (`next_max_id`, `max_id`)

---

## Tratamento de Erros

A API pode retornar os seguintes códigos de status:

| Status | Descrição |
|--------|-----------|
| 200 | Sucesso |
| 400 | Requisição inválida (parâmetros faltando) |
| 401 | API Key inválida ou ausente |
| 404 | Recurso não encontrado |
| 429 | Rate limit excedido |
| 500 | Erro interno do servidor |

**Exemplo de resposta de erro:**
```json
{
  "success": false,
  "error": "Invalid API key"
}
```
