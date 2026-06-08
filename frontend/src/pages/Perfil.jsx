import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Perfil() {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:3001/perfil', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setUsuario(res.data));
  }, []);

  if (!usuario) return <p>Carregando...</p>;

  return (
    <div>
      <h2>Minha Conta</h2>
      <p><strong>Nome:</strong> {usuario.nome}</p>
      <p><strong>E-mail:</strong> {usuario.email}</p>
      <p><strong>Membro desde:</strong> {new Date(usuario.criado_em).toLocaleDateString('pt-BR')}</p>
    </div>
  );
}
