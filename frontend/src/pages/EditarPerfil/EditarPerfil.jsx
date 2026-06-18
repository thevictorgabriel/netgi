import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Header } from '../../components/Header/Header';
import { Footer } from '../../components/Footer/Footer';
import styles from './EditarPerfil.module.css';

export function EditarPerfil() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({ 
    nome: '', telefone: '', curso: '', bio: '', linkedin: '', lattes: '' 
  });
  
  // Estados para lidar com o arquivo físico e a pré-visualização na tela
  const [fotoFile, setFotoFile] = useState(null);
  const [previewFoto, setPreviewFoto] = useState('');

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/profile', {
          method: 'GET',
          credentials: 'include'
        });

        if (response.status === 401) {
          navigate('/login');
          return;
        }

        const data = await response.json();
        setFormData({
          nome: data.nome || '',
          telefone: data.telefone || '',
          curso: data.curso || '',
          bio: data.bio || '',
          linkedin: data.linkedin || '',
          lattes: data.lattes || ''
        });
        
        // Se já tiver foto no banco, coloca na pré-visualização
        setPreviewFoto(data.foto || '');
      } catch (error) {
        console.error("Erro", error);
      } finally {
        setLoading(false);
      }
    };
    carregarDados();
  }, [navigate]);

  // Função que roda assim que você escolhe um arquivo no PC
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFotoFile(file);
      // Cria uma URL temporária para mostrar a foto na tela antes de salvar
      setPreviewFoto(URL.createObjectURL(file)); 
    }
  };

  const handleSalvar = async (e) => {
    e.preventDefault();
    
    // Constrói o pacote de dados misturando textos e o arquivo
    const dataToSend = new FormData();
    dataToSend.append('nome', formData.nome);
    dataToSend.append('telefone', formData.telefone);
    dataToSend.append('curso', formData.curso);
    dataToSend.append('bio', formData.bio);
    dataToSend.append('linkedin', formData.linkedin);
    dataToSend.append('lattes', formData.lattes);
    
    // Só anexa o arquivo se você tiver escolhido um novo
    if (fotoFile) {
      dataToSend.append('foto', fotoFile);
    }

    try {
      const response = await fetch('http://localhost:5000/api/profile', {
        method: 'PUT',
        credentials: 'include',
        body: dataToSend
        // ATENÇÃO: Nunca coloque 'Content-Type': 'multipart/form-data' aqui.
        // O fetch faz o cálculo dos bytes e define os "boundaries" automaticamente.
      });

      if (response.ok) {
        alert("Perfil atualizado com sucesso!");
        navigate('/perfil');
      } else {
        alert("Erro ao atualizar o perfil.");
      }
    } catch (error) {
      alert("Erro de conexão com o servidor.");
    }
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '5rem' }}>Carregando dados...</div>;

  return (
    <div className={styles.pageContainer}>
      <Header />
      <main className={styles.mainContent}>
        <div className={styles.profileWrapper}>
          <div className={styles.infoSection}>
            <form className={styles.form} onSubmit={handleSalvar}>
              
              {/* Seção de Pré-visualização e Upload da Foto */}
              <div style={{ textAlign: 'center', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                <img 
                  src={previewFoto || "https://via.placeholder.com/150"} 
                  alt="Sua foto de perfil" 
                  style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #ff6b00' }}
                />
                <input 
                  type="file" 
                  accept="image/png, image/jpeg, image/jpg" 
                  onChange={handleFileChange}
                  style={{ width: '200px' }}
                />
              </div>

              <div className={styles.inputGroup}>
                <label>NOME</label>
                <input type="text" value={formData.nome} onChange={(e) => setFormData({...formData, nome: e.target.value})} required />
              </div>

              <div className={styles.inputGroup}>
                <label>TELEFONE</label>
                <input type="text" value={formData.telefone} onChange={(e) => setFormData({...formData, telefone: e.target.value})} required />
              </div>

              <div className={styles.inputGroup}>
                <label>CURSO</label>
                <input type="text" value={formData.curso} onChange={(e) => setFormData({...formData, curso: e.target.value})} placeholder="Ex: Engenharia de Software" />
              </div>

              <div className={styles.inputGroup}>
                <label>LINKEDIN</label>
                <input type="text" value={formData.linkedin} onChange={(e) => setFormData({...formData, linkedin: e.target.value})} placeholder="linkedin.com/in/seu-perfil" />
              </div>

              <div className={styles.inputGroup}>
                <label>LATTES</label>
                <input type="text" value={formData.lattes} onChange={(e) => setFormData({...formData, lattes: e.target.value})} placeholder="lattes.cnpq.br/seu-id" />
              </div>

              <div className={styles.inputGroupArea}>
                <label>BIO</label>
                <textarea value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})} placeholder="Fale um pouco sobre você..." />
              </div>

              <div className={styles.formActions}>
                <Link to="/perfil" className={styles.btnCancel}>Cancelar</Link>
                <button type="submit" className={styles.btnSave}>Salvar</button>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}