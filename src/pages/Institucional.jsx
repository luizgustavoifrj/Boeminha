import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';

export default function Institucional() {
  const location = useLocation();
  const [abaAtiva, setAbaAtiva] = useState('sobre');

  useEffect(() => {
    const path = location.pathname.split('/')[1];
    if (path === 'sobre-nos') setAbaAtiva('sobre');
    else if (path === 'faq') setAbaAtiva('faq');
    else if (path === 'termos') setAbaAtiva('termos');
    else if (path === 'politica') setAbaAtiva('privacidade');
    else if (path === 'midia-kit') setAbaAtiva('midiakit');
  }, [location]);

  return (
    <div style={{ paddingTop: '76px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      
      {/* Cabeçalho */}
      <header className="bg-dark text-white py-5" style={{ background: 'linear-gradient(135deg, #112b20, #1b4332)' }}>
        <div className="container py-4">
          <h1 className="fw-bold mb-2">Boeminha Institucional</h1>
          <p className="lead opacity-75" style={{ maxWidth: '700px' }}>
            Nossa missão, políticas de transparência e respostas diretas sobre o funcionamento da principal curadoria de turismo de Niterói.
          </p>
        </div>
      </header>

      <main className="container my-5">
        <div className="row g-4">
          
          {/* Menu Lateral de Navegação */}
          <div className="col-lg-3">
            <div className="bg-white rounded-4 shadow-sm border p-3 sticky-top" style={{ top: '100px' }}>
              <div className="nav flex-column nav-pills gap-2">
                <button onClick={() => setAbaAtiva('sobre')} className={`nav-link fw-bold text-start rounded-pill py-3 ${abaAtiva === 'sobre' ? 'active bg-success text-white' : 'text-dark'}`}>
                  Sobre o Projeto
                </button>
                <button onClick={() => setAbaAtiva('faq')} className={`nav-link fw-bold text-start rounded-pill py-3 ${abaAtiva === 'faq' ? 'active bg-success text-white' : 'text-dark'}`}>
                  Central de Ajuda (FAQ)
                </button>
                <button onClick={() => setAbaAtiva('termos')} className={`nav-link fw-bold text-start rounded-pill py-3 ${abaAtiva === 'termos' ? 'active bg-success text-white' : 'text-dark'}`}>
                  Termos de Uso
                </button>
                <button onClick={() => setAbaAtiva('privacidade')} className={`nav-link fw-bold text-start rounded-pill py-3 ${abaAtiva === 'privacidade' ? 'active bg-success text-white' : 'text-dark'}`}>
                  Política de Privacidade
                </button>
                <button onClick={() => setAbaAtiva('midiakit')} className={`nav-link fw-bold text-start rounded-pill py-3 ${abaAtiva === 'midiakit' ? 'active bg-success text-white' : 'text-dark'}`}>
                  Mídia Kit (Para Parceiros)
                </button>
              </div>
            </div>
          </div>

          {/* Conteúdo Dinâmico */}
          <div className="col-lg-9">
            <div className="bg-white rounded-4 shadow-sm border p-4 p-md-5">
              
              {/* SOBRE NÓS */}
              {abaAtiva === 'sobre' && (
                <div className="animation-fade">
                  <h3 className="fw-bold text-dark mb-4 border-bottom pb-3">Nossa História</h3>
                  <p className="text-muted mb-4 fs-5" style={{ lineHeight: '1.8' }}>
                    O Boeminha nasceu de uma necessidade real no IFRJ: organizar a rica vida cultural, gastronômica e ecológica de Niterói em uma única plataforma digital.
                  </p>
                  <p className="text-muted mb-4" style={{ lineHeight: '1.8' }}>
                    Nós notamos que turistas e até moradores enfrentavam dificuldade para encontrar informações centralizadas sobre trilhas no Parque da Cidade, eventos na Praça da Cantareira ou roteiros históricos no Caminho Niemeyer. Além disso, guias de turismo independentes não tinham uma ferramenta tecnológica acessível para gerenciar suas reservas.
                  </p>
                  <p className="text-muted mb-4" style={{ lineHeight: '1.8' }}>
                    Hoje, o Boeminha atua como uma ponte. Nós fornecemos a infraestrutura tecnológica — incluindo painéis de gestão, checkouts seguros via PIX e perfis avaliados — para empoderar empreendedores locais e proporcionar aos turistas experiências inesquecíveis e sem atritos.
                  </p>
                  <h5 className="fw-bold mt-5 mb-3 text-dark">Nossos Pilares</h5>
                  <ul className="list-group list-group-flush mb-4">
                    <li className="list-group-item bg-transparent text-muted py-3 px-0 border-light"><strong className="text-dark">Curadoria Ativa:</strong> Todos os locais listados passam por uma triagem para garantir a qualidade da experiência.</li>
                    <li className="list-group-item bg-transparent text-muted py-3 px-0 border-light"><strong className="text-dark">Empoderamento Local:</strong> Damos visibilidade a guias independentes e pequenos empreendimentos.</li>
                    <li className="list-group-item bg-transparent text-muted py-3 px-0 border-light"><strong className="text-dark">Tecnologia Simples:</strong> Reservas rápidas, sem burocracia, com bilhetes gerados automaticamente no seu perfil.</li>
                  </ul>
                </div>
              )}

              {/* FAQ */}
              {abaAtiva === 'faq' && (
                <div className="animation-fade">
                  <h3 className="fw-bold text-dark mb-4 border-bottom pb-3">Dúvidas Frequentes</h3>
                  
                  <div className="mb-4">
                    <h6 className="fw-bold text-dark mb-2 fs-5">Como recebo o ingresso do meu roteiro?</h6>
                    <p className="text-muted border-start border-success border-3 ps-3 py-1">Após a confirmação do pagamento no checkout, o seu voucher é gerado automaticamente. Basta acessar a página "Perfil" e ele estará na aba "Meus Próximos Eventos", contendo o QR Code e os detalhes do local de encontro com o guia.</p>
                  </div>
                  
                  <div className="mb-4">
                    <h6 className="fw-bold text-dark mb-2 fs-5">O pagamento via PIX é imediato?</h6>
                    <p className="text-muted border-start border-success border-3 ps-3 py-1">Sim. O sistema utiliza a chave Copia e Cola para aprovação instantânea. Assim que o banco confirmar a transação, a sua vaga no passeio estará garantida.</p>
                  </div>

                  <div className="mb-4">
                    <h6 className="fw-bold text-dark mb-2 fs-5">Tenho um bar, como apareço na plataforma?</h6>
                    <p className="text-muted border-start border-success border-3 ps-3 py-1">Acesse a aba "Seja um Parceiro" no rodapé, preencha o formulário na Etapa 1 e crie o seu anúncio na Etapa 2. A nossa equipe de administração vai avaliar os dados e entrar em contato com você via WhatsApp em até 48h para aprovar o seu Painel Business.</p>
                  </div>

                  <div className="mb-4">
                    <h6 className="fw-bold text-dark mb-2 fs-5">Posso cancelar uma compra?</h6>
                    <p className="text-muted border-start border-success border-3 ps-3 py-1">Sim. O cancelamento pode ser feito com até 48 horas de antecedência ao evento para garantir o reembolso integral, respeitando a agenda de preparação dos guias parceiros.</p>
                  </div>
                </div>
              )}

              {/* TERMOS DE USO */}
              {abaAtiva === 'termos' && (
                <div className="animation-fade">
                  <h3 className="fw-bold text-dark mb-4 border-bottom pb-3">Termos de Uso</h3>
                  <p className="text-muted mb-4 small">Versão 1.0 - Válida a partir de Julho de 2026</p>
                  
                  <h6 className="fw-bold mb-2 text-dark fs-5">1. Definição do Serviço</h6>
                  <p className="text-muted mb-4">O Boeminha é uma plataforma de classificados digitais e intermediação tecnológica. Nós fornecemos o ambiente virtual (software) para que Guias de Turismo e Donos de Estabelecimentos ofertem seus serviços diretamente ao Consumidor Final (Turista).</p>
                  
                  <h6 className="fw-bold mb-2 text-dark fs-5">2. Obrigações dos Parceiros (Guias e Negócios)</h6>
                  <p className="text-muted mb-4">Ao ter o perfil aprovado pela administração do Boeminha, o parceiro compromete-se a manter preços, horários e rotas atualizados em seu painel. O não comparecimento a um passeio agendado gera advertência e suspensão da conta do Guia.</p>

                  <h6 className="fw-bold mb-2 text-dark fs-5">3. Sistema de Avaliações</h6>
                  <p className="text-muted mb-4">Os usuários concordam em fornecer avaliações (notas e comentários) baseadas em experiências reais. O Boeminha reserva-se o direito de remover comentários que contenham linguagem imprópria ou difamação sem fundamentação.</p>
                </div>
              )}

              {/* PRIVACIDADE */}
              {abaAtiva === 'privacidade' && (
                <div className="animation-fade">
                  <h3 className="fw-bold text-dark mb-4 border-bottom pb-3">Política de Privacidade</h3>
                  <p className="text-muted mb-4 fs-5">Transparência total sobre como tratamos suas informações.</p>
                  
                  <p className="text-muted mb-4" style={{ lineHeight: '1.8' }}>
                    Toda a arquitetura do Boeminha é sustentada pelos servidores do Firebase. Isso significa que as suas senhas são armazenadas com criptografia de ponta a ponta e nós não temos acesso direto a elas.
                  </p>
                  
                  <h6 className="fw-bold text-dark mt-4 mb-3 fs-5">Dados que coletamos:</h6>
                  <ul className="list-group list-group-flush mb-4">
                    <li className="list-group-item bg-transparent text-muted py-2 px-0 border-light"><i className="fas fa-check text-success me-2"></i> <strong>Cadastro:</strong> Nome de exibição, e-mail e tipo de conta.</li>
                    <li className="list-group-item bg-transparent text-muted py-2 px-0 border-light"><i className="fas fa-check text-success me-2"></i> <strong>Compras:</strong> Armazenamos o histórico de roteiros adquiridos para compor a aba "Histórico" do seu perfil. Não salvamos os números do seu cartão de crédito no nosso banco de dados.</li>
                    <li className="list-group-item bg-transparent text-muted py-2 px-0 border-light"><i className="fas fa-check text-success me-2"></i> <strong>Pública:</strong> Quando você avalia um local, apenas a sua nota, seu comentário e seu primeiro nome se tornam visíveis para a comunidade.</li>
                  </ul>
                </div>
              )}

              {/* MÍDIA KIT */}
              {abaAtiva === 'midiakit' && (
                <div className="animation-fade">
                  <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
                    <h3 className="fw-bold text-dark m-0">Mídia Kit e Parcerias</h3>
                    <Link to="/anuncie" className="btn btn-dark fw-bold rounded-pill px-4">Anunciar Agora</Link>
                  </div>
                  
                  <p className="text-muted mb-5 fs-5 text-center">Junte-se à vitrine digital que mais cresce em Niterói e coloque o seu negócio no radar de centenas de turistas toda semana.</p>
                  
                  <div className="row g-4 mb-5 text-center">
                    <div className="col-md-4">
                      <div className="bg-light p-4 rounded-4 border border-2">
                        <h2 className="fw-bold text-success m-0">+2.500</h2>
                        <span className="small text-muted fw-bold text-uppercase">Buscas Mensais</span>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="bg-light p-4 rounded-4 border border-2">
                        <h2 className="fw-bold text-success m-0">98%</h2>
                        <span className="small text-muted fw-bold text-uppercase">Taxa de Aprovação</span>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="bg-light p-4 rounded-4 border border-2">
                        <h2 className="fw-bold text-success m-0">Público</h2>
                        <span className="small text-muted fw-bold text-uppercase">Jovem e Engajado</span>
                      </div>
                    </div>
                  </div>

                  <h5 className="fw-bold text-dark mb-4 text-center">O que o Painel Business oferece?</h5>
                  <div className="row g-4">
                    <div className="col-md-6">
                      <div className="d-flex gap-3 bg-light p-3 rounded-4 h-100">
                        <div className="text-success fs-3 mt-1"><i className="fas fa-chart-line"></i></div>
                        <div>
                          <h6 className="fw-bold mb-1 text-dark">Métricas em Tempo Real</h6>
                          <p className="text-muted small m-0">Saiba exatamente quantos usuários visitaram a sua página, clicaram no seu link ou adicionaram seu roteiro ao carrinho.</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="d-flex gap-3 bg-light p-3 rounded-4 h-100">
                        <div className="text-success fs-3 mt-1"><i className="fas fa-ticket-alt"></i></div>
                        <div>
                          <h6 className="fw-bold mb-1 text-dark">Gerador de Cupons</h6>
                          <p className="text-muted small m-0">Crie campanhas de desconto focadas, limitadas por data e comande promoções para lotar a sua agenda nos dias de baixo movimento.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}