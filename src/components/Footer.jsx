import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#112b20', color: '#e9ecef', paddingTop: '60px', paddingBottom: '20px', marginTop: 'auto', borderTop: '4px solid #2d6a4f' }}>
      <div className="container">
        <div className="row g-4 mb-5">
          
          {/* Coluna 1: Marca e Sobre */}
          <div className="col-lg-4 col-md-6">
            <h4 className="fw-bold text-white mb-3"><i className="fas fa-leaf text-success me-2"></i>BOEMINHA.</h4>
            <p className="small text-white-50 mb-4" style={{ lineHeight: '1.6', paddingRight: '20px' }}>
              A principal plataforma curatorial de turismo e lazer de Niterói. Conectando você às experiências mais autênticas da cidade com segurança, cultura e praticidade.
            </p>
            <div className="d-flex gap-3">
              <a href="#" className="text-white-50 text-decoration-none fs-5 transition-hover" title="Instagram"><i className="fab fa-instagram"></i></a>
              <a href="#" className="text-white-50 text-decoration-none fs-5 transition-hover" title="Twitter"><i className="fab fa-twitter"></i></a>
              <a href="#" className="text-white-50 text-decoration-none fs-5 transition-hover" title="TikTok"><i className="fab fa-tiktok"></i></a>
            </div>
          </div>

          {/* Coluna 2: Links Rápidos */}
          <div className="col-lg-2 col-md-6">
            <h6 className="fw-bold text-white text-uppercase mb-3" style={{ letterSpacing: '1px' }}>Explorar</h6>
            <ul className="list-unstyled mb-0 d-flex flex-column gap-2 small">
              <li><Link to="/explorar" className="text-white-50 text-decoration-none transition-hover">Todos os Locais</Link></li>
              <li><Link to="/roteiros" className="text-white-50 text-decoration-none transition-hover">Roteiros Guiados</Link></li>
              <li><Link to="/cidades/niteroi" className="text-white-50 text-decoration-none transition-hover">Em Niterói</Link></li>
              <li><Link to="/cidades/rio" className="text-white-50 text-decoration-none transition-hover">No Rio</Link></li>
            </ul>
          </div>

          {/* Coluna 3: Institucional */}
          <div className="col-lg-2 col-md-6">
            <h6 className="fw-bold text-white text-uppercase mb-3" style={{ letterSpacing: '1px' }}>Institucional</h6>
            <ul className="list-unstyled mb-0 d-flex flex-column gap-2 small">
              <li><Link to="/sobre-nos" className="text-white-50 text-decoration-none transition-hover">Sobre Nós</Link></li>
              <li><Link to="/faq" className="text-white-50 text-decoration-none transition-hover">Central de Ajuda</Link></li>
              <li><Link to="/termos" className="text-white-50 text-decoration-none transition-hover">Termos de Uso</Link></li>
              <li><Link to="/politica" className="text-white-50 text-decoration-none transition-hover">Privacidade</Link></li>
            </ul>
          </div>

          {/* Coluna 4: Parceiros e Contato */}
          <div className="col-lg-4 col-md-6">
            <h6 className="fw-bold text-white text-uppercase mb-3" style={{ letterSpacing: '1px' }}>Negócios</h6>
            <ul className="list-unstyled mb-4 d-flex flex-column gap-2 small">
              <li><Link to="/anuncie" className="text-white-50 text-decoration-none transition-hover">Seja um Parceiro</Link></li>
              <li><Link to="/midia-kit" className="text-white-50 text-decoration-none transition-hover">Mídia Kit</Link></li>
            </ul>
            <h6 className="fw-bold text-white text-uppercase mb-2" style={{ letterSpacing: '1px' }}>Newsletter</h6>
            <div className="input-group input-group-sm">
              <input type="email" className="form-control bg-dark border-secondary text-white" placeholder="Seu e-mail" />
              <button className="btn btn-success fw-bold" type="button">Assinar</button>
            </div>
          </div>

        </div>

        {/* Linha Final */}
        <div className="border-top border-secondary pt-3 mt-4 text-center d-flex flex-column flex-md-row justify-content-between align-items-center">
          <p className="small text-white-50 mb-0">
            &copy; {new Date().getFullYear()} Boeminha. Todos os direitos reservados.
          </p>
          <div className="mt-2 mt-md-0 text-white-50 small">
            Feito com <i className="fas fa-heart text-danger mx-1"></i> no IFRJ
          </div>
        </div>
      </div>
    </footer>
  );
}