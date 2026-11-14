const { describe, it } = require('node:test');
const assert = require('node:assert');

describe('Testes de Integração - Endpoints da API', () => {
  it('GET /api/health deve retornar status 200 e ok:true', async () => {
    try {
      const res = await fetch('http://localhost:3000/api/health');
      const data = await res.json();
      
      assert.strictEqual(res.status, 200);
      assert.strictEqual(data.ok, true);
    } catch (err) {
      assert.fail('Certifique-se de iniciar o servidor com "npm start" antes de rodar os testes de integração.');
    }
  });
});