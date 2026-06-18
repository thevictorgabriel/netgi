import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.columns}>
        <div className={styles.column}>
          <h3>NetGi</h3>
          <p>Núcleo Pesquisa de Economia, Tecnologia, Gestão e Inovação...</p>
        </div>
        <div className={styles.column}>
          <h3>Coordenação</h3>
          <p>Rute Lopes<br/>Moisés Israel<br/>Rute Lopes</p>
        </div>
        <div className={styles.column}>
          <h3>Projetos</h3>
          <p>Café com Ciência<br/>Café com Fofoca<br/>Café com 3M</p>
        </div>
        <div className={styles.column}>
          <h3>Contato</h3>
          <p>(92) 3533-2200</p>
        </div>
        <div className={styles.column}>
          <h3>Eventos</h3>
          <p>CONIC 2026</p>
        </div>
      </div>
      <div className={styles.copyright}>
        <p>Copyright © 2025 NETGI. All Rights Reserved.</p>
      </div>
    </footer>
  );
}