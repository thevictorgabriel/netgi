import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import styles from "./Header.module.css";

export function Header() {
  const isAuth = localStorage.getItem("@NetGi:auth");
  const role = localStorage.getItem("@NetGi:role");

  const [labData, setLabData] = useState({
    status: "FECHADO",
    nome_portador: "Guarita",
    is_me: false,
  });

  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fetchLabStatus = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/lab", {
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setLabData(data);
        }
      } catch (error) {
        console.error("Erro ao buscar status do laboratório:", error);
      }
    };

    fetchLabStatus();

    window.addEventListener("labStatusChanged", fetchLabStatus);

    return () => {
      window.removeEventListener("labStatusChanged", fetchLabStatus);
    };
  }, []);

  const isLabOpen = labData.status === "ABERTO";

  const statusLabel = isLabOpen ? "Aberto" : "Fechado";

  const portadorTexto =
    labData.nome_portador === "Guarita" ? "Chave na" : "Chave com";

  const portadorNome =
    labData.nome_portador === "Guarita"
      ? "Guarita"
      : labData.is_me
        ? "Você"
        : labData.nome_portador;

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const navClass = ({ isActive }) =>
    `${styles.navLink} ${isActive ? styles.activeNav : ""}`;

  return (
    <header className={styles.header}>
      {/* ==========================================
                STATUS DO LABORATÓRIO
            ========================================== */}

      <div className={styles.leftArea}>
        {isAuth ? (
          <Link
            to="/troca-chave"
            className={styles.labStatus}
            aria-label={`Laboratório ${statusLabel}. ${portadorTexto} ${portadorNome}`}
          >
            <span
              className={isLabOpen ? styles.statusOpen : styles.statusClosed}
            >
              {statusLabel}
            </span>

            <span className={styles.statusInfo}>
              <small>{portadorTexto}</small>

              <strong>{portadorNome}</strong>
            </span>
          </Link>
        ) : (
          <div
            className={styles.labStatus}
            aria-label={`Laboratório ${statusLabel}. ${portadorTexto} ${portadorNome}`}
          >
            <span
              className={isLabOpen ? styles.statusOpen : styles.statusClosed}
            >
              {statusLabel}
            </span>

            <span className={styles.statusInfo}>
              <small>{portadorTexto}</small>

              <strong>{portadorNome}</strong>
            </span>
          </div>
        )}
      </div>

      {/* ==========================================
                NAVEGAÇÃO
            ========================================== */}

      <nav className={`${styles.centerArea} ${menuOpen ? styles.open : ""}`}>
        <NavLink to="/" end className={navClass} onClick={closeMenu}>
          Inicial
        </NavLink>

        <NavLink to="/galeria" className={navClass} onClick={closeMenu}>
          Galeria
        </NavLink>

        <NavLink to="/membros" className={navClass} onClick={closeMenu}>
          Membros
        </NavLink>

        <NavLink to="/icetec" className={navClass} onClick={closeMenu}>
          ICETec
        </NavLink>

        <NavLink to="/editais" className={navClass} onClick={closeMenu}>
          Editais e Eventos
        </NavLink>

        {role === "admin" && (
          <NavLink
            to="/gerenciar"
            className={({ isActive }) =>
              `${styles.navLink} ${styles.adminLink} ${
                isActive ? styles.activeNav : ""
              }`
            }
            onClick={closeMenu}
          >
            Gerenciar
          </NavLink>
        )}

        <div className={styles.mobileProfile}>
          <Link
            to={isAuth ? "/perfil" : "/login"}
            className={styles.mobileProfileLink}
            onClick={closeMenu}
          >
            <span className={styles.mobileIcon}>
              <UserIcon />
            </span>

            <span>{isAuth ? "Meu perfil" : "Entrar"}</span>
          </Link>
        </div>
      </nav>

      {/* ==========================================
                PERFIL DESKTOP
            ========================================== */}

      <div className={styles.rightArea}>
        <Link
          to={isAuth ? "/perfil" : "/login"}
          className={styles.profileBtn}
          aria-label={isAuth ? "Abrir meu perfil" : "Entrar"}
        >
          <UserIcon />
        </Link>
      </div>

      {/* ==========================================
                MENU MOBILE
            ========================================== */}

      <button
        type="button"
        className={`${styles.hamburgerBtn} ${
          menuOpen ? styles.menuActive : ""
        }`}
        onClick={() => setMenuOpen((current) => !current)}
        aria-expanded={menuOpen}
        aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
      >
        {menuOpen ? <CloseIcon /> : <MenuIcon />}
      </button>
    </header>
  );
}

/* =========================================================
   ÍCONE DE USUÁRIO
========================================================= */

function UserIcon() {
  return (
    <svg
      className={styles.userIcon}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="4" fill="currentColor" />

      <path
        d="M4.5 20C4.5 16.4 7.55 13.5 12 13.5C16.45 13.5 19.5 16.4 19.5 20V20.5H4.5V20Z"
        fill="currentColor"
      />
    </svg>
  );
}

/* =========================================================
   ÍCONE MENU
========================================================= */

function MenuIcon() {
  return (
    <svg
      className={styles.menuIcon}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 7H19"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />

      <path
        d="M5 12H19"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />

      <path
        d="M5 17H19"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* =========================================================
   ÍCONE FECHAR
========================================================= */

function CloseIcon() {
  return (
    <svg
      className={styles.menuIcon}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M6 6L18 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />

      <path
        d="M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
