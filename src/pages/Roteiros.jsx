export default function Roteiros() {
  return (
    <div style={{ paddingTop: '76px' }}>
      <header className="page-header text-center text-white" style={{ background: 'linear-gradient(rgba(27, 67, 50, 0.85), rgba(45, 106, 79, 0.85)), url("https://www.viajenaviagem.com/wp-content/uploads/2021/07/niteroi-1920x640-1.jpg") no-repeat center center', backgroundSize: 'cover', padding: '80px 0' }}>
        <div className="container">
          <h1 className="display-5 fw-bold mb-3">Roteiros Guiados</h1>
          <p className="lead opacity-75 mx-auto" style={{ maxWidth: '600px' }}>
            Dias perfeitos planejados por quem conhece os segredos da cidade.
          </p>
        </div>
      </header>

      <main className="container mb-5 mt-5">
        <div className="row">
          
          <div className="col-12 mb-4">
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden d-flex flex-md-row">
              <div style={{ width: '100%', minHeight: '250px', backgroundImage: "url('https://upload.wikimedia.org/wikipedia/commons/2/28/Fortaleza_de_santa_cruz.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }} className="w-md-35"></div>
              <div className="card-body p-4 w-md-65 d-flex flex-column">
                <h3 className="fw-bold text-dark">O Clássico: Niemeyer, História e Pôr do Sol</h3>
                <p className="text-muted mb-3">Um tour completo para quem quer conhecer a essência de Niterói. Começamos com uma visita guiada à Fortaleza de Santa Cruz, almoço livre na orla de São Francisco e finalizamos com a vista espetacular do MAC ao entardecer.</p>
                <div className="d-flex gap-3 text-muted small fw-bold mb-4">
                  <span><i className="fas fa-map-marker-alt text-success"></i> 3 Paradas</span>
                  <span><i className="fas fa-walking text-success"></i> Caminhada Leve</span>
                </div>
                <div className="mt-auto d-flex justify-content-between align-items-end">
                  <div>
                    <p className="mb-0 fw-bold small">Guiado por: Carlos Silva</p>
                    <span className="small text-muted"><i className="fas fa-star text-warning"></i> 4.9 (120 avaliações)</span>
                  </div>
                  <div className="text-end">
                    <span className="d-block fs-4 fw-bold text-success">R$ 85<small className="fs-6 text-muted">/pessoa</small></span>
                    <button className="btn btn-success fw-bold rounded-pill px-4 mt-1">RESERVAR</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 mb-4">
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden d-flex flex-md-row">
              <div style={{ width: '100%', minHeight: '250px', backgroundImage: "url('https://diariodocomercio.com.br/wp-content/uploads/2023/01/festa-pic.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }} className="w-md-35"></div>
              <div className="card-body p-4 w-md-65 d-flex flex-column">
                <h3 className="fw-bold text-dark">Circuito Boêmio da Cantareira</h3>
                <p className="text-muted mb-3">Esqueça os roteiros turísticos tradicionais. Esse é um mergulho na verdadeira noite de Niterói. O roteiro inclui degustação em duas cervejarias locais, petiscos tradicionais em um boteco de raiz e encerramento em uma roda de samba.</p>
                <div className="d-flex gap-3 text-muted small fw-bold mb-4">
                  <span><i className="fas fa-beer text-success"></i> 2 Degustações</span>
                  <span><i className="fas fa-moon text-success"></i> Roteiro Noturno</span>
                </div>
                <div className="mt-auto d-flex justify-content-between align-items-end">
                  <div>
                    <p className="mb-0 fw-bold small">Guiado por: Mariana Boemia</p>
                    <span className="small text-muted"><i className="fas fa-star text-warning"></i> 5.0 (85 avaliações)</span>
                  </div>
                  <div className="text-end">
                    <span className="d-block fs-4 fw-bold text-success">R$ 120<small className="fs-6 text-muted">/pessoa</small></span>
                    <button className="btn btn-success fw-bold rounded-pill px-4 mt-1">RESERVAR</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}