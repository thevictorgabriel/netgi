import { useEffect, useMemo, useState } from "react";
import { FaChevronLeft, FaChevronRight, FaTimes } from "react-icons/fa";

import { Header } from "../../components/Header/Header";
import { Footer } from "../../components/Footer/Footer";

import logoNetgi from "../../assets/logo.png";
import icetecImage from "../../assets/Icetec.png";
import letreiroImage from "../../assets/Letreiro.png";

import styles from "./Galeria.module.css";

/* =========================================================
   IMAGENS DA GALERIA

   As imagens abaixo são temporárias.
   Para trocar uma foto, altere apenas o campo "image".

   Categorias disponíveis:
   - NETGI
   - Eventos
   - Pesquisa
   - Projetos
   - ICETec
========================================================= */

const galleryItems = [
  {
    id: 1,
    title: "NETGI",
    category: "NETGI",
    description:
      "Núcleo de Pesquisa em Economia, Tecnologia, Gestão e Inovação.",
    image: logoNetgi,
    layout: "cardLarge",
  },

  {
    id: 2,
    title: "Inovação e Tecnologia",
    category: "Pesquisa",
    description:
      "Pesquisa, desenvolvimento científico e inovação tecnológica no ICET.",
    image: icetecImage,
    layout: "cardTall",
  },

  {
    id: 3,
    title: "Projetos do Núcleo",
    category: "Projetos",
    description:
      "Projetos desenvolvidos em colaboração entre pesquisadores e estudantes.",
    image: letreiroImage,
    layout: "cardNormal",
  },

  {
    id: 4,
    title: "ICETec",
    category: "ICETec",
    description:
      "Iniciativas de empreendedorismo, inovação e desenvolvimento de negócios.",
    image: icetecImage,
    layout: "cardWide",
  },

  {
    id: 5,
    title: "Ciência e Pesquisa",
    category: "Pesquisa",
    description:
      "Produção científica e troca de conhecimentos dentro da universidade.",
    image: logoNetgi,
    layout: "cardNormal",
  },

  {
    id: 6,
    title: "Eventos NETGI",
    category: "Eventos",
    description: "Encontros, seminários e atividades promovidas pelo núcleo.",
    image: letreiroImage,
    layout: "cardTall",
  },

  {
    id: 7,
    title: "Tecnologia e Sociedade",
    category: "Projetos",
    description: "Projetos que aproximam tecnologia, universidade e sociedade.",
    image: icetecImage,
    layout: "cardNormal",
  },

  {
    id: 8,
    title: "Conexões Acadêmicas",
    category: "Eventos",
    description:
      "Momentos de integração e colaboração entre estudantes e pesquisadores.",
    image: logoNetgi,
    layout: "cardWide",
  },

  {
    id: 9,
    title: "Ecossistema NETGI",
    category: "NETGI",
    description:
      "Um ambiente para pesquisa, inovação, empreendedorismo e novas ideias.",
    image: letreiroImage,
    layout: "cardNormal",
  },
];

const categories = [
  "Todos",
  "NETGI",
  "Eventos",
  "Pesquisa",
  "Projetos",
  "ICETec",
];

export function Galeria() {
  const [activeCategory, setActiveCategory] = useState("Todos");

  const [selectedItem, setSelectedItem] = useState(null);

  /* =======================================================
     FILTRO
  ======================================================= */

  const filteredItems = useMemo(() => {
    if (activeCategory === "Todos") {
      return galleryItems;
    }

    return galleryItems.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  /* =======================================================
     ÍNDICE DA FOTO ABERTA
  ======================================================= */

  const selectedIndex = selectedItem
    ? filteredItems.findIndex((item) => item.id === selectedItem.id)
    : -1;

  /* =======================================================
     FECHAR MODAL COM ESC
  ======================================================= */

  useEffect(() => {
    if (!selectedItem) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setSelectedItem(null);
      }

      if (event.key === "ArrowRight") {
        showNextImage();
      }

      if (event.key === "ArrowLeft") {
        showPreviousImage();
      }
    };

    document.body.style.overflow = "hidden";

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";

      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedItem, selectedIndex, filteredItems]);

  /* =======================================================
     PRÓXIMA FOTO
  ======================================================= */

  const showNextImage = () => {
    if (selectedIndex === -1 || filteredItems.length === 0) {
      return;
    }

    const nextIndex = (selectedIndex + 1) % filteredItems.length;

    setSelectedItem(filteredItems[nextIndex]);
  };

  /* =======================================================
     FOTO ANTERIOR
  ======================================================= */

  const showPreviousImage = () => {
    if (selectedIndex === -1 || filteredItems.length === 0) {
      return;
    }

    const previousIndex =
      (selectedIndex - 1 + filteredItems.length) % filteredItems.length;

    setSelectedItem(filteredItems[previousIndex]);
  };

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

        <section className={styles.galleryHero}>
          <div className={styles.heroContent}>
            <span className={styles.eyebrow}>NETGI</span>

            <h1>Galeria</h1>

            <p>
              Registros que fazem parte da nossa história, reunindo ciência,
              inovação, projetos, eventos e as conexões construídas pelo NETGI.
            </p>
          </div>
        </section>

        {/* =================================================
            GALERIA
        ================================================== */}

        <section className={styles.gallerySection}>
          {/* ===============================================
              FILTROS
          ================================================ */}

          <div className={styles.filters}>
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className={`
                  ${styles.filterButton}
                  ${activeCategory === category ? styles.activeFilter : ""}
                `}
                onClick={() => {
                  setActiveCategory(category);

                  setSelectedItem(null);
                }}
              >
                {category}
              </button>
            ))}
          </div>

          {/* ===============================================
              GRID
          ================================================ */}

          {filteredItems.length > 0 ? (
            <div className={styles.galleryGrid}>
              {filteredItems.map((item, index) => (
                <article
                  key={item.id}
                  className={`
                      ${styles.galleryCard}
                      ${styles[item.layout]}
                    `}
                  style={{
                    "--card-index": index,
                  }}
                >
                  <button
                    type="button"
                    className={styles.imageWrapper}
                    onClick={() => setSelectedItem(item)}
                    aria-label={`Abrir imagem ${item.title}`}
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className={styles.galleryImage}
                    />

                    {/* ===================================
                          OVERLAY
                      ==================================== */}

                    <span className={styles.cardOverlay}>
                      <span className={styles.cardCategory}>
                        {item.category}
                      </span>

                      <strong className={styles.cardTitle}>{item.title}</strong>
                    </span>
                  </button>
                </article>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              Nenhuma imagem encontrada nesta categoria.
            </div>
          )}
        </section>
      </main>

      {/* ===================================================
          LIGHTBOX
      ==================================================== */}

      {selectedItem && (
        <div
          className={styles.lightbox}
          role="dialog"
          aria-modal="true"
          aria-label={`Visualizando ${selectedItem.title}`}
        >
          {/* FUNDO */}

          <button
            type="button"
            className={styles.lightboxBackdrop}
            onClick={() => setSelectedItem(null)}
            aria-label="Fechar galeria"
          />

          {/* CONTEÚDO */}

          <div className={styles.lightboxContent}>
            {/* FECHAR */}

            <button
              type="button"
              className={styles.closeButton}
              onClick={() => setSelectedItem(null)}
              aria-label="Fechar imagem"
            >
              <FaTimes />
            </button>

            {/* FOTO */}

            <img
              src={selectedItem.image}
              alt={selectedItem.title}
              className={styles.lightboxImage}
            />

            {/* ANTERIOR */}

            {filteredItems.length > 1 && (
              <button
                type="button"
                className={`
                  ${styles.navigationButton}
                  ${styles.previousButton}
                `}
                onClick={showPreviousImage}
                aria-label="Imagem anterior"
              >
                <FaChevronLeft />
              </button>
            )}

            {/* PRÓXIMA */}

            {filteredItems.length > 1 && (
              <button
                type="button"
                className={`
                  ${styles.navigationButton}
                  ${styles.nextButton}
                `}
                onClick={showNextImage}
                aria-label="Próxima imagem"
              >
                <FaChevronRight />
              </button>
            )}

            {/* INFORMAÇÕES */}

            <div className={styles.lightboxInfo}>
              <div>
                <span className={styles.lightboxCategory}>
                  {selectedItem.category}
                </span>

                <h2 className={styles.lightboxTitle}>{selectedItem.title}</h2>

                <p className={styles.lightboxDescription}>
                  {selectedItem.description}
                </p>
              </div>

              <span className={styles.counter}>
                {selectedIndex + 1}
                {" / "}
                {filteredItems.length}
              </span>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
