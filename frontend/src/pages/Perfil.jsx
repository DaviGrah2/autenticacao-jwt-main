import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Perfil() {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      setError('Token não encontrado. Faça login novamente.');
      setLoading(false);
      return;
    }

    axios.get('http://localhost:3001/perfil', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setUsuario(res.data))
      .catch(err => {
        setError(err.response?.data?.mensagem || 'Erro ao carregar perfil.');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>{error}</p>;
  if (!usuario) return <p>Usuário não encontrado.</p>;

  return (
    <div>
      <h2>Minha Conta</h2>
      <p><strong>Nome:</strong> {usuario.nome}</p>
      <p><strong>E-mail:</strong> {usuario.email}</p>
      <p><strong>Membro desde:</strong> {new Date(usuario.criado_em).toLocaleDateString('pt-BR')}</p>
    </div>
  );
}
