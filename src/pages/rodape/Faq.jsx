import { Link } from 'react-router-dom';

export default function Faq() {
  return (
    <div style={{ paddingTop: '100px', paddingBottom: '60px', minHeight: '80vh', backgroundColor: '#f0f0f0' }}>
      <main className="container bg-white p-5 rounded-4 shadow-sm" style={{ maxWidth: '800px' }}>
        <h1 className="fw-bold mb-4" style={{ color: '#1b4332' }}>Perguntas Frequentes</h1>
        
        <div className="mb-4">
          <p className="fw-bold mb-1">1. Como posso reservar um pacote?</p>
          <p className="text-muted">Basta fazer login, acessar a página de pacotes e clicar em "Ver Detalhes".</p>
        </div>
        
        <div className="mb-4">
          <p className="fw-bold mb-1">2. Quais formas de pagamento aceitam?</p>
          <p className="text-muted">Cartão de crédito, boleto e PIX.</p>
        </div>
        
        <div className="mb-4">
          <p className="fw-bold mb-1">3. Posso cancelar minha viagem?</p>
          <p className="text-muted">Sim, seguindo nossa política de cancelamento em até 7 dias antes da data marcada.</p>
        </div>
        
        <Link to="/" className="btn btn-primary mt-3">Voltar ao Início</Link>
      </main>
    </div>
  );
}