import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import { Header } from "../../components/Header/Header";
import { Footer } from "../../components/Footer/Footer";

import decorLeft from "../../assets/logo.png";
import decorRight from "../../assets/Icetec.png";
import decorTitle from "../../assets/Letreiro.png";

import styles from "./Login.module.css";

export function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erroMensagem, setErroMensagem] = useState("");
  const [enviando, setEnviando] = useState(false);

  /* =======================================================
     LOGIN
  ======================================================= */

  const handleLogin = async (event) => {
    event.preventDefault();

    setErroMensagem("");
    setEnviando(true);

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        credentials: "include",

        body: JSON.stringify({
          email,
          senha,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("@NetGi:auth", "true");

        localStorage.setItem("@NetGi:role", data.user.role);

        navigate("/");

        return;
      }

      setErroMensagem(data.erro || "Erro ao entrar. Verifique seus dados.");
    } catch (error) {
      console.error("Erro ao realizar login:", error);

      setErroMensagem("Erro de conexão com o servidor.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      {/* ===================================================
          HEADER
      ==================================================== */}

      <Header />

      {/* ===================================================
          CONTEÚDO
      ==================================================== */}

      <main className={styles.mainContent}>
        {/* =================================================
            IMAGEM DECORATIVA ESQUERDA
            Pode trocar ou remover depois
        ================================================== */}

        <img
          src={decorLeft}
          alt=""
          aria-hidden="true"
          className={`
            ${styles.decorIcon}
            ${styles.decorLeft}
          `}
        />

        {/* =================================================
            IMAGEM DECORATIVA DIREITA
            Pode trocar ou remover depois
        ================================================== */}

        <img
          src={decorRight}
          alt=""
          aria-hidden="true"
          className={`
            ${styles.decorIcon}
            ${styles.decorRight}
          `}
        />

        {/* =================================================
            LOGIN
        ================================================== */}

        <section className={styles.formWrapper}>
          {/* ===============================================
              TÍTULO
          ================================================ */}

          <div className={styles.titleRow}>
            <img
              src={decorTitle}
              alt=""
              aria-hidden="true"
              className={styles.titleIcon}
            />

            <h1>Login</h1>
          </div>

          {/* ===============================================
              FORMULÁRIO
          ================================================ */}

          <form className={styles.form} onSubmit={handleLogin}>
            {/* =============================================
                MENSAGEM DE ERRO
            ============================================== */}

            {erroMensagem && (
              <div className={styles.feedbackError} role="alert">
                {erroMensagem}
              </div>
            )}

            {/* =============================================
                EMAIL
            ============================================== */}

            <label className={styles.inputGroup} htmlFor="email">
              <span className={styles.srOnly}>E-mail</span>

              <input
                id="email"
                type="email"
                placeholder="E-mail"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                required
              />
            </label>

            {/* =============================================
                SENHA
            ============================================== */}

            <label
              className={`
                ${styles.inputGroup}
                ${styles.passwordGroup}
              `}
              htmlFor="senha"
            >
              <span className={styles.srOnly}>Senha</span>

              <input
                id="senha"
                type={mostrarSenha ? "text" : "password"}
                placeholder="Senha"
                value={senha}
                onChange={(event) => setSenha(event.target.value)}
                autoComplete="current-password"
                required
              />

              {/* ===========================================
                  MOSTRAR / OCULTAR SENHA
              ============================================ */}

              <button
                type="button"
                className={styles.eyeButton}
                onClick={() => setMostrarSenha((estadoAtual) => !estadoAtual)}
                aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                title={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
              >
                {mostrarSenha ? <FaEyeSlash /> : <FaEye />}
              </button>
            </label>

            {/* =============================================
                ESQUECEU A SENHA
            ============================================== */}

            <div className={styles.forgotPassword}>ESQUECEU A SENHA?</div>

            {/* =============================================
                CADASTRO
            ============================================== */}

            <div className={styles.registerLink}>
              <span>Ainda não tem conta?</span>

              <Link to="/cadastro">Crie agora</Link>
            </div>

            {/* =============================================
                BOTÃO ENTRAR
            ============================================== */}

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={enviando}
            >
              <span>{enviando ? "ENTRANDO..." : "ENTRAR"}</span>
            </button>
          </form>
        </section>
      </main>

      {/* ===================================================
          FOOTER
      ==================================================== */}

      <Footer />
    </div>
  );
}
