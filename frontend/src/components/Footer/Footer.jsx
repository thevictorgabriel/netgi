import styles from "./Footer.module.css";
import { FaInstagram, FaEnvelope } from "react-icons/fa";

export function Footer() {
  const anoAtual = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* =========================
            SOBRE O NETGI
        ========================== */}

        <div className={styles.brandSection}>
          <h2>NetGi</h2>

          <p>
            O NETGI (Núcleo de Pesquisa em Economia, Tecnologia, Gestão e
            Inovação) é um grupo de pesquisa consolidado no âmbito do ICET
            (Instituto de Ciências Exatas e Tecnologia) da UFAM (Universidade
            Federal do Amazonas), sediado no Campus de Itacoatiara.
          </p>

          <p>
            Fundado em 2016, o núcleo reúne pesquisadores, estudantes e técnicos
            com o objetivo de promover estudos que integrem a universidade e o
            setor produtivo, fomentando o desenvolvimento regional.
          </p>
        </div>

        {/* =========================
            COORDENAÇÃO
        ========================== */}

        <div className={styles.footerColumn}>
          <h3>Coordenação</h3>

          <ul>
            <li>Rute Lopes</li>
            <li>Moises Israel</li>
            <li>Rute Lopes</li>
            <li>Moises Israel</li>
            <li>Rute Lopes</li>
          </ul>
        </div>

        {/* =========================
            PROJETOS
        ========================== */}

        <div className={styles.footerColumn}>
          <h3>Projetos</h3>

          <ul>
            <li>Café com Ciência</li>
            <li>Café com Fofoca</li>
            <li>Café com 3M</li>
          </ul>
        </div>

        {/* =========================
            CONTATO
        ========================== */}

        <div className={`${styles.footerColumn} ${styles.contactSection}`}>
          <h3>Contato</h3>

          <p className={styles.phone}>(92) 3533 - 2200</p>

          <div className={styles.socialIcons}>
            <a
              href="https://www.instagram.com/netgiufam/"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram do NETGI"
              title="Instagram"
            >
              <FaInstagram />
            </a>

            <a
              href="mailto:netgi207@gmail.com"
              aria-label="E-mail do NETGI"
              title="E-mail"
            >
              <FaEnvelope />
            </a>
          </div>
        </div>

        {/* =========================
            EVENTOS
        ========================== */}

        <div className={styles.footerColumn}>
          <h3>Eventos</h3>

          <ul>
            <li>CONIC 2026</li>
          </ul>
        </div>
      </div>

      {/* =========================
          COPYRIGHT
      ========================== */}

      <div className={styles.copyright}>
        <p>Copyright © {anoAtual} NETGI. All Rights Reserved.</p>
      </div>
    </footer>
  );
}
