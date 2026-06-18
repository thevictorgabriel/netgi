import { Navigate } from 'react-router-dom';

export function PrivateRoute({ children }) {
  // Agora procuramos a nova variável de sessão, e não mais o token!
  const isAuth = localStorage.getItem('@NetGi:auth');

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  return children;
}