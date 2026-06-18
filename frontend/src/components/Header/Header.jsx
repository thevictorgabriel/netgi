import { Link } from 'react-router-dom';
import styles from './Header.module.css';
import logoNetgi from '../../assets/logo.png';
import IconePerfil from '../../assets/IconePerfil.png';

export function Header() {
    const isAuth = localStorage.getItem('@NetGi:auth');
    const role = localStorage.getItem('@NetGi:role');
    const isLabOpen = true;

    return (
        <header className={styles.header}>
            <Link to="/" className={styles.logoContainer}>
                <img src={logoNetgi} alt="Logo NETGI" className={styles.logoImage} style={{ height: '50px', width: 'auto' }} />
            </Link>
            <Link to="/troca-chave" className={styles.labStatus}>
                <span className={isLabOpen ? styles.statusOpen : styles.statusClosed}>
                    {isLabOpen ? 'Aberto' : 'Fechado'}
                </span>
            </Link>

            <nav className={styles.navMenu}>
                <Link to="/">Inicial</Link>
                <Link to="/membros">Membros</Link>
                <Link to="/editais">Editais e Evento</Link>
                <Link to="/icetec">ICETec</Link>

                {role === 'admin' && (
                    <Link to="/gerenciar" className={styles.adminLink}>Gerenciar</Link>
                )}
            </nav>

            <div className={styles.profile}>
                <Link to={isAuth ? "/perfil" : "/login"} className={styles.profileBtn}>
                    <img src={IconePerfil} alt="Perfil" />
                </Link>
            </div>
        </header>
    );
}