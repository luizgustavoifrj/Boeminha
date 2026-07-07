import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../services/firebase';
import Cart from './Cart';
import { useTheme } from '../ThemeContext';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const navigate = useNavigate();
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

  // CORES OFICIAIS DO BOEMINHA
  const navBackground = darkMode ? '#111111' : '#ffffff';
  const brandGreen = '#2d6a4f'; 
  const textColor = darkMode ? '#f8f9fa' : '#212529';

  return (
    <>
      <nav className="navbar navbar-expand-lg fixed-top shadow-sm" style={{ background: navBackground, borderBottom: `3px solid ${brandGreen}`, transition: '0.3s ease' }}>
        <div className="container">
          <Link className="navbar-brand d-flex align-items-center" to="/" style={{ color: textColor }}>
            <i className="fas fa-leaf me-2" style={{ color: brandGreen }}></i>
            <span className="fw-bolder">BOEMINHA.</span>
          </Link>
          <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navContent">
            <i className="fas fa-bars" style={{ color: brandGreen }}></i>
          </button>
          
          <div className="collapse navbar-collapse" id="navContent">
            <ul className="navbar-nav me-auto ms-lg-4">
              <li className="nav-item"><Link className="nav-link fw-medium" style={{ color: textColor }} to="/explorar">Explorar</Link></li>
              <li className="nav-item"><Link className="nav-link fw-medium" style={{ color: textColor }} to="/roteiros">Roteiros</Link></li>
              <li className="nav-item"><Link className="nav-link fw-medium" style={{ color: textColor }} to="/anuncie">Anuncie</Link></li>
            </ul>
            
            <div className="d-flex align-items-center mt-3 mt-lg-0">
              
              <button id="theme-toggle" title="Mudar Tema" className="btn btn-link me-2" onClick={toggleDarkMode}>
                <i className={darkMode ? "fas fa-sun" : "fas fa-moon"} style={{ color: brandGreen, fontSize: '1.2rem', transition: '0.3s' }}></i>
              </button>

              <button className={`btn position-relative border me-3 ${darkMode ? 'btn-dark border-success' : 'btn-light'}`} onClick={() => setIsCartOpen(true)} style={{ transition: '0.3s' }}>
                <i className="fas fa-shopping-bag" style={{ color: darkMode ? '#fff' : '#000' }}></i>
              </button>
              
              {!user ? (
                <div id="login-menu">
                  <Link className="btn btn-outline-success rounded-pill px-4 fw-bold" to="/login">
                    ENTRAR
                  </Link>
                </div>
              ) : (
                <div id="user-menu" className="d-flex align-items-center">
                  <Link className="nav-link fw-bold d-flex align-items-center" to="/perfil" style={{ color: brandGreen }}>
                    <i className="fas fa-user-circle fs-4 me-2"></i>
                    <span className="ms-1">{user.email}</span>
                  </Link>
                  {/* Botão de sair agora é amarelo (warning) para manter a paleta! */}
                  <button onClick={handleLogout} className="btn btn-sm btn-warning ms-3 fw-bold">Sair</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}