# Plano de Testes - Projeto Acolhe

## 1. Visão Geral
Este documento descreve a estratégia, o escopo e as evidências dos testes aplicados ao sistema **Acolhe**, abrangendo validações unitárias, testes de integração de API e testes automatizados de interface (E2E).

## 2. Ferramentas e Ambiente
* **Test Runner:** Node.js Native Test (`node --test`)
* **Testes E2E:** Playwright
* **Ambiente:** Local (Node.js e SQLite)

## 3. Casos de Teste e Execução

| ID | Tipo | Descrição do Teste | Resultado Esperado | Status |
|---|---|---|---|---|
| CT01 | Unitário | Validar regras de e-mail e senha no cadastro | Rejeitar e-mails inválidos e senhas < 10 caracteres | Aprovado |
| CT02 | Integração | Consultar endpoint de saúde da API (`/api/health`) | Retornar status HTTP 200 e `{ ok: true }` | Aprovado |
| CT03 | E2E (Playwright) | Acessar página inicial e validar interface | Carregar título e elementos visuais com sucesso | Aprovado |

## 4. Evidências de Execução
As capturas de tela e relatórios que comprovam a execução bem-sucedida dos testes encontram-se armazenados na pasta `evidencias/` do projeto:
* `evidencias/home-page-execucao.png` (Execução do Playwright)
* Prints de terminal dos testes unitários e de integração.