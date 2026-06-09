import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .users-root {
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
    min-height: 100vh;
    background: var(--bg);
    font-family: 'DM Sans', sans-serif;
    color: var(--text);
    display: flex;
  }

  /* ── Sidebar (same as Dashboard) ── */
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
    text-decoration: none;
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
    width: 220px;
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
    display: flex;
    align-items: center;
    gap: 8px;
    background: var(--panel);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 12px 20px;
    font-size: 13px;
  }
  .summary-badge .num {
    font-family: 'Syne', sans-serif;
    font-size: 22px;
    font-weight: 800;
    letter-spacing: -0.03em;
  }
  .summary-badge .lbl { font-size: 12px; color: var(--muted); }
  .summary-badge.total .num { color: var(--text); }
  .summary-badge.admins .num { color: var(--accent); }
  .summary-badge.active .num { color: var(--green); }
  .summary-badge.inactive .num { color: var(--muted); }

  /* ── Table card ── */
  .table-card {
    background: var(--panel);
    border: 1px solid var(--border);
    border-radius: 10px;
    overflow: hidden;
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

  .td-user { display: flex; align-items: center; gap: 12px; }
  .avatar {
    width: 34px; height: 34px;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-weight: 700; font-size: 12px;
    flex-shrink: 0;
  }
  .avatar-name { font-weight: 500; font-size: 13px; }
  .avatar-email { font-size: 11px; color: var(--muted); margin-top: 1px; }

  .role-badge {
    font-size: 11px;
    font-weight: 600;
    padding: 3px 10px;
    border-radius: 20px;
    letter-spacing: 0.04em;
    text-transform: capitalize;
  }
  .role-admin   { background: rgba(232,255,71,0.1);  color: var(--accent); border: 1px solid rgba(232,255,71,0.2); }
  .role-user    { background: rgba(91,143,255,0.1);  color: var(--blue);   border: 1px solid rgba(91,143,255,0.2); }
  .role-manager { background: rgba(255,170,91,0.1);  color: var(--orange); border: 1px solid rgba(255,170,91,0.2); }

  .status-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
  }
  .dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
  .dot.active   { background: var(--green); box-shadow: 0 0 5px var(--green); }
  .dot.inactive { background: var(--muted); }

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
  .btn-icon.danger:hover { color: var(--red); border-color: var(--red); background: rgba(255,95,109,0.07); }

  /* ── Empty state ── */
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
    width: 440px;
    max-width: 90vw;
    animation: slideUp 0.25s cubic-bezier(0.22,1,0.36,1);
  }
  @keyframes slideUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:none; } }
  .modal-title {
    font-family: 'Syne', sans-serif;
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 24px;
  }
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
  .field input, .field select {
    width: 100%;
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 12px 14px;
    font-size: 14px;
    font-family: 'DM Sans', sans-serif;
    color: var(--text);
    outline: none;
    transition: border-color 0.2s;
    appearance: none;
  }
  .field input:focus, .field select:focus { border-color: var(--accent); }
  .field input::placeholder { color: var(--muted); }
  .field select option { background: var(--panel); }
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
  .toast.error { border-left-color: var(--red); }
  @keyframes slideRight { from { opacity:0; transform:translateX(20px); } to { opacity:1; transform:none; } }

  @media (max-width: 900px) {
    .sidebar { display: none; }
    .main { padding: 28px 20px; }
  }
`;

// ── Avatares coloridos por índice ──────────────────────────
const AVATAR_COLORS = [
  ['#e8ff47', '#0a0a0f'],
  ['#5b8fff', '#fff'],
  ['#4fffb0', '#0a0a0f'],
  ['#ff5f6d', '#fff'],
  ['#ffaa5b', '#0a0a0f'],
  ['#c084fc', '#fff'],
];

const INITIAL_USERS = [
  { id: 1, name: 'Ana Souza',     email: 'ana@app.com',     role: 'admin',   status: 'active',   joined: '10/01/2025' },
  { id: 2, name: 'Bruno Lima',    email: 'bruno@app.com',   role: 'manager', status: 'active',   joined: '22/02/2025' },
  { id: 3, name: 'Carla Mendes',  email: 'carla@app.com',   role: 'user',    status: 'active',   joined: '05/03/2025' },
  { id: 4, name: 'Diego Rocha',   email: 'diego@app.com',   role: 'user',    status: 'inactive', joined: '18/03/2025' },
  { id: 5, name: 'Elisa Ferreira',email: 'elisa@app.com',   role: 'user',    status: 'active',   joined: '02/04/2025' },
  { id: 6, name: 'Felipe Nunes',  email: 'felipe@app.com',  role: 'manager', status: 'inactive', joined: '14/05/2025' },
];

const EMPTY_FORM = { name: '', email: '', role: 'user', status: 'active' };

export default function Users() {
  const navigate = useNavigate();

  const [users, setUsers]         = useState(INITIAL_USERS);
  const [search, setSearch]       = useState('');
  const [filter, setFilter]       = useState('Todos');
  const [modal, setModal]         = useState(false);
  const [editUser, setEditUser]   = useState(null);
  const [form, setForm]           = useState(EMPTY_FORM);
  const [toast, setToast]         = useState(null);
  const [activeNav, setActiveNav] = useState('Usuários');

  const [loggedUser] = useState(() => {
    const raw = localStorage.getItem('token') || '';
    try { return JSON.parse(atob(raw.split('.')[1])); } catch { return { email: 'admin@app.com' }; }
  });

  const showToast = (msg, type = 'ok') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  };

  const openCreate = () => { setForm(EMPTY_FORM); setEditUser(null); setModal(true); };
  const openEdit   = (u)  => { setForm({ name: u.name, email: u.email, role: u.role, status: u.status }); setEditUser(u); setModal(true); };
  const closeModal = ()  => setModal(false);

  const saveUser = () => {
    if (!form.name.trim() || !form.email.trim()) { showToast('Nome e e-mail são obrigatórios.', 'error'); return; }
    if (editUser) {
      setUsers(prev => prev.map(u => u.id === editUser.id ? { ...u, ...form } : u));
      showToast(`${form.name} atualizado.`);
    } else {
      const newUser = { ...form, id: Date.now(), joined: new Date().toLocaleDateString('pt-BR') };
      setUsers(prev => [...prev, newUser]);
      showToast(`${form.name} adicionado.`);
    }
    setModal(false);
  };

  const deleteUser = (u) => {
    if (!window.confirm(`Remover ${u.name}?`)) return;
    setUsers(prev => prev.filter(x => x.id !== u.id));
    showToast(`${u.name} removido.`, 'error');
  };

  const toggleStatus = (u) => {
    setUsers(prev => prev.map(x => x.id === u.id ? { ...x, status: x.status === 'active' ? 'inactive' : 'active' } : x));
    showToast(`Status de ${u.name} alterado.`);
  };

  const handleLogout = () => { localStorage.removeItem('token'); navigate('/login'); };

  const filtered = users.filter(u => {
    const q = search.toLowerCase();
    const matchSearch = u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    const matchFilter =
      filter === 'Todos'     ? true :
      filter === 'Admin'     ? u.role === 'admin' :
      filter === 'Manager'   ? u.role === 'manager' :
      filter === 'Usuário'   ? u.role === 'user' :
      filter === 'Ativos'    ? u.status === 'active' :
      filter === 'Inativos'  ? u.status === 'inactive' : true;
    return matchSearch && matchFilter;
  });

  const navItems = [
    { icon: '⬡', label: 'Dashboard', path: '/dashboard' },
    { icon: '◈', label: 'Usuários',  path: '/usuarios' },
    { icon: '◎', label: 'Requisições', path: '/requisicoes' },
    { icon: '◇', label: 'Configurações', path: '/configuracoes' },
  ];

  const initials = loggedUser?.email?.slice(0, 2).toUpperCase() || 'US';

  return (
    <>
      <style>{styles}</style>
      <div className="users-root">

        {/* ── Sidebar ── */}
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

        {/* ── Main ── */}
        <main className="main">

          {/* Topbar */}
          <div className="topbar">
            <div className="topbar-left">
              <h1>Usuários</h1>
              <p>{users.length} usuários cadastrados</p>
            </div>
            <div className="topbar-actions">
              <input
                className="search-bar"
                type="text"
                placeholder="Buscar por nome ou e-mail…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <button className="btn-primary" onClick={openCreate}>+ Novo usuário</button>
            </div>
          </div>

          {/* Summary */}
          <div className="summary-row">
            <div className="summary-badge total">
              <div><div className="num">{users.length}</div><div className="lbl">Total</div></div>
            </div>
            <div className="summary-badge admins">
              <div><div className="num">{users.filter(u => u.role === 'admin').length}</div><div className="lbl">Admins</div></div>
            </div>
            <div className="summary-badge active">
              <div><div className="num">{users.filter(u => u.status === 'active').length}</div><div className="lbl">Ativos</div></div>
            </div>
            <div className="summary-badge inactive">
              <div><div className="num">{users.filter(u => u.status === 'inactive').length}</div><div className="lbl">Inativos</div></div>
            </div>
          </div>

          {/* Table */}
          <div className="table-card">
            <div className="filter-bar">
              {['Todos','Ativos','Inativos','Admin','Manager','Usuário'].map(f => (
                <button key={f} className={`filter-btn ${filter === f ? 'on' : ''}`} onClick={() => setFilter(f)}>{f}</button>
              ))}
            </div>
            <table>
              <thead>
                <tr>
                  <th>Usuário</th>
                  <th>Cargo</th>
                  <th>Status</th>
                  <th>Desde</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5}>
                      <div className="empty-state">
                        <span>◎</span>
                        Nenhum usuário encontrado.
                      </div>
                    </td>
                  </tr>
                ) : filtered.map((u, i) => {
                  const [bg, fg] = AVATAR_COLORS[i % AVATAR_COLORS.length];
                  return (
                    <tr key={u.id}>
                      <td>
                        <div className="td-user">
                          <div className="avatar" style={{ background: bg, color: fg }}>
                            {u.name.slice(0,2).toUpperCase()}
                          </div>
                          <div>
                            <div className="avatar-name">{u.name}</div>
                            <div className="avatar-email">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`role-badge role-${u.role}`}>{u.role}</span>
                      </td>
                      <td>
                        <span className="status-pill">
                          <span className={`dot ${u.status}`} />
                          {u.status === 'active' ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td style={{ color: 'var(--muted)', fontSize: 12 }}>{u.joined}</td>
                      <td>
                        <div className="action-group">
                          <button className="btn-icon" onClick={() => openEdit(u)}>Editar</button>
                          <button className="btn-icon" onClick={() => toggleStatus(u)}>
                            {u.status === 'active' ? 'Desativar' : 'Ativar'}
                          </button>
                          <button className="btn-icon danger" onClick={() => deleteUser(u)}>Remover</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {/* ── Modal ── */}
      {modal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && closeModal()}>
          <div className="modal">
            <div className="modal-title">{editUser ? 'Editar usuário' : 'Novo usuário'}</div>

            <div className="field">
              <label>Nome completo</label>
              <input type="text" placeholder="Maria Silva" value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div className="field">
              <label>E-mail</label>
              <input type="email" placeholder="maria@email.com" value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            </div>
            <div className="field">
              <label>Cargo</label>
              <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
                <option value="user">Usuário</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="field">
              <label>Status</label>
              <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                <option value="active">Ativo</option>
                <option value="inactive">Inativo</option>
              </select>
            </div>

            <div className="modal-actions">
              <button className="btn-cancel" onClick={closeModal}>Cancelar</button>
              <button className="btn-primary" onClick={saveUser}>
                {editUser ? 'Salvar alterações' : 'Criar usuário'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Toast ── */}
      {toast && <div className={`toast ${toast.type === 'error' ? 'error' : ''}`}>{toast.msg}</div>}
    </>
  );
}