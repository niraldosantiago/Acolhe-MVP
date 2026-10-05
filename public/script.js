// --- DICIONÁRIO MULTI-IDIOMAS ---
const i18nTranslations = {
  pt: {
    nav_home: "Início",
    nav_help: "Como Ajudar",
    nav_emergency: "Emergência",
    nav_report: "Fazer Denúncia",
    nav_map: "Onde Buscar",
    quick_exit: "SAÍDA RÁPIDA",
    hero_subtitle: "Você não está sozinha.",
    hero_desc: "Encontre orientação, informações e canais de apoio de forma rápida e segura.",
    btn_need_help: "PRECISO DE AJUDA AGORA",
    how_can_we_help: "Como podemos ajudar?",
    card_find_help_title: "Encontrar ajuda",
    card_find_help_desc: "Serviços próximos",
    card_report_title: "Quero denunciar",
    card_report_desc: "Saiba como buscar ajuda",
    card_rights_title: "Meus direitos",
    card_rights_desc: "Conheça seus direitos",
    card_info_title: "Informações úteis",
    card_info_desc: "Orientações e contatos",
    security_title: "Sua segurança é prioridade.",
    security_desc: "Orientações e contatos seguros.",
    security_space: "Este é um espaço seguro e confidencial para você.",
    help_header: "Como podemos te ajudar?",
    help_subheader: "Escolha uma das opções abaixo:",
    opt_emergency_title: "Emergência",
    opt_emergency_desc: "Estou em uma situação de perigo agora.",
    opt_report_title: "Quero fazer uma denúncia",
    opt_report_desc: "Quero registrar ou buscar orientação sobre um caso.",
    opt_map_title: "Encontrar ajuda perto de mim",
    opt_map_desc: "Quero entender meus direitos e saber onde buscar ajuda.",
    opt_info_title: "Quero informações",
    opt_info_desc: "Quero entender meus direitos.",
    emergency_now_title: "Precisando de ajuda agora?",
    emergency_now_desc: "Se você está em uma situação de perigo, busque ajuda imediata:",
    call_190: "LIGAR PARA 190",
    call_190_sub: "Polícia Militar",
    call_180: "LIGAR PARA 180",
    call_180_sub: "Central de Atendimento à Mulher",
    other_options: "Outras opções:",
    emergency_chat: "Chat de emergência",
    emergency_chat_sub: "Converse com uma atendente",
    report_header: "Fazer denúncia",
    report_banner_desc: "Sua denúncia pode ajudar outras mulheres e salvar vidas.",
    label_report_type: "Como prefere fazer sua denúncia?",
    report_anon: "Denúncia anônima",
    report_anon_sub: "Sua identidade será mantida em sigilo",
    report_id: "Denúncia identificada",
    report_id_sub: "Seus dados serão utilizados para o contato",
    label_type_violence: "Sobre o que deseja denunciar?",
    opt_select: "Selecione o tipo de violência",
    label_description: "Conte o que aconteceu:",
    attach_label: "Deseja adicionar provas ou arquivos?",
    attach_files: "Enviar arquivos (fotos, áudios, documentos)",
    attach_limit: "Tamanho máximo: 10MB",
    btn_send_report: "Enviar denúncia",
    important_title: "Importante!",
    important_desc: "Em caso de emergência ligue 190",
    map_header: "Onde buscar ajuda",
    map_subheader: "Encontre serviços e instituições perto de você",
    nearby_places: "Locais próximos",
    see_all: "Ver todos >",
    not_found_title: "Não encontrou o que precisa?",
    not_found_desc: "Fale com nossa equipe e receba orientações",
    contact_us: "Fale conosco",
    modal_rights_title: "Seus Direitos Legais",
    chat_header: "Atendimento Acolhe",
    chat_status: "Online • Canal Seguro",
    chat_welcome: "Olá! Você está em um canal seguro e confidencial. Como podemos te ajudar agora?",
    footer_desc: "Uma plataforma segura e confidencial voltada ao acolhimento, orientação e proteção de mulheres em situação de vulnerabilidade ou violência.",
    footer_nav_title: "Navegação",
    footer_channels_title: "Canais de Ajuda",
    contact_190: "Polícia Militar",
    contact_180: "Central da Mulher",
    contact_100: "Direitos Humanos",
    footer_copyright: "© 2026 Acolhe. Todos os direitos reservados. Projeto sem fins lucrativos.",
    footer_security: "Seu histórico de navegação e dados estão protegidos."
  },
  en: {
    nav_home: "Home",
    nav_help: "Get Help",
    nav_emergency: "Emergency",
    nav_report: "Report",
    nav_map: "Find Help",
    quick_exit: "QUICK EXIT",
    hero_subtitle: "You are not alone.",
    hero_desc: "Find guidance, information, and support channels quickly and safely.",
    btn_need_help: "I NEED HELP NOW",
    how_can_we_help: "How can we help?",
    card_find_help_title: "Find help",
    card_find_help_desc: "Nearby services",
    card_report_title: "I want to report",
    card_report_desc: "Learn how to seek help",
    card_rights_title: "My rights",
    card_rights_desc: "Know your rights",
    card_info_title: "Useful information",
    card_info_desc: "Guidance and contacts",
    security_title: "Your safety is our priority.",
    security_desc: "Discrete and safe guidance.",
    security_space: "This is a safe and confidential space for you.",
    help_header: "How can we help you?",
    help_subheader: "Choose one of the options below:",
    opt_emergency_title: "Emergency",
    opt_emergency_desc: "I am in danger right now.",
    opt_report_title: "Make a report",
    opt_report_desc: "Register or seek guidance on a case.",
    opt_map_title: "Find help near me",
    opt_map_desc: "Understand my rights and find help.",
    opt_info_title: "Get information",
    opt_info_desc: "Understand your legal rights.",
    emergency_now_title: "Need help right now?",
    emergency_now_desc: "If you are in immediate danger, seek help now:",
    call_190: "CALL 190",
    call_190_sub: "Military Police",
    call_180: "CALL 180",
    call_180_sub: "Women's Helpline",
    other_options: "Other options:",
    emergency_chat: "Emergency Chat",
    emergency_chat_sub: "Talk to a representative",
    report_header: "Submit a Report",
    report_banner_desc: "Your report can help other women and save lives.",
    label_report_type: "How do you prefer to submit your report?",
    report_anon: "Anonymous report",
    report_anon_sub: "Your identity will remain confidential",
    report_id: "Identified report",
    report_id_sub: "Your details will be used to contact you",
    label_type_violence: "What type of violence are you reporting?",
    opt_select: "Select type of violence",
    label_description: "Tell us what happened:",
    attach_label: "Do you want to attach evidence or files?",
    attach_files: "Upload files (photos, audio, documents)",
    attach_limit: "Max size: 10MB",
    btn_send_report: "Submit Report",
    important_title: "Important!",
    important_desc: "In case of emergency call 190",
    map_header: "Where to find help",
    map_subheader: "Find services and support centers near you",
    nearby_places: "Nearby locations",
    see_all: "See all >",
    not_found_title: "Didn't find what you need?",
    not_found_desc: "Talk to our team for guidance",
    contact_us: "Contact us",
    modal_rights_title: "Your Legal Rights",
    chat_header: "Acolhe Support",
    chat_status: "Online • Secure Channel",
    chat_welcome: "Hello! You are in a safe and confidential chat. How can we help you right now?",
    footer_desc: "A safe and confidential platform dedicated to supporting, guiding, and protecting women in situations of vulnerability or violence.",
    footer_nav_title: "Navigation",
    footer_channels_title: "Help Channels",
    contact_190: "Military Police",
    contact_180: "Women's Helpline",
    contact_100: "Human Rights",
    footer_copyright: "© 2026 Acolhe. All rights reserved. Non-profit project.",
    footer_security: "Your browsing history and data are protected."
  },
  es: {
    nav_home: "Inicio",
    nav_help: "Ayuda",
    nav_emergency: "Emergencia",
    nav_report: "Denunciar",
    nav_map: "Buscar",
    quick_exit: "SALIDA RÁPIDA",
    hero_subtitle: "No estás sola.",
    hero_desc: "Encuentra orientación, información y apoyo de forma rápida y segura.",
    btn_need_help: "NECESITO AYUDA AHORA",
    how_can_we_help: "¿Cómo podemos ayudarte?",
    card_find_help_title: "Encontrar ayuda",
    card_find_help_desc: "Servicios cercanos",
    card_report_title: "Quiero denunciar",
    card_report_desc: "Aprende a buscar ayuda",
    card_rights_title: "Mis derechos",
    card_rights_desc: "Conoce tus derechos",
    card_info_title: "Información útil",
    card_info_desc: "Orientación y contactos",
    security_title: "Tu seguridad es prioridad.",
    security_desc: "Orientación segura e idónea.",
    security_space: "Este es un espacio seguro y confidencial para ti.",
    help_header: "¿Cómo podemos ayudarte?",
    help_subheader: "Elige una opción a continuación:",
    opt_emergency_title: "Emergencia",
    opt_emergency_desc: "Estoy en situación de peligro ahora.",
    opt_report_title: "Hacer una denuncia",
    opt_report_desc: "Registrar o consultar sobre un caso.",
    opt_map_title: "Encontrar ayuda cerca de mí",
    opt_map_desc: "Entender mis derechos y buscar ayuda.",
    opt_info_title: "Informaciones",
    opt_info_desc: "Conocer mis derechos legales.",
    emergency_now_title: "¿Necesitas ayuda ahora?",
    emergency_now_desc: "Si estás en peligro inminente, busca ayuda de inmediato:",
    call_190: "LLAMAR AL 190",
    call_190_sub: "Policía Militar",
    call_180: "LLAMAR AL 180",
    call_180_sub: "Atención a la Mujer",
    other_options: "Otras opciones:",
    emergency_chat: "Chat de emergencia",
    emergency_chat_sub: "Habla con un especialista",
    report_header: "Hacer denuncia",
    report_banner_desc: "Tu denuncia puede ayudar a otras mujeres y salvar vidas.",
    label_report_type: "¿Cómo prefieres hacer tu denuncia?",
    report_anon: "Denuncia anónima",
    report_anon_sub: "Tu identidad será confidencial",
    report_id: "Denuncia identificada",
    report_id_sub: "Tus datos se usarán para contactarte",
    label_type_violence: "¿Qué deseas denunciar?",
    opt_select: "Selecciona el tipo de violencia",
    label_description: "Cuéntanos qué sucedió:",
    attach_label: "¿Deseas adjuntar pruebas o archivos?",
    attach_files: "Subir archivos (fotos, audios, documentos)",
    attach_limit: "Tamaño máximo: 10MB",
    btn_send_report: "Enviar denuncia",
    important_title: "¡Importante!",
    important_desc: "En caso de emergencia llama al 190",
    map_header: "Dónde buscar ayuda",
    map_subheader: "Encuentra centros de soporte cercanos",
    nearby_places: "Lugares cercanos",
    see_all: "Ver todos >",
    not_found_title: "¿No encontraste lo que buscas?",
    not_found_desc: "Habla con nuestro equipo",
    contact_us: "Contáctanos",
    modal_rights_title: "Tus Derechos Legales",
    chat_header: "Soporte Acolhe",
    chat_status: "En línea • Canal Seguro",
    chat_welcome: "¡Hola! Estás en un chat seguro y confidencial. ¿Cómo podemos ayudarte hoy?",
    footer_desc: "Una plataforma segura y confidencial orientada a la acogida, orientación y protección de mujeres en situación de vulnerabilidad o violencia.",
    footer_nav_title: "Navegación",
    footer_channels_title: "Canales de Ayuda",
    contact_190: "Policía Militar",
    contact_180: "Atención a la Mujer",
    contact_100: "Derechos Humanos",
    footer_copyright: "© 2026 Acolhe. Todos los derechos reservados. Proyecto sin fines de lucro.",
    footer_security: "Su historial de navegación y datos están protegidos."
  }
};


function switchAuthTab(tab) {
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const loginBtn = document.getElementById('tab-login-btn');
  const regBtn = document.getElementById('tab-register-btn');

  if (tab === 'login') {
    loginForm.style.display = 'block';
    registerForm.style.display = 'none';
    loginBtn.classList.add('active');
    regBtn.classList.remove('active');
  } else {
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
    loginBtn.classList.remove('active');
    regBtn.classList.add('active');
  }
}
// --- NAVEGAÇÃO ENTRE SEÇÕES (SPA) ---
function navigateTo(targetId) {
  document.querySelectorAll('.page-section').forEach(sec => sec.classList.remove('active'));
  document.querySelectorAll('.nav-btn, .mob-btn').forEach(btn => btn.classList.remove('active'));

  const targetSection = document.getElementById(targetId);
  if (targetSection) {
    targetSection.classList.add('active');
  }

  document.querySelectorAll(`[data-target="${targetId}"]`).forEach(btn => btn.classList.add('active'));

  if (targetId === 'map' && leafletMap) {
    setTimeout(() => {
      leafletMap.invalidateSize();
    }, 250);
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Event Listeners nos botões de navegação (Desktop e Mobile)
document.querySelectorAll('.nav-btn, .mob-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.getAttribute('data-target');
    if (target) navigateTo(target);
  });
});

// --- SISTEMA DE TRADUÇÃO (CORRIGIDO) ---
const langSelector = document.getElementById('lang-selector');
if (langSelector) {
  langSelector.addEventListener('change', (e) => {
    const selectedLang = e.target.value;
    const dict = i18nTranslations[selectedLang]; // Correção da referência de objeto

    if (!dict) return;

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) {
        el.innerHTML = dict[key];
      }
    });
  });
}

// --- ALTERNADOR DE TEMA (DARK / LIGHT) ---
const themeToggleBtn = document.getElementById('theme-toggle');
if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    themeToggleBtn.innerHTML = isDark ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
  });
}

// --- CONTADOR DE CARACTERES & SELEÇÃO DE ARQUIVOS ---
function updateCharCount() {
  const textarea = document.getElementById('report-text');
  const countEl = document.getElementById('char-count');
  if (textarea && countEl) {
    countEl.innerText = textarea.value.length;
  }
}

function toggleRadioCard(input) {
  document.querySelectorAll('.radio-card').forEach(card => card.classList.remove('active'));
  input.closest('.radio-card').classList.add('active');
}

function toggleReportType(radio) {
  toggleRadioCard(radio);

  const identifiedFields = document.getElementById('identified-fields');
  const nameInput = document.getElementById('user-name');
  const phoneInput = document.getElementById('user-phone');

  if (radio.value === 'identified') {
    if (identifiedFields) identifiedFields.style.display = 'block';
    if (nameInput) nameInput.setAttribute('required', 'true');
    if (phoneInput) phoneInput.setAttribute('required', 'true');
  } else {
    if (identifiedFields) identifiedFields.style.display = 'none';
    if (nameInput) nameInput.removeAttribute('required');
    if (phoneInput) phoneInput.removeAttribute('required');
  }
}

function handleFiles(input) {
  const fileListContainer = document.getElementById('file-list');
  if (!fileListContainer) return;

  fileListContainer.innerHTML = '';

  Array.from(input.files).forEach(file => {
    const item = document.createElement('div');
    item.innerText = `📄 ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`;
    fileListContainer.appendChild(item);
  });
}

async function submitForm(e) {
  e.preventDefault();

  const form = e.target;
  const tipoDenuncia = form.querySelector('input[name="anon_type"]:checked')?.value;
  const tipoViolencia = form.querySelector('.custom-select')?.value;
  const descricao = document.getElementById('report-text')?.value.trim();
  
  const nome = document.getElementById('user-name')?.value.trim() || null;
  const telefone = document.getElementById('user-phone')?.value.trim() || null;

  if (!tipoDenuncia || !tipoViolencia || !descricao) {
    alert('Preencha todos os campos obrigatórios antes de enviar.');
    return;
  }

  const payload = {
    tipo_denuncia: tipoDenuncia,
    tipo_violencia: tipoViolencia,
    descricao: descricao,
    nome: tipoDenuncia === 'identified' ? nome : null,
    telefone: tipoDenuncia === 'identified' ? telefone : null
  };

  try {
    const resposta = await fetch('/api/denuncias', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
      throw new Error(dados.erro || 'Não foi possível cadastrar a denúncia.');
    }

    alert(`Denúncia cadastrada com sucesso. Protocolo: ${dados.id}`);

    form.reset();
    document.getElementById('file-list').innerHTML = '';
    document.getElementById('char-count').innerText = '0';
    if (document.getElementById('identified-fields')) {
      document.getElementById('identified-fields').style.display = 'none';
    }
  } catch (erro) {
    console.error(erro);
    alert('Erro ao enviar a denúncia. Verifique a conexão com o servidor.');
  }
}

// --- MAPA INTERATIVO (LEAFLET / OPENSTREETMAP - CORRIGIDO) ---
let leafletMap;
let markersLayer = L.layerGroup(); // Grupo para gerenciamento de marcadores

const sampleLocations = [
  {
    name: "Casa da Mulher do Nordeste",
    lat: -8.0476,
    lng: -34.897,
    desc: "Acolhimento, apoio psicossocial e jurídico",
    badge: "Atendimento 24h"
  },
  {
    name: "Delegacia da Mulher de Santo Amaro",
    lat: -8.0522,
    lng: -34.885,
    desc: "Registro de ocorrência e medidas protetivas",
    badge: "Atendimento 24h"
  },
  {
    name: "Centro de Referência Clarice Lispector",
    lat: -8.0610,
    lng: -34.871,
    desc: "Apoio psicológico, social e grupos de apoio",
    badge: "Atendimento 24h"
  }
];

function initLeafletMap() {
  const mapContainer = document.getElementById('map-container');
  if (!mapContainer) return;

  leafletMap = L.map('map-container').setView([-8.0522, -34.885], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
  }).addTo(leafletMap);

  markersLayer.addTo(leafletMap);
  renderPlaces(sampleLocations);
}

function renderPlaces(places) {
  markersLayer.clearLayers(); // Limpa marcadores antigos para evitar duplicação

  const placesList = document.getElementById('places-list');
  if (placesList) placesList.innerHTML = '';

  places.forEach(place => {
    // Adiciona marcador via LayerGroup
    L.marker([place.lat, place.lng])
      .bindPopup(`<b>${place.name}</b><br>${place.desc}`)
      .addTo(markersLayer);

    // Renderiza Card
    if (placesList) {
      const placeCard = document.createElement('div');
      placeCard.className = 'place-item';
      placeCard.innerHTML = `
        <i class="fa-solid fa-house-chimney-medical place-icon"></i>
        <div class="place-details">
          <h4>${place.name}</h4>
          <p>${place.desc}</p>
          <span class="badge-24h">${place.badge}</span>
        </div>
      `;
      placesList.appendChild(placeCard);
    }
  });
}

function filterLocations() {
  const searchInput = document.getElementById('map-search');
  if (!searchInput) return;

  const query = searchInput.value.toLowerCase();
  const filtered = sampleLocations.filter(p =>
    p.name.toLowerCase().includes(query) || p.desc.toLowerCase().includes(query)
  );
  renderPlaces(filtered);
}

function showAllLocations(e) {
  if (e) e.preventDefault();
  const searchInput = document.getElementById('map-search');
  if (searchInput) searchInput.value = '';
  renderPlaces(sampleLocations);
}

// --- MODAIS E CHAT ---
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add('active');
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('active');
}

function handleChatKeyPress(e) {
  if (e.key === 'Enter') {
    sendChatMessage();
  }
}

function sendChatMessage() {
  const input = document.getElementById('chat-input');
  if (!input) return;

  const text = input.value.trim();
  if (!text) return;

  const messagesContainer = document.getElementById('chat-messages');

  const userMsg = document.createElement('div');
  userMsg.className = 'msg user-msg';
  userMsg.innerText = text;
  messagesContainer.appendChild(userMsg);

  input.value = '';
  messagesContainer.scrollTop = messagesContainer.scrollHeight;

  setTimeout(() => {
    const sysMsg = document.createElement('div');
    sysMsg.className = 'msg system-msg';
    sysMsg.innerText = "Recebemos sua mensagem. Uma atendente especializada está conectando...";
    messagesContainer.appendChild(sysMsg);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }, 1000);
}

// --- FUNÇÃO DE SAÍDA RÁPIDA ---
function quickExit() {
  window.location.replace("https://www.shein.com");
}

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    quickExit();
  }
});

// --- INICIALIZAÇÃO DA APLICAÇÃO ---
window.addEventListener('DOMContentLoaded', () => {
  initLeafletMap();
});

let selectedFiles = [];

// Atualiza e exibe os arquivos
function handleFiles(input) {
  const files = Array.from(input.files);
  selectedFiles = selectedFiles.concat(files);
  renderFileList();
}

// Renderiza a lista de arquivos com botão de excluir
function renderFileList() {
  const container = document.getElementById('file-list-container');
  const list = document.getElementById('file-list');
  list.innerHTML = '';

  if (selectedFiles.length === 0) {
    container.style.display = 'none';
    return;
  }

  container.style.display = 'block';
  selectedFiles.forEach((file, index) => {
    const item = document.createElement('div');
    item.className = 'file-item';
    item.innerHTML = `
      <span><i class="fa-solid fa-file"></i> ${file.name}</span>
      <button type="button" class="btn-remove-file" onclick="removeFile(${index})" title="Remover arquivo">
        <i class="fa-solid fa-xmark"></i>
      </button>
    `;
    list.appendChild(item);
  });
}

// Exclui um arquivo específico
function removeFile(index) {
  selectedFiles.splice(index, 1);
  renderFileList();
}

// Exclui todos os arquivos
function clearAllFiles() {
  selectedFiles = [];
  document.getElementById('file-input').value = '';
  renderFileList();
}

// Limpa todos os campos do formulário
function resetForm() {
  document.getElementById('report-form').reset();
  clearAllFiles();
  document.getElementById('char-count').innerText = '0';
  document.getElementById('identified-fields').style.display = 'none';
}