import { Link } from 'react-router-dom';

export default function Termos() {
  return (
    <div style={{ paddingTop: '100px', paddingBottom: '100px', backgroundColor: '#f4f7f6', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="card border-0 shadow-lg p-4 p-md-5" style={{ borderRadius: '20px', maxWidth: '800px', width: '95%' }}>
        
        <div className="text-center mb-5">
          <h2 className="fw-bold text-dark display-6">Condições de Uso do Site</h2>
          <p className="text-muted small">Última atualização: Julho de 2026</p>
        </div>

        <div className="text-muted" style={{ lineHeight: '1.8', textAlign: 'justify' }}>
          <h6 className="fw-bold text-dark fs-5 mt-4 mb-2">1. Aceitação e Escopo</h6>
          <p className="mb-4">
            Ao acessar e usar a plataforma Boeminha, o usuário concorda expressamente em cumprir e ficar vinculado a estes Termos de Uso. O Boeminha atua como intermediador tecnológico, fornecendo o ambiente virtual para que Guias de Turismo e Estabelecimentos ofertem suas experiências ao Consumidor Final.
          </p>
          
          <h6 className="fw-bold text-dark fs-5 mb-2">2. Transações e Agendamentos</h6>
          <p className="mb-4">
            Todas as compras de roteiros e ingressos são processadas através do nosso Checkout Seguro (via PIX ou Cartão). A emissão do bilhete digital e do QR Code no perfil do usuário é automática após a confirmação financeira. O usuário compromete-se a comparecer ao local de encontro no horário estipulado pelo Guia.
          </p>

          <h6 className="fw-bold text-dark fs-5 mb-2">3. Cancelamentos e Reembolsos</h6>
          <p className="mb-4">
            Para garantir o respeito à agenda dos nossos parceiros, solicitações de cancelamento de roteiros guiados devem ser feitas com, no mínimo, 48 horas de antecedência do horário do evento para elegibilidade de reembolso integral.
          </p>

          <h6 className="fw-bold text-dark fs-5 mb-2">4. Responsabilidades dos Parceiros</h6>
          <p>
            Guias e donos de negócios cadastrados na plataforma ("Boeminha Business") são os únicos responsáveis pela veracidade das informações, preços e imagens publicadas em seus anúncios, bem como pela execução impecável do serviço ofertado.
          </p>
        </div>

        <div className="text-center mt-5">
          {/* Mantive a cor azul que você usou na imagem image_a3b6e3.png, mas você pode trocar para btn-success se preferir */}
          <Link to="/" className="btn btn-primary fw-bold rounded-pill px-5 py-3 shadow-sm">
            <i className="fas fa-arrow-left me-2"></i> Voltar ao Início
          </Link>
        </div>
        
      </div>
    </div>
  );
}