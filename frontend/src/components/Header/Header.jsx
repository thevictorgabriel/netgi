import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Header.module.css';
import logoNetgi from '../../assets/logo.png';
import IconePerfil from '../../assets/IconePerfil.png';

export function Header() {
    const isAuth = localStorage.getItem('@NetGi:auth');
    const role = localStorage.getItem('@NetGi:role');
    
    const [labData, setLabData] = useState({ status: 'FECHADO', nome_portador: 'Guarita', is_me: false });

    useEffect(() => {
        const fetchLabStatus = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/lab', { credentials: 'include' });
                if (response.ok) {
                    const data = await response.json();
                    setLabData(data);
                }
            } catch (error) {
                console.error("Erro ao buscar status do lab", error);
            }
        };
        
        fetchLabStatus();
        window.addEventListener('labStatusChanged', fetchLabStatus);
        return () => window.removeEventListener('labStatusChanged', fetchLabStatus);
    }, []);

    let textoStatus = "";
    if (labData.nome_portador === 'Guarita') {
        textoStatus = "FECHADO (Guarita)";
    } else {
        textoStatus = `${labData.status} (Chave com ${labData.is_me ? 'Você' : labData.nome_portador})`;
    }

    const isLabOpen = labData.status === 'ABERTO';

    return (
        <header className={styles.header}>
            <Link to="/" className={styles.logoContainer}>
                <img src={logoNetgi} alt="Logo NETGI" className={styles.logoImage} style={{ height: '50px', width: 'auto' }} />
            </Link>
            
            <nav className={styles.navMenu} style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                
                {isAuth ? (
                    <Link to="/troca-chave" className={styles.labStatus}>
                        <span className={isLabOpen ? styles.statusOpen : styles.statusClosed}>
                            {textoStatus}
                        </span>
                    </Link>
                ) : (
                    <div className={styles.labStatus} style={{ cursor: 'default' }}>
                        <span className={isLabOpen ? styles.statusOpen : styles.statusClosed}>
                            {textoStatus}
                        </span>
                    </div>
                )}

                <Link to="/">Inicial</Link>
                <Link to="/editais">Editais e Evento</Link>
                <Link to="/icetec">ICETec</Link>
                <Link to="/membros">Membros</Link>

                {role === 'admin' && (
                    <Link to="/gerenciar" className={styles.adminLink}>Gerenciar</Link>
                )}
            </nav>

            <div className={styles.profile}>
                <Link to={isAuth ? "/perfil" : "/login"} className={styles.profileBtn}>
                    <img 
                        src={IconePerfil} 
                        alt="Perfil" 
                        style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} 
                    />
                </Link>
            </div>
        </header>
    );
}