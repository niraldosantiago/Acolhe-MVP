/* Camada de compatibilidade: preserva as funções e IDs do script original. */
const ACOLHE_ALLOWED = new Set(['image/jpeg','image/png','application/pdf','audio/mpeg','audio/wav']);
const ACOLHE_MAX_FILES = 10 * 1024 * 1024;

function acolheEscape(value) {
  return String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
}

function handleFiles(input) {
  const incoming = Array.from(input.files || []);
  const known = new Set((selectedFiles || []).map(f => `${f.name}-${f.size}-${f.lastModified}`));
  const accepted = [];
  for (const file of incoming) {
    const key = `${file.name}-${file.size}-${file.lastModified}`;
    if (!ACOLHE_ALLOWED.has(file.type)) { alert(`Tipo de arquivo não permitido: ${file.name}`); continue; }
    if (!known.has(key)) { accepted.push(file); known.add(key); }
  }
  const total = [...(selectedFiles || []), ...accepted].reduce((sum, f) => sum + f.size, 0);
  if (total > ACOLHE_MAX_FILES) { alert('O tamanho total dos arquivos não pode exceder 10 MB.'); return; }
  selectedFiles = [...(selectedFiles || []), ...accepted];
  renderFileList();
}
function renderFileList() {
  const container = document.getElementById('file-list-container'), list = document.getElementById('file-list');
  if (!container || !list) return;
  list.replaceChildren(); container.style.display = selectedFiles.length ? 'block' : 'none';
  selectedFiles.forEach((file, index) => {
    const item = document.createElement('div'); item.className = 'file-item';
    const label = document.createElement('span'); label.textContent = `${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`;
    const remove = document.createElement('button'); remove.type = 'button'; remove.className = 'btn-remove-file'; remove.textContent = '×'; remove.setAttribute('aria-label', `Remover ${file.name}`); remove.onclick = () => removeFile(index);
    item.append(label, remove); list.appendChild(item);
  });
}
function removeFile(index) { selectedFiles.splice(index, 1); renderFileList(); }
function clearAllFiles() { selectedFiles = []; const input = document.getElementById('file-input'); if (input) input.value = ''; renderFileList(); }
function readFile(file) { return new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve({name:file.name,type:file.type,size:file.size,data:reader.result}); reader.onerror = reject; reader.readAsDataURL(file); }); }

async function submitForm(event) {
  event.preventDefault();
  const form = event.target, type = form.querySelector('input[name="anon_type"]:checked')?.value, violence = document.getElementById('violence-type')?.value, description = document.getElementById('report-text')?.value.trim();
  if (!type || !violence || !description) { alert('Preencha todos os campos obrigatórios antes de enviar.'); return; }
  const button = form.querySelector('[type="submit"]'); if (button) button.disabled = true;
  try {
    const body = {tipo_denuncia:type,tipo_violencia:violence,descricao:description,nome:type==='identified'?document.getElementById('user-name')?.value.trim()||null:null,telefone:type==='identified'?document.getElementById('user-phone')?.value.trim()||null:null,email:type==='identified'?document.getElementById('user-email')?.value.trim()||null:null,arquivos:await Promise.all(selectedFiles.map(readFile))};
    const response = await fetch('/api/denuncias',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)}), data = await response.json();
    if (!response.ok) throw new Error(data.erro || 'Não foi possível enviar a denúncia.');
    alert(`Denúncia recebida. Protocolo: ${data.id}`); resetForm();
  } catch (error) { console.error(error); alert(error.message || 'Erro ao enviar a denúncia.'); }
  finally { if (button) button.disabled = false; }
}
function resetForm() { document.getElementById('report-form')?.reset(); clearAllFiles(); const count = document.getElementById('char-count'); if (count) count.textContent='0'; const fields = document.getElementById('identified-fields'); if (fields) fields.style.display='none'; }

function openModal(id) { const modal=document.getElementById(id); if (!modal) return; modal.classList.add('active'); modal.setAttribute('aria-hidden','false'); document.body.classList.add('modal-open'); modal.querySelector('.close-modal')?.focus(); }
function closeModal(id) { const modal=document.getElementById(id); if (!modal) return; modal.classList.remove('active'); modal.setAttribute('aria-hidden','true'); document.body.classList.remove('modal-open'); }
function clearLocalData() { ['acolhe_theme','acolhe_lang','acolhe_pin_enabled'].forEach(k=>localStorage.removeItem(k)); alert('Preferências locais removidas deste navegador.'); }
function togglePinSecurity(input) { if (input.checked) { const pin=prompt('Crie um PIN local de 4 dígitos:'); if (!/^\d{4}$/.test(pin||'')) { input.checked=false; alert('O PIN deve ter exatamente 4 dígitos.'); return; } localStorage.setItem('acolhe_pin_enabled','true'); } else localStorage.removeItem('acolhe_pin_enabled'); }

async function handleAuthSubmit(event, type) {
  event.preventDefault(); const prefix=type==='login'?'auth-login':'auth-reg'; const email=document.getElementById(`${prefix}-email`)?.value.trim(); const password=document.getElementById(`${prefix}-password`)?.value;
  if (type==='register' && password!==document.getElementById('auth-reg-confirm')?.value) { alert('As senhas não conferem.'); return; }
  try { const response=await fetch(type==='login'?'/api/login':'/api/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password})}),data=await response.json(); if(!response.ok)throw Error(data.erro||'Falha na autenticação.'); closeModal('auth-modal'); alert(data.mensagem||'Operação concluída.'); await updateProfile(); } catch(error) { alert(error.message); }
}
async function updateProfile() { const response=await fetch('/api/me'), data=await response.json(); if(data.user){ const name=document.getElementById('profile-display-name'); if(name) name.textContent=data.user.email; const email=document.getElementById('profile-email'); if(email) email.textContent=data.user.email; } }

const savedAcolheTheme=localStorage.getItem('acolhe_theme'); if(savedAcolheTheme==='dark') document.body.classList.add('dark-theme');
document.addEventListener('keydown', e => { if(e.key==='Escape') document.querySelectorAll('.modal-overlay.active').forEach(m=>closeModal(m.id)); });
