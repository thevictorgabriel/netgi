import styles from './Footer.module.css';
import { FaInstagram, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

export function Footer() {
  const anoAtual = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        
        <div className={styles.brandSection}>
          <h3>NETGI</h3>
          <p>
            Núcleo de Pesquisa em Economia, Tecnologia, Gestão e Inovação. <br />
            Transformando conhecimento acadêmico em soluções de mercado.
          </p>
        </div>

        <div className={styles.contactSection}>
          <h3>Contato & Redes</h3>
          <div className={styles.socialIcons}>
            <a href="https://www.instagram.com/netgiufam/" target="_blank" rel="noreferrer" title="Instagram">
              <FaInstagram />
            </a>
            <a href="mailto:netgi207@gmail.com" title="E-mail">
              <FaEnvelope />
            </a>
          </div>
          <p className={styles.location}>
            <FaMapMarkerAlt /> ICET / UFAM - Itacoatiara, AM
          </p>
        </div>

      </div>
      
      <div className={styles.copyright}>
        <p>Copyright &copy; {anoAtual} NETGI. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}