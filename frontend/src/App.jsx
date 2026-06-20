import { Routes, Route } from 'react-router-dom';
import { PrivateRoute } from './components/PrivateRoute/PrivateRoute';
import { Home } from './pages/Home/Home';
import { Login } from './pages/Login/Login';
import { Cadastro } from './pages/Cadastro/Cadastro';
import { Perfil } from './pages/Perfil/Perfil';
import { EditarPerfil } from './pages/EditarPerfil/EditarPerfil';
import { Gerenciar } from './pages/Gerenciar/Gerenciar';
import { Membros } from './pages/Membros/Membros';
import { TrocaChave } from './pages/TrocaChave/TrocaChave';
import { Editais } from './pages/Editais/Editais';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />

      <Route path="/membros" element={<Membros />} />
      <Route path="/editais" element={<Editais />} />
      
      {/* Rotas Protegidas para Usuários Logados */}
      <Route path="/perfil" element={<PrivateRoute><Perfil /></PrivateRoute>} />
      <Route path="/perfil/editar" element={<PrivateRoute><EditarPerfil /></PrivateRoute>} />
      <Route path="/troca-chave" element={<PrivateRoute><TrocaChave /></PrivateRoute>} /> {/* <- ADICIONADO AQUI */}
      
      {/* Rota Protegida Exclusiva para o Admin */}
      <Route path="/gerenciar" element={<PrivateRoute requerAdmin={true}><Gerenciar /></PrivateRoute>} />
      
      <Route path="*" element={
        <div style={{ padding: '2rem', textAlign: 'center' }}><h2>Página não encontrada (404)</h2></div>
      } />
    </Routes>
  );
}

export default App;