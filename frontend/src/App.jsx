import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Registrar from './pages/Registrar';
import Perfil from './pages/Perfil';
import Configuracoes from './pages/Configuracoes';
import Requisicoes from './pages/Requisicoes';
import Usuarios from './pages/Usuarios';
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/registrar" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registrar" element={<Registrar />} />

        {/* Rotas protegidas */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/requisicoes" element={<ProtectedRoute><Requisicoes /></ProtectedRoute>} />
        <Route path="/configuracoes" element={<ProtectedRoute><Configuracoes /></ProtectedRoute>} />
        <Route path="/usuarios" element={<ProtectedRoute><Usuarios /></ProtectedRoute>} />  {/* ← adicionar */}
        <Route path="/configuracoes/perfil" element={<ProtectedRoute><Perfil /></ProtectedRoute>} />  {/* ← adicionar */}
      </Routes>
    </BrowserRouter>
  );
}