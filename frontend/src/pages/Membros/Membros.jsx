import { useEffect, useState } from 'react';
import { Header } from '../../components/Header/Header';
import { Footer } from '../../components/Footer/Footer';
import styles from './Membros.module.css';

export function Membros() {
  const [membros, setMembros] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Verifica se o visitante é o administrador
  const role = localStorage.getItem('@NetGi:role');
  const isAdmin = role === 'admin';

  useEffect(() => {
    carregarMembros();
  }, []);

  const carregarMembros = async () => {
    try {
      // Como é pública, não precisa de credentials: 'include' obrigatoriamente, 
      // mas mantemos o padrão fetch limpo.
      const response = await fetch('http://localhost:5000/api/membros');
      
      if (response.ok) {
        const data = await response.json();
        setMembros(data);
      }
    } catch (error) {
      console.error("Erro ao carregar membros:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletar = async (id, nome) => {
    if (!window.confirm(`Tem certeza que deseja APAGAR o membro ${nome} permanentemente?`)) return;

    try {
      const response = await fetch(`http://localhost:5000/api/admin/membros/${id}`, {
        method: 'DELETE',
        credentials: 'include' // OBRIGATÓRIO: Envia a sessão do admin para validar
      });

      if (response.ok) {
        // Atualiza a tela removendo o membro deletado
        setMembros(membros.filter(m => m.id !== id));
        alert("Membro removido do sistema.");
      } else {
        alert("Erro ao excluir. Você precisa ser administrador.");
      }
    } catch (error) {
      alert("Erro de conexão com o servidor.");
    }
  };

  return (
    <div className={styles.pageContainer}>
      <Header />

      <main className={styles.mainContent}>
        <div className={styles.membrosWrapper}>
          <h2 className={styles.title}>Membros do Laboratório</h2>

          {loading ? (
            <p style={{ textAlign: 'center' }}>Carregando membros...</p>
          ) : membros.length === 0 ? (
            <p style={{ textAlign: 'center' }}>Nenhum membro aprovado ainda.</p>
          ) : (
            <div className={styles.gridMembros}>
              {membros.map(membro => (
                <div key={membro.id} className={styles.membroCard}>
                  
                  <img 
                    src={membro.foto || "https://via.placeholder.com/100"} 
                    alt={membro.nome} 
                    className={styles.membroFoto}
                  />
                  
                  <h3 className={styles.membroNome}>
                    {membro.nome} 
                    {membro.role === 'admin' && <span className={styles.badgeAdmin}>Admin</span>}
                  </h3>
                  
                  <p className={styles.membroCurso}>{membro.curso || "Curso não informado"}</p>
                  
                  {membro.bio && <p className={styles.membroBio}>"{membro.bio}"</p>}

                  <div className={styles.membroLinks}>
                    {membro.linkedin && <a href={membro.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>}
                    {membro.lattes && <a href={membro.lattes} target="_blank" rel="noreferrer">Lattes</a>}
                  </div>

                  {/* Renderização Condicional: Só aparece se o visitante for admin e o usuário não for ele mesmo */}
                  {isAdmin && membro.role !== 'admin' && (
                    <button 
                      onClick={() => handleDeletar(membro.id, membro.nome)} 
                      className={styles.btnDeletar}
                    >
                      Remover Membro
                    </button>
                  )}
                  
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