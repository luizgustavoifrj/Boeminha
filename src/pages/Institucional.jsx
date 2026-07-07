import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';

export default function Institucional() {
  const location = useLocation();
  const [abaAtiva, setAbaAtiva] = useState('sobre');

  // Muda a aba ativa baseado no link clicado no rodapé
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
        <div className="container text-center py-4">
          <h1 className="fw-bold mb-3">Boeminha Institucional</h1>
          <p className="lead opacity-75 mx-auto" style={{ maxWidth: '600px' }}>
            Transparência, segurança e a nossa missão de conectar você às melhores experiências de Niterói e do Rio.
          </p>
        </div>
      </header>

      <main className="container my-5">
        <div className="row g-4">
          
          {/* Menu Lateral */}
          <div className="col-lg-3">
            <div className="bg-white rounded-4 shadow-sm border p-3 sticky-top" style={{ top: '100px' }}>
              <div className="nav flex-column nav-pills gap-2">
                <button onClick={() => setAbaAtiva('sobre')} className={`nav-link fw-bold text-start rounded-pill ${abaAtiva === 'sobre' ? 'active bg-success text-white' : 'text-dark'}`}>
                  <i className="fas fa-info-circle me-2"></i> Sobre Nós
                </button>
                <button onClick={() => setAbaAtiva('faq')} className={`nav-link fw-bold text-start rounded-pill ${abaAtiva === 'faq' ? 'active bg-success text-white' : 'text-dark'}`}>
                  <i className="fas fa-question-circle me-2"></i> FAQ & Ajuda
                </button>
                <button onClick={() => setAbaAtiva('termos')} className={`nav-link fw-bold text-start rounded-pill ${abaAtiva === 'termos' ? 'active bg-success text-white' : 'text-dark'}`}>
                  <i className="fas fa-file-contract me-2"></i> Termos de Uso
                </button>
                <button onClick={() => setAbaAtiva('privacidade')} className={`nav-link fw-bold text-start rounded-pill ${abaAtiva === 'privacidade' ? 'active bg-success text-white' : 'text-dark'}`}>
                  <i className="fas fa-shield-alt me-2"></i> Privacidade
                </button>
                <button onClick={() => setAbaAtiva('midiakit')} className={`nav-link fw-bold text-start rounded-pill ${abaAtiva === 'midiakit' ? 'active bg-success text-white' : 'text-dark'}`}>
                  <i className="fas fa-bullhorn me-2"></i> Mídia Kit
                </button>
              </div>
            </div>
          </div>

          {/* Conteúdo das Abas */}
          <div className="col-lg-9">
            <div className="bg-white rounded-4 shadow-sm border p-4 p-md-5">
              
              {abaAtiva === 'sobre' && (
                <div className="animation-fade">
                  <h3 className="fw-bold text-dark mb-4 border-bottom pb-3">Sobre o Boeminha</h3>
                  <p className="text-muted mb-4" style={{ lineHeight: '1.8' }}>
                    O Boeminha nasceu nas salas de aula do IFRJ com um propósito claro: resolver a fragmentação do turismo e lazer na nossa região. Percebemos que Niterói possui uma riqueza cultural, histórica e gastronômica imensa, mas muitas vezes inacessível ou desconhecida tanto por turistas quanto pelos próprios moradores.
                  </p>
                  <p className="text-muted mb-4" style={{ lineHeight: '1.8' }}>
                    Nós somos mais que um catálogo. Somos uma <strong>plataforma curatorial</strong> que digitaliza e profissionaliza o turismo local. Nossa infraestrutura permite que Guias de Turismo tenham autonomia para gerir suas agendas e que donos de estabelecimentos acompanhem o impacto do seu negócio através de dados reais.
                  </p>
                  <h5 className="fw-bold mt-5 mb-3 text-dark">Nossa Missão</h5>
                  <p className="text-muted mb-4">Conectar exploradores às experiências mais autênticas da cidade, fomentando a economia criativa local e dando palco para guias independentes e empreendedores.</p>
                </div>
              )}

              {abaAtiva === 'faq' && (
                <div className="animation-fade">
                  <h3 className="fw-bold text-dark mb-4 border-bottom pb-3">Perguntas Frequentes (FAQ)</h3>
                  
                  <div className="mb-4">
                    <h6 className="fw-bold text-success mb-2">Como funcionam as reservas de roteiros?</h6>
                    <p className="text-muted small">Ao escolher um roteiro, você define a data no nosso Checkout Seguro e finaliza a compra. O ingresso digital vai automaticamente para a aba "Próximos Eventos" no seu Perfil.</p>
                  </div>
                  
                  <div className="mb-4">
                    <h6 className="fw-bold text-success mb-2">Quais as formas de pagamento aceitas?</h6>
                    <p className="text-muted small">Aceitamos PIX (com aprovação instantânea via QR Code ou Copia e Cola) e Cartões de Crédito.</p>
                  </div>

                  <div className="mb-4">
                    <h6 className="fw-bold text-success mb-2">Sou guia de turismo, como me cadastro?</h6>
                    <p className="text-muted small">Basta acessar a página "Anuncie", preencher o formulário selecionando a opção "Guia de Turismo". Nossa administração analisará seu perfil e liberará o acesso ao painel de criação de roteiros.</p>
                  </div>

                  <div className="mb-4">
                    <h6 className="fw-bold text-success mb-2">O que é a Nota Média?</h6>
                    <p className="text-muted small">Após participar de um passeio ou visitar um local, o turista pode deixar uma avaliação de 1 a 5 estrelas no seu histórico de compras. Isso ajuda a manter o padrão de qualidade da nossa comunidade.</p>
                  </div>
                </div>
              )}

              {abaAtiva === 'termos' && (
                <div className="animation-fade">
                  <h3 className="fw-bold text-dark mb-4 border-bottom pb-3">Termos de Uso</h3>
                  <p className="text-muted mb-3">Última atualização: Julho de 2026</p>
                  <h6 className="fw-bold mt-4 mb-2">1. Aceitação dos Termos</h6>
                  <p className="text-muted small mb-4">Ao acessar e usar a plataforma Boeminha, você concorda em cumprir e ficar vinculado a estes Termos de Uso. O uso do serviço é restrito a usuários que forneçam informações verdadeiras no cadastro.</p>
                  
                  <h6 className="fw-bold mb-2">2. Responsabilidades dos Parceiros</h6>
                  <p className="text-muted small mb-4">Guias e donos de estabelecimentos são inteiramente responsáveis pela veracidade das informações, roteiros, horários e imagens publicadas em seus respectivos painéis de gestão. O Boeminha atua apenas como intermediador tecnológico.</p>

                  <h6 className="fw-bold mb-2">3. Política de Cancelamento e Cupons</h6>
                  <p className="text-muted small mb-4">Os cupons gerados pelo painel Business são de responsabilidade do emissor. Cancelamentos de roteiros devem ser solicitados com no mínimo 48 horas de antecedência para reembolso integral.</p>
                </div>
              )}

              {abaAtiva === 'privacidade' && (
                <div className="animation-fade">
                  <h3 className="fw-bold text-dark mb-4 border-bottom pb-3">Política de Privacidade</h3>
                  <p className="text-muted mb-4 small" style={{ lineHeight: '1.8' }}>
                    O Boeminha leva a proteção dos seus dados a sério. Utilizamos infraestrutura do Firebase (Google) para garantir a criptografia e segurança ponta a ponta das suas informações.
                  </p>
                  <ul className="list-unstyled text-muted small">
                    <li className="mb-3"><i className="fas fa-check text-success me-2"></i> <strong>Dados coletados:</strong> Nome, e-mail, foto de perfil, histórico de compras e comportamento de navegação dentro do site.</li>
                    <li className="mb-3"><i className="fas fa-check text-success me-2"></i> <strong>Uso dos dados:</strong> Utilizamos suas informações estritamente para processar ingressos, autenticar seu acesso e gerar estatísticas anônimas para os painéis dos nossos parceiros.</li>
                    <li className="mb-3"><i className="fas fa-check text-success me-2"></i> <strong>Compartilhamento:</strong> Seus dados de contato não são vendidos a terceiros. Apenas seu nome e foto são visíveis nas avaliações públicas.</li>
                  </ul>
                </div>
              )}

              {abaAtiva === 'midiakit' && (
                <div className="animation-fade">
                  <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
                    <h3 className="fw-bold text-dark m-0">Mídia Kit & Negócios</h3>
                    <Link to="/anuncie" className="btn btn-dark fw-bold rounded-pill px-4">Seja Parceiro</Link>
                  </div>
                  
                  <div className="row g-4 mb-5 text-center">
                    <div className="col-md-4">
                      <div className="bg-light p-4 rounded-4 border">
                        <h2 className="fw-bold text-success m-0">+5.000</h2>
                        <span className="small text-muted fw-bold text-uppercase">Acessos Mensais</span>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="bg-light p-4 rounded-4 border">
                        <h2 className="fw-bold text-success m-0">1.284</h2>
                        <span className="small text-muted fw-bold text-uppercase">Usuários Ativos</span>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="bg-light p-4 rounded-4 border">
                        <h2 className="fw-bold text-success m-0">18-35</h2>
                        <span className="small text-muted fw-bold text-uppercase">Faixa Etária Principal</span>
                      </div>
                    </div>
                  </div>

                  <h5 className="fw-bold text-dark mb-3">Por que anunciar no Boeminha?</h5>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="d-flex gap-3">
                        <div className="text-success fs-3"><i className="fas fa-chart-pie"></i></div>
                        <div>
                          <h6 className="fw-bold mb-1">Painel de Dados Real</h6>
                          <p className="text-muted small">Acompanhe visualizações, cliques e conversões do seu negócio em tempo real.</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="d-flex gap-3">
                        <div className="text-success fs-3"><i className="fas fa-ticket-alt"></i></div>
                        <div>
                          <h6 className="fw-bold mb-1">Gerador de Cupons</h6>
                          <p className="text-muted small">Crie promoções direcionadas exclusivamente para a comunidade engajada da plataforma.</p>
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