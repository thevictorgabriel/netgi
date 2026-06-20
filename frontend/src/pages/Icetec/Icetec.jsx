import { Header } from '../../components/Header/Header';
import { Footer } from '../../components/Footer/Footer';
import imgIcetec from '../../assets/Icetec.png';
import imgIcetUfam from '../../assets/icetUFAM.jpeg';
import styles from './Icetec.module.css';

export function Icetec() {
  return (
    <div className={styles.pageContainer}>
      <Header />
      
      <main className={styles.mainContent}>
        <div className={styles.heroSection}>
          <h1 className={styles.title}>Conheça a ICETec</h1>
          <p className={styles.subtitle}>
            Incubadora do Instituto de Ciências Exatas e Tecnologia da UFAM.
          </p>
        </div>

        <section className={styles.contentSection}>
          <div className={styles.textBlock}>
            <h2>O que é a ICETec?</h2>
            <p>
              A Incubadora do Instituto de Ciências Exatas e Tecnologia (ICETec) está vinculada ao ICET da Universidade Federal do Amazonas, localizada no município de Itacoatiara. A administração completa da incubadora — englobando a Coordenação Geral, a Coordenação Técnica e a Secretaria Executiva — compete ao Núcleo de Pesquisa em Economia, Tecnologia, Gestão e Inovação (NETGI).
            </p>
            <p>
              A sua finalidade central é contribuir para a criação e consolidação de empreendimentos e empresas nascentes. O foco abrange aspectos tecnológicos, de gestão, mercadológicos e de recursos humanos, visando o fortalecimento e a melhoria do desempenho desses negócios no mercado.
            </p>
          </div>

          {/* PRIMEIRA IMAGEM */}
          <div className={styles.imageContainer}>
            <img 
              src={imgIcetec} 
              alt="Logo ou Imagem da ICETec" 
              className={styles.contentImage} 
            />
            <span className={styles.imageCaption}>Espaço dedicado ao desenvolvimento tecnológico e inovação.</span>
          </div>

          <div className={styles.textBlock}>
            <h2>Como Funciona a Incubação?</h2>
            <p>
              A ICETec adota as modalidades de incubação residente e associada. O prazo de incubação para ambas as modalidades é de 24 (vinte e quatro) meses, podendo ser prorrogado por mais um período de até 12 (doze) meses, totalizando um limite máximo de 36 meses de apoio.
            </p>
            <p>
              Os projetos acolhidos pela incubadora devem atuar preferencialmente em áreas estratégicas de base tecnológica ou tecnologia tradicional, tais como:
            </p>
            <ul className={styles.areasList}>
              <li>Informática (software, bioinformática e robótica)</li>
              <li>Agronegócios (com ênfase em produtos alimentícios)</li>
              <li>Biotecnologia, Farmacologia e Química Fina</li>
              <li>Energia convencional, renovável e eficiência energética</li>
              <li>Tecnologia educacional e serviços técnicos especializados</li>
            </ul>
          </div>

          {/* SEGUNDA IMAGEM */}
          <div className={styles.imageContainer}>
            <img 
              src={imgIcetUfam} 
              alt="Instituto de Ciências Exatas e Tecnologia - UFAM" 
              className={styles.contentImage} 
            />
            <span className={styles.imageCaption}>Apoio direto na transformação de projetos em novos produtos e processos.</span>
          </div>

          <div className={styles.textBlock}>
            <h2>Apoio Estratégico</h2>
            <p>
              O principal objetivo da infraestrutura fornecida pela ICETec e seus parceiros é facilitar a transformação de ideias em novos produtos ou processos mercadológicos. Além do espaço físico, a incubadora fornece assessoria gerencial e propicia aos empreendedores condições favoráveis para um desenvolvimento empresarial acelerado e sadio, ajudando-os a alcançar o mercado de forma eficiente.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}