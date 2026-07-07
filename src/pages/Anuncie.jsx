import { useState } from 'react';
import { firestore } from '../services/firebase';
import { Link } from 'react-router-dom';

export default function Anuncie() {
  const [etapa, setEtapa] = useState(1);
  const [loading, setLoading] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  // Dados mesclados (Contato + Detalhes do Local)
  const [formData, setFormData] = useState({
    nome: '', email: '', whatsapp: '', tipo: 'Bar ou Restaurante', mensagem: '',
    tituloLocal: '', descricaoLocal: '', precoLocal: '', horarioLocal: '', imagemLocal: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const irParaProximaEtapa = (e) => {
    e.preventDefault();
    setEtapa(2);
  };

  const voltarEtapa = () => setEtapa(1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await firestore.collection('solicitacoes_parceria').add({
        ...formData,
        dataEnvio: new Date().toISOString(),
        status: 'Pendente'
      });
      
      setSucesso(true);
      setEtapa(1);
      setFormData({ 
        nome: '', email: '', whatsapp: '', tipo: 'Bar ou Restaurante', mensagem: '',
        tituloLocal: '', descricaoLocal: '', precoLocal: '', horarioLocal: '', imagemLocal: '' 
      });
      setTimeout(() => setSucesso(false), 8000);
    } catch (error) {
      alert("Erro ao enviar solicitação.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ paddingTop: '76px', backgroundColor: '#f8fcf9', minHeight: '100vh' }}>
      
      <header className="text-center text-white" style={{ background: 'linear-gradient(135deg, #1b4332 0%, #2d6a4f 100%)', padding: '60px 0 100px 0' }}>
        <div className="container">
          <span className="badge bg-warning text-dark fw-bold px-3 py-2 rounded-pill mb-3">SEJA UM PARCEIRO BOEMINHA</span>
          <h1 className="fw-bold mb-3" style={{ fontSize: '2.5rem' }}>Destaque seu negócio.</h1>
        </div>
      </header>

      <section className="container" style={{ marginTop: '-60px', position: 'relative', zIndex: 10, paddingBottom: '100px' }}>
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="card border-0 shadow-lg rounded-4 p-4 p-md-5 bg-white">
              
              {sucesso ? (
                <div className="text-center py-5">
                  <i className="fas fa-check-circle text-success" style={{ fontSize: '5rem' }}></i>
                  <h3 className="fw-bold mt-4">Solicitação Enviada!</h3>
                  <p className="text-muted mb-4">Nossa equipe analisará seu perfil e entrará em contato via WhatsApp em até 48 horas.</p>
                  <Link to="/" className="btn btn-outline-success fw-bold rounded-pill px-4">Voltar ao Início</Link>
                </div>
              ) : (
                <>
                  {/* ETAPA 1: CONTATO */}
                  {etapa === 1 && (
                    <div className="animation-fade">
                      <div className="text-center mb-4">
                        <h4 className="fw-bold text-dark">Etapa 1: Seus Dados de Contato</h4>
                        <div className="progress mt-3 mx-auto" style={{ height: '8px', maxWidth: '300px' }}>
                          <div className="progress-bar bg-success" style={{ width: '50%' }}></div>
                        </div>
                      </div>

                      <form onSubmit={irParaProximaEtapa}>
                        <div className="row g-3 mb-3">
                          <div className="col-md-6">
                            <label className="form-label fw-bold small text-muted">Nome do Responsável *</label>
                            <input type="text" name="nome" value={formData.nome} onChange={handleChange} className="form-control bg-light p-3" required />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label fw-bold small text-muted">WhatsApp *</label>
                            <input type="text" name="whatsapp" value={formData.whatsapp} onChange={handleChange} className="form-control bg-light p-3" placeholder="(21) 90000-0000" required />
                          </div>
                        </div>

                        <div className="row g-3 mb-3">
                          <div className="col-md-6">
                            <label className="form-label fw-bold small text-muted">E-mail Profissional *</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-control bg-light p-3" required />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label fw-bold small text-muted">Tipo de Parceria *</label>
                            <select name="tipo" value={formData.tipo} onChange={handleChange} className="form-select bg-light p-3 fw-bold text-dark" required>
                              <option value="Bar ou Restaurante">Bar ou Restaurante</option>
                              <option value="Guia de Turismo">Guia de Turismo / Trilha</option>
                              <option value="Produtor de Eventos">Produtor de Eventos</option>
                            </select>
                          </div>
                        </div>

                        <div className="mb-4">
                          <label className="form-label fw-bold small text-muted">Mensagem Adicional (Opcional)</label>
                          <textarea name="mensagem" value={formData.mensagem} onChange={handleChange} className="form-control bg-light p-3" rows="2"></textarea>
                        </div>

                        <button type="submit" className="btn btn-dark fw-bold w-100 p-3 rounded-pill shadow-sm">
                          IR PARA A PRÓXIMA ETAPA <i className="fas fa-arrow-right ms-2"></i>
                        </button>
                      </form>
                    </div>
                  )}

                  {/* ETAPA 2: DADOS DO LOCAL COM PRÉVIA */}
                  {etapa === 2 && (
                    <div className="animation-fade">
                      <div className="text-center mb-4">
                        <button onClick={voltarEtapa} className="btn btn-sm btn-link text-success text-decoration-none float-start"><i className="fas fa-arrow-left me-1"></i> Voltar</button>
                        <h4 className="fw-bold text-dark m-0">Etapa 2: Monte seu Anúncio</h4>
                        <div className="progress mt-3 mx-auto" style={{ height: '8px', maxWidth: '300px' }}>
                          <div className="progress-bar bg-success" style={{ width: '100%' }}></div>
                        </div>
                      </div>

                      <div className="row g-5 mt-2">
                        {/* Formulário de Montagem */}
                        <div className="col-lg-6">
                          <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                              <label className="form-label fw-bold small">Nome do Local / Experiência *</label>
                              <input type="text" name="tituloLocal" value={formData.tituloLocal} onChange={handleChange} className="form-control bg-light p-2" required />
                            </div>
                            <div className="row g-2 mb-3">
                              <div className="col-6">
                                <label className="form-label fw-bold small">Preço Médio (R$)</label>
                                <input type="number" name="precoLocal" value={formData.precoLocal} onChange={handleChange} className="form-control bg-light p-2" />
                              </div>
                              <div className="col-6">
                                <label className="form-label fw-bold small">Horário/Duração</label>
                                <input type="text" name="horarioLocal" value={formData.horarioLocal} onChange={handleChange} className="form-control bg-light p-2" placeholder="Ex: 18h às 02h" />
                              </div>
                            </div>
                            <div className="mb-3">
                              <label className="form-label fw-bold small">Link da Imagem Principal *</label>
                              <input type="url" name="imagemLocal" value={formData.imagemLocal} onChange={handleChange} className="form-control bg-light p-2" placeholder="https://..." required />
                            </div>
                            <div className="mb-4">
                              <label className="form-label fw-bold small">Descrição do Anúncio *</label>
                              <textarea name="descricaoLocal" value={formData.descricaoLocal} onChange={handleChange} className="form-control bg-light p-2" rows="3" required></textarea>
                            </div>
                            <button type="submit" className="btn btn-success fw-bold w-100 p-3 rounded-pill shadow-sm" disabled={loading}>
                              {loading ? 'ENVIANDO...' : <><i className="fas fa-check-circle me-2"></i> ENVIAR SOLICITAÇÃO</>}
                            </button>
                          </form>
                        </div>

                        {/* Coluna da Prévia Visual */}
                        <div className="col-lg-6">
                          <label className="form-label fw-bold small text-muted d-block text-center mb-3">Como os turistas verão:</label>
                          <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden bg-light mx-auto" style={{ maxWidth: '350px' }}>
                            <div style={{ height: '200px', backgroundColor: '#e9ecef', backgroundImage: `url(${formData.imagemLocal})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
                              <span className="badge bg-dark text-white position-absolute bottom-0 start-0 m-3 p-2 fw-bold shadow-sm">
                                <i className="far fa-clock me-1"></i> {formData.horarioLocal || 'Horário'}
                              </span>
                            </div>
                            <div className="card-body p-4 d-flex flex-column">
                              <span className="badge bg-success bg-opacity-10 text-success mb-2 align-self-start">{formData.tipo}</span>
                              <h5 className="fw-bold text-dark mb-2">{formData.tituloLocal || 'Nome do seu Negócio'}</h5>
                              <p className="text-muted small mb-4 flex-grow-1">{formData.descricaoLocal || 'Sua descrição aparecerá aqui...'}</p>
                              <div className="mt-auto d-flex justify-content-between align-items-center pt-3 border-top">
                                <span className="fw-bold text-success fs-5">R$ {formData.precoLocal || '00'},00</span>
                                <button type="button" className="btn btn-dark fw-bold rounded-pill px-3 shadow-sm disabled">Ver Mais</button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}