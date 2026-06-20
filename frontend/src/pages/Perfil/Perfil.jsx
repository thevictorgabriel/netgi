import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Header } from '../../components/Header/Header';
import { Footer } from '../../components/Footer/Footer';
import styles from './Perfil.module.css';
import IconePerfil from '../../assets/IconePerfil.png';

export function Perfil() {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const carregarPerfil = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/profile', {
          method: 'GET',
          credentials: 'include' // O navegador envia o cookie automaticamente
        });

        if (response.status === 401) {
          localStorage.clear();
          navigate('/login');
          return;
        }

        const data = await response.json();
        setUsuario(data);
      } catch (err) {
        console.error("Erro ao carregar:", err);
      } finally {
        setLoading(false);
      }
    };

    carregarPerfil();
  }, [navigate]);

  const handleLogout = async () => {
    await fetch('http://localhost:5000/api/logout', { method: 'POST', credentials: 'include' });
    localStorage.clear();
    navigate('/login');
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '5rem' }}>Carregando...</div>;
  if (!usuario) return <div style={{ textAlign: 'center', marginTop: '5rem' }}>Erro ao carregar perfil. <button onClick={handleLogout}>Sair</button></div>;

  return (
    <div className={styles.pageContainer}>
      <Header />
      <main className={styles.mainContent}>
        <div className={styles.profileWrapper}>
          <div className={styles.photoSection}>
            <img
              src={usuario.foto ? `http://localhost:5000/static/uploads/${usuario.foto}` : IconePerfil}
              alt="Meu Perfil"
              className={styles.profileImage} /* Mantenha sua classe CSS */
            />
          </div>
          <div className={styles.infoSection}>
            <div className={styles.headerInfo}>
              <div className={styles.nameEmail}>
                <h2>{usuario.nome}</h2>
                <span className={styles.email}>{usuario.email}</span>
              </div>
              <div className={styles.course}>
                <span>{usuario.curso || "Curso não informado"}</span>
              </div>
            </div>
            <div className={styles.bioBox}>
              <p>{usuario.bio || "Nenhuma biografia informada ainda."}</p>
            </div>
            <div className={styles.actionButtons}>
              <Link to="/perfil/editar" className={styles.btnDefault}>Editar</Link>
              <button onClick={handleLogout} style={{ backgroundColor: '#ff4d4d', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '20px', cursor: 'pointer' }}>Sair da Conta</button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}