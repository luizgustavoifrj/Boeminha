import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { firestore } from '../services/firebase';
import { useTheme } from '../ThemeContext'; // <-- Importando o Cérebro do Tema!

export default function Roteiros() {
  const navigate = useNavigate();
  const [roteiros, setRoteiros] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const { darkMode } = useTheme(); // <-- Lendo se está escuro ou claro

  // Estados para o novo Modal e Notificação
  const [roteiroSelecionado, setRoteiroSelecionado] = useState(null);
  const [notificacao, setNotificacao] = useState('');

  // Roteiros fixos atualizados com a estatística de passeios realizados
  const roteirosIniciais = [
    {
      id: "rot-1",
      titulo: "Trilha Escondida do Tupinambá",
      descricao: "Descubra mirantes secretos na Mata Atlântica que apenas os locais conhecem. Nível moderado, ideal para aventureiros. O trajeto includes paradas estratégicas para hidratação e fotos panorâmicas da Baía de Guanabara.",
      duracao: "4 horas",
      preco: 45.00,
      imagem: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Parque_da_Cidade_em_Niter%C3%B3i.jpg/1200px-Parque_da_Cidade_em_Niter%C3%B3i.jpg",
      guia: { nome: "Aline Silva", foto: "https://randomuser.me/api/portraits/women/32.jpg", avaliacao: 4.9, especialidade: "Ecoturismo", passeiosRealizados: 124 }
    },
    {
      id: "rot-2",
      titulo: "Circuito Niemeyer Noturno",
      descricao: "Passeio arquitetônico pelas obras de Oscar Niemeyer à noite, com paradas estratégicas para fotos e muita história. Ideal para quem quer entender a genialidade por trás das curvas do MAC e do Teatro Popular.",
      duracao: "3 horas",
      preco: 60.00,
      imagem: "https://www.guiaviagensbrasil.com/imagens/belo-museu-de-arte-contemporanea-niteroi-rj.jpg",
      guia: { nome: "Carlos Eduardo", foto: "https://randomuser.me/api/portraits/men/22.jpg", avaliacao: 4.8, especialidade: "Cultura & História", passeiosRealizados: 89 }
    },
    {
      id: "rot-3",
      titulo: "Tour Gastronômico da Cantareira",
      descricao: "Mergulho cultural com degustação em 3 botecos clássicos da praça. O valor já inclui 3 chopes artesanais, petiscos locais e uma aula sobre a história boêmia da região. Venha com fome!",
      duracao: "4 horas",
      preco: 120.00,
      imagem: "https://diariodocomercio.com.br/wp-content/uploads/2023/01/festa-pic.jpg",
      patrocinado: true,
      linkPatrocinado: "https://www.ingresso.com",
      lat: -22.9015, lng: -43.132,
      dias: "Quinta a Domingo", horario: "A partir das 18h",
      endereco: "Rua Alexandre Moura, 2A - São Domingos"
    }
  ];

  useEffect(() => {
    const carregarRoteiros = async () => {
      try {
        const snapshot = await firestore.collection('roteiros_parceiros').where('status', '==', 'Aprovado').get();
        const doFirebase = snapshot.docs.map(doc => ({ id: doc.id, ...data() }));
        setAtracoes([...atracoesDb, ...filtradasBD]);
      } catch (error) {
        // Fallback caso dê erro no firebase ou esteja vazio, mantém os locais padrão mapeados
        setAtracoes(atracoesDb);
      }
    };
    carregarRoteiros();
  }, []);

  const adicionarAoCarrinho = (local) => {
    const cartSalvo = JSON.parse(localStorage.getItem('boeminha_cart')) || [];
    const itemExistente = cartSalvo.find(item => item.id === local.id);

    if (itemExistente) {
      itemExistente.qtd += 1; 
    } else {
      cartSalvo.push({
        id: local.id,
        titulo: local.titulo,
        imagem: local.imagem,
        preco: local.preco,
        qtd: 1
      });
    }
    localStorage.setItem('boeminha_cart', JSON.stringify(cartSalvo));
  };

  return (
    // Removido o backgroundColor fixado por estilo inline para obedecer o tema global
    <div style={{ paddingTop: '76px', minHeight: '100vh' }}>
      
      <header className="text-center text-white" style={{ background: 'linear-gradient(135deg, #1b4332 0%, #2d6a4f 100%)', padding: '60px 0 100px 0' }}>
        <div className="container">
          <h1 className="fw-bold mb-2 text-white" style={{ fontSize: '2.5rem' }}>Roteiros Guiados</h1>
          <p className="lead opacity-75 mx-auto mb-0" style={{ maxWidth: '650px', fontSize: '1.05rem' }}>
            Experiências completas desenhadas e conduzidas pelos melhores guias locais da cidade.
          </p>
        </div>
      </header>

      <section className="container" style={{ marginTop: '-60px', position: 'relative', zIndex: 10, paddingBottom: '100px' }}>
        <div className="row g-4">
          {atracoes.length === 0 ? (
            <div className="col-12 text-center py-5 card border-0 shadow-sm rounded-4">
              <h5 className="text-muted fw-bold">Nenhum roteiro disponível no momento.</h5>
            </div>
          ) : (
            atracoes.map(attr => (
              <div className="col-lg-4 col-md-6" key={attr.id}>
                {/* A classe 'bg-white' sairá automaticamente no CSS dinâmico global */}
                <div className={`card h-100 border-0 shadow-lg rounded-4 overflow-hidden bg-white`}>
                  <div style={{ height: '200px', backgroundImage: `url(${attr.imagem})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
                    <span className="badge bg-dark bg-opacity-75 text-white position-absolute bottom-0 start-0 m-3 p-2 fw-bold small">
                      <i className="far fa-clock me-1"></i> {attr.duracao}
                    </span>
                  </div>
                  
                  <div className="card-body p-4 d-flex flex-column">
                    {/* Perfil do Guia */}
                    <div className={`d-flex align-items-center mb-3 pb-3 border-bottom ${darkMode ? 'border-secondary' : ''}`}>
                      <img src={attr.guia?.foto} alt={attr.guia?.nome} className="rounded-circle shadow-sm me-3" style={{ width: '45px', height: '45px', objectFit: 'cover' }} />
                      <div>
                        <h6 className="mb-0 fw-bold" style={{ fontSize: '0.9rem' }}>{attr.guia?.nome}</h6>
                        <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                          <i className="fas fa-star text-warning me-1"></i>{attr.guia?.avaliacao} • {attr.guia?.passeiosRealizados} passeios
                        </small>
                      </div>
                    </div>

                    <h5 className="fw-bold text-truncate mb-2">{attr.titulo}</h5>
                    <p className="text-muted small flex-grow-1" style={{ display: '-webkit-box', WebkitLineClamp: '3', WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: '1.5' }}>
                      {attr.descricao}
                    </p>
                    
                    <div className={`mt-auto pt-3 border-top d-flex justify-content-between align-items-center ${darkMode ? 'border-secondary' : ''}`}>
                      <span className="fw-bold text-success fs-5">
                        {attr.preco > 0 ? `R$ ${attr.preco.toFixed(2).replace('.', ',')}` : 'Gratuito'}
                      </span>
                      
                      <button onClick={() => setRoteiroSelecionado(attr)} className={`btn fw-bold rounded-pill px-4 shadow-sm ${darkMode ? 'btn-light text-dark' : 'btn-dark'}`}>
                        Ver Detalhes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* MODAL RESPONSIVO AO TEMA ESCURO */}
      {roteiroSelecionado && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className={`modal-content rounded-4 border-0 overflow-hidden ${darkMode ? 'bg-dark border border-secondary text-white' : ''}`}>
              
              <div className="position-relative" style={{ height: '300px', backgroundImage: `url(${roteiroSelecionado.imagem})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <button type="button" className="btn-close btn-close-white position-absolute top-0 end-0 m-3" onClick={() => setRoteiroSelecionado(null)} style={{ zIndex: 10 }}></button>
                <div className="position-absolute bottom-0 start-0 w-100 p-4" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)' }}>
                  <span className="badge bg-success mb-2 px-3 py-2 text-uppercase letter-spacing">{roteiroSelecionado.guia?.especialidade || 'Especialista'}</span>
                  <h2 className="fw-bold text-white mb-0">{roteiroSelecionado.titulo}</h2>
                </div>
              </div>

              {/* Removido o bg-white fixo para o ThemeContext gerenciar */}
              <div className="modal-body p-4 p-md-5">
                <div className="row g-4">
                  
                  <div className="col-md-7">
                    <h5 className="fw-bold mb-3">Sobre o Roteiro</h5>
                    <p className={`${darkMode ? 'text-light opacity-75' : 'text-muted'}`} style={{ lineHeight: '1.7' }}>{roteiroSelecionado.descricao}</p>
                    
                    <div className="d-flex gap-4 mt-4">
                      <div>
                        <span className="d-block small text-muted fw-bold text-uppercase">Duração</span>
                        <span className="fw-bold"><i className="far fa-clock text-success me-1"></i> {roteiroSelecionado.duracao}</span>
                      </div>
                      {roteiroSelecionado.horario && (
                        <div>
                          <span className="d-block small text-muted fw-bold text-uppercase">Início</span>
                          <span className="fw-bold"><i className="fas fa-hourglass-start text-success me-1"></i> {roteiroSelecionado.horario}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="col-md-5">
                    {/* Alterado bg-light fixo por uma classe dinâmica */}
                    <div className={`p-4 rounded-4 border ${darkMode ? 'bg-dark border-secondary' : 'bg-light'}`}>
                      <h6 className="fw-bold mb-3 text-uppercase" style={{ fontSize: '0.8rem', letterSpacing: '1px' }}>Seu Guia</h6>
                      <div className="d-flex align-items-center mb-3">
                        <img src={roteiroSelecionado.guia?.foto} alt={roteiroSelecionado.guia?.nome} className="rounded-circle me-3 border border-2 border-success" style={{ width: '60px', height: '60px', objectFit: 'cover' }} />
                        <div>
                          <h6 className="fw-bold m-0">{roteiroSelecionado.guia?.nome}</h6>
                          <div className="text-warning small mt-1">
                            <i className="fas fa-star"></i> <span className={`fw-bold ${darkMode ? 'text-white' : 'text-dark'}`}>{roteiroSelecionado.guia?.avaliacao}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className={`d-flex justify-content-between align-items-center p-2 rounded-3 border mb-4 ${darkMode ? 'bg-dark border-secondary' : 'bg-white'}`}>
                        <span className="small text-muted fw-bold">Passeios pelo Boeminha:</span>
                        <span className={`badge fs-6 ${darkMode ? 'bg-secondary text-white' : 'bg-dark'}`}>{roteiroSelecionado.guia?.passeiosRealizados}</span>
                      </div>

                      <div className={`border-top pt-3 text-center ${darkMode ? 'border-secondary' : ''}`}>
                        <span className="d-block small text-muted fw-bold mb-1">Valor por pessoa</span>
                        <h3 className="fw-bold text-success mb-3">R$ {roteiroSelecionado.preco.toFixed(2).replace('.', ',')}</h3>
                        <button onClick={() => adicionarAoCarrinho(roteiroSelecionado)} className="btn btn-success fw-bold w-100 rounded-pill py-2 shadow-sm">
                          <i className="fas fa-cart-plus me-2"></i> Adicionar ao Carrinho
                        </button>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Notificação Toast */}
      {notificacao && (
        <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 2000 }}>
          <div className="toast show align-items-center text-white bg-success border-0 shadow-lg" role="alert">
            <div className="d-flex">
              <div className="toast-body fw-bold">
                <i className="fas fa-check-circle me-2"></i> {notificacao}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}