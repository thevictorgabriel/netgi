import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import { Header } from "../../components/Header/Header";
import { Footer } from "../../components/Footer/Footer";

import decorLeft from "../../assets/logo.png";
import decorRight from "../../assets/Icetec.png";
import decorTitle from "../../assets/Letreiro.png";

import styles from "./Cadastro.module.css";

export function Cadastro() {
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);

  const [mensagem, setMensagem] = useState({
    tipo: "",
    texto: "",
  });

  const [enviando, setEnviando] = useState(false);

  /* =======================================================
     CADASTRO
  ======================================================= */

  const handleCadastro = async (event) => {
    event.preventDefault();

    setMensagem({
      tipo: "",
      texto: "",
    });

    if (senha !== confirmarSenha) {
      setMensagem({
        tipo: "erro",
        texto: "As senhas não coincidem.",
      });

      return;
    }

    setEnviando(true);

    try {
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          nome,
          telefone,
          email,
          senha,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMensagem({
          tipo: "sucesso",
          texto: data.mensagem || "Cadastro realizado com sucesso.",
        });

        setNome("");
        setTelefone("");
        setEmail("");
        setSenha("");
        setConfirmarSenha("");

        setTimeout(() => {
          navigate("/login");
        }, 3500);

        return;
      }

      setMensagem({
        tipo: "erro",
        texto: data.erro || "Erro ao realizar cadastro.",
      });
    } catch (error) {
      console.error("Erro no cadastro:", error);

      setMensagem({
        tipo: "erro",
        texto: "Erro de conexão com o servidor.",
      });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <Header />

      <main className={styles.mainContent}>
        {/* =================================================
            IMAGENS DECORATIVAS
            Temporárias — podem ser removidas depois
        ================================================== */}

        <img
          src={decorLeft}
          alt=""
          aria-hidden="true"
          className={`
            ${styles.decorIcon}
            ${styles.decorTopLeft}
          `}
        />

        <img
          src={decorRight}
          alt=""
          aria-hidden="true"
          className={`
            ${styles.decorIcon}
            ${styles.decorRight}
          `}
        />

        <img
          src={decorTitle}
          alt=""
          aria-hidden="true"
          className={`
            ${styles.decorIcon}
            ${styles.decorLeft}
          `}
        />

        {/* =================================================
            CADASTRO
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

            <h1>Cadastro</h1>
          </div>

          {/* ===============================================
              FORMULÁRIO
          ================================================ */}

          <form className={styles.form} onSubmit={handleCadastro}>
            {/* =============================================
                MENSAGEM
            ============================================== */}

            {mensagem.texto && (
              <div
                className={
                  mensagem.tipo === "erro"
                    ? styles.feedbackError
                    : styles.feedbackSuccess
                }
                role="alert"
              >
                {mensagem.texto}
              </div>
            )}

            {/* =============================================
                NOME
            ============================================== */}

            <label className={styles.inputGroup} htmlFor="nome">
              <span className={styles.srOnly}>Nome</span>

              <input
                id="nome"
                type="text"
                placeholder="Nome"
                value={nome}
                onChange={(event) => setNome(event.target.value)}
                autoComplete="name"
                required
              />
            </label>

            {/* =============================================
                TELEFONE
            ============================================== */}

            <label className={styles.inputGroup} htmlFor="telefone">
              <span className={styles.srOnly}>Telefone</span>

              <input
                id="telefone"
                type="tel"
                placeholder="Telefone"
                value={telefone}
                onChange={(event) => setTelefone(event.target.value)}
                autoComplete="tel"
                required
              />
            </label>

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
                autoComplete="new-password"
                required
              />

              <button
                type="button"
                className={styles.eyeButton}
                onClick={() => setMostrarSenha((atual) => !atual)}
                aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
              >
                {mostrarSenha ? <FaEyeSlash /> : <FaEye />}
              </button>
            </label>

            {/* =============================================
                CONFIRMAR SENHA
            ============================================== */}

            <label
              className={`
                ${styles.inputGroup}
                ${styles.passwordGroup}
              `}
              htmlFor="confirmarSenha"
            >
              <span className={styles.srOnly}>Confirmar senha</span>

              <input
                id="confirmarSenha"
                type={mostrarConfirmarSenha ? "text" : "password"}
                placeholder="Confirmar senha"
                value={confirmarSenha}
                onChange={(event) => setConfirmarSenha(event.target.value)}
                autoComplete="new-password"
                required
              />

              <button
                type="button"
                className={styles.eyeButton}
                onClick={() => setMostrarConfirmarSenha((atual) => !atual)}
                aria-label={
                  mostrarConfirmarSenha
                    ? "Ocultar confirmação da senha"
                    : "Mostrar confirmação da senha"
                }
              >
                {mostrarConfirmarSenha ? <FaEyeSlash /> : <FaEye />}
              </button>
            </label>

            {/* =============================================
                LINK LOGIN
            ============================================== */}

            <div className={styles.loginLink}>
              <span>Já tenho uma conta?</span>

              <Link to="/login">Entrar agora</Link>
            </div>

            {/* =============================================
                BOTÃO
            ============================================== */}

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={enviando}
            >
              <span>{enviando ? "CADASTRANDO..." : "CRIAR CONTA"}</span>
            </button>
          </form>
        </section>
      </main>

      <Footer />
    </div>
  );
}
