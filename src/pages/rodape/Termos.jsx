import { Link } from 'react-router-dom';

export default function Termos() {
  return (
    <div style={{ paddingTop: '100px', paddingBottom: '60px', minHeight: '80vh', backgroundColor: '#f0f0f0' }}>
      <main className="container bg-white p-5 rounded-4 shadow-sm" style={{ maxWidth: '800px' }}>
        <h1 className="fw-bold mb-4" style={{ color: '#1b4332' }}>Condições de Uso do Site</h1>
        <p className="text-muted mb-3" style={{ lineHeight: 1.6 }}>
          Ao acessar nosso site, o usuário concorda com os termos estabelecidos, incluindo uso pessoal das informações, respeito às leis aplicáveis e não reprodução de conteúdo sem autorização.
        </p>
        <p className="text-muted mb-4" style={{ lineHeight: 1.6 }}>
          Reservamo-nos o direito de modificar estes termos a qualquer momento sem aviso prévio.
        </p>
        <Link to="/" className="btn btn-primary mt-3">Voltar ao Início</Link>
      </main>
    </div>
  );
}