# Acolhe — versão revisada

Aplicação web com telas públicas, conta de usuária, formulário de denúncia, mapa informativo e painel administrativo. A sessão de administração usa cookie separado da sessão de usuária; autenticação no painel nunca vale como login de denunciante. Denúncia identificada exige sessão autenticada: o navegador verifica `/api/me`, mas a API também impõe a regra; o usuário precisa ter nome e telefone no cadastro. Denúncias anônimas são armazenadas sem vínculo ao usuário.

## Requisitos

Node.js 22.5+ com `node:sqlite`. Não há dependências npm externas.

## Executar localmente

```bash
ACOLHE_ADMIN_EMAIL=admin@example.org ACOLHE_ADMIN_PASSWORD='DefinaUmaSenhaForteAqui' npm start
```

Abra `http://localhost:3000`. A conta administrativa inicial é criada apenas quando essas variáveis são informadas. Em produção, ambas são obrigatórias e a senha deve ter pelo menos 12 caracteres. Não use a senha em exemplos reais nem a compartilhe.

`ACOLHE_DATA_DIR` define o diretório persistente para o SQLite e anexos. Em produção, configure-o para armazenamento durável e faça backups protegidos. Não use armazenamento efêmero.

## Rotas principais

- `POST /api/register`, `POST /api/login`, `POST /api/logout`, `GET /api/me`
- `POST /api/denuncias` (identificadas exigem sessão válida)
- `GET /api/minhas-denuncias`
- Administração: `/api/admin/login`, `/api/admin/me`, `/api/admin/denuncias`, `/api/admin/analytics`, `/api/admin/auditoria`, exportação CSV e rotas de atualização/exclusão.

## Antes de produção

Configure HTTPS, armazenamento persistente, cópias de segurança, monitoramento, política de retenção e controle de acesso. Revise avisos de privacidade e contatos de emergência para a região de implantação. A triagem é heurística por palavras-chave, não é diagnóstico nem substitui avaliação humana. O chat é uma demonstração e o mapa contém pontos de exemplo; confirme serviços e horários antes de uso real. A saída rápida navega para uma página em branco, mas não apaga histórico, dados do servidor nem sessão.

O formato de banco desta versão é novo (`acolhe.sqlite`). Para dados anteriores, faça backup e migração validada; não sobrescreva a base existente sem plano de migração.
