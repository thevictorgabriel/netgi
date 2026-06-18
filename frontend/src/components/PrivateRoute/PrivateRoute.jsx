import { Navigate } from 'react-router-dom';

export function PrivateRoute({ children, requerAdmin }) {
  const isAuth = localStorage.getItem('@NetGi:auth');
  const role = localStorage.getItem('@NetGi:role');

  // Se não estiver autenticado, manda para o login
  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  // Se a rota exigir admin e o usuário não for admin, manda para a home
  if (requerAdmin && role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // Se passar nas validações, renderiza a página protegida
  return children;
}