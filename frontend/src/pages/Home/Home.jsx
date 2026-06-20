import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../../components/Header/Header';
import { Footer } from '../../components/Footer/Footer';
import imgLetreiro from '../../assets/Letreiro.png';
import imgIcetec from '../../assets/Icetec.png';
import IconePerfil from '../../assets/IconePerfil.png';
import styles from './Home.module.css';

export function Home() {
  const [atividades, setAtividades] = useState([]);
  const [membros, setMembros] = useState([]);

  useEffect(() => {
    // Busca os eventos para o carrossel
    fetch('http://localhost:5000/api/eventos')
      .then(res => res.ok ? res.json() : [])
      .then(data => setAtividades(data.slice(0, 5)))
      .catch(console.error);

    // Busca os membros aprovados para o carrossel
    fetch('http://localhost:5000/api/usuarios/aprovados', { credentials: 'include' })
      .then(res => res.ok ? res.json() : [])
      .then(data => setMembros(data))
      .catch(console.error);
  }, []);

  return (
    <div className={styles.pageContainer}>
      <Header />
      
      <main className={styles.mainContent}>
        
        {/* SEÇÃO 1: HERO (TÍTULO E LETREIRO) */}
        <section className={styles.heroSection}>
          <div className={styles.heroWrapper}>
            <h1 className={styles.mainTitle}>Núcleo de Pesquisa em Economia, Tecnologia, Gestão e Inovação</h1>
            <img src={imgLetreiro} alt="NETGI" className={styles.letreiroImage} />
            <p className={styles.heroText}>
              O NETGI é um organismo de caráter transdisciplinar focado na organização e coordenação de ações, atividades e programas por meio do ensino, da pesquisa e da extensão no Instituto de Ciências Exatas e Tecnologia (ICET).
            </p>
          </div>
        </section>

        {/* SEÇÃO 2: FUNCIONAMENTO E DETALHES (Fundo Cinza) */}
        <section className={`${styles.infoSection} ${styles.bgLight}`}>
          <div className={styles.sectionWrapper}>
            <h2>Cowork como Espaço Físico Universitário</h2>
            <p className={styles.infoText}>
              Funcionando como um laboratório prático e ambiente de coworking acadêmico, o núcleo está localizado no município de Itacoatiara (AM), oferecendo infraestrutura para que estudantes desenvolvam projetos científicos e de negócios, mantendo estreitas interações com os diversos cursos do ICET.
            </p>
            <div className={styles.featuresGrid}>
              <div className={styles.featureCard}>
                <h3>🚀 Projetos de Inovação</h3>
                <p>Desenvolvimento de soluções nas áreas de automação, robótica e Indústria 4.0.</p>
              </div>
              <div className={styles.featureCard}>
                <h3>🤝 Empreendedorismo</h3>
                <p>Aproximação entre universidade-empresa e incubação de ideias nascidas no ambiente acadêmico.</p>
              </div>
              <div className={styles.featureCard}>
                <h3>🔍 Pesquisa Aplicada</h3>
                <p>Conexão entre a teoria de sala de aula e a realidade do mercado e do Polo Industrial.</p>
              </div>
            </div>
          </div>
        </section>

        {/* SEÇÃO 3: CARROSSEL DE EVENTOS/EDITAIS */}
        <section className={styles.carouselSection}>
          <div className={styles.sectionWrapper}>
            <div className={styles.sectionHeader}>
              <h2>Mural de Atividades</h2>
              <Link to="/editais" className={styles.btnAction}>Ver Todos os Editais</Link>
            </div>
            
            <div className={styles.carouselContainer}>
              {atividades.length === 0 ? (
                <p>Nenhuma atividade recente.</p>
              ) : (
                atividades.map(ativ => (
                  <div key={ativ.id} className={styles.atividadeCard}>
                    <span className={styles.badge}>{ativ.tipo.toUpperCase()}</span>
                    <h4>{ativ.titulo}</h4>
                    <p className={styles.dateInfo}>📅 {ativ.data_inicio}</p>
                    <p className={styles.descPreview}>{ativ.descricao}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* SEÇÃO 4: ICETEC (Fundo Cinza) */}
        <section className={`${styles.icetecSection} ${styles.bgLight}`}>
          <div className={styles.sectionWrapper}>
            <div className={styles.icetecLayout}>
              <div className={styles.icetecText}>
                <img src={imgIcetec} alt="Logo ICETec" className={styles.icetecLogoInline} />
                <h2>Incubadora de Empresas</h2>
                <p>
                  A ICETec tem como principal objetivo transformar conhecimento acadêmico em inovação de mercado. Oferecemos suporte estrutural, gerencial e metodológico para a criação e consolidação de startups e empreendimentos de base tecnológica, social ou tradicional.
                </p>
                <Link to="/icetec" className={styles.btnActionIcetec}>Conheça a ICETec</Link>
              </div>
            </div>
          </div>
        </section>

        {/* SEÇÃO 5: CARROSSEL CONTÍNUO DE MEMBROS */}
        <section className={styles.carouselSection}>
          <div className={styles.sectionWrapper}>
            <div className={styles.sectionHeader}>
              <h2>Nossa Equipe</h2>
              <Link to="/membros" className={styles.btnAction}>Ver Todos os Membros</Link>
            </div>
            
            {membros.length === 0 ? (
              <p>Faça login para visualizar os membros.</p>
            ) : (
              <div className={styles.marqueeContainer}>
                <div className={styles.marqueeTrack}>
                  {/* Duplicamos a lista para criar a ilusão de rolagem infinita */}
                  {[...membros, ...membros].map((membro, index) => (
                    <div key={`${membro.id}-${index}`} className={styles.membroCard}>
                      <img 
                        src={membro.foto ? `http://localhost:5000/static/uploads/${membro.foto}` : IconePerfil} 
                        alt={membro.nome} 
                        className={styles.membroFoto} 
                      />
                      <h4>{membro.nome}</h4>
                      <p>{membro.curso || 'Membro NETGI'}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}