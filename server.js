const http = require('node:http');
const fs = require('node:fs');
const fsp = fs.promises;
const path = require('node:path');
const crypto = require('node:crypto');
const { DatabaseSync } = require('node:sqlite');

// Diretórios e Configurações Principais
const ROOT = __dirname;
// Em produção (Render), armazena em /tmp para evitar problemas de gravação no disco efémero
const DATA = process.env.NODE_ENV === 'production'
  ? path.join('/tmp', 'data')
  : path.join(ROOT, 'data');

const PUBLIC = path.join(ROOT, 'public');
const UPLOADS = path.join(DATA, 'uploads');
const PORT = Number(process.env.PORT || 3000);
const MAX_BODY = 12 * 1024 * 1024; // 12 MB
const ADMIN_EMAIL = String(process.env.ACOLHE_ADMIN_EMAIL || 'admin@acolhe.local').toLowerCase();
const ADMIN_PASSWORD = process.env.ACOLHE_ADMIN_PASSWORD || 'TroqueEstaSenha!123';

// Garante que a pasta de dados e a pasta de uploads existem no servidor
fs.mkdirSync(DATA, { recursive: true });
fs.mkdirSync(UPLOADS, { recursive: true, mode: 0o700 });

// Conexão e Inicialização do Banco de Dados SQLite
const db = new DatabaseSync(path.join(DATA, 'acolhe.db'));

try {
  db.exec('PRAGMA journal_mode = WAL;');
} catch (e) {
  console.warn('Aviso: WAL mode não pôde ser ativado, operando em modo padrão.');
}

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    is_admin INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS denuncias (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    tipo_denuncia TEXT NOT NULL CHECK (tipo_denuncia IN ('anon', 'identified')),
    tipo_violencia TEXT NOT NULL CHECK (tipo_violencia IN ('fisica', 'psicologica', 'patrimonial', 'sexual', 'moral')),
    descricao TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Recebida' CHECK (status IN ('Recebida', 'Em análise', 'Concluída')),
    nome TEXT,
    telefone TEXT,
    email TEXT,
    arquivos TEXT NOT NULL DEFAULT '[]',
    criado_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    excluida_em TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS auditoria (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    actor_user_id INTEGER,
    denuncia_id INTEGER,
    acao TEXT NOT NULL,
    detalhes TEXT,
    criado_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (actor_user_id) REFERENCES users(id),
    FOREIGN KEY (denuncia_id) REFERENCES denuncias(id)
  );
`);

// Função utilitária para garantir compatibilidade de colunas em bancos existentes
function ensureColumn(table, column, definition) {
  const cols = db.prepare(`PRAGMA table_info(${table})`).all();
  if (!cols.some((c) => c.name === column)) {
    db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
  }
}

ensureColumn('users', 'is_admin', 'INTEGER NOT NULL DEFAULT 0');
ensureColumn('denuncias', 'user_id', 'INTEGER');
ensureColumn('denuncias', 'nome', 'TEXT');
ensureColumn('denuncias', 'telefone', 'TEXT');
ensureColumn('denuncias', 'email', 'TEXT');
ensureColumn('denuncias', 'arquivos', "TEXT NOT NULL DEFAULT '[]'");
ensureColumn('denuncias', 'excluida_em', 'TEXT');

// Segurança e Criptografia de Senhas
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  return `${salt}:${crypto.scryptSync(password, salt, 64).toString('hex')}`;
}

function checkPassword(password, stored) {
  try {
    const [salt, hex] = String(stored).split(':');
    const actual = crypto.scryptSync(password, salt, 64);
    const expected = Buffer.from(hex, 'hex');
    return expected.length === actual.length && crypto.timingSafeEqual(expected, actual);
  } catch {
    return false;
  }
}

// Prepared Statements (Consultas Pré-compiladas)
const userByEmail = db.prepare('SELECT id,email,password_hash,is_admin FROM users WHERE email=?');
const userById = db.prepare('SELECT id,email,is_admin FROM users WHERE id=?');
const insertUser = db.prepare('INSERT INTO users(email,password_hash,is_admin) VALUES(?,?,?)');
const insertReport = db.prepare('INSERT INTO denuncias(user_id,tipo_denuncia,tipo_violencia,descricao,nome,telefone,email,arquivos) VALUES(?,?,?,?,?,?,?,?)');
const reportById = db.prepare('SELECT id,user_id,tipo_denuncia,tipo_violencia,descricao,status,nome,telefone,email,arquivos,criado_em,excluida_em FROM denuncias WHERE id=?');
const userReports = db.prepare('SELECT id,tipo_denuncia,tipo_violencia,status,criado_em FROM denuncias WHERE user_id=? AND excluida_em IS NULL ORDER BY id DESC');
const auditInsert = db.prepare('INSERT INTO auditoria(actor_user_id,denuncia_id,acao,detalhes) VALUES(?,?,?,?)');

// Garantir Administrador Inicial
if (!userByEmail.get(ADMIN_EMAIL)) {
  insertUser.run(ADMIN_EMAIL, hashPassword(ADMIN_PASSWORD), 1);
  console.warn(`Administrador inicial criado: ${ADMIN_EMAIL}.`);
} else {
  db.prepare('UPDATE users SET is_admin=1 WHERE email=?').run(ADMIN_EMAIL);
}

// Gerenciamento de Sessões e Cookies
const sessions = new Map();

function getCookie(req) {
  return (req.headers.cookie || '')
    .split(';')
    .map((x) => x.trim())
    .find((x) => x.startsWith('sid='))
    ?.slice(4);
}

function sessionUser(req) {
  const id = sessions.get(getCookie(req));
  return id ? userById.get(id) : null;
}

function setSession(res, id) {
  const sid = crypto.randomBytes(32).toString('hex');
  sessions.set(sid, id);
  res.setHeader('Set-Cookie', `sid=${sid}; HttpOnly; SameSite=Strict; Path=/; Max-Age=86400`);
}

function clearSession(req, res) {
  const sid = getCookie(req);
  if (sid) sessions.delete(sid);
  res.setHeader('Set-Cookie', 'sid=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0');
}

// Utilitários de Resposta
function json(res, status, data, extra = {}) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'no-referrer',
    ...extra,
  });
  res.end(JSON.stringify(data));
}

function requireAdmin(req, res) {
  const actor = sessionUser(req);
  if (!actor || !actor.is_admin) {
    json(res, 401, { erro: 'Autenticação administrativa necessária.' });
    return null;
  }
  return actor;
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0, parts = [], done = false;
    const fail = (e) => {
      if (!done) {
        done = true;
        reject(e);
        req.destroy();
      }
    };
    req.on('data', (c) => {
      size += c.length;
      if (size > MAX_BODY) fail(Object.assign(new Error('Payload muito grande.'), { status: 413 }));
      else parts.push(c);
    });
    req.on('end', () => {
      if (done) return;
      done = true;
      try {
        resolve(JSON.parse(Buffer.concat(parts).toString() || '{}'));
      } catch {
        reject(Object.assign(new Error('JSON inválido.'), { status: 400 }));
      }
    });
    req.on('error', reject);
  });
}

function validEmail(v) {
  return typeof v === 'string' && /^\S+@\S+\.\S+$/.test(v) && v.length <= 200;
}

function audit(actor, id, action, details = {}) {
  auditInsert.run(actor || null, id || null, action, JSON.stringify(details));
}

// Validação e Armazenamento de Anexos
const allowedTypes = new Set(['image/jpeg', 'image/png', 'application/pdf', 'audio/mpeg', 'audio/wav']);

function safeName(n) {
  return path.basename(n).replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 100) || 'arquivo';
}

async function saveFiles(files, id) {
  const result = [];
  for (const f of Array.isArray(files) ? files : []) {
    if (
      !f ||
      !allowedTypes.has(f.type) ||
      !Number.isInteger(f.size) ||
      f.size < 0 ||
      f.size > 10 * 1024 * 1024 ||
      typeof f.data !== 'string' ||
      !f.data.startsWith('data:')
    ) {
      throw Object.assign(new Error('Anexo inválido.'), { status: 400 });
    }
    const buf = Buffer.from(f.data.slice(f.data.indexOf(',') + 1), 'base64');
    if (buf.length !== f.size || buf.length > 10 * 1024 * 1024) {
      throw Object.assign(new Error('Tamanho de anexo inválido.'), { status: 400 });
    }
    const file = `${id}-${crypto.randomUUID()}-${safeName(f.name)}`;
    await fsp.writeFile(path.join(UPLOADS, file), buf, { mode: 0o600 });
    result.push({ name: f.name, type: f.type, size: buf.length, file });
  }
  return result;
}

// Roteador de Requisições (API e Arquivos Estáticos)
async function route(req, res) {
  const url = new URL(req.url, 'http://localhost');
  const p = url.pathname;
  const m = req.method;
  const actor = sessionUser(req);

  if (p === '/api/health' && m === 'GET') return json(res, 200, { ok: true, banco: 'SQLite' });
  if (p === '/api/me' && m === 'GET') return json(res, 200, { user: actor || null });

  if (p === '/api/register' && m === 'POST') {
    const b = await readBody(req);
    const email = String(b.email || '').toLowerCase().trim();
    if (!validEmail(email) || typeof b.password !== 'string' || b.password.length < 6) {
      return json(res, 400, { erro: 'Informe e-mail válido e senha com pelo menos 6 caracteres.' });
    }
    if (userByEmail.get(email)) return json(res, 409, { erro: 'E-mail já cadastrado.' });
    const r = insertUser.run(email, hashPassword(b.password), 0);
    setSession(res, Number(r.lastInsertRowid));
    return json(res, 201, { mensagem: 'Conta criada.' });
  }

  if (p === '/api/login' && m === 'POST') {
    const b = await readBody(req);
    const u = userByEmail.get(String(b.email || '').toLowerCase().trim());
    if (!u || typeof b.password !== 'string' || !checkPassword(b.password, u.password_hash)) {
      return json(res, 401, { erro: 'Credenciais inválidas.' });
    }
    setSession(res, u.id);
    return json(res, 200, { mensagem: 'Login realizado.', user: { id: u.id, email: u.email, is_admin: Boolean(u.is_admin) } });
  }

  if (p === '/api/logout' && m === 'POST') {
    clearSession(req, res);
    return json(res, 200, { mensagem: 'Sessão encerrada.' });
  }

  if (p === '/api/minhas-denuncias' && m === 'GET') {
    if (!actor) return json(res, 401, { erro: 'Faça login.' });
    return json(res, 200, userReports.all(actor.id));
  }

  if (p === '/api/denuncias' && m === 'POST') {
    const b = await readBody(req);
    const type = b.tipo_denuncia;
    const v = String(b.tipo_violencia || '');
    const d = String(b.descricao || '').trim();

    if (
      !['anon', 'identified'].includes(type) ||
      !['fisica', 'psicologica', 'patrimonial', 'sexual', 'moral'].includes(v) ||
      !d ||
      d.length > 1000
    ) {
      return json(res, 400, { erro: 'Dados da denúncia inválidos.' });
    }

    const total = (Array.isArray(b.arquivos) ? b.arquivos : []).reduce((n, x) => n + (Number(x?.size) || 0), 0);
    if (total > 10 * 1024 * 1024) return json(res, 400, { erro: 'O total de anexos excede 10 MB.' });

    const r = insertReport.run(
      actor?.id || null,
      type,
      v,
      d,
      type === 'identified' ? String(b.nome || '').slice(0, 200) : null,
      type === 'identified' ? String(b.telefone || '').slice(0, 40) : null,
      type === 'identified' ? String(b.email || '').slice(0, 200) : null,
      '[]'
    );
    const id = Number(r.lastInsertRowid);

    try {
      const files = await saveFiles(b.arquivos, id);
      db.prepare('UPDATE denuncias SET arquivos=? WHERE id=?').run(JSON.stringify(files), id);
      return json(res, 201, { id, status: 'Recebida', arquivos: files.map((x) => x.name) });
    } catch (e) {
      db.prepare('DELETE FROM denuncias WHERE id=?').run(id);
      return json(res, e.status || 400, { erro: e.message });
    }
  }

  if (p === '/api/admin/login' && m === 'POST') {
    const b = await readBody(req);
    const u = userByEmail.get(String(b.email || '').toLowerCase().trim());
    if (!u?.is_admin || typeof b.password !== 'string' || !checkPassword(b.password, u.password_hash)) {
      return json(res, 401, { erro: 'Credenciais administrativas inválidas.' });
    }
    setSession(res, u.id);
    audit(u.id, null, 'login_admin');
    return json(res, 200, { mensagem: 'Acesso administrativo autorizado.', user: { id: u.id, email: u.email } });
  }

  if (p === '/api/admin/logout' && m === 'POST') {
    if (actor?.is_admin) audit(actor.id, null, 'logout_admin');
    clearSession(req, res);
    return json(res, 200, { mensagem: 'Sessão administrativa encerrada.' });
  }

  if (p === '/api/admin/me' && m === 'GET') {
    return json(res, actor?.is_admin ? 200 : 401, { authenticated: Boolean(actor?.is_admin), user: actor?.is_admin ? actor : null });
  }

  if (p === '/api/admin/denuncias' && m === 'GET') {
    const admin = requireAdmin(req, res);
    if (!admin) return;

    const status = url.searchParams.get('status');
    const search = url.searchParams.get('q');
    let sql = 'SELECT id,tipo_denuncia,tipo_violencia,descricao,status,nome,telefone,email,arquivos,criado_em FROM denuncias WHERE excluida_em IS NULL';
    const params = [];

    if (['Recebida', 'Em análise', 'Concluída'].includes(status)) {
      sql += ' AND status=?';
      params.push(status);
    }
    if (search) {
      sql += ' AND (CAST(id AS TEXT) LIKE ? OR descricao LIKE ? OR email LIKE ?)';
      const q = `%${search.slice(0, 100)}%`;
      params.push(q, q, q);
    }
    sql += ' ORDER BY id DESC';

    audit(admin.id, null, 'listar_denuncias', { status: status || null, busca: search || null });
    return json(res, 200, db.prepare(sql).all(...params));
  }

  const pm = p.match(/^\/api\/admin\/denuncias\/(\d+)$/);
  if (pm && m === 'PATCH') {
    const admin = requireAdmin(req, res);
    if (!admin) return;
    const id = Number(pm[1]);
    const current = reportById.get(id);
    const b = await readBody(req);

    if (!current || current.excluida_em) return json(res, 404, { erro: 'Denúncia não encontrada.' });
    if (!['Recebida', 'Em análise', 'Concluída'].includes(b.status)) return json(res, 400, { erro: 'Status inválido.' });

    db.prepare('UPDATE denuncias SET status=? WHERE id=? AND excluida_em IS NULL').run(b.status, id);
    audit(admin.id, id, 'alterar_status', { de: current.status, para: b.status });
    return json(res, 200, reportById.get(id));
  }

  const am = p.match(/^\/api\/admin\/denuncias\/(\d+)\/arquivar$/);
  if (am && m === 'POST') {
    const admin = requireAdmin(req, res);
    if (!admin) return;
    const id = Number(am[1]);
    const current = reportById.get(id);

    if (!current || current.excluida_em) return json(res, 404, { erro: 'Denúncia não encontrada.' });
    const b = await readBody(req);

    db.prepare('UPDATE denuncias SET excluida_em=? WHERE id=? AND excluida_em IS NULL').run(new Date().toISOString(), id);
    audit(admin.id, id, 'arquivar_denuncia', { motivo: String(b.motivo || '').slice(0, 500) });
    return json(res, 200, { mensagem: 'Denúncia arquivada.', id });
  }

  if (p === '/api/admin/auditoria' && m === 'GET') {
    const admin = requireAdmin(req, res);
    if (!admin) return;
    audit(admin.id, null, 'listar_auditoria');
    return json(
      res,
      200,
      db.prepare('SELECT a.id,a.acao,a.detalhes,a.criado_em,u.email AS operador FROM auditoria a LEFT JOIN users u ON u.id=a.actor_user_id ORDER BY a.id DESC LIMIT 500').all()
    );
  }

  if (p === '/api/admin/analytics' && m === 'GET') {
    const admin = requireAdmin(req, res);
    if (!admin) return;

    const isoDate = (v) => /^\d{4}-\d{2}-\d{2}$/.test(v || '');
    const from = url.searchParams.get('from');
    const to = url.searchParams.get('to');

    if ((from && !isoDate(from)) || (to && !isoDate(to))) {
      return json(res, 400, { erro: 'Período inválido. Use AAAA-MM-DD.' });
    }

    const filters = [], params = [];
    if (from) {
      filters.push('criado_em >= ?');
      params.push(`${from} 00:00:00`);
    }
    if (to) {
      filters.push('criado_em < ?');
      params.push(`${to} 23:59:59`);
    }

    const range = filters.length ? ` AND ${filters.join(' AND ')}` : '';
    const summary = db.prepare(`SELECT COUNT(*) AS total, SUM(CASE WHEN excluida_em IS NULL THEN 1 ELSE 0 END) AS ativos, SUM(CASE WHEN excluida_em IS NOT NULL THEN 1 ELSE 0 END) AS arquivadas FROM denuncias WHERE 1=1${range}`).get(...params);
    const active = ' AND excluida_em IS NULL';

    const byStatus = db.prepare(`SELECT status AS chave,COUNT(*) AS valor FROM denuncias WHERE 1=1${range}${active} GROUP BY status ORDER BY status`).all(...params);
    const byType = db.prepare(`SELECT CASE WHEN tipo_denuncia='anon' THEN 'Anônima' ELSE 'Identificada' END AS chave,COUNT(*) AS valor FROM denuncias WHERE 1=1${range}${active} GROUP BY tipo_denuncia`).all(...params);
    const byViolence = db.prepare(`SELECT tipo_violencia AS chave,COUNT(*) AS valor FROM denuncias WHERE 1=1${range}${active} GROUP BY tipo_violencia ORDER BY valor DESC`).all(...params);
    const timeline = db.prepare(`SELECT substr(criado_em,1,10) AS chave,COUNT(*) AS valor FROM denuncias WHERE 1=1${range}${active} GROUP BY substr(criado_em,1,10) ORDER BY chave`).all(...params);
    const rows = db.prepare(`SELECT descricao,nome,telefone,email,arquivos,tipo_denuncia FROM denuncias WHERE 1=1${range}${active}`).all(...params);

    let anexos = 0, bytes = 0, descricoesVazias = 0, identificadasSemContato = 0;
    for (const row of rows) {
      if (!String(row.descricao || '').trim()) descricoesVazias++;
      if (row.tipo_denuncia === 'identified' && !row.email && !row.telefone) identificadasSemContato++;
      try {
        const files = JSON.parse(row.arquivos || '[]');
        if (Array.isArray(files)) {
          anexos += files.length;
          bytes += files.reduce((n, f) => n + (Number(f.size) || 0), 0);
        }
      } catch {}
    }

    audit(admin.id, null, 'consultar_analytics', { from: from || null, to: to || null });
    return json(res, 200, {
      periodo: { from: from || null, to: to || null },
      resumo: { total: Number(summary.total || 0), ativos: Number(summary.ativos || 0), arquivadas: Number(summary.arquivadas || 0) },
      distribuicoes: { status: byStatus, tipo: byType, violencia: byViolence },
      serieTemporal: timeline,
      qualidade: { registrosAnalisados: rows.length, anexos, bytesAnexos: bytes, descricoesVazias, identificadasSemContato },
    });
  }

  if (p.startsWith('/api/')) return json(res, 404, { erro: 'Rota da API não encontrada.' });
  if (m !== 'GET' && m !== 'HEAD') return json(res, 405, { erro: 'Método não permitido.' });

  return serve(req, res, p);
}

// Servidor de Arquivos Estáticos (HTML, CSS, JS)
function mime(file) {
  return (
    {
      '.html': 'text/html; charset=utf-8',
      '.css': 'text/css; charset=utf-8',
      '.js': 'application/javascript; charset=utf-8',
      '.json': 'application/json; charset=utf-8',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.svg': 'image/svg+xml',
      '.ico': 'image/x-icon',
    }[path.extname(file).toLowerCase()] || 'application/octet-stream'
  );
}

function serve(req, res, p) {
  let decoded;
  try {
    decoded = decodeURIComponent(p);
  } catch {
    return json(res, 400, { erro: 'Caminho inválido.' });
  }

  const rel = decoded === '/' ? '/index.html' : decoded;
  const file = path.resolve(PUBLIC, '.' + rel);

  if (!file.startsWith(`${path.resolve(PUBLIC)}${path.sep}`)) {
    return json(res, 403, { erro: 'Acesso negado.' });
  }

  fs.stat(file, (e, s) => {
    if (e || !s.isFile()) return json(res, 404, { erro: 'Arquivo não encontrado.' });
    res.writeHead(200, { 'Content-Type': mime(file), 'X-Content-Type-Options': 'nosniff' });
    if (req.method === 'HEAD') return res.end();
    fs.createReadStream(file).pipe(res);
  });
  