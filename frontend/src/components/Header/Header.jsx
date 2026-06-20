import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Header.module.css';
import logoNetgi from '../../assets/logo.png';
import IconePerfil from '../../assets/IconePerfil.png';

export function Header() {
    const isAuth = localStorage.getItem('@NetGi:auth');
    const role = localStorage.getItem('@NetGi:role');
    
    const [labData, setLabData] = useState({ status: 'FECHADO', nome_portador: 'Guarita', is_me: false });
    const [menuOpen, setMenuOpen] = useState(false);

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
            
            <div className={styles.leftArea}>
                <Link to="/" className={styles.logoContainer}>
                    <img src={logoNetgi} alt="Logo NETGI" className={styles.logoImage} />
                </Link>
            </div>
            
            {/* O Botão hambúrguer vai para o final porque a rightArea some no mobile */}
            <button className={styles.hamburgerBtn} onClick={() => setMenuOpen(!menuOpen)}>
                {menuOpen ? '✖' : '☰'}
            </button>
            
            <nav className={`${styles.centerArea} ${menuOpen ? styles.open : ''}`}>
                {isAuth ? (
                    <Link to="/troca-chave" className={styles.labStatus} onClick={() => setMenuOpen(false)}>
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

                <Link to="/" onClick={() => setMenuOpen(false)}>Inicial</Link>
                <Link to="/editais" onClick={() => setMenuOpen(false)}>Editais e Eventos</Link>
                <Link to="/icetec" onClick={() => setMenuOpen(false)}>ICETec</Link>
                <Link to="/membros" onClick={() => setMenuOpen(false)}>Membros</Link>

                {role === 'admin' && (
                    <Link to="/gerenciar" className={styles.adminLink} onClick={() => setMenuOpen(false)}>Gerenciar</Link>
                )}

                {/* Perfil renderizado DENTRO do menu, visível apenas no mobile */}
                <div className={styles.mobileProfile}>
                    <Link to={isAuth ? "/perfil" : "/login"} onClick={() => setMenuOpen(false)}>
                        <img src={IconePerfil} alt="Perfil" className={styles.profileImg} />
                    </Link>
                </div>
            </nav>

            {/* Perfil renderizado na direita, visível apenas no desktop */}
            <div className={styles.rightArea}>
                <Link to={isAuth ? "/perfil" : "/login"} className={styles.profileBtn}>
                    <img src={IconePerfil} alt="Perfil" className={styles.profileImg} />
                </Link>
            </div>

        </header>
    );
}