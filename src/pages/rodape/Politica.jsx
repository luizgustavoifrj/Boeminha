import { Link } from 'react-router-dom';

export default function Privacidade() {
  return (
    <div style={{ paddingTop: '100px', paddingBottom: '100px', backgroundColor: '#f4f7f6', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="card border-0 shadow-lg p-4 p-md-5" style={{ borderRadius: '20px', maxWidth: '800px', width: '95%' }}>
        
        <div className="text-center mb-5">
          <i className="fas fa-shield-alt text-success fs-1 mb-3"></i>
          <h2 className="fw-bold text-dark display-6">Privacidade dos Usuários</h2>
        </div>

        <div className="text-muted" style={{ lineHeight: '1.8', textAlign: 'justify' }}>
          <p className="mb-4">
            O <strong>Boeminha</strong> leva a segurança das suas informações a sério. Nossa plataforma foi desenvolvida utilizando a infraestrutura do Google Firebase, o que garante que a autenticação e o banco de dados operem com protocolos de criptografia de ponta a ponta.
          </p>

          <h6 className="fw-bold text-dark fs-5 mt-4 mb-3">Quais dados coletamos?</h6>
          <ul className="mb-4">
            <li className="mb-2"><strong>Dados de Conta:</strong> Nome, e-mail e foto de perfil, essenciais para a criação da sua identidade no site.</li>
            <li className="mb-2"><strong>Dados de Transação:</strong> Armazenamos o seu histórico de roteiros agendados e status de pagamento. <em>Nota: Não salvamos números de cartão de crédito nos nossos servidores.</em></li>
            <li><strong>Interações:</strong> Suas avaliações e comentários sobre roteiros ou estabelecimentos.</li>
          </ul>

          <h6 className="fw-bold text-dark fs-5 mb-3">Como utilizamos essas informações?</h6>
          <p className="mb-4">
            Coletamos apenas os dados estritamente necessários para emitir seus ingressos digitais, gerenciar sua agenda no painel de usuário e fornecer estatísticas anônimas de visitação para os painéis de nossos parceiros (Guias e Estabelecimentos).
          </p>

          <h6 className="fw-bold text-dark fs-5 mb-3">Seus Direitos</h6>
          <p>
            Garantimos que suas informações jamais serão vendidas a terceiros. Como usuário, você possui controle total sobre o seu perfil, podendo editar seus dados ou solicitar a exclusão permanente da sua conta e de todo o seu histórico a qualquer momento, acessando as configurações do seu Painel.
          </p>
        </div>

        <div className="text-center mt-5">
          {/* Mantive a cor azul que você usou na imagem image_a3b702.png */}
          <Link to="/" className="btn btn-primary fw-bold rounded-pill px-5 py-3 shadow-sm">
            <i className="fas fa-arrow-left me-2"></i> Voltar ao Início
          </Link>
        </div>
        
      </div>
    </div>
  );
}