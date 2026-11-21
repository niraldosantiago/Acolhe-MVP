const esc = (v) => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    let cacheDenuncias = [];

    // SQLite CURRENT_TIMESTAMP é UTC; acrescenta Z em timestamps legados sem fuso.
    function formatarDataHoraDenuncia(valor) {
      if (!valor) return 'Horário indisponível';
      let timestamp = String(valor).trim();
      if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}(?:\.\d+)?$/.test(timestamp)) {
        timestamp = timestamp.replace(' ', 'T') + 'Z';
      } else if (!/(Z|[+-]\d{2}:?\d{2})$/i.test(timestamp)) {
        timestamp += 'Z';
      }
      const data = new Date(timestamp);
      if (Number.isNaN(data.getTime())) return 'Horário indisponível';
      return data.toLocaleString('pt-BR', {
        timeZone: 'America/Sao_Paulo',
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
      });
    }


    function togglePasswordVisibility(inputId, button) {
      const input = document.getElementById(inputId);
      if (!input || !button) return;
      const showing = input.type === 'password';
      input.type = showing ? 'text' : 'password';
      const label = showing ? 'Ocultar senha' : 'Mostrar senha';
      button.setAttribute('aria-label', label);
      button.setAttribute('title', label);
      button.setAttribute('aria-pressed', String(showing));
      button.innerHTML = showing
        ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 3l18 18"></path><path d="M10.6 10.6a2 2 0 0 0 2.8 2.8"></path><path d="M9.9 5.2A10.8 10.8 0 0 1 12 5c6.4 0 10 7 10 7a17 17 0 0 1-3.1 3.8"></path><path d="M6.2 6.2C3.5 8 2 12 2 12s3.6 7 10 7a10 10 0 0 0 4-.8"></path></svg>'
        : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z"></path><circle cx="12" cy="12" r="3"></circle></svg>';
    }


    async function checkAuth() {
      try {
        const res = await fetch('/api/admin/me');
        if (res.ok) {
          document.getElementById('login-overlay').classList.add('hidden');
          loadDashboard();
        } else {
          document.getElementById('login-overlay').classList.remove('hidden');
        }
      } catch (e) {
        document.getElementById('login-overlay').classList.remove('hidden');
      }
    }

    document.getElementById('admin-login-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const errEl = document.getElementById('login-error');

      try {
        const res = await fetch('/api/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();

        if (res.ok) {
          errEl.classList.add('hidden');
          document.getElementById('login-overlay').classList.add('hidden');
          loadDashboard();
        } else {
          errEl.textContent = data.erro || 'Falha na autenticação';
          errEl.classList.remove('hidden');
        }
      } catch (err) {
        errEl.textContent = 'Erro ao conectar ao servidor.';
        errEl.classList.remove('hidden');
      }
    });

    document.getElementById('close-modal').addEventListener('click', () => {
      document.getElementById('details-modal').classList.add('hidden');
    });
    document.getElementById('details-modal').addEventListener('click', (e) => {
      if (e.target === document.getElementById('details-modal')) {
        document.getElementById('details-modal').classList.add('hidden');
      }
    });

    // Exibição detalhada no Modal garantindo a formatação exata da hora do sistema
    function abrirDetalhes(id) {
      const d = cacheDenuncias.find(item => item.id === id);
      if (!d) return;

      const modalTitle = document.getElementById('modal-title');
      const modalBody = document.getElementById('modal-body-content');

      let aiInfo = {};
      try { aiInfo = JSON.parse(d.ai_analise || '{}'); } catch {}

      const urgencia = aiInfo.urgencia || 'N/A';
      const classUrgencia = urgencia === 'Alta' ? 'urgencia-alta' : urgencia === 'Média' ? 'urgencia-media' : 'urgencia-baixa';

      modalTitle.innerHTML = `
        <span>Detalhes da Denúncia #${d.id}</span>
        <span class="badge-urgencia ${classUrgencia}">Urgência: ${esc(urgencia)}</span>
      `;

      let arquivosHtml = 'Nenhum anexo';
      try {
        const files = JSON.parse(d.arquivos || '[]');
        if (files.length > 0) {
          arquivosHtml = files.map(f => `<li>📁 <strong>${esc(f.name)}</strong> (${Math.round(f.size/1024)} KB)</li>`).join('');
          arquivosHtml = `<ul style="margin-left: 20px; list-style-type: none;">${arquivosHtml}</ul>`;
        }
      } catch (e) {
        arquivosHtml = 'Erro ao carregar anexos';
      }

      const dataSistemaExata = formatarDataHoraDenuncia(d.criado_em);

      modalBody.innerHTML = `
        <div class="operator-actions-bar">
          <div>
            <strong style="font-size: 13px;">Status Atual:</strong>
            <select id="modal-status-select" onchange="updateStatusAndReload(${esc(d.id)}, this.value)" style="padding: 6px 10px; border-radius: 4px; font-weight: bold; border: 1px solid var(--border); cursor: pointer;">
              <option value="Recebida" ${d.status === 'Recebida' ? 'selected' : ''}>🔴 Recebida</option>
              <option value="Em análise" ${d.status === 'Em análise' ? 'selected' : ''}>🟡 Em análise</option>
              <option value="Concluída" ${d.status === 'Concluída' ? 'selected' : ''}>🟢 Concluída</option>
            </select>
          </div>
          <div>
            <button class="btn-danger btn-sm" onclick="alert('Alerta de emergência acionado às ' + new Date().toLocaleTimeString())">🚨 Acionar Emergência</button>
          </div>
        </div>

        <div>
          <p><strong>Data e hora em que a denúncia foi registrada (Brasília):</strong> <span style="color: var(--primary); font-weight: bold;">${dataSistemaExata}</span></p>
          <p><strong>Tipo de Envio:</strong> ${d.tipo_denuncia === 'anon' ? 'Anônima' : 'Identificada'}</p>
          <p><strong>Tipologia de Violência:</strong> <span style="font-weight: 600; text-transform: capitalize;">${esc(d.tipo_violencia)}</span></p>
          <p><strong>Contato / Dados da Vítima:</strong> ${d.tipo_denuncia === 'identified' ? `${esc(d.nome)} | E-mail: ${esc(d.email)} | Tel: ${esc(d.telefone)}` : 'Não aplicável (Anônima)'}</p>
        </div>

        <div style="margin-top: 15px;">
          <strong>Descrição Completa do Relato:</strong>
          <div style="background: #f1f3f5; padding: 12px; border-radius: 4px; margin-top: 5px; white-space: pre-wrap; font-size: 13px; line-height: 1.6;">${esc(d.descricao)}</div>
        </div>

        <div class="ai-box">
          <h4 style="color: var(--primary); margin-bottom: 8px;">🤖 Análise Automatizada (IA)</h4>
          <p><strong>Pontuação de Risco:</strong> ${esc(aiInfo.pontosRisco || 0)} pontos</p>
          <p style="margin-top: 6px;"><strong>Recomendações Sugeridas:</strong></p>
          <ul style="margin-left: 20px; font-size: 13px; margin-top: 4px;">
            ${(aiInfo.recomendacoesSugeridas || ['Nenhuma recomendação registrada']).map(rec => `<li style="margin-bottom: 4px;">${esc(rec)}</li>`).join('')}
          </ul>
        </div>

        <div style="margin-top: 15px;">
          <strong>Anexos Enviados:</strong>
          <div style="margin-top: 5px; font-size: 13px;">${arquivosHtml}</div>
        </div>

        <div class="operator-notes-box">
          <strong>📝 Anotações Internas do Operador (Privado):</strong>
          <textarea id="operator-note-text" placeholder="Adicione observações da triagem ou encaminhamentos internos...">${esc(d.observacoes || '')}</textarea>
          <button class="btn-success btn-sm" style="margin-top: 8px;" onclick="salvarAnotacaoOperador(${esc(d.id)})">Salvar Anotação</button>
        </div>
      `;

      document.getElementById('details-modal').classList.remove('hidden');
    }

    async function updateStatusAndReload(id, newStatus) {
      await updateStatus(id, newStatus);
      const item = cacheDenuncias.find(d => d.id === id);
      if (item) item.status = newStatus;
    }

    async function salvarAnotacaoOperador(id) {
  const nota = document.getElementById('operator-note-text').value;

  try {
    const res = await fetch(`/api/admin/denuncias/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ observacoes: nota })
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      alert(data.erro || 'Não foi possível salvar a anotação.');
      return;
    }

    alert('Anotação salva com sucesso.');
    await loadDashboard();
  } catch (error) {
    console.error('Erro ao salvar anotação:', error);
    alert('Falha de conexão. A anotação não foi confirmada como salva.');
  }
}


    document.getElementById('btn-export-csv').addEventListener('click', () => {
      window.location.href = '/api/admin/export/csv';
    });

    document.getElementById('btn-toggle-auditoria').addEventListener('click', () => {
      const container = document.getElementById('auditoria-container');
      const btn = document.getElementById('btn-toggle-auditoria');
      
      container.classList.toggle('hidden');
      if (container.classList.contains('hidden')) {
        btn.textContent = 'Mostrar Auditoria';
      } else {
        btn.textContent = 'Ocultar Auditoria';
      }
    });

    document.getElementById('btn-limpar-auditoria').addEventListener('click', async () => {
      if (!confirm('Deseja realmente limpar todos os logs de auditoria?')) return;

      try {
        const res = await fetch('/api/admin/auditoria/limpar', { method: 'DELETE' });
        const data = await res.json();
        if (res.ok) {
          alert('Logs de auditoria limpos com sucesso.');
          loadAuditoria();
        } else {
          alert(data.erro || 'Erro ao limpar logs.');
        }
      } catch (e) {
        alert('Erro ao conectar ao servidor.');
      }
    });

    async function loadDashboard() {
      const query = document.getElementById('search-input').value.trim();
      let url = '/api/admin/denuncias';
      if (query) {
        url += `?q=${encodeURIComponent(query)}`;
      }

      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error('Não foi possível carregar os dados.');
        cacheDenuncias = await res.json();

        renderMetrics(cacheDenuncias);
        renderTable(cacheDenuncias);
        loadAnalyticsProgress();
        loadAuditoria();
      } catch (err) {
        console.error(err.message);
      }
    }

    async function loadAuditoria() {
      try {
        const res = await fetch('/api/admin/auditoria');
        if (!res.ok) return;
        const logs = await res.json();

        const tbody = document.getElementById('auditoria-tbody');
        tbody.innerHTML = '';

        if (!Array.isArray(logs) || logs.length === 0) {
          tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">Nenhum registo de auditoria encontrado.</td></tr>';
          return;
        }

        logs.forEach(log => {
          const tr = document.createElement('tr');
          let detalhesTexto = '-';
          try {
            const d = JSON.parse(log.detalhes || '{}');
            detalhesTexto = Object.keys(d).length ? JSON.stringify(d) : '-';
          } catch {
            detalhesTexto = log.detalhes || '-';
          }

          tr.innerHTML = `
            <td>#${log.id}</td>
            <td>${new Date(log.criado_em).toLocaleString('pt-BR')}</td>
            <td>${esc(log.operador || 'Sistema / Admin')}</td>
            <td><strong style="color: #457b9d;">${esc(log.acao)}</strong></td>
            <td style="font-size: 12px; color: #555; font-family: monospace;">${esc(detalhesTexto)}</td>
          `;
          tbody.appendChild(tr);
        });
      } catch (err) {
        console.error('Erro ao carregar auditoria:', err);
      }
    }

    document.getElementById('btn-search').addEventListener('click', () => loadDashboard());
    document.getElementById('search-input').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') loadDashboard();
    });

    document.getElementById('select-all').addEventListener('change', (e) => {
      const checkboxes = document.querySelectorAll('.row-checkbox');
      checkboxes.forEach(cb => cb.checked = e.target.checked);
    });

    document.getElementById('btn-excluir-selecionadas').addEventListener('click', async () => {
      const selected = Array.from(document.querySelectorAll('.row-checkbox:checked')).map(cb => cb.value);
      if (selected.length === 0) {
        alert('Selecione pelo menos uma denúncia para excluir.');
        return;
      }

      if (!confirm(`Deseja realmente excluir as ${selected.length} denúncia(s) selecionada(s)?`)) return;

      try {
        for (const id of selected) {
          await fetch(`/api/admin/denuncias/${id}`, { method: 'DELETE' });
        }
        alert('Denúncias selecionadas excluídas com sucesso.');
        loadDashboard();
      } catch (e) {
        alert('Erro ao excluir as denúncias.');
      }
    });

    async function deleteDenuncia(id, event) {
      if (event) event.stopPropagation();
      if (!confirm(`Deseja excluir a denúncia #${id}?`)) return;
      try {
        const res = await fetch(`/api/admin/denuncias/${id}`, { method: 'DELETE' });
        if (res.ok) {
          loadDashboard();
        } else {
          alert('Erro ao excluir a denúncia.');
        }
      } catch (e) {
        alert('Erro de conexão.');
      }
    }

    document.getElementById('btn-limpar-base').addEventListener('click', async () => {
      if (!confirm('ATENÇÃO: Deseja realmente excluir TODAS as denúncias da base de dados?')) return;

      try {
        const res = await fetch('/api/admin/denuncias/limpar', { method: 'DELETE' });
        const data = await res.json();
        if (res.ok) {
          alert('Base de dados limpa com sucesso.');
          loadDashboard();
        } else {
          alert(data.erro || 'Erro ao limpar a base.');
        }
      } catch (e) {
        alert('Erro de conexão.');
      }
    });

    function renderMetrics(data) {
      document.getElementById('total-count').textContent = data.length;
      document.getElementById('recebidas-count').textContent = data.filter(d => d.status === 'Recebida').length;
      document.getElementById('analise-count').textContent = data.filter(d => d.status === 'Em análise').length;
      document.getElementById('concluidas-count').textContent = data.filter(d => d.status === 'Concluída').length;
      document.getElementById('result-count').textContent = `Mostrando ${data.length} registo(s)`;
    }

    function renderTable(data) {
      const tbody = document.getElementById('denuncias-tbody');
      tbody.innerHTML = '';
      document.getElementById('select-all').checked = false;

      if (data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="10" style="text-align: center;">Nenhuma denúncia encontrada.</td></tr>';
        return;
      }

      data.forEach(d => {
  const tr = document.createElement('tr');
  tr.className = 'clickable-row';
  tr.onclick = () => abrirDetalhes(d.id);

  const badgeClass =
    d.status === 'Recebida'
      ? 'status-recebida'
      : d.status === 'Em análise'
        ? 'status-analise'
        : 'status-concluida';

  const contato = d.tipo_denuncia === 'identified'
    ? `${d.nome || ''} (${d.email || d.telefone || 'N/A'})`
    : 'Anônima';

  const violenciaLabels = {
    fisica: 'Física',
    psicologica: 'Psicológica',
    patrimonial: 'Patrimonial',
    sexual: 'Sexual',
    moral: 'Moral',
    cibernetica: 'Cibernética',
    institucional: 'Institucional'
  };

  const violenciaKey = String(d.tipo_violencia || '').toLowerCase().trim();
  const labelViolencia =
    violenciaLabels[violenciaKey] ||
    (violenciaKey.charAt(0).toUpperCase() + violenciaKey.slice(1));

  // Corrige XSS: a descrição é dado controlado pelo usuário.
  const descricao = String(d.descricao ?? '');
  const descricaoCurta = descricao.length > 40
    ? `${descricao.slice(0, 40)}...`
    : descricao;

  let iaHtml = '<span style="color: #666;">Pendente</span>';

  try {
    const ai = JSON.parse(d.ai_analise || '{}');

    if (ai.urgencia) {
      const cor = ai.urgencia === 'Alta'
        ? '#e63946'
        : ai.urgencia === 'Média'
          ? '#f4a261'
          : '#2a9d8f';

      const recomendacao = Array.isArray(ai.recomendacoesSugeridas)
        ? ai.recomendacoesSugeridas.slice(0, 1).join('')
        : '';

      iaHtml = `
        <div>
          <span style="background: ${cor}; color: white; padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: bold; display: inline-block; margin-bottom: 3px;">
            ${esc(ai.urgencia)} (${esc(ai.pontosRisco)}pts)
          </span>
          <div style="font-size: 11px; color: #555; max-width: 200px; line-height: 1.2;">
            ${esc(recomendacao)}
          </div>
        </div>
      `;
    }
  } catch {
    iaHtml = '<span style="color: #999;">-</span>';
  }

  const dataFormatadaTabela = formatarDataHoraDenuncia(d.criado_em);

  tr.innerHTML = `
    <td onclick="event.stopPropagation()">
      <input type="checkbox" class="row-checkbox" value="${esc(d.id)}" />
    </td>
    <td>#${esc(d.id)}</td>
    <td style="font-size: 13px; font-family: monospace;">
      ${esc(dataFormatadaTabela)}
    </td>
    <td>${d.tipo_denuncia === 'anon' ? 'Anônima' : 'Identificada'}</td>
    <td style="font-weight: 500;">${esc(labelViolencia)}</td>
    <td title="${esc(descricao)}">${esc(descricaoCurta)}</td>
    <td>${iaHtml}</td>
    <td>${esc(contato)}</td>
    <td>
      <span class="status-badge ${badgeClass}">${esc(d.status)}</span>
    </td>
    <td style="display: flex; gap: 8px; align-items: center;"
        onclick="event.stopPropagation()">
      <select onchange="updateStatus(${Number(d.id)}, this.value)">
        <option value="Recebida" ${d.status === 'Recebida' ? 'selected' : ''}>Recebida</option>
        <option value="Em análise" ${d.status === 'Em análise' ? 'selected' : ''}>Em análise</option>
        <option value="Concluída" ${d.status === 'Concluída' ? 'selected' : ''}>Concluída</option>
      </select>
      <button class="btn-danger btn-sm"
              onclick="deleteDenuncia(${Number(d.id)}, event)">
        Excluir
      </button>
    </td>
  `;

  tbody.appendChild(tr);
});
} // fecha renderTable(data)

    async function updateStatus(id, newStatus) {
      try {
        const res = await fetch(`/api/admin/denuncias/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus })
        });
        if (res.ok) {
          loadDashboard();
        } else {
          alert('Erro ao atualizar status.');
        }
      } catch (e) {
        alert('Erro de conexão.');
      }
    }

    document.getElementById('btn-logout').addEventListener('click', async () => {
      await fetch('/api/admin/logout', { method: 'POST' });
      location.reload();
    });

    checkAuth();

    async function loadAnalyticsProgress() {
      try {
        const res = await fetch('/api/admin/analytics');
        if (!res.ok) return;
        const data = await res.json();

        if (!data.distribuicoes) return;

        const violenciaData = data.distribuicoes.violencia;
        const totalViolencia = violenciaData.reduce((acc, item) => acc + item.valor, 0);
        const violenciaContainer = document.getElementById('progress-violencia-container');
        violenciaContainer.innerHTML = '';
        
        const violenciaColorMap = {
          'fisica': '#e63946',
          'psicologica': '#f4a261',
          'patrimonial': '#e76f51',
          'sexual': '#d90429',
          'moral': '#457b9d',
          'cibernetica': '#2a9d8f',
          'institucional': '#6a0572'
        };

        const violenciaLabels = {
          'fisica': 'Física',
          'psicologica': 'Psicológica',
          'patrimonial': 'Patrimonial',
          'sexual': 'Sexual',
          'moral': 'Moral',
          'cibernetica': 'Cibernética',
          'institucional': 'Institucional'
        };

        violenciaData.forEach((item) => {
          const key = String(item.chave || '').toLowerCase().trim();
          const pct = totalViolencia > 0 ? Math.round((item.valor / totalViolencia) * 100) : 0;
          const label = violenciaLabels[key] || (key.charAt(0).toUpperCase() + key.slice(1));
          const color = violenciaColorMap[key] || '#457b9d';

           violenciaContainer.innerHTML += `
  <div class="progress-item">
    <div class="progress-header">
      <span>${esc(label)}</span>
      <span>${esc(item.valor)} (${esc(pct)}%)</span>
    </div>
    <div class="progress-track">
      <div class="progress-fill"
           style="width: ${pct}%; background-color: ${color};">
      </div>
    </div>
  </div>
`;

        });

        const statusData = data.distribuicoes.status;
        const totalStatus = statusData.reduce((acc, item) => acc + item.valor, 0);
        const statusContainer = document.getElementById('progress-status-container');
        statusContainer.innerHTML = '';
        const statusColorMap = {
          'Recebida': '#c92a2a',
          'Em análise': '#e67700',
          'Concluída': '#2b8a3e'
        };

        statusData.forEach(item => {
          const pct = totalStatus > 0 ? Math.round((item.valor / totalStatus) * 100) : 0;
          const color = statusColorMap[item.chave] || '#457b9d';

         statusContainer.innerHTML += `
  <div class="progress-item">
    <div class="progress-header">
      <span>${esc(item.chave)}</span>
      <span>${esc(item.valor)} (${esc(pct)}%)</span>
    </div>
    <div class="progress-track">
      <div class="progress-fill"
           style="width: ${pct}%; background-color: ${color};">
      </div>
    </div>
  </div>
`;
  
        });

      } catch (err) {
        console.error('Erro ao carregar dados de progresso:', err);
      }
    }
