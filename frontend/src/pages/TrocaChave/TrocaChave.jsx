import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Header } from "../../components/Header/Header";
import { Footer } from "../../components/Footer/Footer";

import styles from "./TrocaChave.module.css";

export function TrocaChave() {
  const navigate = useNavigate();

  /* =======================================================
     ESTADOS
  ======================================================= */

  const [labData, setLabData] = useState(null);

  const [usuarios, setUsuarios] = useState([]);

  const [usuarioSelecionado, setUsuarioSelecionado] = useState("");

  const [acaoEmAndamento, setAcaoEmAndamento] = useState("");

  /* =======================================================
     PERMISSÃO DO USUÁRIO
  ======================================================= */

  const role = localStorage.getItem("@NetGi:role");

  /* =======================================================
     CARREGAR DADOS DO LABORATÓRIO
  ======================================================= */

  const carregarDados = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/lab", {
        credentials: "include",
      });

      if (response.status === 401) {
        navigate("/login");

        return;
      }

      if (response.ok) {
        const data = await response.json();

        setLabData(data);
      }
    } catch (error) {
      console.error("Erro ao carregar laboratório:", error);
    }
  };

  /* =======================================================
     CARREGAR USUÁRIOS
  ======================================================= */

  const carregarUsuarios = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/usuarios/aprovados",
        {
          credentials: "include",
        },
      );

      if (response.ok) {
        const data = await response.json();

        setUsuarios(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
    }
  };

  /* =======================================================
     CARREGAMENTO INICIAL
  ======================================================= */

  useEffect(() => {
    const autenticado = localStorage.getItem("@NetGi:auth");

    if (!autenticado) {
      navigate("/login");

      return;
    }

    carregarDados();

    carregarUsuarios();
  }, [navigate]);

  /* =======================================================
     EXECUTAR AÇÃO
  ======================================================= */

  const executarAcao = async (acao, novo_portador_id = null) => {
    /*
       Evita cliques repetidos enquanto
       uma ação já está sendo executada.
    */

    if (acaoEmAndamento) {
      return;
    }

    setAcaoEmAndamento(acao);

    try {
      const response = await fetch("http://localhost:5000/api/lab/acao", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        credentials: "include",

        body: JSON.stringify({
          acao,
          novo_portador_id,
        }),
      });

      if (response.ok) {
        /*
           Aguarda os novos dados antes
           de finalizar a ação.

           Quando labData mudar, a "key"
           do bloco de status também muda
           e a animação reinicia.
        */

        await carregarDados();

        /*
           Avisa o Header para atualizar
           o status do laboratório.
        */

        window.dispatchEvent(new Event("labStatusChanged"));

        /*
           Limpa usuário depois
           da transferência.
        */

        if (acao === "transferir") {
          setUsuarioSelecionado("");
        }

        if (acao === "devolver_guarita") {
          alert("Chave devolvida e laboratório trancado com sucesso.");
        }
      } else {
        const data = await response.json();

        alert(data.erro || "Erro ao realizar ação.");
      }
    } catch (error) {
      console.error("Erro ao executar ação:", error);

      alert("Erro de conexão.");
    } finally {
      setAcaoEmAndamento("");
    }
  };

  /* =======================================================
     CARREGANDO
  ======================================================= */

  if (!labData) {
    return (
      <div className={styles.pageContainer}>
        <Header />

        <main className={styles.mainContent}>
          <div className={styles.cardInfo}>
            <h2>Carregando...</h2>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  /* =======================================================
     NOME DE QUEM ESTÁ COM A CHAVE
  ======================================================= */

  const nomePortador =
    labData.portador_id === null
      ? "Guarita"
      : labData.is_me
        ? "VOCÊ"
        : labData.nome_portador || "Outro membro";

  /* =======================================================
     CLASSE VISUAL DO STATUS
  ======================================================= */

  let statusVisualClass = styles.statusFechado;

  /*
     Durante a transferência mostramos
     a animação azul temporariamente.
  */

  if (acaoEmAndamento === "transferir") {
    statusVisualClass = styles.statusTransferindo;
  } else if (labData.status === "ABERTO") {

  /*
     Laboratório aberto ganha
     destaque laranja.
  */
    statusVisualClass = styles.statusAberto;
  } else if (labData.portador_id !== null) {

  /*
     Laboratório fechado, mas alguém
     está com a chave, ganha destaque verde.
  */
    statusVisualClass = styles.statusComChave;
  } else {

  /*
     Caso contrário:
     laboratório fechado e chave na guarita.
  */
    statusVisualClass = styles.statusFechado;
  }

  /* =======================================================
     CHAVE DA ANIMAÇÃO

     Toda mudança relevante recria o bloco,
     fazendo o CSS animation executar novamente.
  ======================================================= */

  const statusAnimationKey = `
    ${labData.status}
    -
    ${labData.portador_id ?? "guarita"}
    -
    ${labData.nome_portador ?? "ninguem"}
    -
    ${acaoEmAndamento || "idle"}
  `;

  /* =======================================================
     PÁGINA
  ======================================================= */

  return (
    <div className={styles.pageContainer}>
      <Header />

      <main className={styles.mainContent}>
        <div className={styles.cardInfo}>
          <h2>Status Atual da Chave</h2>

          {/* ===============================================
              STATUS ANIMADO
          ================================================ */}

          <div
            key={statusAnimationKey}
            className={`
              ${styles.statusGeral}
              ${styles.statusAnimated}
              ${statusVisualClass}
            `}
          >
            <p>
              Laboratório está: <strong>{labData.status}</strong>
            </p>

            <p>
              A chave está com: <strong>{nomePortador}</strong>
            </p>
          </div>

          {/* ===============================================
              PAINEL DE AÇÕES
          ================================================ */}

          <div className={styles.painelAcoes}>
            {/* =============================================
                CENÁRIO 1
                CHAVE NA GUARITA
            ============================================== */}

            {labData.portador_id === null && (
              <button
                type="button"
                className={styles.btnPegar}
                disabled={Boolean(acaoEmAndamento)}
                onClick={() => executarAcao("pegar_guarita")}
              >
                {acaoEmAndamento === "pegar_guarita"
                  ? "Pegando chave..."
                  : "Pegar Chave na Guarita"}
              </button>
            )}

            {/* =============================================
                CENÁRIO 2
                A CHAVE ESTÁ COMIGO
            ============================================== */}

            {labData.is_me && (
              <div className={styles.minhasAcoes}>
                {/* =========================================
                    ABRIR / FECHAR
                ========================================== */}

                <button
                  type="button"
                  className={
                    labData.status === "FECHADO"
                      ? styles.btnAbrir
                      : styles.btnFechar
                  }
                  disabled={Boolean(acaoEmAndamento)}
                  onClick={() => executarAcao("toggle_status")}
                >
                  {acaoEmAndamento === "toggle_status"
                    ? "Atualizando..."
                    : labData.status === "FECHADO"
                      ? "Abrir Laboratório"
                      : "Fechar Laboratório"}
                </button>

                <hr className={styles.divisor} />

                {/* =========================================
                    TRANSFERÊNCIA
                ========================================== */}

                <div className={styles.transferGroup}>
                  <select
                    value={usuarioSelecionado}
                    onChange={(event) =>
                      setUsuarioSelecionado(event.target.value)
                    }
                    className={styles.selectUser}
                    disabled={Boolean(acaoEmAndamento)}
                  >
                    <option value="">Transferir para outro membro...</option>

                    {usuarios.map((usuario) => (
                      <option key={usuario.id} value={usuario.id}>
                        {usuario.nome}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    className={styles.btnTransferir}
                    disabled={Boolean(acaoEmAndamento)}
                    onClick={() => {
                      if (!usuarioSelecionado) {
                        alert("Selecione um usuário primeiro.");

                        return;
                      }

                      executarAcao(
                        "transferir",

                        Number(usuarioSelecionado),
                      );
                    }}
                  >
                    {acaoEmAndamento === "transferir"
                      ? "Transferindo..."
                      : "Transferir"}
                  </button>
                </div>

                <hr className={styles.divisor} />

                {/* =========================================
                    DEVOLVER
                ========================================== */}

                <button
                  type="button"
                  className={styles.btnDevolver}
                  disabled={Boolean(acaoEmAndamento)}
                  onClick={() => executarAcao("devolver_guarita")}
                >
                  {acaoEmAndamento === "devolver_guarita"
                    ? "Devolvendo..."
                    : "Devolver na Guarita (Tranca automático)"}
                </button>
              </div>
            )}

            {/* =============================================
                CENÁRIO 3
                CHAVE COM OUTRA PESSOA
            ============================================== */}

            {!labData.is_me && labData.portador_id !== null && (
              <div className={styles.minhasAcoes}>
                <p className={styles.avisoOcupado}>
                  Você não pode realizar ações porque a chave está sendo mantida
                  por <strong>{labData.nome_portador}</strong>.
                </p>

                {/* =========================================
                    PODER DE ADMIN
                ========================================== */}

                {role === "admin" && (
                  <button
                    type="button"
                    className={styles.btnDevolver}
                    disabled={Boolean(acaoEmAndamento)}
                    onClick={() => executarAcao("devolver_guarita")}
                  >
                    {acaoEmAndamento === "devolver_guarita"
                      ? "Forçando devolução..."
                      : "Forçar Devolução para Guarita (Ação Admin)"}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
