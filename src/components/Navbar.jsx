import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../services/firebase';
import Cart from './Cart';
import { useTheme } from '../ThemeContext'; // <-- Puxando o "cérebro" do Modo Escuro!

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const navigate = useNavigate();
  
  // 1. Extraímos o estado do tema e a função de trocar o tema
  const { darkMode, toggleDarkMode } = useTheme();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error("Erro ao sair:", error);
    }
  };

  // 2. Cores dinâmicas: Estética rubro-negra muito mais moderna no modo escuro!
  const navBackground = darkMode ? '#111111' : '#fff';
  const borderColor = darkMode ? '#c10020' : '#2d6a4f'; // Vermelho vivo no Dark, Verde no Light
  const accentColor = darkMode ? '#c10020' : '#2d6a4f';
  const textColor = darkMode ? '#f8f9fa' : '#212529';

  return (
    <>
      <nav className="navbar navbar-expand-lg fixed-top shadow-sm" style={{ background: navBackground, borderBottom: `3px solid ${borderColor}`, transition: '0.3s ease' }}>
        <div className="container">
          <Link className="navbar-brand d-flex align-items-center" to="/" style={{ color: textColor }}>
            <i className="fas fa-leaf me-2" style={{ color: accentColor }}></i>
            <span className="fw-bolder">BOEMINHA.</span>
          </Link>
          <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navContent">
            <i className="fas fa-bars" style={{ color: accentColor }}></i>
          </button>
          
          <div className="collapse navbar-collapse" id="navContent">
            <ul className="navbar-nav me-auto ms-lg-4">
              <li className="nav-item"><Link className="nav-link fw-medium" style={{ color: textColor }} to="/explorar">Explorar</Link></li>
              <li className="nav-item"><Link className="nav-link fw-medium" style={{ color: textColor }} to="/roteiros">Roteiros</Link></li>
              <li className="nav-item"><Link className="nav-link fw-medium" style={{ color: textColor }} to="/anuncie">Anuncie</Link></li>
            </ul>
            
            <div className="d-flex align-items-center mt-3 mt-lg-0">
              
              {/* 3. SEU BOTÃO ORIGINAL, AGORA FUNCIONANDO! */}
              <button id="theme-toggle" title="Mudar Tema" className="btn btn-link me-2" onClick={toggleDarkMode}>
                {/* O ícone troca sozinho de Lua para Sol */}
                <i className={darkMode ? "fas fa-sun" : "fas fa-moon"} style={{ color: accentColor, fontSize: '1.2rem', transition: '0.3s' }}></i>
              </button>

              {/* Botão do Carrinho adaptado ao tema */}
              <button className={`btn position-relative border me-3 ${darkMode ? 'btn-dark border-danger' : 'btn-light'}`} onClick={() => setIsCartOpen(true)} style={{ transition: '0.3s' }}>
                <i className="fas fa-shopping-bag" style={{ color: darkMode ? '#fff' : '#000' }}></i>
              </button>
              
              {!user ? (
                <div id="login-menu">
                  <Link 
                    className={`btn rounded-pill px-4 fw-bold ${darkMode ? 'btn-outline-danger' : 'btn-outline-success'}`} 
                    to="/login"
                  >
                    ENTRAR
                  </Link>
                </div>
              ) : (
                <div id="user-menu" className="d-flex align-items-center">
                  <Link className="nav-link fw-bold d-flex align-items-center" to="/perfil" style={{ color: accentColor }}>
                    <i className="fas fa-user-circle fs-4 me-2"></i>
                    <span className="ms-1">{user.email}</span>
                  </Link>
                  <button onClick={handleLogout} className="btn btn-sm btn-danger ms-3">Sair</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Componente do Carrinho embutido */}
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}