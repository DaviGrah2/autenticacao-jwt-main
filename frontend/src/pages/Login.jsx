import { useState } from "react";
import { useNavigate } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .login-root {
    --bg: #0a0a0f;
    --panel: #111118;
    --border: #1e1e2e;
    --accent: #e8ff47;
    --accent-dim: rgba(232, 255, 71, 0.08);
    --text: #f0f0f5;
    --muted: #6b6b80;
    --error: #ff5f6d;
    min-height: 100vh;
    background: var(--bg);
    display: flex;
    font-family: 'DM Sans', sans-serif;
    color: var(--text);
    overflow: hidden;
  }

  /* Left decorative panel */
  .login-left {
    flex: 1;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 60px;
    background: var(--panel);
    border-right: 1px solid var(--border);
    overflow: hidden;
  }
  .login-left::before {
    content: '';
    position: absolute;
    width: 500px; height: 500px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(232,255,71,0.12) 0%, transparent 70%);
    top: -100px; left: -100px;
    animation: pulse 6s ease-in-out infinite;
  }
  .login-left::after {
    content: '';
    position: absolute;
    width: 300px; height: 300px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(100,80,255,0.1) 0%, transparent 70%);
    bottom: -50px; right: -50px;
    animation: pulse 8s ease-in-out infinite reverse;
  }
  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.15); opacity: 0.7; }
  }

  .brand-block {
    position: relative;
    z-index: 1;
    text-align: left;
  }
  .brand-tag {
    display: inline-block;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--accent);
    border: 1px solid var(--accent);
    padding: 4px 12px;
    border-radius: 2px;
    margin-bottom: 28px;
  }
  .brand-title {
    font-family: 'Syne', sans-serif;
    font-size: clamp(48px, 5vw, 72px);
    font-weight: 800;
    line-height: 0.95;
    letter-spacing: -0.03em;
    margin-bottom: 24px;
  }
  .brand-title span { color: var(--accent); }
  .brand-desc {
    font-size: 15px;
    color: var(--muted);
    line-height: 1.7;
    max-width: 320px;
    font-weight: 300;
  }

  .grid-bg {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(var(--border) 1px, transparent 1px),
      linear-gradient(90deg, var(--border) 1px, transparent 1px);
    background-size: 48px 48px;
    opacity: 0.4;
    mask-image: radial-gradient(ellipse at center, black 30%, transparent 75%);
  }

  /* Right form panel */
  .login-right {
    width: 480px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 60px 48px;
    background: var(--bg);
  }

  .form-wrapper {
    width: 100%;
    animation: slideUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  }
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .form-heading {
    font-family: 'Syne', sans-serif;
    font-size: 32px;
    font-weight: 700;
    margin-bottom: 8px;
    letter-spacing: -0.02em;
  }
  .form-sub {
    font-size: 14px;
    color: var(--muted);
    margin-bottom: 40px;
    font-weight: 300;
  }

  .field {
    margin-bottom: 20px;
  }
  .field label {
    display: block;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 8px;
  }
  .field input {
    width: 100%;
    background: var(--panel);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 14px 16px;
    font-size: 15px;
    font-family: 'DM Sans', sans-serif;
    color: var(--text);
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .field input:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(232, 255, 71, 0.1);
  }
  .field input::placeholder { color: var(--muted); }

  .error-msg {
    background: rgba(255, 95, 109, 0.1);
    border: 1px solid rgba(255, 95, 109, 0.3);
    border-radius: 6px;
    padding: 12px 16px;
    font-size: 13px;
    color: var(--error);
    margin-bottom: 20px;
  }

  .btn-login {
    width: 100%;
    background: var(--accent);
    color: #0a0a0f;
    border: none;
    border-radius: 6px;
    padding: 15px;
    font-size: 14px;
    font-weight: 700;
    font-family: 'DM Sans', sans-serif;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    cursor: pointer;
    transition: opacity 0.2s, transform 0.1s;
    margin-top: 8px;
  }
  .btn-login:hover:not(:disabled) { opacity: 0.88; }
  .btn-login:active:not(:disabled) { transform: scale(0.99); }
  .btn-login:disabled { opacity: 0.5; cursor: not-allowed; }

  .spinner {
    display: inline-block;
    width: 14px; height: 14px;
    border: 2px solid rgba(10,10,15,0.3);
    border-top-color: #0a0a0f;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
    vertical-align: middle;
    margin-right: 8px;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  @media (max-width: 768px) {
    .login-left { display: none; }
    .login-right { width: 100%; padding: 40px 28px; }
  }
`;

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3001/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          senha: password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Credenciais inválidas.");
        return;
      }

      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch {
      setError("Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="login-root">
        <div className="login-left">
          <div className="grid-bg" />
          <div className="brand-block">
            <div className="brand-tag">Autenticação JWT</div>
            <h1 className="brand-title">
              Acesso
              <br />
              <span>Seguro.</span>
            </h1>
            <p className="brand-desc">
              Tokens gerados com assinatura criptográfica. Sessões stateless,
              controle total sobre cada requisição.
            </p>
          </div>
        </div>

        <div className="login-right">
          <div className="form-wrapper">
            <h2 className="form-heading">Entrar</h2>
            <p className="form-sub">Informe suas credenciais para continuar.</p>

            {error && <div className="error-msg">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="field">
                <label htmlFor="email">E-mail</label>
                <input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>

              <div className="field">
                <label htmlFor="password">Senha</label>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>

              <button className="btn-login" type="submit" disabled={loading}>
                {loading && <span className="spinner" />}
                {loading ? "Autenticando..." : "Entrar"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
