// Controle de visibilidade para campos de senha do index.html.
function togglePasswordVisibility(inputId, button) {
  const input = document.getElementById(inputId);
  if (!input || !button) return;

  const showing = input.type === 'password';
  input.type = showing ? 'text' : 'password';

  const label = showing ? 'Ocultar senha' : 'Mostrar senha';
  button.setAttribute('aria-label', label);
  button.setAttribute('title', label);
  button.setAttribute('aria-pressed', String(showing));

  const icon = document.createElement('i');
  icon.className = showing ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye';
  icon.setAttribute('aria-hidden', 'true');
  button.replaceChildren(icon);
}

// Mantém compatibilidade temporária com onclick inline existentes no HTML.
// Para CSP em modo bloqueio, esses atributos onclick também devem ser migrados.
window.togglePasswordVisibility = togglePasswordVisibility;
