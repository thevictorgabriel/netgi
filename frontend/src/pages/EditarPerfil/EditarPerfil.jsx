import { useEffect, useRef, useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import { FaCamera } from "react-icons/fa";

import { Header } from "../../components/Header/Header";
import { Footer } from "../../components/Footer/Footer";

import styles from "./EditarPerfil.module.css";

export function EditarPerfil() {
  const navigate = useNavigate();

  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);

  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
    curso: "",
    bio: "",
    linkedin: "",
    lattes: "",
  });

  /* =======================================================
     FOTO
  ======================================================= */

  const [fotoFile, setFotoFile] = useState(null);
  const [previewFoto, setPreviewFoto] = useState("");

  /* =======================================================
     CARREGAR PERFIL
  ======================================================= */

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/profile", {
          method: "GET",
          credentials: "include",
        });

        if (response.status === 401) {
          navigate("/login");

          return;
        }

        if (!response.ok) {
          throw new Error("Não foi possível carregar os dados do perfil.");
        }

        const data = await response.json();

        setFormData({
          nome: data.nome || "",
          telefone: data.telefone || "",
          curso: data.curso || "",
          bio: data.bio || "",
          linkedin: data.linkedin || "",
          lattes: data.lattes || "",
        });

        /* Se já existir uma foto salva */

        setPreviewFoto(data.foto || "");
      } catch (error) {
        console.error("Erro ao carregar perfil:", error);
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, [navigate]);

  /* =======================================================
     LIBERAR URL TEMPORÁRIA DA FOTO
  ======================================================= */

  useEffect(() => {
    return () => {
      if (previewFoto && previewFoto.startsWith("blob:")) {
        URL.revokeObjectURL(previewFoto);
      }
    };
  }, [previewFoto]);

  /* =======================================================
     ALTERAR CAMPOS
  ======================================================= */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* =======================================================
     ABRIR SELETOR DE FOTO
  ======================================================= */

  const handleAbrirSeletorFoto = () => {
    fileInputRef.current?.click();
  };

  /* =======================================================
     SELECIONAR FOTO
  ======================================================= */

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    /* =====================================================
       VALIDA O TIPO
    ===================================================== */

    const tiposPermitidos = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/webp",
    ];

    if (!tiposPermitidos.includes(file.type)) {
      alert("Selecione uma imagem PNG, JPG, JPEG ou WEBP.");

      event.target.value = "";

      return;
    }

    /* =====================================================
       LIMITE DE 5 MB
    ===================================================== */

    const tamanhoMaximo = 5 * 1024 * 1024;

    if (file.size > tamanhoMaximo) {
      alert("A imagem deve ter no máximo 5 MB.");

      event.target.value = "";

      return;
    }

    setFotoFile(file);

    const novaPreview = URL.createObjectURL(file);

    setPreviewFoto((previewAnterior) => {
      if (previewAnterior && previewAnterior.startsWith("blob:")) {
        URL.revokeObjectURL(previewAnterior);
      }

      return novaPreview;
    });
  };

  /* =======================================================
     SALVAR PERFIL
  ======================================================= */

  const handleSalvar = async (event) => {
    event.preventDefault();

    if (salvando) {
      return;
    }

    setSalvando(true);

    /* =====================================================
       FORM DATA
    ===================================================== */

    const dataToSend = new FormData();

    dataToSend.append("nome", formData.nome);

    dataToSend.append("telefone", formData.telefone);

    dataToSend.append("curso", formData.curso);

    dataToSend.append("bio", formData.bio);

    dataToSend.append("linkedin", formData.linkedin);

    dataToSend.append("lattes", formData.lattes);

    /* Só envia foto caso tenha escolhido uma nova */

    if (fotoFile) {
      dataToSend.append("foto", fotoFile);
    }

    try {
      const response = await fetch("http://localhost:5000/api/profile", {
        method: "PUT",

        credentials: "include",

        body: dataToSend,
      });

      if (response.status === 401) {
        navigate("/login");

        return;
      }

      if (!response.ok) {
        throw new Error("Erro ao atualizar o perfil.");
      }

      alert("Perfil atualizado com sucesso!");

      navigate("/perfil");
    } catch (error) {
      console.error("Erro ao salvar perfil:", error);

      alert("Não foi possível atualizar o perfil.");
    } finally {
      setSalvando(false);
    }
  };

  /* =======================================================
     CARREGANDO
  ======================================================= */

  if (loading) {
    return (
      <div className={styles.pageContainer}>
        <Header />

        <main className={styles.mainContent}>
          <div className={styles.profileWrapper}>
            <p>Carregando dados...</p>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  /* =======================================================
     PÁGINA
  ======================================================= */

  return (
    <div className={styles.pageContainer}>
      <Header />

      <main className={styles.mainContent}>
        <div className={styles.profileWrapper}>
          {/* ===============================================
              FOTO DE PERFIL
          ================================================ */}

          <div className={styles.photoSection}>
            <div className={styles.imageContainer}>
              {previewFoto ? (
                <img
                  src={previewFoto}
                  alt="Sua foto de perfil"
                  className={styles.profileImage}
                />
              ) : (
                <div
                  className={`${styles.profileImage} ${styles.profileImagePlaceholder}`}
                  aria-label="Sem foto de perfil"
                >
                  <span>{formData.nome?.charAt(0)?.toUpperCase() || "N"}</span>
                </div>
              )}

              {/* ===========================================
                  BOTÃO CÂMERA
              ============================================ */}

              <button
                type="button"
                className={styles.cameraBtn}
                onClick={handleAbrirSeletorFoto}
                aria-label="Alterar foto de perfil"
                title="Alterar foto"
              >
                <FaCamera />
              </button>

              {/* Input escondido */}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={handleFileChange}
                hidden
              />
            </div>
          </div>

          {/* ===============================================
              FORMULÁRIO
          ================================================ */}

          <div className={styles.infoSection}>
            <form className={styles.form} onSubmit={handleSalvar}>
              {/* ===========================================
                  NOME
              ============================================ */}

              <div className={styles.inputGroup}>
                <label htmlFor="nome">NOME</label>

                <input
                  id="nome"
                  name="nome"
                  type="text"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* ===========================================
                  TELEFONE
              ============================================ */}

              <div className={styles.inputGroup}>
                <label htmlFor="telefone">TELEFONE</label>

                <input
                  id="telefone"
                  name="telefone"
                  type="text"
                  value={formData.telefone}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* ===========================================
                  CURSO
              ============================================ */}

              <div className={styles.inputGroup}>
                <label htmlFor="curso">CURSO</label>

                <input
                  id="curso"
                  name="curso"
                  type="text"
                  value={formData.curso}
                  onChange={handleChange}
                  placeholder="Ex: Engenharia de Software"
                />
              </div>

              {/* ===========================================
                  LINKEDIN
              ============================================ */}

              <div className={styles.inputGroup}>
                <label htmlFor="linkedin">LINKEDIN</label>

                <input
                  id="linkedin"
                  name="linkedin"
                  type="text"
                  value={formData.linkedin}
                  onChange={handleChange}
                  placeholder="linkedin.com/in/seu-perfil"
                  className={styles.linkedinInput}
                />
              </div>

              {/* ===========================================
                  LATTES
              ============================================ */}

              <div className={styles.inputGroup}>
                <label htmlFor="lattes">LATTES</label>

                <input
                  id="lattes"
                  name="lattes"
                  type="text"
                  value={formData.lattes}
                  onChange={handleChange}
                  placeholder="lattes.cnpq.br/seu-id"
                  className={styles.lattesInput}
                />
              </div>

              {/* ===========================================
                  BIO
              ============================================ */}

              <div className={styles.inputGroupArea}>
                <label htmlFor="bio">BIO</label>

                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Fale um pouco sobre você..."
                />
              </div>

              {/* ===========================================
                  AÇÕES
              ============================================ */}

              <div className={styles.formActions}>
                <Link to="/perfil" className={styles.btnCancel}>
                  Cancelar
                </Link>

                <button
                  type="submit"
                  className={styles.btnSave}
                  disabled={salvando}
                >
                  {salvando ? "Salvando..." : "Salvar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
