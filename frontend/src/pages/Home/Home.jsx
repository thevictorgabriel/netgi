import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { Header } from "../../components/Header/Header";
import { Footer } from "../../components/Footer/Footer";

import imgLetreiro from "../../assets/Letreiro.png";
import imgIcetec from "../../assets/Icetec.png";

/* =========================================================
   IMAGENS TEMPORÁRIAS DOS TÓPICOS DO COWORK

   Você pode substituir essas imagens depois.
========================================================= */

import imgInovacao from "../../assets/logo.png";
import imgEmpreendedorismo from "../../assets/Icetec.png";
import imgPesquisa from "../../assets/Letreiro.png";

import styles from "./Home.module.css";

export function Home() {
  const [atividades, setAtividades] = useState([]);

  /* =======================================================
     BUSCAR ATIVIDADES
  ======================================================= */

  useEffect(() => {
    const fetchAtividades = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/eventos");

        if (!response.ok) {
          return;
        }

        const data = await response.json();

        setAtividades(Array.isArray(data) ? data.slice(0, 5) : []);
      } catch (error) {
        console.error("Erro ao carregar atividades:", error);
      }
    };

    fetchAtividades();
  }, []);

  return (
    <div className={styles.pageContainer}>
      {/* ===================================================
          HEADER
      ==================================================== */}

      <Header />

      <main className={styles.mainContent}>
        {/* =================================================
            HERO
        ================================================== */}

        <section className={styles.heroSection}>
          <div className={styles.heroWrapper}>
            <h1 className={styles.mainTitle}>
              Núcleo de Pesquisa em Economia, Tecnologia, Gestão e Inovação
            </h1>

            <img
              src={imgLetreiro}
              alt="NETGI"
              className={styles.letreiroImage}
            />
          </div>

          {/* ===============================================
              LINKS INFERIORES DO HERO

              No design, ficam em uma cápsula
              no canto inferior direito.
          ================================================ */}

          <div className={styles.heroUtility}>
            <Link
              to="/politica-de-privacidade"
              className={styles.heroUtilityLink}
            >
              Políticas de Privacidade
            </Link>

            <a
              href="mailto:netgi207@gmail.com"
              className={styles.heroUtilityLink}
            >
              Contato
            </a>
          </div>
        </section>

        {/* =================================================
            COWORK
        ================================================== */}

        <section
          className={`
            ${styles.infoSection}
            ${styles.bgLight}
          `}
        >
          <div className={styles.sectionWrapper}>
            <h2>Cowork como Espaço Físico Universitário</h2>

            <p className={styles.infoText}>
              Funcionando como um laboratório prático e ambiente de coworking
              acadêmico, o núcleo está localizado no município de Itacoatiara
              (AM), oferecendo infraestrutura para que estudantes desenvolvam
              projetos científicos e de negócios, mantendo estreitas interações
              com os diversos cursos do ICET.
            </p>

            {/* =============================================
                TÓPICOS DO COWORK
            ============================================== */}

            <div className={styles.featuresGrid}>
              {/* ===========================================
                  PROJETOS DE INOVAÇÃO
              ============================================ */}

              <article className={styles.featureCard}>
                <div className={styles.featureHeading}>
                  <span className={styles.featureImageWrapper}>
                    <img
                      src={imgInovacao}
                      alt=""
                      aria-hidden="true"
                      className={styles.featureImage}
                    />
                  </span>

                  <h3>Projetos de Inovação</h3>
                </div>

                <p>
                  Desenvolvimento de soluções nas áreas de automação, robótica e
                  Indústria 4.0.
                </p>
              </article>

              {/* ===========================================
                  EMPREENDEDORISMO
              ============================================ */}

              <article className={styles.featureCard}>
                <div className={styles.featureHeading}>
                  <span className={styles.featureImageWrapper}>
                    <img
                      src={imgEmpreendedorismo}
                      alt=""
                      aria-hidden="true"
                      className={styles.featureImage}
                    />
                  </span>

                  <h3>Empreendedorismo</h3>
                </div>

                <p>
                  Aproximação entre universidade-empresa e incubação de ideias
                  nascidas no ambiente acadêmico.
                </p>
              </article>

              {/* ===========================================
                  PESQUISA APLICADA
              ============================================ */}

              <article className={styles.featureCard}>
                <div className={styles.featureHeading}>
                  <span className={styles.featureImageWrapper}>
                    <img
                      src={imgPesquisa}
                      alt=""
                      aria-hidden="true"
                      className={styles.featureImage}
                    />
                  </span>

                  <h3>Pesquisa Aplicada</h3>
                </div>

                <p>
                  Conexão entre a teoria de sala de aula e a realidade do
                  mercado e do Polo Industrial.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* =================================================
            MURAL DE ATIVIDADES
        ================================================== */}

        <section className={styles.carouselSection}>
          <div className={styles.sectionWrapper}>
            <div className={styles.sectionHeader}>
              <h2>Mural de Atividades</h2>

              <Link to="/editais" className={styles.btnAction}>
                Ver Todos os Editais
              </Link>
            </div>

            <div className={styles.carouselContainer}>
              {atividades.length === 0 ? (
                <p>Nenhuma atividade recente.</p>
              ) : (
                atividades.map((atividade) => (
                  <article key={atividade.id} className={styles.atividadeCard}>
                    <span className={styles.badge}>
                      {atividade.tipo?.toUpperCase()}
                    </span>

                    <h4>{atividade.titulo}</h4>

                    <p className={styles.dateInfo}>{atividade.data_inicio}</p>

                    <p className={styles.descPreview}>{atividade.descricao}</p>
                  </article>
                ))
              )}
            </div>
          </div>
        </section>

        {/* =================================================
            ICETEC
        ================================================== */}

        <section
          className={`
            ${styles.icetecSection}
            ${styles.bgLight}
          `}
        >
          <div className={styles.sectionWrapper}>
            <div className={styles.icetecLayout}>
              <div className={styles.icetecText}>
                <img
                  src={imgIcetec}
                  alt="ICETec"
                  className={styles.icetecLogoInline}
                />

                <h2>Incubadora de Empresas</h2>

                <p>
                  A ICETec tem como principal objetivo transformar conhecimento
                  acadêmico em inovação de mercado. Oferecemos suporte
                  estrutural, gerencial e metodológico para a criação e
                  consolidação de startups e empreendimentos de base
                  tecnológica, social ou tradicional.
                </p>

                <Link to="/icetec" className={styles.btnActionIcetec}>
                  Conheça a ICETec
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ===================================================
          FOOTER
      ==================================================== */}

      <Footer />
    </div>
  );
}
