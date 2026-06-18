import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Header } from '../../components/Header/Header';
import { Footer } from '../../components/Footer/Footer';
import { api } from '../../services/api';
import styles from './Login.module.css';

export function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erroMensagem, setErroMensagem] = useState('');
  
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Exige o recebimento do cookie de sessão
        body: JSON.stringify({ email, senha }),
      });

      const data = await response.json();

      if (response.ok) {
        // Salvamos apenas um status no localStorage para a interface saber que está logado
        localStorage.setItem('@NetGi:auth', 'true');
        localStorage.setItem('@NetGi:role', data.user.role);
        navigate('/');
      } else {
        alert(data.erro || "Erro ao logar.");
      }
    } catch (error) {
      alert("Erro de conexão com o servidor.");
    }
  };

  return (
    <div className={styles.pageContainer}>
      <Header />

      <main className={styles.mainContent}>
        <div className={styles.formWrapper}>
          <h2>Login</h2>
          
          <form className={styles.form} onSubmit={handleLogin}>
            
            {/* Exibe a mensagem de erro caso ela exista */}
            {erroMensagem && (
              <div style={{ color: 'red', fontSize: '0.9rem', textAlign: 'center', marginBottom: '1rem' }}>
                {erroMensagem}
              </div>
            )}

            <div className={styles.inputGroup}>
              <label htmlFor="email">E-mail</label>
              <input 
                type="email" 
                id="email" 
                placeholder="Digite seu e-mail" 
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
                placeholder="Digite sua senha" 
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required 
              />
            </div>

            <div className={styles.forgotPassword}>
              <a href="#">ESQUECEU A SENHA?</a>
            </div>

            <button type="submit" className={styles.submitBtn}>ENTRAR</button>
          </form>

          <div className={styles.registerLink}>
            <span>Ainda não tem conta? <Link to="/cadastro">Crie agora</Link></span>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}