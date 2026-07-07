import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#0a1a14', color: '#e9ecef', paddingTop: '80px', borderTop: '4px solid #2d6a4f', marginTop: 'auto' }}>
      
      {/* Container Principal */}
      <div className="container pb-5">
        <div className="row g-5">
          
          {/* Coluna 1: A Marca */}
          <div className="col-lg-4 col-md-6">
            <Link to="/" className="text-decoration-none">
              <h3 className="fw-bold text-white mb-3" style={{ letterSpacing: '-1px' }}>
                <i className="fas fa-map-marked-alt text-success me-2"></i>BOEMINHA<span className="text-success">.</span>
              </h3>
            </Link>
            <p className="small text-white-50 mb-4 pe-lg-4" style={{ lineHeight: '1.8' }}>
              A bússola oficial da cultura, gastronomia e turismo de Niterói. 
              Mais do que um catálogo, somos a sua conexão direta com guias independentes e as experiências mais autênticas da cidade.
            </p>
            <div className="d-flex gap-3">
              <a href="#" className="btn btn-sm btn-outline-success rounded-circle d-flex align-items-center justify-content-center transition-hover" style={{ width: '38px', height: '38px' }} title="Instagram"><i className="fab fa-instagram fs-6"></i></a>
              <a href="#" className="btn btn-sm btn-outline-success rounded-circle d-flex align-items-center justify-content-center transition-hover" style={{ width: '38px', height: '38px' }} title="Twitter"><i className="fab fa-twitter fs-6"></i></a>
              <a href="#" className="btn btn-sm btn-outline-success rounded-circle d-flex align-items-center justify-content-center transition-hover" style={{ width: '38px', height: '38px' }} title="TikTok"><i className="fab fa-tiktok fs-6"></i></a>
            </div>
          </div>

          {/* Coluna 2: Navegação da Plataforma */}
          <div className="col-lg-2 col-md-6">
            <h6 className="fw-bold text-white text-uppercase mb-4" style={{ letterSpacing: '1px', fontSize: '0.85rem' }}>A Plataforma</h6>
            <ul className="list-unstyled d-flex flex-column gap-3 small">
              <li><Link to="/explorar" className="text-white-50 text-decoration-none custom-link-hover">Explorar Locais</Link></li>
              <li><Link to="/roteiros" className="text-white-50 text-decoration-none custom-link-hover">Roteiros Guiados</Link></li>
              <li>
                <Link to="/anuncie" className="text-white-50 text-decoration-none custom-link-hover d-flex align-items-center">
                  Área do Parceiro <span className="badge bg-success ms-2" style={{ fontSize: '0.6rem' }}>BUSINESS</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Coluna 3: Links Institucionais (Integrados com a nova página) */}
          <div className="col-lg-2 col-md-6">
            <h6 className="fw-bold text-white text-uppercase mb-4" style={{ letterSpacing: '1px', fontSize: '0.85rem' }}>Transparência</h6>
            <ul className="list-unstyled d-flex flex-column gap-3 small">
              <li><Link to="/sobre-nos" className="text-white-50 text-decoration-none custom-link-hover">Nossa História</Link></li>
              <li><Link to="/faq" className="text-white-50 text-decoration-none custom-link-hover">Central de Ajuda</Link></li>
              <li><Link to="/termos" className="text-white-50 text-decoration-none custom-link-hover">Termos de Uso</Link></li>
              <li><Link to="/politica" className="text-white-50 text-decoration-none custom-link-hover">Privacidade</Link></li>
              <li><Link to="/midia-kit" className="text-white-50 text-decoration-none custom-link-hover">Mídia Kit</Link></li>
            </ul>
          </div>

          {/* Coluna 4: CTA e Clube Boeminha */}
          <div className="col-lg-4 col-md-6">
            <div className="bg-white bg-opacity-10 p-4 rounded-4 border border-secondary border-opacity-25 shadow-sm">
              <h6 className="fw-bold text-white text-uppercase mb-2" style={{ letterSpacing: '1px', fontSize: '0.85rem' }}>
                <i className="fas fa-ticket-alt text-success me-2"></i>Clube Boeminha
              </h6>
              <p className="small text-white-50 mb-3" style={{ lineHeight: '1.6' }}>
                Receba cupons secretos de bares e descontos em roteiros exclusivos direto no seu e-mail. Sem spam, apenas boemia.
              </p>
              <form className="input-group" onSubmit={(e) => { e.preventDefault(); alert('Bem-vindo ao Clube Boeminha! Em breve você receberá nossos cupons.'); }}>
                <input type="email" className="form-control bg-dark border-secondary text-white shadow-none" placeholder="Seu melhor e-mail" required />
                <button className="btn btn-success fw-bold px-3" type="submit"><i className="fas fa-paper-plane"></i></button>
              </form>
            </div>
          </div>

        </div>
      </div>

      {/* Sub-Footer (Barra Inferior) */}
      <div className="border-top border-secondary border-opacity-25 py-4" style={{ backgroundColor: '#07120e' }}>
        <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
          
          {/* Indicador de Status do Sistema */}
          <div className="small text-white-50 d-flex align-items-center gap-2">
            <div className="spinner-grow text-success" style={{ width: '12px', height: '12px', animationDuration: '1.5s' }} role="status"></div>
            <span className="fw-bold text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>Sistemas 100% Ativos</span>
          </div>
          
          <p className="small text-white-50 mb-0 text-center">
            &copy; {new Date().getFullYear()} Boeminha. Todos os direitos reservados.
          </p>
          
          {/* Assinatura do Projeto */}
          <div className="small text-white-50 fw-bold">
            Projeto Final • <span className="text-success">IFRJ</span>
          </div>
        </div>
      </div>
      
      {/* Estilo CSS embutido para animação de hover nos links */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-link-hover { transition: color 0.3s ease; }
        .custom-link-hover:hover { color: #4ade80 !important; }
        .transition-hover { transition: all 0.3s ease; }
        .transition-hover:hover { background-color: #198754; color: white !important; border-color: #198754; transform: translateY(-3px); }
      `}} />
    </footer>
  );
}