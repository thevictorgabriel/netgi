import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../../components/Header/Header';
import { Footer } from '../../components/Footer/Footer';
import styles from './TrocaChave.module.css';

export function TrocaChave() {
  const [labData, setLabData] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState('');
  const navigate = useNavigate();

  const carregarDados = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/lab', { credentials: 'include' });
      if (response.ok) {
        setLabData(await response.json());
      }
    } catch (err) {
      console.error(err);
    }
  };

  const carregarUsuarios = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/usuarios/aprovados', { credentials: 'include' });
      if (response.ok) {
        setUsuarios(await response.json());
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    // Se não estiver logado, não pode acessar a troca de chaves
    if (!localStorage.getItem('@NetGi:auth')) {
      navigate('/login');
      return;
    }
    carregarDados();
    carregarUsuarios();
  }, [navigate]);

  const executarAcao = async (acao, novo_portador_id = null) => {
    try {
      const response = await fetch('http://localhost:5000/api/lab/acao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ acao, novo_portador_id })
      });
      
      if (response.ok) {
        carregarDados(); // Recarrega a tela para mostrar a mudança instantaneamente

        //Avisa o Header para se atualizar
        window.dispatchEvent(new Event('labStatusChanged'));

        if (acao === 'devolver_guarita') {
          alert("Chave devolvida e laboratório trancado com sucesso.");
        }
      } else {
        const data = await response.json();
        alert(data.erro || "Erro ao realizar ação.");
      }
    } catch (error) {
      alert("Erro de conexão.");
    }
  };

  if (!labData) return <div style={{ textAlign: 'center', marginTop: '3rem' }}>Carregando...</div>;

  return (
    <div className={styles.pageContainer}>
      <Header />
      <main className={styles.mainContent}>
        <div className={styles.cardInfo}>
          <h2>Status Atual da Chave</h2>
          
          <div className={styles.statusGeral}>
            <p>Laboratório está: <strong>{labData.status}</strong></p>
            <p>A chave está com: <strong>{labData.is_me ? "VOCÊ" : labData.nome_portador}</strong></p>
          </div>

          <div className={styles.painelAcoes}>
            
            {/* CENÁRIO 1: Chave na Guarita */}
            {labData.portador_id === null && (
              <button className={styles.btnPegar} onClick={() => executarAcao('pegar_guarita')}>
                Pegar Chave na Guarita
              </button>
            )}

            {/* CENÁRIO 2: A chave está comigo */}
            {labData.is_me && (
              <div className={styles.minhasAcoes}>
                <button 
                  className={labData.status === 'FECHADO' ? styles.btnAbrir : styles.btnFechar} 
                  onClick={() => executarAcao('toggle_status')}
                >
                  {labData.status === 'FECHADO' ? 'Abrir Laboratório' : 'Fechar Laboratório'}
                </button>

                <hr className={styles.divisor} />

                <div className={styles.transferGroup}>
                  <select 
                    value={usuarioSelecionado} 
                    onChange={(e) => setUsuarioSelecionado(e.target.value)}
                    className={styles.selectUser}
                  >
                    <option value="">Transferir para outro membro...</option>
                    {usuarios.map(u => (
                      <option key={u.id} value={u.id}>{u.nome}</option>
                    ))}
                  </select>
                  <button 
                    className={styles.btnTransferir}
                    onClick={() => {
                      if (!usuarioSelecionado) return alert("Selecione um usuário primeiro.");
                      executarAcao('transferir', parseInt(usuarioSelecionado));
                    }}
                  >
                    Transferir
                  </button>
                </div>

                <hr className={styles.divisor} />

                <button className={styles.btnDevolver} onClick={() => executarAcao('devolver_guarita')}>
                  Devolver na Guarita (Tranca automático)
                </button>
              </div>
            )}

            {/* CENÁRIO 3: A chave está com outra pessoa */}
            {!labData.is_me && labData.portador_id !== null && (
              <p className={styles.avisoOcupado}>
                Você não pode realizar ações porque a chave está sendo mantida por {labData.nome_portador}.
              </p>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}