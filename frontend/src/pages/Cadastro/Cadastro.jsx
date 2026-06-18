import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Header } from '../../components/Header/Header';
import { Footer } from '../../components/Footer/Footer';
import styles from './Cadastro.module.css';

export function Cadastro() {
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  
  const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });
  const navigate = useNavigate();

  const handleCadastro = async (event) => {
    event.preventDefault();
    setMensagem({ tipo: '', texto: '' }); 

    if (senha !== confirmarSenha) {
      setMensagem({ tipo: 'erro', texto: 'As senhas não coincidem.' });
      return;
    }

    try {
      // Nova requisição usando fetch nativo apontando para /api/register
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nome,
          telefone,
          email,
          senha
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMensagem({ tipo: 'sucesso', texto: data.mensagem });
        
        setNome('');
        setTelefone('');
        setEmail('');
        setSenha('');
        setConfirmarSenha('');

        setTimeout(() => {
          navigate('/login');
        }, 3500);

      } else {
        // Se o Flask retornar um erro (ex: email já cadastrado)
        setMensagem({ tipo: 'erro', texto: data.erro || 'Erro ao realizar cadastro.' });
      }

    } catch (error) {
      console.error("Erro no cadastro:", error);
      setMensagem({ tipo: 'erro', texto: 'Erro de conexão com o servidor.' });
    }
  };

  return (
    <div className={styles.pageContainer}>
      <Header />

      <main className={styles.mainContent}>
        <div className={styles.formWrapper}>
          <h2>Cadastro</h2>
          
          <form className={styles.form} onSubmit={handleCadastro}>
            
            {mensagem.texto && (
              <div style={{ 
                color: mensagem.tipo === 'erro' ? '#d93025' : '#1e8e3e',
                backgroundColor: mensagem.tipo === 'erro' ? '#fce8e6' : '#e6f4ea',
                padding: '0.8rem', 
                borderRadius: '4px',
                textAlign: 'center', 
                marginBottom: '1rem',
                fontSize: '0.9rem',
                fontWeight: '500'
              }}>
                {mensagem.texto}
              </div>
            )}

            <div className={styles.inputGroup}>
              <label htmlFor="nome">Nome</label>
              <input 
                type="text" 
                id="nome" 
                placeholder="Seu nome completo" 
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required 
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="telefone">Telefone</label>
              <input 
                type="tel" 
                id="telefone" 
                placeholder="(00) 00000-0000" 
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                required 
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="email">E-mail</label>
              <input 
                type="email" 
                id="email" 
                placeholder="Seu melhor e-mail" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="senha">Senha</label>
              <input 
                type="password" 
                id="senha" 
                placeholder="Crie uma senha" 
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required 
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="confirmarSenha">Confirmar senha</label>
              <input 
                type="password" 
                id="confirmarSenha" 
                placeholder="Repita a senha" 
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                required 
              />
            </div>

            <button type="submit" className={styles.submitBtn}>CRIAR CONTA</button>
          </form>

          <div className={styles.loginLink}>
            <span>Já tenho uma conta? <Link to="/login">Entrar agora</Link></span>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}