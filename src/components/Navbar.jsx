import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../services/firebase';
import Cart from './Cart';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const navigate = useNavigate();

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

  return (
    <>
      <nav className="navbar navbar-expand-lg fixed-top" style={{ background: '#fff', borderBottom: '3px solid #2d6a4f' }}>
        <div className="container">
          <Link className="navbar-brand" to="/">
            <i className="fas fa-leaf me-2"></i>BOEMINHA.
          </Link>
          <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navContent">
            <i className="fas fa-bars text-success"></i>
          </button>
          
          <div className="collapse navbar-collapse" id="navContent">
            <ul className="navbar-nav me-auto ms-lg-4">
              <li className="nav-item"><Link className="nav-link" to="/explorar">Explorar</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/roteiros">Roteiros</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/anuncie">Anuncie</Link></li>
            </ul>
            
            <div className="d-flex align-items-center mt-3 mt-lg-0">
              <button id="theme-toggle" title="Mudar Tema" className="btn btn-link">
                <i className="fas fa-moon" style={{ color: '#2d6a4f' }}></i>
              </button>

              {/* Botão do Carrinho */}
              <button className="btn btn-light position-relative border me-3" onClick={() => setIsCartOpen(true)}>
                <i className="fas fa-shopping-bag text-dark"></i>
              </button>
              
              {!user ? (
                <div id="login-menu">
                  <Link className="btn btn-outline-success rounded-pill px-4 fw-bold" to="/login">ENTRAR</Link>
                </div>
              ) : (
                <div id="user-menu" className="d-flex align-items-center">
                  <Link className="nav-link fw-bold text-success d-flex align-items-center" to="/perfil">
                    <i className="fas fa-user-circle fs-4 me-2"></i>
                    <span>{user.email}</span>
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