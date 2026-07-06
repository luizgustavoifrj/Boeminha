import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer text-center" style={{ background: '#1b4332', color: '#fff', padding: '40px 0 20px', marginTop: 'auto' }}>
      <div className="container">
        <h5 className="fw-bold mb-3"><i className="fas fa-leaf me-2"></i>BOEMINHA.</h5>
        
        <div className="d-flex justify-content-center gap-4 mb-4 mt-3">
          <Link to="/sobre-nos" className="text-white-50 text-decoration-none small">Sobre Nós</Link>
          <Link to="/faq" className="text-white-50 text-decoration-none small">FAQ</Link>
          <Link to="/termos" className="text-white-50 text-decoration-none small">Termos de Uso</Link>
          <Link to="/politica" className="text-white-50 text-decoration-none small">Privacidade</Link>
        </div>

        <p className="text-white-50 small mb-0">
          &copy; 2026 Plataforma Curatorial de Niterói. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}