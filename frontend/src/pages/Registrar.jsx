import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Registrar() {
  const [form, setForm] = useState({ nome: '', email: '', senha: '', confirmar: '' });
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (form.senha !== form.confirmar) {
      setErro('As senhas não coincidem.');
      return;
    }
    try {
      await axios.post('http://localhost:3001/registrar', {
        nome: form.nome,
        email: form.email,
        senha: form.senha,
      });
      navigate('/login');
    } catch (err) {
      setErro(err.response?.data?.mensagem || 'Erro ao cadastrar.');
    }
  };

  return (
    <div>
      <h2>Cadastro</h2>
      <input name="nome" placeholder="Nome" onChange={handleChange} />
      <input name="email" placeholder="E-mail" onChange={handleChange} />
      <input name="senha" type="password" placeholder="Senha" onChange={handleChange} />
      <input name="confirmar" type="password" placeholder="Confirmar Senha" onChange={handleChange} />
      {erro && <p style={{ color: 'red' }}>{erro}</p>}
      <button
        onClick={handleSubmit}
        disabled={!form.nome || !form.email || !form.senha || form.senha !== form.confirmar}
      >
        Cadastrar
      </button>
      <p>Já tem conta? <Link to="/login">Entrar</Link></p>
    </div>
  );
}
