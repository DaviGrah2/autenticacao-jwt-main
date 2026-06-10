import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .dash-root {
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
    min-height: 100vh;
    background: var(--bg);
    font-family: 'DM Sans', sans-serif;
    color: var(--text);
    display: flex;
  }

  /* Sidebar */
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
  .nav-item.active {
    color: var(--accent);
    border-left-color: var(--accent);
    background: var(--accent-dim);
    font-weight: 500;
  }
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
  .user-avatar {
    width: 36px; height: 36px;
    border-radius: 50%;
    background: var(--accent);
    display: flex; align-items: center; justify-content: center;
    font-weight: 700;
    font-size: 14px;
    color: #0a0a0f;
    flex-shrink: 0;
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

  /* Main content */
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
    margin-bottom: 40px;
  }
  .topbar-title {
    font-family: 'Syne', sans-serif;
    font-size: 28px;
    font-weight: 700;
    letter-spacing: -0.02em;
  }
  .topbar-date {
    font-size: 13px;
    color: var(--muted);
    background: var(--panel);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 6px 16px;
  }

  /* Stat cards */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin-bottom: 32px;
  }
  .stat-card {
    background: var(--panel);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 24px;
    position: relative;
    overflow: hidden;
    transition: border-color 0.2s;
  }
  .stat-card:hover { border-color: #2e2e45; }
  .stat-card::after {
    content: '';
    position: absolute;
    top: 0; right: 0;
    width: 80px; height: 80px;
    border-radius: 50%;
    opacity: 0.07;
    transform: translate(20px, -20px);
  }
  .stat-card.green::after { background: var(--green); }
  .stat-card.blue::after  { background: var(--blue); }
  .stat-card.accent::after { background: var(--accent); }

  .stat-label {
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 12px;
  }
  .stat-value {
    font-family: 'Syne', sans-serif;
    font-size: 36px;
    font-weight: 800;
    letter-spacing: -0.03em;
    line-height: 1;
    margin-bottom: 8px;
  }
  .stat-card.green .stat-value { color: var(--green); }
  .stat-card.blue  .stat-value { color: var(--blue); }
  .stat-card.accent .stat-value { color: var(--accent); }
  .stat-delta {
    font-size: 12px;
    color: var(--muted);
  }
  .stat-delta.up { color: var(--green); }

  /* Token info */
  .token-card {
    background: var(--panel);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 28px;
    margin-bottom: 32px;
  }
  .token-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
  }
  .section-title {
    font-family: 'Syne', sans-serif;
    font-size: 16px;
    font-weight: 700;
  }
  .badge {
    font-size: 11px;
    font-weight: 500;
    padding: 4px 10px;
    border-radius: 20px;
    letter-spacing: 0.05em;
  }
  .badge.active { background: rgba(79,255,176,0.1); color: var(--green); border: 1px solid rgba(79,255,176,0.2); }
  .badge.warn   { background: rgba(232,255,71,0.1);  color: var(--accent); border: 1px solid rgba(232,255,71,0.2); }

  .token-display {
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 14px 16px;
    font-size: 12px;
    color: var(--muted);
    font-family: 'Courier New', monospace;
    word-break: break-all;
    line-height: 1.6;
  }
  .token-display strong { color: var(--accent); font-family: inherit; }

  /* Activity table */
  .table-card {
    background: var(--panel);
    border: 1px solid var(--border);
    border-radius: 10px;
    overflow: hidden;
  }
  .table-header {
    padding: 20px 24px;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  table { width: 100%; border-collapse: collapse; }
  thead th {
    padding: 12px 24px;
    text-align: left;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--muted);
    background: var(--panel2);
  }
  tbody tr { border-top: 1px solid var(--border); transition: background 0.1s; }
  tbody tr:hover { background: var(--accent-dim); }
  tbody td { padding: 14px 24px; font-size: 13px; }
  .td-method {
    font-family: 'Courier New', monospace;
    font-size: 11px;
    font-weight: 600;
    padding: 3px 8px;
    border-radius: 4px;
    display: inline-block;
  }
  .td-method.get   { background: rgba(91,143,255,0.15); color: var(--blue); }
  .td-method.post  { background: rgba(79,255,176,0.12); color: var(--green); }
  .td-method.del   { background: rgba(255,95,109,0.12); color: var(--red); }
  .status-dot { width: 7px; height: 7px; border-radius: 50%; display: inline-block; margin-right: 8px; }
  .status-dot.ok  { background: var(--green); box-shadow: 0 0 6px var(--green); }
  .status-dot.err { background: var(--red);   box-shadow: 0 0 6px var(--red); }

  @media (max-width: 900px) {
    .sidebar { display: none; }
    .main { padding: 28px 20px; }
    .stats-grid { grid-template-columns: 1fr; }
  }
`;

const ACTIVITIES = [
  { method: "POST", endpoint: "/api/auth/login", status: 200, time: "agora" },
  { method: "GET", endpoint: "/api/user/profile", status: 200, time: "1 min" },
  {
    method: "GET",
    endpoint: "/api/dashboard/data",
    status: 200,
    time: "2 min",
  },
  { method: "POST", endpoint: "/api/user/update", status: 200, time: "8 min" },
  { method: "GET", endpoint: "/api/items", status: 401, time: "15 min" },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const raw = localStorage.getItem("token") || "";
    setToken(raw);

    if (raw) {
      try {
        const payload = JSON.parse(atob(raw.split(".")[1]));
        setUser(payload);
      } catch {
        setUser({ email: "usuario@app.com", role: "user" });
      }
    } else {
      setUser({ email: "usuario@app.com", role: "user" });
    }

    const interval = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const initials = user?.email?.slice(0, 2).toUpperCase() || "US";
  const truncatedToken = token
    ? `${token.slice(0, 24)}...${token.slice(-12)}`
    : "Nenhum token encontrado";

  const navItems = [
    { icon: "⬡", label: "Dashboard" },
    { icon: "◈", label: "Usuários" },
    { icon: "◎", label: "Requisições" },
    { icon: "◇", label: "Configurações" },
  ];

  return (
    <>
      <style>{styles}</style>
      <div className="dash-root">
        <aside className="sidebar">
          <div className="sidebar-logo">
            Auth<span>JWT</span>
          </div>

          <div className="sidebar-section">Menu</div>
          {navItems.map(({ icon, label }) => (
            <div
              key={label}
              className={`nav-item ${activeNav === label ? "active" : ""}`}
              onClick={() => {
                setActiveNav(label);

                if (label === "Configurações") {
                  navigate("/dashboard/configuracoes");
                }

                if (label === "Dashboard") {
                  navigate("/dashboard");
                }

                if (label === "Usuários") {
                  navigate("/usuarios"); 
                }
              }}
            >
              <span className="nav-icon">{icon}</span>
              {label}
            </div>
          ))}

          <div className="sidebar-bottom">
            <div className="user-chip">
              <div className="user-avatar">{initials}</div>
              <div className="user-info">
                <div className="user-name">{user?.email || "..."}</div>
                <div className="user-role">{user?.role || "user"}</div>
              </div>
            </div>
            <button className="btn-logout" onClick={handleLogout}>
              Sair da conta
            </button>
          </div>
        </aside>

        <main className="main">
          <div className="topbar">
            <h1 className="topbar-title">Dashboard</h1>
            <div className="topbar-date">
              {now.toLocaleDateString("pt-BR", {
                weekday: "short",
                day: "numeric",
                month: "short",
              })}
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-card green">
              <div className="stat-label">Requisições OK</div>
              <div className="stat-value">1.284</div>
              <div className="stat-delta up">↑ +12% hoje</div>
            </div>
            <div className="stat-card blue">
              <div className="stat-label">Sessões Ativas</div>
              <div className="stat-value">47</div>
              <div className="stat-delta">online agora</div>
            </div>
            <div className="stat-card accent">
              <div className="stat-label">Tokens Emitidos</div>
              <div className="stat-value">320</div>
              <div className="stat-delta up">↑ +5 na última hora</div>
            </div>
          </div>

          <div className="token-card">
            <div className="token-header">
              <div className="section-title">Seu Token JWT</div>
              <span className={`badge ${token ? "active" : "warn"}`}>
                {token ? "● Ativo" : "⚠ Ausente"}
              </span>
            </div>
            <div className="token-display">
              <strong>Bearer</strong> {truncatedToken}
            </div>
          </div>

          <div className="table-card">
            <div className="table-header">
              <div className="section-title">Atividade Recente</div>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Método</th>
                  <th>Endpoint</th>
                  <th>Status</th>
                  <th>Quando</th>
                </tr>
              </thead>
              <tbody>
                {ACTIVITIES.map((a, i) => (
                  <tr key={i}>
                    <td>
                      <span
                        className={`td-method ${a.method === "GET" ? "get" : a.method === "POST" ? "post" : "del"}`}
                      >
                        {a.method}
                      </span>
                    </td>
                    <td
                      style={{
                        color: "var(--muted)",
                        fontFamily: "Courier New, monospace",
                        fontSize: 12,
                      }}
                    >
                      {a.endpoint}
                    </td>
                    <td>
                      <span
                        className={`status-dot ${a.status < 400 ? "ok" : "err"}`}
                      />
                      {a.status}
                    </td>
                    <td style={{ color: "var(--muted)", fontSize: 12 }}>
                      {a.time}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </>
  );
}
