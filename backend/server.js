import pool from './db.js';
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
import authMiddleware from './middleware/authMiddleware.js';
const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Servidor funcionando');
});

// ─── REGISTRAR ───────────────────────────────────────────
app.post('/registrar', async (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha)
    return res.status(400).json({ mensagem: 'Preencha todos os campos.' });

  try {
    // Verifica duplicidade
    const existe = await pool.query('SELECT id FROM usuarios WHERE email = $1', [email]);
    if (existe.rows.length > 0)
      return res.status(400).json({ mensagem: 'E-mail já cadastrado.' });

    const senha_hash = await bcrypt.hash(senha, 10);

    await pool.query(
      'INSERT INTO usuarios (nome, email, senha_hash) VALUES ($1, $2, $3)',
      [nome, email, senha_hash]
    );

    res.status(201).json({ mensagem: 'Usuário criado com sucesso!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensagem: 'Erro interno no servidor.' });
  }
});

// ─── LOGIN ────────────────────────────────────────────────
app.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  try {
    const resultado = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);

    if (resultado.rows.length === 0)
      return res.status(401).json({ mensagem: 'Credenciais inválidas.' });

    const usuario = resultado.rows[0];
    const senhaOk = await bcrypt.compare(senha, usuario.senha_hash);

    if (!senhaOk)
      return res.status(401).json({ mensagem: 'Credenciais inválidas.' });

    const token = jwt.sign(
      { id: usuario.id, nome: usuario.nome, email: usuario.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    console.log("Token gerado:", token);
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensagem: 'Erro interno no servidor.' });
  }
});

// ─── PERFIL (protegida) ────────────────────────────────────
app.get('/perfil', authMiddleware, async (req, res) => {
  try {
    const resultado = await pool.query(
      'SELECT nome, email, criado_em FROM usuarios WHERE id = $1',
      [req.usuario.id]
    );
    res.json(resultado.rows[0]);
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao buscar perfil.' });
  }
});

// ─── ATUALIZAR SENHA (protegida) ───────────────────────────
app.put('/configuracoes/senha', authMiddleware, async (req, res) => {
  const { senhaAtual, novaSenha } = req.body;

  try {
    const resultado = await pool.query('SELECT senha_hash FROM usuarios WHERE id = $1', [req.usuario.id]);
    const usuario = resultado.rows[0];

    const senhaOk = await bcrypt.compare(senhaAtual, usuario.senha_hash);
    if (!senhaOk)
      return res.status(400).json({ mensagem: 'Senha atual incorreta.' });

    const novoHash = await bcrypt.hash(novaSenha, 10);
    await pool.query('UPDATE usuarios SET senha_hash = $1 WHERE id = $2', [novoHash, req.usuario.id]);

    res.json({ mensagem: 'Senha atualizada com sucesso!' });
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao atualizar senha.' });
  }
});

app.listen(3001, () => console.log('Servidor rodando na porta 3001'));

export default (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer TOKEN"

  if (!token)
    return res.status(401).json({ mensagem: 'Token não fornecido.' });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = payload;
    next();
  } catch {
    res.status(403).json({ mensagem: 'Token inválido ou expirado.' });
  }
};