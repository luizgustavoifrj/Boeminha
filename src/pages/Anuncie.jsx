export default function Anuncie() {
  return (
    <div style={{ paddingTop: '76px' }}>
      <header className="b2b-hero text-center text-white" style={{ background: '#1b4332', padding: '100px 0', borderBottom: '10px solid #e9c46a' }}>
        <div className="container">
          <h1 className="display-4 fw-bold mb-4">Conecte sua marca a quem busca Niterói de verdade.</h1>
          <p className="lead opacity-75 mx-auto" style={{ maxWidth: '750px' }}>
            O BoeMinha é a vitrine principal para moradores e turistas que querem fugir do óbvio. Anuncie seu bar, restaurante, evento ou serviço com quem entende a alma da cidade.
          </p>
        </div>
      </header>

      <section className="pricing-section container" style={{ padding: '80px 0' }}>
        <h2 className="text-center fw-bold mb-2" style={{ color: '#1b4332' }}>Planos de Divulgação</h2>
        <p className="text-center text-muted mb-5">Escolha o formato que melhor se adapta ao tamanho do seu negócio.</p>
        
        <div className="row g-4 align-items-center justify-content-center">
          <div className="col-lg-4 col-md-6">
            <div className="card h-100 border p-5 rounded-4 shadow-sm">
              <h4 className="fw-bold">Presença Local</h4>
              <p className="text-muted small mb-4">Ideal para pequenos negócios.</p>
              <h2 className="fw-bold" style={{ color: '#1b4332' }}>R$ 89<span className="fs-6 text-muted">/mês</span></h2>
              <ul className="list-unstyled mt-4 mb-4 text-muted small">
                <li className="mb-3"><i className="fas fa-check text-success me-2"></i> Página de detalhes completa</li>
                <li className="mb-3"><i className="fas fa-check text-success me-2"></i> Botão de link para WhatsApp</li>
              </ul>
              <button className="btn btn-outline-success w-100 fw-bold rounded-pill mt-auto">Solicitar</button>
            </div>
          </div>
          
          <div className="col-lg-4 col-md-6">
            <div className="card h-100 border border-success p-5 rounded-4 shadow" style={{ transform: 'scale(1.03)' }}>
              <span className="badge bg-success position-absolute top-0 start-50 translate-middle px-3 py-2 rounded-pill">MAIOR RETORNO</span>
              <h4 className="fw-bold mt-2">Destaque Boêmio</h4>
              <p className="text-muted small mb-4">Para quem quer dominar Niterói.</p>
              <h2 className="fw-bold" style={{ color: '#1b4332' }}>R$ 199<span className="fs-6 text-muted">/mês</span></h2>
              <ul className="list-unstyled mt-4 mb-4 text-muted small">
                <li className="mb-3"><i className="fas fa-check text-success me-2"></i> Tudo do plano anterior</li>
                <li className="mb-3"><i className="fas fa-check text-success me-2"></i> Pin especial no Mapa</li>
                <li className="mb-3"><i className="fas fa-check text-success me-2"></i> Aparece no topo das buscas</li>
              </ul>
              <button className="btn btn-success w-100 fw-bold rounded-pill mt-auto">Assinar Destaque</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}