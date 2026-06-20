import { useEffect, useState } from 'react';
import { Header } from '../../components/Header/Header';
import { Footer } from '../../components/Footer/Footer';
import styles from './Editais.module.css';

export function Editais() {
  const isAuth = localStorage.getItem('@NetGi:auth'); // Verifica se está logado
  const [eventos, setEventos] = useState([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [formData, setFormData] = useState({
    id: '', tipo: 'evento', titulo: '', descricao: '', link: '', data_inicio: '', data_fim: '', horario: ''
  });
  const [arquivo, setArquivo] = useState(null);

  const carregarEventos = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/eventos');
      if (response.ok) setEventos(await response.json());
    } catch (err) { console.error(err); }
  };

  useEffect(() => { carregarEventos(); }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (arquivo) data.append('imagem', arquivo);

    try {
      const response = await fetch('http://localhost:5000/api/eventos', {
        method: 'POST', credentials: 'include', body: data
      });
      if (response.ok) {
        alert("Salvo com sucesso!");
        setMostrarForm(false);
        setFormData({ id: '', tipo: 'evento', titulo: '', descricao: '', link: '', data_inicio: '', data_fim: '', horario: '' });
        setArquivo(null);
        carregarEventos();
      }
    } catch (err) { alert("Erro ao salvar."); }
  };

  const editarEvento = (evento) => {
    setFormData(evento);
    setMostrarForm(true);
    window.scrollTo(0, 0);
  };

  const deletarEvento = async (id) => {
    if (!window.confirm("Certeza que deseja excluir?")) return;
    try {
      await fetch(`http://localhost:5000/api/eventos/${id}`, { method: 'DELETE', credentials: 'include' });
      carregarEventos();
    } catch (err) { alert("Erro ao deletar."); }
  };

  return (
    <div className={styles.pageContainer}>
      <Header />
      <main className={styles.mainContent}>
        <div className={styles.headerSecao}>
          <h2>Eventos, Palestras e Editais</h2>
          {isAuth && (
            <button className={styles.btnNovo} onClick={() => {
                setFormData({ id: '', tipo: 'evento', titulo: '', descricao: '', link: '', data_inicio: '', data_fim: '', horario: '' });
                setMostrarForm(!mostrarForm);
            }}>
              {mostrarForm ? 'Cancelar' : '+ Adicionar Novo'}
            </button>
          )}
        </div>

        {/* FORMULÁRIO (SÓ APARECE SE LOGADO E CLICAR NO BOTÃO) */}
        {mostrarForm && isAuth && (
          <form className={styles.formCard} onSubmit={handleSubmit}>
            <h3>{formData.id ? 'Editar Atividade' : 'Nova Atividade'}</h3>
            <div className={styles.inputGroupRow}>
              <select name="tipo" value={formData.tipo} onChange={handleChange} required>
                <option value="evento">Evento</option>
                <option value="palestra">Palestra</option>
                <option value="edital">Edital</option>
                <option value="outros">Outros</option>
              </select>
              <input type="text" name="titulo" placeholder="Título" value={formData.titulo} onChange={handleChange} required />
            </div>
            
            <textarea name="descricao" placeholder="Descrição da atividade..." value={formData.descricao} onChange={handleChange} required rows="3" />
            
            <div className={styles.inputGroupRow}>
              <input type="date" name="data_inicio" value={formData.data_inicio} onChange={handleChange} required />
              <input type="date" name="data_fim" title="Data Final (Opcional)" value={formData.data_fim || ''} onChange={handleChange} />
              <input type="time" name="horario" value={formData.horario || ''} onChange={handleChange} />
            </div>

            <div className={styles.inputGroupRow}>
              <input type="url" name="link" placeholder="Link (Ex: Inscrição ou PDF)" value={formData.link || ''} onChange={handleChange} />
              <input type="file" accept="image/*" onChange={(e) => setArquivo(e.target.files[0])} />
            </div>

            <button type="submit" className={styles.btnSalvar}>Salvar Atividade</button>
          </form>
        )}

        {/* MURAL PÚBLICO */}
        <div className={styles.gridEventos}>
          {eventos.length === 0 ? <p>Nenhuma atividade cadastrada no momento.</p> : eventos.map(ev => (
            <div key={ev.id} className={styles.cardEvento}>
              {ev.imagem && <img src={ev.imagem} alt="Capa" className={styles.imgEvento} />}
              <div className={styles.cardBody}>
                <span className={styles.badge}>{ev.tipo.toUpperCase()}</span>
                <h3>{ev.titulo}</h3>
                <p className={styles.dataTag}>📅 {ev.data_inicio} {ev.data_fim && `até ${ev.data_fim}`} {ev.horario && `| ⏰ ${ev.horario}`}</p>
                <p className={styles.descricao}>{ev.descricao}</p>
                
                <div className={styles.acoesBase}>
                  {ev.link && <a href={ev.link} target="_blank" rel="noreferrer" className={styles.btnLink}>Acessar Link</a>}
                  
                  {isAuth && (
                    <div className={styles.acoesAdmin}>
                      <button onClick={() => editarEvento(ev)} className={styles.btnEditar}>Editar</button>
                      <button onClick={() => deletarEvento(ev.id)} className={styles.btnDeletar}>Excluir</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}