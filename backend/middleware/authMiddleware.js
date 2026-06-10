import jwt from 'jsonwebtoken';
 
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>
 
  if (!token) {
    return res.status(401).json({ message: 'Token não fornecido.' });
  }
 
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    req.usuario = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ mensagem: 'Token inválido ou expirado.' });
  }
};
 
export default authMiddleware;
 