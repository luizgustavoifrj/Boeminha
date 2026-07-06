import { Link } from 'react-router-dom';

export default function Parceiros() {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Solicitação enviada com sucesso! Nossa equipe entrará em contato.');
  };

  return (
    <div style={{ paddingTop: '76px' }}>
      <header className="text-center text-white" style={{ background: 'linear-gradient(135deg, #1b4332 0%, #2d6a4f 100%)', padding: '100px 0' }}>
        <div className="container">
          <h1 className="fw-bold mb-4" style={{ fontSize: '3.5rem', letterSpacing: '-1px' }}>Conecte-se com quem respira Niterói.</h1>
          <p className="lead opacity-75 mx-auto mb-5" style={{ maxWidth: '700px' }}>
            A plataforma nº 1 para divulgar estabelecimentos autênticos e para Guias de Turismo venderem seus roteiros diretamente para o público certo.
          </p>
          <div className="d-flex justify-content-center gap-3">
            <a href="#solucoes" className="btn btn-light rounded-pill px-4 py-3 fw-bold text-success">VER SOLUÇÕES</a>
            <a href="#cadastro" className="btn btn-outline-light rounded-pill px-4 py-3 fw-bold border-2">CRIAR CONTA BUSINESS</a>
          </div>
        </div>
      </header>

      <section id="solucoes" className="container" style={{ marginTop: '-50px', position: 'relative', zIndex: 10 }}>
        <div className="row g-4">
          <div className="col-md-6">
            <div className="card h-100 p-5 text-center border-0 shadow-sm rounded-4">
              <div className="mx-auto mb-4 d-flex align-items-center justify-content-center rounded-circle bg-white shadow-sm" style={{ width: '80px', height: '80px', color: '#2d6a4f', fontSize: '2rem' }}>
                <i className="fas fa-store"></i>
              </div>
              <h3 className="fw-bold mb-3" style={{ color: '#1b4332' }}>Para Estabelecimentos</h3>
              <p className="text-muted mb-4">Bares, restaurantes, galerias e espaços culturais. Compre espaços publicitários, seja um "Local Patrocinado" e atraia turistas.</p>
              <Link to="/midia-kit" className="btn btn-outline-success fw-bold rounded-pill w-100 mt-auto">Ver Mídia Kit</Link>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card h-100 p-5 text-center border-0 shadow-sm rounded-4" style={{ borderTop: '5px solid #e9c46a' }}>
              <div className="mx-auto mb-4 d-flex align-items-center justify-content-center rounded-circle bg-white shadow-sm" style={{ width: '80px', height: '80px', color: '#2d6a4f', fontSize: '2rem' }}>
                <i className="fas fa-map-signs"></i>
              </div>
              <h3 className="fw-bold mb-3" style={{ color: '#1b4332' }}>Para Guias de Turismo</h3>
              <p className="text-muted mb-4">Especialistas em Niterói. Crie seu perfil no BoeMinha, publique seus Roteiros Guiados e receba reservas pela plataforma.</p>
              <a href="#cadastro" className="btn btn-success fw-bold rounded-pill w-100 mt-auto">Cadastrar como Guia</a>
            </div>
          </div>
        </div>
      </section>

      <section id="cadastro" className="container" style={{ padding: '80px 0' }}>
        <div className="row align-items-center">
          <div className="col-lg-5 mb-5 mb-lg-0">
            <h2 className="fw-bold mb-4" style={{ color: '#1b4332' }}>Faça parte da nossa rede curatorial.</h2>
            <p className="text-muted mb-4">Seja você um guia com uma trilha secreta para mostrar ou um boteco de respeito precisando de visibilidade, o BoeMinha é o seu lugar.</p>
            <div className="d-flex align-items-center">
              <div className="bg-light rounded-circle p-3 me-3 text-success">
                <i className="fas fa-users fa-lg"></i>
              </div>
              <div>
                <h6 className="fw-bold mb-0">+50 Parceiros Ativos</h6>
                <small className="text-muted">Junte-se a nós</small>
              </div>
            </div>
          </div>
          <div className="col-lg-6 offset-lg-1">
            <div className="card border-0 shadow-lg rounded-4">
              <div className="card-body p-5">
                <h4 className="fw-bold mb-4">Solicitar Cadastro Business</h4>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label small fw-bold">Eu sou um(a):</label>
                    <select className="form-select bg-light">
                      <option>Guia de Turismo / Especialista</option>
                      <option>Estabelecimento Comercial</option>
                      <option>Produtor de Eventos</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <input type="text" className="form-control bg-light p-3" placeholder="Seu Nome ou Nome do Local" required />
                  </div>
                  <div className="mb-3">
                    <input type="email" className="form-control bg-light p-3" placeholder="E-mail Profissional" required />
                  </div>
                  <div className="mb-4">
                    <input type="text" className="form-control bg-light p-3" placeholder="WhatsApp" required />
                  </div>
                  <button type="submit" className="btn btn-success fw-bold w-100 p-3 rounded-pill">ENVIAR SOLICITAÇÃO</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}