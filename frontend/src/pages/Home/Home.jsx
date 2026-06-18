import { Header } from '../../components/Header/Header';
import { Footer } from '../../components/Footer/Footer';
import { ContentBlock } from '../../components/ContentBlock/ContentBlock';
import styles from './Home.module.css';

// Importe suas imagens do "MacBook Pro 16_ - 1.jpg" aqui
// import brainImg from '../../assets/brain-lightbulb.png';
// import icetecLogo from '../../assets/icetec-logo.png';

export function Home() {
  return (
    <div className={styles.pageContainer}>
      <Header />

      <main className={styles.mainContent}>
        {/* Seção Hero (Título Principal) */}
        <section className={styles.hero}>
          <h1>Núcleo Pesquisa de Economia, Tecnologia, Gestão e Inovação</h1>
          <div className={styles.heroBackground}>
            {/* Imagem do cérebro/lâmpada da referência iria aqui */}
          </div>
        </section>

        {/* Blocos de Conteúdo baseados no layout */}
        <ContentBlock 
          title="Cowork como Espaço Físico Universitário"
          description="Funcionando como um laboratório prático e ambiente de coworking acadêmico, o núcleo oferece infraestrutura para que estudantes desenvolvam projetos científicos e de negócios."
          // image={brainImg}
          reverse={false}
        />

        <div className={styles.subBlocks}>
          <ContentBlock 
            title="Projetos de Inovação"
            description="Desenvolvimento de soluções nas áreas de automação, robótica e Indústria 4.0."
            // icon={rocketIcon}
          />
          <ContentBlock 
            title="Empreendedorismo"
            description="Incubação de ideias e startups nascidas no ambiente acadêmico."
            // icon={peopleIcon}
          />
        </div>

        <ContentBlock 
          title=""
          description="A ICETec é a incubadora de empresas localizada no campus... Seu principal objetivo é transformar conhecimento acadêmico em inovação de mercado."
          // image={icetecLogo}
          reverse={true}
        />
      </main>

      <Footer />
    </div>
  );
}