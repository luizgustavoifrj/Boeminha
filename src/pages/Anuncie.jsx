import { useState } from 'react';
import { firestore } from '../services/firebase';

export default function Anuncie() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    whatsapp: '',
    tipo: 'Bar ou Restaurante',
    mensagem: ''
  });
  const [loading, setLoading] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Salva a solicitação no banco de dados real do Firebase
      await firestore.collection('solicitacoes_parceria').add({
        ...formData,
        dataEnvio: new Date().toISOString(),
        status: 'Pendente'
      });
      
      setSucesso(true);
      setFormData({ nome: '', email: '', whatsapp: '', tipo: 'Bar ou Restaurante', mensagem: '' });
      
      // Remove a mensagem de sucesso após 5 segundos
      setTimeout(() => setSucesso(false), 5000);
    } catch (error) {
      console.error("Erro ao enviar formulário: ", error);
      alert("Ocorreu um erro ao enviar sua solicitação. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ paddingTop: '76px', backgroundColor: '#f8fcf9', minHeight: '100vh' }}>
      
      {/* Cabeçalho da Página */}
      <header className="text-center text-white" style={{ background: 'linear-gradient(135deg, #1b4332 0%, #2d6a4f 100%)', padding: '80px 0' }}>
        <div className="container">
          <span className="badge bg-warning text-dark fw-bold px-3 py-2 rounded-pill mb-3">SEJA UM PARCEIRO BOEMINHA</span>
          <h1 className="fw-bold mb-4" style={{ fontSize: '3rem', letterSpacing: '-1px' }}>Destaque seu negócio.</h1>
          <p className="lead opacity-75 mx-auto" style={{ maxWidth: '700px' }}>
            Junte-se à principal plataforma curatorial da região. Conectamos o seu estabelecimento ou serviço de guia turístico diretamente a milhares de exploradores ativos.
          </p>
        </div>
      </header>

      {/* Seção do Formulário */}
      <section className="container" style={{ marginTop: '-40px', position: 'relative', zIndex: 10, paddingBottom: '100px' }}>
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card border-0 shadow-lg rounded-4 p-4 p-md-5 bg-white">
              
              <div className="text-center mb-5">
                <h3 className="fw-bold text-dark">Formulário de Aplicação</h3>
                <p className="text-muted">Preencha os dados abaixo e nossa equipe entrará em contato em até 48 horas.</p>
              </div>

              {sucesso && (
                <div className="alert alert-success fw-bold text-center mb-4 p-3 rounded-3">
                  <i className="fas fa-check-circle me-2 fs-5 align-middle"></i> 
                  Solicitação enviada com sucesso! Retornaremos em breve.
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-muted">Nome do Responsável *</label>
                    <input type="text" name="nome" value={formData.nome} onChange={handleChange} className="form-control bg-light p-3" required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-muted">WhatsApp *</label>
                    <input type="text" name="whatsapp" value={formData.whatsapp} onChange={handleChange} className="form-control bg-light p-3" placeholder="(00) 00000-0000" required />
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
                      <option value="Guia de Turismo">Guia de Turismo / Especialista</option>
                      <option value="Produtor de Eventos">Produtor de Eventos</option>
                      <option value="Espaço Cultural">Espaço Cultural / Galeria</option>
                    </select>
                  </div>
                </div>

                <div className="mb-4 mt-2">
                  <label className="form-label fw-bold small text-muted">Conte um pouco sobre o seu negócio *</label>
                  <textarea name="mensagem" value={formData.mensagem} onChange={handleChange} className="form-control bg-light p-3" rows="4" placeholder="O que torna a sua experiência única?" required style={{ resize: 'none' }}></textarea>
                </div>

                <button type="submit" className="btn btn-success fw-bold w-100 p-3 rounded-pill shadow-sm" disabled={loading}>
                  {loading ? (
                    <><i className="fas fa-spinner fa-spin me-2"></i> ENVIANDO SOLICITAÇÃO...</>
                  ) : (
                    <><i className="fas fa-paper-plane me-2"></i> ENVIAR SOLICITAÇÃO DE PARCERIA</>
                  )}
                </button>
              </form>

            </div>
          </div>
        </div>
      </section>

    </div>
  );
}