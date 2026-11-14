const { test, expect } = require('@playwright/test');

test.describe('Testes E2E - Interface Web', () => {
  test('deve acessar a página inicial e capturar print de evidência', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Verifica se o título da página está correto
    await expect(page).toHaveTitle(/Acolhe/i);
    
    // Captura evidência automática na pasta de evidências
    await page.screenshot({ path: 'evidencias/home-page-execucao.png', fullPage: true });
  });
});