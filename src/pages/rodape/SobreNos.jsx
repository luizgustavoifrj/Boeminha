import { Link } from 'react-router-dom';

export default function SobreNos() {
  return (
    <div style={{ paddingTop: '100px', paddingBottom: '100px', backgroundColor: '#f4f7f6', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="card border-0 shadow-lg p-4 p-md-5" style={{ borderRadius: '20px', maxWidth: '800px', width: '95%' }}>
        
        <div className="text-center mb-5">
          <span className="badge bg-success mb-2 px-3 py-2 text-uppercase">Nossa História</span>
          <h2 className="fw-bold text-dark display-6">Quem Somos</h2>
        </div>

        <div className="text-muted" style={{ lineHeight: '1.8', fontSize: '1.05rem', textAlign: 'justify' }}>
          <p>
            O <strong>Boeminha</strong> nasceu nas salas de aula do IFRJ com um propósito claro: resolver a fragmentação do turismo e lazer em Niterói. Percebemos que nossa cidade possui uma riqueza cultural, histórica e gastronômica imensa, mas muitas vezes inacessível ou desconhecida, tanto por turistas quanto pelos próprios moradores.
          </p>
          <p>
            Nós somos muito mais que um catálogo. Somos uma plataforma curatorial que digitaliza e profissionaliza o turismo local. Nossa infraestrutura permite que Guias de Turismo tenham autonomia para gerir suas agendas de forma inteligente e que donos de estabelecimentos acompanhem o impacto do seu negócio através de dados reais.
          </p>
          
          <h5 className="fw-bold text-dark mt-4 mb-3">Nossa Missão</h5>
          <p>
            Conectar exploradores às experiências mais autênticas da cidade, fomentando a economia criativa local e dando o palco merecido para guias independentes e pequenos empreendedores da boemia fluminense.
          </p>
        </div>

        <div className="text-center mt-5">
          <Link to="/" className="btn btn-success fw-bold rounded-pill px-5 py-3 shadow-sm">
            <i className="fas fa-arrow-left me-2"></i> Voltar ao Início
          </Link>
        </div>
        
      </div>
    </div>
  );
}