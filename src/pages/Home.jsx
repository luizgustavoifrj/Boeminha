import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { firestore } from '../services/firebase';

export default function Home() {
  const [busca, setBusca] = useState('');
  const [anuncios, setAnuncios] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const buscarAnuncios = async () => {
      try {
        const snapshot = await firestore.collection('anuncios_patrocinados').where('status', '==', 'Ativo').get();
        const lista = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAnuncios(lista);
      } catch (error) {
        console.error("Erro ao buscar anúncios:", error);
      }
    };
    buscarAnuncios();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (busca.trim() !== '') {
      navigate(`/explorar?q=${busca}`);
    }
  };

  // Separação de anúncios para múltiplos espaços na página
  const anunciosTopo = anuncios.slice(0, 3);
  const anunciosMeio = anuncios.slice(3, 6);

  return (
    <div style={{ paddingTop: '76px', backgroundColor: '#f8fcf9', minHeight: '100vh' }}>
      
      {/* 1. HERO SECTION */}
      <section className="position-relative d-flex align-items-center" style={{ minHeight: '85vh', backgroundColor: '#112b20', overflow: 'hidden' }}>
        <div className="position-absolute w-100 h-100" style={{ backgroundImage: "url('https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Museu_de_Arte_Contempor%C3%A2nea_de_Niter%C3%B3i_-_Rio_de_Janeiro%2C_Brasil.jpg/1200px-Museu_de_Arte_Contempor%C3%A2nea_de_Niter%C3%B3i_-_Rio_de_Janeiro%2C_Brasil.jpg')", backgroundSize: 'cover', backgroundPosition: 'center', opacity: '0.4' }}></div>
        <div className="container position-relative" style={{ zIndex: 10 }}>
          <div className="row justify-content-center text-center">
            <div className="col-lg-9 col-xl-8">
              <span className="badge bg-success mb-3 px-3 py-2 text-uppercase letter-spacing shadow-sm">A Bússola Oficial de Niterói</span>
              <h1 className="display-3 fw-bold text-white mb-4" style={{ letterSpacing: '-1.5px', textShadow: '0 4px 15px rgba(0,0,0,0.3)' }}>Descubra a verdadeira essência da cidade.</h1>
              <p className="lead text-white-50 mb-5 px-md-5">Conectamos você às experiências mais autênticas, guias locais especializados e a uma rota gastronômica inesquecível.</p>
              
              <form onSubmit={handleSearch} className="bg-white p-2 rounded-pill shadow-lg d-flex align-items-center mx-auto" style={{ maxWidth: '600px' }}>
                <i className="fas fa-search text-muted ms-3 fs-5"></i>
                <input type="text" className="form-control border-0 shadow-none bg-transparent py-3 px-3 fs-5" placeholder="Ex: Trilha, Bar, Museu..." value={busca} onChange={(e) => setBusca(e.target.value)} />
                <button type="submit" className="btn btn-success fw-bold rounded-pill px-4 py-3 text-uppercase" style={{ letterSpacing: '1px' }}>Explorar</button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ESPAÇO PUBLICITÁRIO 1: CARROSSEL NO TOPO */}
      {anunciosTopo.length > 0 && (
        <section className="container" style={{ marginTop: '-40px', position: 'relative', zIndex: 20 }}>
          <div id="carouselPatrocinado" className="carousel slide shadow-lg rounded-4 overflow-hidden bg-dark" data-bs-ride="carousel" data-bs-interval="4000">
            <div className="carousel-inner">
              {anunciosTopo.map((anuncio, index) => (
                <div className={`carousel-item ${index === 0 ? 'active' : ''}`} key={anuncio.id}>
                  <a href={anuncio.link} target="_blank" rel="noopener noreferrer" className="d-block position-relative">
                    <img src={anuncio.imagemUrl} className="d-block w-100" style={{ height: '160px', objectFit: 'cover', opacity: '0.8' }} alt={anuncio.titulo} />
                    <div className="position-absolute top-50 start-50 translate-middle text-center w-100 px-3">
                      <span className="badge bg-warning text-dark mb-2 shadow-sm">PATROCINADO</span>
                      <h4 className="fw-bold text-white mb-0" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>{anuncio.titulo}</h4>
                    </div>
                  </a>
                </div>
              ))}
            </div>
            {anunciosTopo.length > 1 && (
              <>
                <button className="carousel-control-prev" type="button" data-bs-target="#carouselPatrocinado" data-bs-slide="prev">
                  <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                  <span className="visually-hidden">Anterior</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#carouselPatrocinado" data-bs-slide="next">
                  <span className="carousel-control-next-icon" aria-hidden="true"></span>
                  <span className="visually-hidden">Próximo</span>
                </button>
              </>
            )}
          </div>
        </section>
      )}

      {/* 2. CATEGORIAS RÁPIDAS */}
      <section className="container" style={{ marginTop: anunciosTopo.length > 0 ? '40px' : '-40px', position: 'relative', zIndex: 20 }}>
        <div className="row g-4 justify-content-center">
          <div className="col-md-3 col-6">
            <Link to="/explorar" className="card border-0 shadow-sm rounded-4 text-center p-4 text-decoration-none custom-card-hover bg-white h-100">
              <div className="bg-success bg-opacity-10 text-success rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '60px', height: '60px' }}><i className="fas fa-beer fs-3"></i></div>
              <h6 className="fw-bold text-dark m-0">Bares & Pubs</h6>
            </Link>
          </div>
          <div className="col-md-3 col-6">
            <Link to="/explorar" className="card border-0 shadow-sm rounded-4 text-center p-4 text-decoration-none custom-card-hover bg-white h-100">
              <div className="bg-success bg-opacity-10 text-success rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '60px', height: '60px' }}><i className="fas fa-utensils fs-3"></i></div>
              <h6 className="fw-bold text-dark m-0">Restaurantes</h6>
            </Link>
          </div>
          <div className="col-md-3 col-6">
            <Link to="/roteiros" className="card border-0 shadow-sm rounded-4 text-center p-4 text-decoration-none custom-card-hover bg-white h-100">
              <div className="bg-success bg-opacity-10 text-success rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '60px', height: '60px' }}><i className="fas fa-hiking fs-3"></i></div>
              <h6 className="fw-bold text-dark m-0">Trilhas & Natureza</h6>
            </Link>
          </div>
          <div className="col-md-3 col-6">
            <Link to="/roteiros" className="card border-0 shadow-sm rounded-4 text-center p-4 text-decoration-none custom-card-hover bg-white h-100">
              <div className="bg-success bg-opacity-10 text-success rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '60px', height: '60px' }}><i className="fas fa-landmark fs-3"></i></div>
              <h6 className="fw-bold text-dark m-0">Arte & Cultura</h6>
            </Link>
          </div>
        </div>
      </section>

      {/* 3. DESTAQUE: ROTEIROS GUIADOS */}
      <section className="py-5 my-5">
        <div className="container">
          <div className="d-flex justify-content-between align-items-end mb-5">
            <div>
              <span className="text-success fw-bold text-uppercase letter-spacing small"><i className="fas fa-fire me-2"></i>Em Alta</span>
              <h2 className="fw-bold text-dark display-6 m-0" style={{ letterSpacing: '-1px' }}>Experiências Guiadas</h2>
            </div>
            <Link to="/roteiros" className="btn btn-outline-dark fw-bold rounded-pill px-4 d-none d-md-block">Ver todos os roteiros</Link>
          </div>

          <div className="row g-4">
            <div className="col-md-6">
              <div className="card border-0 shadow-sm rounded-4 overflow-hidden text-white custom-card-hover h-100">
                <div style={{ height: '350px', backgroundImage: "url('https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Parque_da_Cidade_em_Niter%C3%B3i.jpg/1200px-Parque_da_Cidade_em_Niter%C3%B3i.jpg')", backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
                  <div className="position-absolute w-100 h-100" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)' }}></div>
                  <div className="position-absolute bottom-0 p-4 w-100">
                    <span className="badge bg-success mb-2">Ecoturismo</span>
                    <h3 className="fw-bold">Trilha Escondida do Tupinambá</h3>
                    <p className="text-white-50 mb-3" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>Descubra mirantes secretos na Mata Atlântica que apenas os locais conhecem.</p>
                    <Link to="/roteiros" className="btn btn-sm btn-light fw-bold rounded-pill px-3 text-success">Agendar Agora</Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card border-0 shadow-sm rounded-4 overflow-hidden text-white custom-card-hover h-100">
                <div style={{ height: '350px', backgroundImage: "url('https://diariodocomercio.com.br/wp-content/uploads/2023/01/festa-pic.jpg')", backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
                  <div className="position-absolute w-100 h-100" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)' }}></div>
                  <div className="position-absolute bottom-0 p-4 w-100">
                    <span className="badge bg-warning text-dark mb-2">Gastronomia</span>
                    <h3 className="fw-bold">Tour Gastronômico da Cantareira</h3>
                    <p className="text-white-50 mb-3" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>Mergulho cultural com degustação em 3 botecos clássicos da praça.</p>
                    <Link to="/roteiros" className="btn btn-sm btn-light fw-bold rounded-pill px-3 text-dark">Agendar Agora</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ESPAÇO PUBLICITÁRIO 2: SUGESTÕES PATROCINADAS NO MEIO DA PÁGINA */}
      {anunciosMeio.length > 0 && (
        <section className="container mb-5 pb-4">
          <div className="d-flex align-items-center mb-4">
            <h5 className="fw-bold text-dark m-0">Sugestões Patrocinadas</h5>
            <div className="ms-3 flex-grow-1" style={{ height: '1px', backgroundColor: '#e9ecef' }}></div>
          </div>
          <div className="row g-4">
            {anunciosMeio.map(anuncio => (
              <div className="col-md-4" key={anuncio.id}>
                <a href={anuncio.link} target="_blank" rel="noopener noreferrer" className="card border-0 shadow-sm rounded-4 overflow-hidden text-decoration-none custom-card-hover">
                  <div style={{ height: '140px', backgroundImage: `url(${anuncio.imagemUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                  <div className="card-body p-3 bg-white text-center">
                    <span className="badge bg-light text-muted border mb-2" style={{ fontSize: '0.65rem' }}>PATROCINADO</span>
                    <h6 className="fw-bold text-dark m-0 text-truncate">{anuncio.titulo}</h6>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. POR QUE O BOEMINHA? */}
      <section className="py-5 bg-white border-top border-bottom">
        <div className="container py-5">
          <div className="text-center mb-5">
            <h2 className="fw-bold text-dark mb-3" style={{ letterSpacing: '-1px' }}>Por que usar o Boeminha?</h2>
            <p className="text-muted">Desenhado para simplificar sua vida e apoiar a economia local.</p>
          </div>
          <div className="row g-5 text-center">
            <div className="col-md-4">
              <div className="bg-success bg-opacity-10 text-success rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4" style={{ width: '80px', height: '80px' }}>
                <i className="fas fa-shield-alt fs-2"></i>
              </div>
              <h5 className="fw-bold text-dark">Transações Seguras</h5>
              <p className="text-muted small">Pagamentos via PIX ou Cartão integrados com proteção de ponta a ponta.</p>
            </div>
            <div className="col-md-4">
              <div className="bg-success bg-opacity-10 text-success rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4" style={{ width: '80px', height: '80px' }}>
                <i className="fas fa-star fs-2"></i>
              </div>
              <h5 className="fw-bold text-dark">Curadoria Especializada</h5>
              <p className="text-muted small">Todos os roteiros e estabelecimentos passam por uma avaliação criteriosa antes de entrarem na plataforma.</p>
            </div>
            <div className="col-md-4">
              <div className="bg-success bg-opacity-10 text-success rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4" style={{ width: '80px', height: '80px' }}>
                <i className="fas fa-hands-helping fs-2"></i>
              </div>
              <h5 className="fw-bold text-dark">Apoio ao Guia Local</h5>
              <p className="text-muted small">Nossa plataforma dá autonomia e ferramentas profissionais para guias independentes crescerem.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CHAMADA PARA NEGÓCIOS (Business) */}
      <section className="py-5 mb-5">
        <div className="container py-4">
          <div className="card border-0 rounded-4 overflow-hidden shadow-lg" style={{ background: 'linear-gradient(135deg, #1b4332, #112b20)' }}>
            <div className="row g-0 align-items-center">
              <div className="col-lg-8 p-5">
                <span className="badge bg-warning text-dark mb-3 px-3 py-2 fw-bold text-uppercase">Boeminha Business</span>
                <h2 className="fw-bold text-white mb-3 display-6" style={{ letterSpacing: '-1px' }}>Tem um negócio em Niterói?</h2>
                <p className="lead text-white-50 mb-4">
                  Cadastre seu bar, restaurante ou serviço de guia de turismo. Tenha acesso a um painel de métricas, crie cupons e alcance milhares de exploradores.
                </p>
                <div className="d-flex flex-wrap gap-3">
                  <Link to="/anuncie" className="btn btn-success fw-bold rounded-pill px-4 py-3 fs-5 shadow-sm">Seja um Parceiro Oficial</Link>
                  <Link to="/midia-kit" className="btn btn-outline-light fw-bold rounded-pill px-4 py-3">Ver Mídia Kit</Link>
                </div>
              </div>
              <div className="col-lg-4 d-none d-lg-block text-center p-4">
                <i className="fas fa-store text-white opacity-25" style={{ fontSize: '12rem', transform: 'rotate(-10deg)' }}></i>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-card-hover { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .custom-card-hover:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important; }
      `}} />
    </div>
  );
}