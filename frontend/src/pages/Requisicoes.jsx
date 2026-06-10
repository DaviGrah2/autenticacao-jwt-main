import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .req-root {
    --bg: #0a0a0f;
    --panel: #111118;
    --panel2: #14141d;
    --border: #1e1e2e;
    --accent: #e8ff47;
    --accent-dim: rgba(232, 255, 71, 0.07);
    --text: #f0f0f5;
    --muted: #6b6b80;
    --green: #4fffb0;
    --red: #ff5f6d;
    --blue: #5b8fff;
    --orange: #ffaa5b;
    --purple: #c084fc;
    min-height: 100vh;
    background: var(--bg);
    font-family: 'DM Sans', sans-serif;
    color: var(--text);
    display: flex;
  }

  /* ── Sidebar ── */
  .sidebar {
    width: 240px;
    min-height: 100vh;
    background: var(--panel);
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    padding: 32px 0;
    flex-shrink: 0;
  }
  .sidebar-logo {
    font-family: 'Syne', sans-serif;
    font-size: 20px;
    font-weight: 800;
    letter-spacing: -0.02em;
    padding: 0 28px 32px;
    border-bottom: 1px solid var(--border);
  }
  .sidebar-logo span { color: var(--accent); }
  .sidebar-section {
    padding: 24px 16px 8px;
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--muted);
  }
  .nav-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 11px 28px;
    font-size: 14px;
    font-weight: 400;
    color: var(--muted);
    cursor: pointer;
    border-left: 3px solid transparent;
    transition: all 0.15s;
    margin: 1px 0;
    user-select: none;
  }
  .nav-item:hover { color: var(--text); background: var(--accent-dim); }
  .nav-item.active { color: var(--accent); border-left-color: var(--accent); background: var(--accent-dim); font-weight: 500; }
  .nav-icon { font-size: 16px; width: 20px; text-align: center; }
  .sidebar-bottom {
    margin-top: auto;
    padding: 24px 16px 0;
    border-top: 1px solid var(--border);
  }
  .user-chip {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    border-radius: 8px;
    background: var(--panel2);
    margin-bottom: 8px;
  }
  .user-avatar-sm {
    width: 36px; height: 36px;
    border-radius: 50%;
    background: var(--accent);
    display: flex; align-items: center; justify-content: center;
    font-weight: 700; font-size: 14px; color: #0a0a0f; flex-shrink: 0;
  }
  .user-info { overflow: hidden; }
  .user-name { font-size: 13px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .user-role { font-size: 11px; color: var(--muted); }
  .btn-logout {
    width: 100%;
    background: transparent;
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 10px;
    font-size: 13px;
    font-family: 'DM Sans', sans-serif;
    color: var(--muted);
    cursor: pointer;
    transition: all 0.15s;
  }
  .btn-logout:hover { color: var(--red); border-color: var(--red); background: rgba(255,95,109,0.07); }

  /* ── Main ── */
  .main {
    flex: 1;
    padding: 40px 48px;
    overflow-y: auto;
    animation: fadeIn 0.4s ease forwards;
  }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }

  .topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 32px;
    flex-wrap: wrap;
    gap: 16px;
  }
  .topbar-left h1 {
    font-family: 'Syne', sans-serif;
    font-size: 28px;
    font-weight: 700;
    letter-spacing: -0.02em;
    margin-bottom: 4px;
  }
  .topbar-left p { font-size: 13px; color: var(--muted); }
  .topbar-actions { display: flex; gap: 10px; align-items: center; }

  .btn-primary {
    background: var(--accent);
    color: #0a0a0f;
    border: none;
    border-radius: 6px;
    padding: 10px 20px;
    font-size: 13px;
    font-weight: 700;
    font-family: 'DM Sans', sans-serif;
    letter-spacing: 0.06em;
    cursor: pointer;
    transition: opacity 0.15s, transform 0.1s;
    white-space: nowrap;
  }
  .btn-primary:hover { opacity: 0.85; }
  .btn-primary:active { transform: scale(0.98); }

  .search-bar {
    background: var(--panel);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 10px 14px;
    font-size: 13px;
    font-family: 'DM Sans', sans-serif;
    color: var(--text);
    outline: none;
    width: 240px;
    transition: border-color 0.2s;
  }
  .search-bar::placeholder { color: var(--muted); }
  .search-bar:focus { border-color: var(--accent); }

  /* ── Summary badges ── */
  .summary-row {
    display: flex;
    gap: 12px;
    margin-bottom: 24px;
    flex-wrap: wrap;
  }
  .summary-badge {
    background: var(--panel);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 16px 24px;
    min-width: 110px;
  }
  .summary-badge .num {
    font-family: 'Syne', sans-serif;
    font-size: 26px;
    font-weight: 800;
    letter-spacing: -0.03em;
    line-height: 1;
    margin-bottom: 4px;
  }
  .summary-badge .lbl { font-size: 11px; color: var(--muted); letter-spacing: 0.05em; }
  .summary-badge.total .num   { color: var(--text); }
  .summary-badge.pending .num { color: var(--orange); }
  .summary-badge.approved .num{ color: var(--green); }
  .summary-badge.rejected .num{ color: var(--red); }
  .summary-badge.review .num  { color: var(--blue); }

  /* ── Kanban board ── */
  .kanban-board {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin-bottom: 40px;
  }
  .kanban-col {
    background: var(--panel);
    border: 1px solid var(--border);
    border-radius: 10px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  .kanban-col-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 16px;
    border-bottom: 1px solid var(--border);
    background: var(--panel2);
  }
  .kanban-col-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
  .col-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
  .col-dot.pending  { background: var(--orange); box-shadow: 0 0 6px var(--orange); }
  .col-dot.review   { background: var(--blue);   box-shadow: 0 0 6px var(--blue); }
  .col-dot.approved { background: var(--green);  box-shadow: 0 0 6px var(--green); }
  .col-dot.rejected { background: var(--red);    box-shadow: 0 0 6px var(--red); }
  .col-count {
    font-size: 11px;
    font-weight: 600;
    padding: 2px 8px;
    border-radius: 10px;
    background: var(--bg);
    color: var(--muted);
  }
  .kanban-cards {
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    flex: 1;
    min-height: 80px;
  }

  /* ── Req card ── */
  .req-card {
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 14px;
    cursor: pointer;
    transition: border-color 0.15s, transform 0.1s;
    position: relative;
    overflow: hidden;
  }
  .req-card:hover { border-color: #2e2e45; transform: translateY(-1px); }
  .req-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0;
    width: 3px; height: 100%;
  }
  .req-card.pending::before  { background: var(--orange); }
  .req-card.review::before   { background: var(--blue); }
  .req-card.approved::before { background: var(--green); }
  .req-card.rejected::before { background: var(--red); }

  .req-card-id {
    font-size: 10px;
    font-family: 'Courier New', monospace;
    color: var(--muted);
    margin-bottom: 6px;
    letter-spacing: 0.05em;
  }
  .req-card-title {
    font-size: 13px;
    font-weight: 500;
    margin-bottom: 8px;
    line-height: 1.4;
  }
  .req-card-meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 10px;
  }
  .req-card-author {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    color: var(--muted);
  }
  .author-dot {
    width: 20px; height: 20px;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 9px;
    font-weight: 700;
    flex-shrink: 0;
  }
  .req-card-date { font-size: 10px; color: var(--muted); }
  .priority-tag {
    font-size: 10px;
    font-weight: 600;
    padding: 2px 7px;
    border-radius: 10px;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }
  .priority-alta   { background: rgba(255,95,109,0.12); color: var(--red); border: 1px solid rgba(255,95,109,0.2); }
  .priority-media  { background: rgba(255,170,91,0.12); color: var(--orange); border: 1px solid rgba(255,170,91,0.2); }
  .priority-baixa  { background: rgba(79,255,176,0.10); color: var(--green); border: 1px solid rgba(79,255,176,0.2); }

  /* ── Table section ── */
  .table-card {
    background: var(--panel);
    border: 1px solid var(--border);
    border-radius: 10px;
    overflow: hidden;
  }
  .table-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 20px 0;
    margin-bottom: 0;
  }
  .section-title {
    font-family: 'Syne', sans-serif;
    font-size: 16px;
    font-weight: 700;
  }
  .filter-bar {
    display: flex;
    gap: 6px;
    padding: 16px 20px;
    border-bottom: 1px solid var(--border);
    flex-wrap: wrap;
  }
  .filter-btn {
    background: transparent;
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 5px 14px;
    font-size: 12px;
    font-family: 'DM Sans', sans-serif;
    color: var(--muted);
    cursor: pointer;
    transition: all 0.15s;
  }
  .filter-btn:hover { color: var(--text); border-color: #2e2e45; }
  .filter-btn.on { background: var(--accent-dim); border-color: var(--accent); color: var(--accent); font-weight: 500; }

  table { width: 100%; border-collapse: collapse; }
  thead th {
    padding: 12px 20px;
    text-align: left;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--muted);
    background: var(--panel2);
    white-space: nowrap;
  }
  tbody tr { border-top: 1px solid var(--border); transition: background 0.12s; }
  tbody tr:hover { background: var(--accent-dim); }
  tbody td { padding: 14px 20px; font-size: 13px; vertical-align: middle; }

  .method-badge {
    font-size: 11px;
    font-weight: 600;
    padding: 3px 8px;
    border-radius: 4px;
    font-family: 'Courier New', monospace;
    display: inline-block;
  }
  .method-GET    { background: rgba(91,143,255,0.12); color: var(--blue); }
  .method-POST   { background: rgba(79,255,176,0.10); color: var(--green); }
  .method-PUT    { background: rgba(255,170,91,0.12); color: var(--orange); }
  .method-DELETE { background: rgba(255,95,109,0.12); color: var(--red); }

  .status-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    font-weight: 500;
    padding: 3px 10px;
    border-radius: 20px;
  }
  .status-pendente  { background: rgba(255,170,91,0.1);  color: var(--orange); border: 1px solid rgba(255,170,91,0.2); }
  .status-revisao   { background: rgba(91,143,255,0.1);  color: var(--blue);   border: 1px solid rgba(91,143,255,0.2); }
  .status-aprovado  { background: rgba(79,255,176,0.1);  color: var(--green);  border: 1px solid rgba(79,255,176,0.2); }
  .status-rejeitado { background: rgba(255,95,109,0.1);  color: var(--red);    border: 1px solid rgba(255,95,109,0.2); }

  .dot-sm { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
  .dot-pendente  { background: var(--orange); }
  .dot-revisao   { background: var(--blue); }
  .dot-aprovado  { background: var(--green); box-shadow: 0 0 4px var(--green); }
  .dot-rejeitado { background: var(--red); }

  .action-group { display: flex; gap: 6px; }
  .btn-icon {
    background: transparent;
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 6px 10px;
    font-size: 12px;
    font-family: 'DM Sans', sans-serif;
    color: var(--muted);
    cursor: pointer;
    transition: all 0.15s;
    white-space: nowrap;
  }
  .btn-icon:hover { color: var(--text); border-color: #2e2e45; }
  .btn-icon.approve:hover { color: var(--green); border-color: var(--green); background: rgba(79,255,176,0.07); }
  .btn-icon.reject:hover  { color: var(--red);   border-color: var(--red);   background: rgba(255,95,109,0.07); }

  .empty-state {
    text-align: center;
    padding: 60px 24px;
    color: var(--muted);
    font-size: 14px;
  }
  .empty-state span { display: block; font-size: 32px; margin-bottom: 12px; }

  /* ── Modal ── */
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.7);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
    animation: fadeIn 0.2s ease;
  }
  .modal {
    background: var(--panel);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 32px;
    width: 520px;
    max-width: 90vw;
    max-height: 90vh;
    overflow-y: auto;
    animation: slideUp 0.25s cubic-bezier(0.22,1,0.36,1);
  }
  @keyframes slideUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:none; } }
  .modal-title {
    font-family: 'Syne', sans-serif;
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 6px;
  }
  .modal-subtitle { font-size: 13px; color: var(--muted); margin-bottom: 24px; }

  .detail-row {
    display: flex;
    gap: 12px;
    margin-bottom: 14px;
    flex-wrap: wrap;
  }
  .detail-chip {
    font-size: 12px;
    padding: 4px 12px;
    border-radius: 20px;
    background: var(--panel2);
    border: 1px solid var(--border);
    color: var(--muted);
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }
  .detail-chip strong { color: var(--text); }

  .divider { height: 1px; background: var(--border); margin: 20px 0; }

  .field { margin-bottom: 16px; }
  .field label {
    display: block;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 6px;
  }
  .field textarea, .field select, .field input {
    width: 100%;
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 12px 14px;
    font-size: 14px;
    font-family: 'DM Sans', sans-serif;
    color: var(--text);
    outline: none;
    resize: vertical;
    transition: border-color 0.2s;
  }
  .field textarea:focus, .field select:focus, .field input:focus { border-color: var(--accent); }
  .field textarea { min-height: 100px; }
  .field select option { background: var(--panel); }
  .field input::placeholder { color: var(--muted); }

  .modal-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 24px; }
  .btn-cancel {
    background: transparent;
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 10px 20px;
    font-size: 13px;
    font-family: 'DM Sans', sans-serif;
    color: var(--muted);
    cursor: pointer;
    transition: all 0.15s;
  }
  .btn-cancel:hover { color: var(--text); border-color: #2e2e45; }
  .btn-danger {
    background: rgba(255,95,109,0.1);
    border: 1px solid rgba(255,95,109,0.3);
    border-radius: 6px;
    padding: 10px 20px;
    font-size: 13px;
    font-weight: 600;
    font-family: 'DM Sans', sans-serif;
    color: var(--red);
    cursor: pointer;
    transition: all 0.15s;
  }
  .btn-danger:hover { background: rgba(255,95,109,0.18); }
  .btn-success {
    background: rgba(79,255,176,0.1);
    border: 1px solid rgba(79,255,176,0.3);
    border-radius: 6px;
    padding: 10px 20px;
    font-size: 13px;
    font-weight: 600;
    font-family: 'DM Sans', sans-serif;
    color: var(--green);
    cursor: pointer;
    transition: all 0.15s;
  }
  .btn-success:hover { background: rgba(79,255,176,0.18); }

  /* ── Toast ── */
  .toast {
    position: fixed;
    bottom: 28px;
    right: 28px;
    background: var(--panel);
    border: 1px solid var(--border);
    border-left: 3px solid var(--green);
    border-radius: 8px;
    padding: 14px 20px;
    font-size: 13px;
    color: var(--text);
    z-index: 200;
    animation: slideRight 0.3s cubic-bezier(0.22,1,0.36,1);
  }
  .toast.error   { border-left-color: var(--red); }
  .toast.warning { border-left-color: var(--orange); }
  @keyframes slideRight { from { opacity:0; transform:translateX(20px); } to { opacity:1; transform:none; } }

  /* ── View toggle ── */
  .view-toggle {
    display: flex;
    background: var(--panel);
    border: 1px solid var(--border);
    border-radius: 6px;
    overflow: hidden;
  }
  .view-btn {
    background: transparent;
    border: none;
    padding: 8px 14px;
    font-size: 14px;
    cursor: pointer;
    color: var(--muted);
    transition: all 0.15s;
  }
  .view-btn.on { background: var(--accent-dim); color: var(--accent); }
  .view-btn:hover:not(.on) { color: var(--text); }

  @media (max-width: 1100px) {
    .kanban-board { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 900px) {
    .sidebar { display: none; }
    .main { padding: 28px 20px; }
    .kanban-board { grid-template-columns: 1fr; }
  }
`;

const AVATAR_COLORS = [
  ['#e8ff47','#0a0a0f'], ['#5b8fff','#fff'], ['#4fffb0','#0a0a0f'],
  ['#ff5f6d','#fff'],    ['#ffaa5b','#0a0a0f'], ['#c084fc','#fff'],
];

const INITIAL_REQS = [
  { id:'REQ-001', titulo:'Acesso ao módulo financeiro', descricao:'Precisamos de acesso de leitura ao módulo de relatórios financeiros para auditorias mensais.', autor:'Ana Souza',       status:'aprovado',  prioridade:'alta',  metodo:'GET',    endpoint:'/api/financeiro/relatorios', data:'02/06/2025', categoria:'Acesso' },
  { id:'REQ-002', titulo:'Criação de usuário admin',    descricao:'Solicitação para criação de novo usuário com perfil administrador para o setor de TI.', autor:'Bruno Lima',    status:'pendente',  prioridade:'alta',  metodo:'POST',   endpoint:'/api/usuarios',              data:'04/06/2025', categoria:'Usuário' },
  { id:'REQ-003', titulo:'Reset de senha em massa',     descricao:'Reset forçado de senhas para o grupo de estagiários após incidente de segurança.', autor:'Carla Mendes',  status:'revisao',   prioridade:'media', metodo:'PUT',    endpoint:'/api/auth/reset',             data:'05/06/2025', categoria:'Segurança' },
  { id:'REQ-004', titulo:'Remoção de dados inativos',   descricao:'Limpeza de registros de usuários inativos há mais de 12 meses conforme política de dados.', autor:'Diego Rocha',   status:'pendente',  prioridade:'baixa', metodo:'DELETE', endpoint:'/api/usuarios/inativos',     data:'06/06/2025', categoria:'Dados' },
  { id:'REQ-005', titulo:'Integração com SSO externo',  descricao:'Configuração do provedor de identidade externo para login único com Azure AD.', autor:'Elisa Ferreira', status:'rejeitado',  prioridade:'alta',  metodo:'POST',   endpoint:'/api/auth/sso',              data:'03/06/2025', categoria:'Integração' },
  { id:'REQ-006', titulo:'Exportação de logs de auditoria', descricao:'Download dos logs de acesso dos últimos 90 dias em formato CSV para análise.', autor:'Felipe Nunes',  status:'aprovado',  prioridade:'media', metodo:'GET',    endpoint:'/api/logs/export',           data:'01/06/2025', categoria:'Auditoria' },
  { id:'REQ-007', titulo:'Permissão leitura banco dados', descricao:'Acesso readonly ao banco de dados de produção para time de analytics.', autor:'Ana Souza',       status:'revisao',   prioridade:'alta',  metodo:'GET',    endpoint:'/api/db/readonly',           data:'07/06/2025', categoria:'Acesso' },
  { id:'REQ-008', titulo:'Desativação conta usuário',   descricao:'Desativar conta do colaborador João Pereira após desligamento da empresa.', autor:'Bruno Lima',    status:'aprovado',  prioridade:'media', metodo:'PUT',    endpoint:'/api/usuarios/desativar',    data:'08/06/2025', categoria:'Usuário' },
];

const EMPTY_FORM = { titulo:'', descricao:'', categoria:'Acesso', prioridade:'media', metodo:'GET', endpoint:'', autor:'' };

const STATUS_LABELS = { pendente:'Pendente', revisao:'Em revisão', aprovado:'Aprovado', rejeitado:'Rejeitado' };
const PRIORITY_LABELS = { alta:'Alta', media:'Média', baixa:'Baixa' };

export default function Requisicoes() {
  const navigate = useNavigate();
  const [reqs, setReqs]           = useState(INITIAL_REQS);
  const [view, setView]           = useState('kanban'); // 'kanban' | 'table'
  const [filter, setFilter]       = useState('Todos');
  const [search, setSearch]       = useState('');
  const [modal, setModal]         = useState(false);
  const [detailReq, setDetailReq] = useState(null);
  const [form, setForm]           = useState(EMPTY_FORM);
  const [toast, setToast]         = useState(null);
  const [activeNav, setActiveNav] = useState('Requisições');

  const [loggedUser] = useState(() => {
    const raw = localStorage.getItem('token') || '';
    try { return JSON.parse(atob(raw.split('.')[1])); } catch { return { email:'admin@app.com' }; }
  });

  const showToast = (msg, type = 'ok') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  };

  const handleLogout = () => { localStorage.removeItem('token'); navigate('/login'); };

  const navItems = [
    { icon:'⬡', label:'Dashboard',    path:'/dashboard' },
    { icon:'◈', label:'Usuários',      path:'/usuarios' },
    { icon:'◎', label:'Requisições',   path:'/requisicoes' },
    { icon:'◇', label:'Configurações', path:'/dashboard/configuracoes' },
  ];

  const filtered = reqs.filter(r => {
    const q = search.toLowerCase();
    const matchSearch = r.titulo.toLowerCase().includes(q) || r.id.toLowerCase().includes(q) || r.autor.toLowerCase().includes(q);
    const matchFilter =
      filter === 'Todos'      ? true :
      filter === 'Pendente'   ? r.status === 'pendente' :
      filter === 'Em revisão' ? r.status === 'revisao' :
      filter === 'Aprovado'   ? r.status === 'aprovado' :
      filter === 'Rejeitado'  ? r.status === 'rejeitado' : true;
    return matchSearch && matchFilter;
  });

  const byStatus = s => reqs.filter(r => r.status === s);

  const changeStatus = (id, newStatus) => {
    setReqs(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
    const label = STATUS_LABELS[newStatus];
    showToast(`Requisição marcada como ${label}.`, newStatus === 'rejeitado' ? 'error' : newStatus === 'pendente' ? 'warning' : 'ok');
    setDetailReq(null);
  };

  const deleteReq = (id) => {
    if (!window.confirm('Remover esta requisição?')) return;
    setReqs(prev => prev.filter(r => r.id !== id));
    showToast('Requisição removida.', 'error');
    setDetailReq(null);
  };

  const saveReq = () => {
    if (!form.titulo.trim() || !form.autor.trim()) { showToast('Título e solicitante são obrigatórios.', 'error'); return; }
    const newId = `REQ-${String(reqs.length + 1).padStart(3,'0')}`;
    const newReq = { ...form, id: newId, status:'pendente', data: new Date().toLocaleDateString('pt-BR') };
    setReqs(prev => [...prev, newReq]);
    showToast(`${newId} criada com sucesso.`);
    setModal(false);
    setForm(EMPTY_FORM);
  };

  const initials = loggedUser?.email?.slice(0,2).toUpperCase() || 'US';

  const COLUMNS = [
    { key:'pendente',  label:'Pendente',   dotClass:'pending' },
    { key:'revisao',   label:'Em revisão', dotClass:'review' },
    { key:'aprovado',  label:'Aprovado',   dotClass:'approved' },
    { key:'rejeitado', label:'Rejeitado',  dotClass:'rejected' },
  ];

  return (
    <>
      <style>{styles}</style>
      <div className="req-root">

        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-logo">Auth<span>JWT</span></div>
          <div className="sidebar-section">Menu</div>
          {navItems.map(({ icon, label, path }) => (
            <div key={label}
              className={`nav-item ${activeNav === label ? 'active' : ''}`}
              onClick={() => { setActiveNav(label); navigate(path); }}>
              <span className="nav-icon">{icon}</span>{label}
            </div>
          ))}
          <div className="sidebar-bottom">
            <div className="user-chip">
              <div className="user-avatar-sm">{initials}</div>
              <div className="user-info">
                <div className="user-name">{loggedUser?.email || '...'}</div>
                <div className="user-role">{loggedUser?.role || 'admin'}</div>
              </div>
            </div>
            <button className="btn-logout" onClick={handleLogout}>Sair da conta</button>
          </div>
        </aside>

        {/* Main */}
        <main className="main">

          {/* Topbar */}
          <div className="topbar">
            <div className="topbar-left">
              <h1>Requisições</h1>
              <p>{reqs.length} requisições no total</p>
            </div>
            <div className="topbar-actions">
              <input
                className="search-bar"
                type="text"
                placeholder="Buscar por ID, título ou autor…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <div className="view-toggle">
                <button className={`view-btn ${view === 'kanban' ? 'on' : ''}`} onClick={() => setView('kanban')}>⊞</button>
                <button className={`view-btn ${view === 'table' ? 'on' : ''}`}  onClick={() => setView('table')}>☰</button>
              </div>
              <button className="btn-primary" onClick={() => setModal(true)}>+ Nova requisição</button>
            </div>
          </div>

          {/* Summary */}
          <div className="summary-row">
            <div className="summary-badge total">
              <div className="num">{reqs.length}</div><div className="lbl">Total</div>
            </div>
            <div className="summary-badge pending">
              <div className="num">{reqs.filter(r => r.status === 'pendente').length}</div><div className="lbl">Pendentes</div>
            </div>
            <div className="summary-badge review">
              <div className="num">{reqs.filter(r => r.status === 'revisao').length}</div><div className="lbl">Em revisão</div>
            </div>
            <div className="summary-badge approved">
              <div className="num">{reqs.filter(r => r.status === 'aprovado').length}</div><div className="lbl">Aprovadas</div>
            </div>
            <div className="summary-badge rejected">
              <div className="num">{reqs.filter(r => r.status === 'rejeitado').length}</div><div className="lbl">Rejeitadas</div>
            </div>
          </div>

          {/* ── KANBAN VIEW ── */}
          {view === 'kanban' && (
            <div className="kanban-board">
              {COLUMNS.map(col => (
                <div className="kanban-col" key={col.key}>
                  <div className="kanban-col-header">
                    <div className="kanban-col-title">
                      <span className={`col-dot ${col.dotClass}`} />
                      {col.label}
                    </div>
                    <span className="col-count">{byStatus(col.key).length}</span>
                  </div>
                  <div className="kanban-cards">
                    {byStatus(col.key).length === 0 && (
                      <div style={{ textAlign:'center', padding:'24px 0', color:'var(--muted)', fontSize:12 }}>Nenhuma</div>
                    )}
                    {byStatus(col.key).map((r, i) => {
                      const [bg, fg] = AVATAR_COLORS[i % AVATAR_COLORS.length];
                      return (
                        <div key={r.id} className={`req-card ${r.status}`} onClick={() => setDetailReq(r)}>
                          <div className="req-card-id">{r.id} · {r.categoria}</div>
                          <div className="req-card-title">{r.titulo}</div>
                          <span className={`priority-tag priority-${r.prioridade}`}>{PRIORITY_LABELS[r.prioridade]}</span>
                          <div className="req-card-meta">
                            <div className="req-card-author">
                              <div className="author-dot" style={{ background: bg, color: fg }}>
                                {r.autor.slice(0,2).toUpperCase()}
                              </div>
                              {r.autor.split(' ')[0]}
                            </div>
                            <div className="req-card-date">{r.data}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── TABLE VIEW ── */}
          {view === 'table' && (
            <div className="table-card">
              <div className="table-header">
                <div className="section-title">Todas as requisições</div>
              </div>
              <div className="filter-bar">
                {['Todos','Pendente','Em revisão','Aprovado','Rejeitado'].map(f => (
                  <button key={f} className={`filter-btn ${filter === f ? 'on' : ''}`} onClick={() => setFilter(f)}>{f}</button>
                ))}
              </div>
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Título</th>
                    <th>Método</th>
                    <th>Prioridade</th>
                    <th>Status</th>
                    <th>Solicitante</th>
                    <th>Data</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={8}>
                      <div className="empty-state"><span>◎</span>Nenhuma requisição encontrada.</div>
                    </td></tr>
                  ) : filtered.map(r => (
                    <tr key={r.id}>
                      <td style={{ fontFamily:'Courier New, monospace', fontSize:12, color:'var(--muted)' }}>{r.id}</td>
                      <td style={{ fontWeight:500 }}>{r.titulo}</td>
                      <td><span className={`method-badge method-${r.metodo}`}>{r.metodo}</span></td>
                      <td><span className={`priority-tag priority-${r.prioridade}`}>{PRIORITY_LABELS[r.prioridade]}</span></td>
                      <td>
                        <span className={`status-pill status-${r.status}`}>
                          <span className={`dot-sm dot-${r.status}`} />
                          {STATUS_LABELS[r.status]}
                        </span>
                      </td>
                      <td style={{ color:'var(--muted)', fontSize:12 }}>{r.autor}</td>
                      <td style={{ color:'var(--muted)', fontSize:12 }}>{r.data}</td>
                      <td>
                        <div className="action-group">
                          <button className="btn-icon" onClick={() => setDetailReq(r)}>Ver</button>
                          {r.status === 'pendente' && <>
                            <button className="btn-icon approve" onClick={() => changeStatus(r.id,'revisao')}>Revisar</button>
                            <button className="btn-icon reject"  onClick={() => changeStatus(r.id,'rejeitado')}>Rejeitar</button>
                          </>}
                          {r.status === 'revisao' && <>
                            <button className="btn-icon approve" onClick={() => changeStatus(r.id,'aprovado')}>Aprovar</button>
                            <button className="btn-icon reject"  onClick={() => changeStatus(r.id,'rejeitado')}>Rejeitar</button>
                          </>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>

      {/* ── Modal Nova Requisição ── */}
      {modal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div className="modal">
            <div className="modal-title">Nova requisição</div>
            <div className="modal-subtitle">Preencha os dados para abrir uma nova requisição.</div>

            <div className="field">
              <label>Título</label>
              <input type="text" placeholder="Descreva brevemente o que é necessário"
                value={form.titulo} onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))} />
            </div>
            <div className="field">
              <label>Descrição</label>
              <textarea placeholder="Detalhes adicionais sobre a requisição…"
                value={form.descricao} onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))} />
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <div className="field">
                <label>Categoria</label>
                <select value={form.categoria} onChange={e => setForm(f => ({ ...f, categoria: e.target.value }))}>
                  {['Acesso','Usuário','Segurança','Dados','Integração','Auditoria','Outro'].map(c => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label>Prioridade</label>
                <select value={form.prioridade} onChange={e => setForm(f => ({ ...f, prioridade: e.target.value }))}>
                  <option value="baixa">Baixa</option>
                  <option value="media">Média</option>
                  <option value="alta">Alta</option>
                </select>
              </div>
              <div className="field">
                <label>Método HTTP</label>
                <select value={form.metodo} onChange={e => setForm(f => ({ ...f, metodo: e.target.value }))}>
                  {['GET','POST','PUT','DELETE'].map(m => <option key={m}>{m}</option>)}
                </select>
              </div>
              <div className="field">
                <label>Endpoint</label>
                <input type="text" placeholder="/api/recurso" value={form.endpoint}
                  onChange={e => setForm(f => ({ ...f, endpoint: e.target.value }))} />
              </div>
            </div>
            <div className="field">
              <label>Solicitante</label>
              <input type="text" placeholder="Nome completo do solicitante" value={form.autor}
                onChange={e => setForm(f => ({ ...f, autor: e.target.value }))} />
            </div>

            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setModal(false)}>Cancelar</button>
              <button className="btn-primary" onClick={saveReq}>Criar requisição</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal Detalhes ── */}
      {detailReq && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setDetailReq(null)}>
          <div className="modal">
            <div className="modal-title">{detailReq.titulo}</div>
            <div className="modal-subtitle">{detailReq.id} · Aberta em {detailReq.data}</div>

            <div className="detail-row">
              <span className={`status-pill status-${detailReq.status}`}>
                <span className={`dot-sm dot-${detailReq.status}`} />
                {STATUS_LABELS[detailReq.status]}
              </span>
              <span className={`priority-tag priority-${detailReq.prioridade}`}>{PRIORITY_LABELS[detailReq.prioridade]}</span>
              <span className={`method-badge method-${detailReq.metodo}`}>{detailReq.metodo}</span>
            </div>

            <div className="detail-row">
              <span className="detail-chip"><strong>Solicitante</strong>{detailReq.autor}</span>
              <span className="detail-chip"><strong>Categoria</strong>{detailReq.categoria}</span>
            </div>

            {detailReq.endpoint && (
              <div className="field" style={{ marginBottom:0 }}>
                <label>Endpoint</label>
                <div style={{ fontFamily:'Courier New, monospace', fontSize:13, color:'var(--muted)',
                  background:'var(--bg)', border:'1px solid var(--border)', borderRadius:6, padding:'10px 14px' }}>
                  {detailReq.endpoint}
                </div>
              </div>
            )}

            {detailReq.descricao && (
              <>
                <div className="divider" />
                <div className="field" style={{ marginBottom:0 }}>
                  <label>Descrição</label>
                  <div style={{ fontSize:14, lineHeight:1.6, color:'var(--text)', padding:'2px 0' }}>
                    {detailReq.descricao}
                  </div>
                </div>
              </>
            )}

            <div className="divider" />

            <div className="modal-actions" style={{ flexWrap:'wrap' }}>
              <button className="btn-cancel" onClick={() => setDetailReq(null)}>Fechar</button>
              <button className="btn-danger" onClick={() => deleteReq(detailReq.id)}>Remover</button>
              {detailReq.status === 'pendente' && <>
                <button className="btn-cancel" onClick={() => changeStatus(detailReq.id,'revisao')}>→ Em revisão</button>
                <button className="btn-danger"  onClick={() => changeStatus(detailReq.id,'rejeitado')}>Rejeitar</button>
                <button className="btn-success" onClick={() => changeStatus(detailReq.id,'aprovado')}>Aprovar</button>
              </>}
              {detailReq.status === 'revisao' && <>
                <button className="btn-danger"  onClick={() => changeStatus(detailReq.id,'rejeitado')}>Rejeitar</button>
                <button className="btn-success" onClick={() => changeStatus(detailReq.id,'aprovado')}>Aprovar</button>
              </>}
              {detailReq.status === 'aprovado' && (
                <button className="btn-cancel" onClick={() => changeStatus(detailReq.id,'pendente')}>↩ Reabrir</button>
              )}
              {detailReq.status === 'rejeitado' && (
                <button className="btn-cancel" onClick={() => changeStatus(detailReq.id,'pendente')}>↩ Reabrir</button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && <div className={`toast ${toast.type === 'error' ? 'error' : toast.type === 'warning' ? 'warning' : ''}`}>{toast.msg}</div>}
    </>
  );
}