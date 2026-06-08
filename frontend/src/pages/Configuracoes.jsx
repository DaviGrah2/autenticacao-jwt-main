import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Configuracoes() {
  const [form, setForm] = useState({
    senhaAtual: "",
    novaSenha: "",
    confirmar: "",
  });
  const [msg, setMsg] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (form.novaSenha !== form.confirmar) {
      setMsg("As senhas novas não coincidem.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        "http://localhost:3001/configuracoes/senha",
        {
          senhaAtual: form.senhaAtual,
          novaSenha: form.novaSenha,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setMsg(res.data.mensagem);
    } catch (err) {
      setMsg(err.response?.data?.mensagem || "Erro ao atualizar.");
    }
  };

  return (
    <div>
      <button onClick={() => navigate("/dashboard")}>
        ← Voltar ao Dashboard
      </button>

      <h2>Segurança</h2>

      <input
        name="senhaAtual"
        type="password"
        placeholder="Senha atual"
        onChange={handleChange}
      />

      <input
        name="novaSenha"
        type="password"
        placeholder="Nova senha"
        onChange={handleChange}
      />

      <input
        name="confirmar"
        type="password"
        placeholder="Confirmar nova senha"
        onChange={handleChange}
      />

      {msg && <p>{msg}</p>}

      <button onClick={handleSubmit}>Atualizar Senha</button>
    </div>
  );
}
