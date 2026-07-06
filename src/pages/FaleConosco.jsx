import { useState } from 'react';

export default function FaleConosco() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      alert("Mensagem Enviada! Retornaremos o contato em breve.");
      setLoading(false);
      e.target.reset();
    }, 1500);
  };

  return (
    <div style={{ paddingTop: '76px' }}>
      <header className="text-center text-white" style={{ background: 'linear-gradient(135deg, #1b4332 0%, #2d6a4f 100%)', padding: '80px 0' }}>
        <div className="container">
          <h1 className="fw-bold mb-3" style={{ fontSize: '3rem', letterSpacing: '-1px' }}>Vamos fazer negócio.</h1>
          <p className="lead opacity-75 mx-auto" style={{ maxWidth: '600px' }}>
            Preencha o formulário abaixo para anunciar seu estabelecimento, sugerir um roteiro ou tirar dúvidas sobre o nosso Mídia Kit.
          </p>
        </div>
      </header>

      <section className="container" style={{ padding: '60px 0 100px' }}>
        <div className="row g-5">
          <div className="col-lg-5">
            <div className="bg-white border rounded-4 p-5 h-100 shadow-sm">
              <h3 className="fw-bold mb-4" style={{ color: '#1b4332' }}>Nossos Canais</h3>
              
              <div className="d-flex align-items-start mb-4">
                <div className="bg-light rounded-circle d-flex align-items-center justify-content-center text-success me-3" style={{ width: '50px', height: '50px', fontSize: '1.2rem' }}>
                  <i className="fab fa-whatsapp"></i>
                </div>
                <div>
                  <h5 className="fw-bold mb-1">Atendimento Comercial</h5>
                  <p className="text-muted small mb-0">(21) 9674490009<br/>Seg a Sex - 09h às 18h</p>
                </div>
              </div>

              <div className="d-flex align-items-start mb-4">
                <div className="bg-light rounded-circle d-flex align-items-center justify-content-center text-success me-3" style={{ width: '50px', height: '50px', fontSize: '1.2rem' }}>
                  <i className="fas fa-envelope"></i>
                </div>
                <div>
                  <h5 className="fw-bold mb-1">E-mail Corporativo</h5>
                  <p className="text-muted small mb-0">comercial@boeminha.com.br<br/>Retorno em até 24 horas úteis</p>
                </div>
              </div>

              <div className="d-flex align-items-start mb-4">
                <div className="bg-light rounded-circle d-flex align-items-center justify-content-center text-success me-3" style={{ width: '50px', height: '50px', fontSize: '1.2rem' }}>
                  <i className="fas fa-map-marker-alt"></i>
                </div>
                <div>
                  <h5 className="fw-bold mb-1">Sede Acadêmica</h5>
                  <p className="text-muted small mb-0">IFRJ - Campus Niterói<br/>Projeto Técnico</p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-7">
            <div className="bg-white border rounded-4 p-5 shadow-sm">
              <h4 className="fw-bold mb-2" style={{ color: '#1b4332' }}>Envie sua mensagem</h4>
              <p className="text-muted mb-4">Nossa equipe de curadoria analisará seu perfil comercial.</p>
              
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold small text-muted">Nome do Responsável *</label>
                    <input type="text" className="form-control bg-light p-3" required />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold small text-muted">Nome do Local/Empresa *</label>
                    <input type="text" className="form-control bg-light p-3" required />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold small text-muted">E-mail *</label>
                    <input type="email" className="form-control bg-light p-3" required />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold small text-muted">WhatsApp *</label>
                    <input type="tel" className="form-control bg-light p-3" required />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold small text-muted">Assunto do Contato *</label>
                  <select className="form-select bg-light p-3" required defaultValue="">
                    <option value="" disabled>Selecione uma opção...</option>
                    <option value="anunciar">Quero anunciar meu estabelecimento</option>
                    <option value="guia">Sou guia e quero publicar roteiros</option>
                    <option value="midia_kit">Solicitar o Mídia Kit 2026 em PDF</option>
                    <option value="duvida">Outras dúvidas comerciais</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="form-label fw-bold small text-muted">Mensagem / Descrição do Local *</label>
                  <textarea className="form-control bg-light p-3" rows="4" required style={{ resize: 'none' }}></textarea>
                </div>
                <button type="submit" className="btn btn-success fw-bold w-100 p-3 rounded-pill" disabled={loading}>
                  {loading ? <><i className="fas fa-spinner fa-spin me-2"></i> Processando...</> : <><i className="fas fa-paper-plane me-2"></i> Enviar Solicitação</>}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}