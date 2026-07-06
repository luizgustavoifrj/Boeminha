import { Link } from 'react-router-dom';

export default function MidiaKit() {
  return (
    <div style={{ paddingTop: '76px' }}>
      <header className="bg-light border-bottom" style={{ padding: '100px 0 80px' }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-7">
              <span className="badge text-dark fw-bold px-3 py-2 rounded-pill mb-3" style={{ background: '#e9c46a' }}>MÍDIA KIT 2026</span>
              <h1 className="fw-bold mb-3" style={{ fontSize: '3.5rem', color: '#1b4332', letterSpacing: '-1.5px' }}>Onde a cidade se encontra.</h1>
              <p className="text-muted" style={{ fontSize: '1.25rem', maxWidth: '700px' }}>
                O BoeMinha é a principal plataforma de curadoria hiper-local de Niterói. Conectamos o seu negócio a um público jovem, universitário e engajado.
              </p>
            </div>
            <div className="col-lg-5 d-none d-lg-block text-center">
              <i className="fas fa-chart-pie" style={{ fontSize: '12rem', color: '#2d6a4f', opacity: 0.1 }}></i>
            </div>
          </div>
        </div>
      </header>

      <section className="container text-center" style={{ padding: '80px 0' }}>
        <h2 className="fw-bold mb-5" style={{ color: '#1b4332' }}>Nossos Números (Projeções)</h2>
        <div className="row">
          <div className="col-md-4 mb-4">
            <div className="fw-bold lh-1 mb-2" style={{ fontSize: '4rem', color: '#2d6a4f' }}>15<span className="fs-3 text-muted">k</span></div>
            <div className="fw-bold text-uppercase">Acessos Mensais</div>
            <p className="text-muted small mt-2">Tráfego orgânico focado na região metropolitana.</p>
          </div>
          <div className="col-md-4 mb-4">
            <div className="fw-bold lh-1 mb-2" style={{ fontSize: '4rem', color: '#2d6a4f' }}>4.2<span className="fs-3 text-muted">k</span></div>
            <div className="fw-bold text-uppercase">Usuários Cadastrados</div>
            <p className="text-muted small mt-2">Exploradores com perfil ativo na plataforma.</p>
          </div>
          <div className="col-md-4 mb-4">
            <div className="fw-bold lh-1 mb-2" style={{ fontSize: '4rem', color: '#2d6a4f' }}>8.5<span className="fs-3 text-muted">%</span></div>
            <div className="fw-bold text-uppercase">Taxa de Conversão</div>
            <p className="text-muted small mt-2">De cliques nos anúncios para reservas reais.</p>
          </div>
        </div>
      </section>

      <section className="text-center" style={{ padding: '100px 0', background: '#1b4332', color: 'white' }}>
        <div className="container">
          <h2 className="fw-bold mb-4" style={{ fontSize: '2.5rem' }}>Pronto para conectar sua marca?</h2>
          <p className="mb-5 opacity-75 mx-auto" style={{ fontSize: '1.1rem', maxWidth: '600px' }}>
            Baixe nosso Mídia Kit em PDF com a tabela completa de valores institucionais ou fale agora com um consultor.
          </p>
          <div>
            <button className="btn btn-success fw-bold rounded-pill px-4 py-3 me-md-3 mb-3 mb-md-0 shadow-sm">
              <i className="fas fa-file-pdf me-2"></i> Baixar Mídia Kit (PDF)
            </button>
            <Link to="/fale-conosco" className="btn btn-outline-light fw-bold rounded-pill px-4 py-3">Falar com Consultor</Link>
          </div>
        </div>
      </section>
    </div>
  );
}