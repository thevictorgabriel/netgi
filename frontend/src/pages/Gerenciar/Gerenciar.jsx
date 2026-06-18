import { useEffect, useState } from 'react';
import { Header } from '../../components/Header/Header';
import { Footer } from '../../components/Footer/Footer';
import styles from './Gerenciar.module.css';

export function Gerenciar() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const carregarUsuarios = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/usuarios-pendentes', {
        method: 'GET',
        credentials: 'include' // OBRIGATÓRIO: Envia a sessão do admin
      });
      
      if (response.ok) {
        const data = await response.json();
        setUsuarios(data);
      }
    } catch (error) {
      console.error("Erro ao carregar usuários", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAprovar = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/aprovar/${id}`, {
        method: 'PUT',
        credentials: 'include'
      });
      
      if (response.ok) {
        setUsuarios(usuarios.filter(u => u.id !== id));
        alert("Usuário aprovado com sucesso!");
      } else {
        alert("Erro ao aprovar usuário.");
      }
    } catch (error) {
      alert("Erro de conexão ao aprovar.");
    }
  };

  const handleRejeitar = async (id) => {
    // Alerta de confirmação nativo do navegador
    if(!window.confirm("Tem certeza que deseja rejeitar e apagar permanentemente este usuário?")) return;
    
    try {
      const response = await fetch(`http://localhost:5000/api/admin/rejeitar/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      if (response.ok) {
        setUsuarios(usuarios.filter(u => u.id !== id));
        alert("Usuário removido do sistema.");
      } else {
        alert("Erro ao rejeitar usuário.");
      }
    } catch (error) {
      alert("Erro de conexão ao rejeitar.");
    }
  };

  return (
    <div className={styles.pageContainer}>
      <Header />

      <main className={styles.mainContent}>
        <div className={styles.adminPanel}>
          <h2>Solicitações de Cadastro</h2>

          {loading ? (
             <p style={{ textAlign: 'center', marginTop: '2rem' }}>Carregando solicitações...</p>
          ) : usuarios.length === 0 ? (
            <p className={styles.emptyMessage}>Nenhuma solicitação pendente no momento.</p>
          ) : (
            <div className={styles.userList}>
              {usuarios.map(usuario => (
                <div key={usuario.id} className={styles.userCard}>
                  <div className={styles.userData}>
                    <strong>{usuario.nome}</strong>
                    <span>{usuario.email}</span>
                    <span>{usuario.telefone}</span>
                  </div>
                  <div className={styles.userActions}>
                    <button onClick={() => handleRejeitar(usuario.id)} className={styles.btnReject}>Rejeitar</button>
                    <button onClick={() => handleAprovar(usuario.id)} className={styles.btnApprove}>Aprovar</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}