import { Link } from 'react-router-dom';

export default function Politica() {
  return (
    <div style={{ paddingTop: '100px', paddingBottom: '60px', minHeight: '80vh', backgroundColor: '#f0f0f0' }}>
      <main className="container bg-white p-5 rounded-4 shadow-sm" style={{ maxWidth: '800px' }}>
        <h1 className="fw-bold mb-4" style={{ color: '#1b4332' }}>Privacidade dos Usuários</h1>
        <p className="text-muted mb-3" style={{ lineHeight: 1.6 }}>
          Coletamos apenas os dados necessários para realizar as reservas e oferecer um atendimento personalizado. Garantimos que suas informações não serão compartilhadas com terceiros sem consentimento.
        </p>
        <p className="text-muted mb-4" style={{ lineHeight: 1.6 }}>
          Você pode solicitar a remoção de seus dados a qualquer momento.
        </p>
        <Link to="/" className="btn btn-primary mt-3">Voltar ao Início</Link>
      </main>
    </div>
  );
}