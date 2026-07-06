import { Link } from 'react-router-dom';

export default function SobreNos() {
  return (
    <div style={{ paddingTop: '76px', minHeight: '80vh', backgroundColor: '#f8fcf9' }}>
      <header style={{ backgroundColor: '#1b4332', textAlign: 'center', padding: '2rem 0', borderBottom: '4px solid #e9c46a' }}>
        <Link to="/" style={{ color: '#ffffff', textDecoration: 'none', fontSize: '2rem', fontWeight: 800, letterSpacing: '3px' }}>
          <i className="fas fa-leaf" style={{ color: '#2d6a4f', marginRight: '12px' }}></i> BOEMINHA
        </Link>
      </header>
      <main className="container d-flex justify-content-center align-items-center" style={{ padding: '4rem 1.5rem' }}>
        <div className="bg-white p-5 rounded-4 text-center" style={{ maxWidth: '650px', boxShadow: '0 10px 30px rgba(45, 106, 79, 0.08)', borderTop: '5px solid #2d6a4f' }}>
          <h1 className="fw-bold mb-4" style={{ color: '#1b4332' }}>Quem Somos</h1>
          <p className="text-muted mb-4" style={{ fontSize: '1.15rem', lineHeight: 1.7 }}>
            Somos uma plataforma digital dedicada a oferecer as melhores experiências de turismo e lazer. Nosso objetivo é conectar você à essência da cidade, revelando desde os pontos clássicos até os cantinhos mais boêmios de Niterói. Atuamos com qualidade e foco no usuário para transformar cada roteiro em uma experiência inesquecível.
          </p>
          <Link to="/" className="btn btn-success fw-bold px-4 py-2 rounded-pill">Voltar ao Início</Link>
        </div>
      </main>
    </div>
  );
}