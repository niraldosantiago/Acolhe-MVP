const { describe, it } = require('node:test');
const assert = require('node:assert');

// Regras extraídas do servidor
const validarEmail = (email) => /^\S+@\S+\.\S+$/.test(email);
const validarSenha = (senha) => typeof senha === 'string' && senha.length >= 10;

describe('Testes Unitários - Validações do Acolhe', () => {
  it('deve aceitar um e-mail com formato válido', () => {
    assert.strictEqual(validarEmail('contato@acolhe.com'), true);
  });

  it('deve rejeitar e-mails sem o domínio ou formato incorreto', () => {
    assert.strictEqual(validarEmail('usuario-sem-dominio'), false);
  });

  it('deve validar a senha conforme o requisito mínimo de 10 caracteres', () => {
    assert.strictEqual(validarSenha('senhaSegura123'), true);
    assert.strictEqual(validarSenha('12345'), false);
  });
});