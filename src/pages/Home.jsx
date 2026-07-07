import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { atracoesDb } from '../data/database';
import { firestore } from '../services/firebase';
import { useTheme } from '../ThemeContext'; // <-- Modo escuro ativado na Home!

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sugestoes, setSugestoes] = useState([]);
  const [mostrarSugestoes, setMostrarSugestoes] = useState(false);
  
  // Estado para puxar os anúncios reais cadastrados pelos parceiros no banco de dados
  const [anuncios, setAnuncios] = useState([]);
  
  const navigate = useNavigate();
  const { darkMode } = useTheme(); // Puxando o cérebro das cores

  useEffect(() => {
    const buscarAnuncios = async () => {
      try {
        const snapshot = await firestore.collection('anuncios_patrocinados').where('status', '==', 'Ativo').get();
        const lista = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAnuncios(lista);
      } catch (error) {
        console.error("Erro ao buscar anúncios patrocinados:", error);
      }
    };
    buscarAnuncios();
  }, []);

  // LÓGICA DE AUTOCOMPLETE INTELIGENTE
  const handleSearchInput = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim().length > 0) {
      const filtradas = atracoesDb.filter(attr => 
        attr.titulo.toLowerCase().includes(query.toLowerCase()) || 
        attr.tag.toLowerCase().includes(query.toLowerCase()) ||
        attr.categoria.toLowerCase().includes(query.toLowerCase())
      );
      setSugestoes(filtradas);
      setMostrarSugestoes(true);
    } else {
      setSugestoes([]);
      setMostrarSugestoes(false);
    }
  };

  const realizarBusca = (termo) => {
    const busca = termo || searchQuery;
    if (busca.trim() !== '') {
      navigate(`/explorar?busca=${encodeURIComponent(busca)}`);
    } else {
      navigate(`/explorar`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setMostrarSugestoes(false);
      realizarBusca();
    }
  };

  const anunciosTopo = anuncios.slice(0, 3);
  const anunciosRestantes = anuncios.slice(3, 9);

  return (
    <div style={{ paddingTop: '76px' }}>
      
      {/* ESPAÇO PUBLICITÁRIO FIXO / TOPO */}
      <div className="container">
        <div className={`ad-banner-top border border-dashed rounded-3 d-flex align-items-center justify-content-center text-uppercase ${darkMode ? 'bg-dark text-light border-secondary' : 'bg-white text-muted'}`} style={{ height: '90px', margin: '20px auto', maxWidth: '1200px', letterSpacing: '2px', fontSize: '0.75rem' }}>
          <i className="fas fa-bullhorn me-2"></i> Espaço Publicitário (728x90)
        </div>
      </div>

      {/* CARROSSEL DINÂMICO DE ANÚNCIOS DO SISTEMA */}
      {anunciosTopo.length > 0 && (
        <div className="container mb-4" style={{ maxWidth: '1200px' }}>
          <div id="carouselPatrocinadoHome" className={`carousel slide shadow-sm rounded-4 overflow-hidden border ${darkMode ? 'bg-dark border-secondary' : 'bg-white'}`} data-bs-ride="carousel" data-bs-interval="4000">
            <div className="carousel-inner">
              {anunciosTopo.map((anuncio, idx) => (
                <div className={`carousel-item ${idx === 0 ? 'active' : ''}`} key={anuncio.id}>
                  <a href={anuncio.link} target="_blank" rel="noreferrer" className="d-block position-relative text-decoration-none">
                    <img src={anuncio.imagemUrl} className="d-block w-100" style={{ height: '150px', objectFit: 'cover' }} alt={anuncio.titulo} />
                    <div className="position-absolute bottom-0 start-0 w-100 p-2 text-white bg-dark bg-opacity-75 d-flex justify-content-between align-items-center px-3 small">
                      <span className="badge bg-warning text-dark fw-bold">PATROCINADO BUSINESS</span>
                      <span className="fw-bold text-truncate ms-2 text-white">{anuncio.titulo}</span>
                    </div>
                  </a>
                </div>
              ))}
            </div>
            {anunciosTopo.length > 1 && (
              <>
                <button className="carousel-control-prev" type="button" data-bs-target="#carouselPatrocinadoHome" data-bs-slide="prev">
                  <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#carouselPatrocinadoHome" data-bs-slide="next">
                  <span className="carousel-control-next-icon" aria-hidden="true"></span>
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* HEADER HERO SECTION */}
      <header className="hero-section text-center position-relative mx-3 mb-5 rounded-4" style={{ padding: '100px 0', background: '#1b4332', color: 'white' }}>
        <div className="hero-bg position-absolute top-0 start-0 w-100 h-100 rounded-4" style={{ backgroundImage: 'url(https://www.niteroi.rj.gov.br/wp-content/uploads/2022/05/mac_pordosol.jpg)', opacity: darkMode ? 0.2 : 0.35, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
        
        <div className="container hero-content position-relative" style={{ zIndex: 10 }}>
          <h1 className="fw-bold mb-3" style={{ fontSize: '3rem', letterSpacing: '-1px' }}>Descubra a verdadeira Niterói.</h1>
          <p className="lead opacity-75 mx-auto mb-4" style={{ maxWidth: '650px' }}>
            Trilhas escondidas, a melhor gastronomia e eventos autênticos mapeados por especialistas.
          </p>
          
          <div className="search-container mx-auto position-relative" style={{ maxWidth: '600px', zIndex: 1050 }}>
            <div className={`search-box p-2 rounded-pill d-flex shadow position-relative ${darkMode ? 'bg-dark border border-secondary' : 'bg-white'}`} style={{ zIndex: 1060 }}>
              <input 
                type="text" 
                className={`form-control border-0 bg-transparent shadow-none px-3 fw-medium ${darkMode ? 'text-white' : 'text-dark'}`}
                placeholder="O que você quer explorar hoje?" 
                value={searchQuery}
                onChange={handleSearchInput}
                onKeyDown={handleKeyDown}
                onFocus={() => { if(sugestoes.length > 0) setMostrarSugestoes(true); }}
                onBlur={() => setTimeout(() => setMostrarSugestoes(false), 200)}
                autoComplete="off"
              />
              <button className="btn btn-success rounded-pill px-4 fw-bold" onClick={() => realizarBusca()}>
                <i className="fas fa-search"></i>
              </button>
            </div>
            
            {mostrarSugestoes && sugestoes.length > 0 && (
              <div className={`position-absolute w-100 shadow-lg rounded-4 mt-2 py-2 text-start ${darkMode ? 'bg-dark border border-secondary' : 'bg-white'}`} style={{ top: '100%', left: 0, zIndex: 1050, maxHeight: '300px', overflowY: 'auto' }}>
                {sugestoes.map((sug) => (
                  <div 
                    key={sug.id} 
                    className={`px-4 py-3 fw-bold d-flex justify-content-between align-items-center ${darkMode ? 'text-light' : 'text-dark'}`}
                    style={{ cursor: 'pointer', transition: '0.2s', fontSize: '0.95rem', borderBottom: darkMode ? '1px solid #333' : '1px solid #f8f9fa' }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = darkMode ? '#333' : '#f8f9fa'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                    onClick={() => {
                      setSearchQuery(sug.titulo);
                      setSugestoes([]);
                      realizarBusca(sug.titulo);
                    }}
                  >
                    <div className="d-flex align-items-center">
                      <i className="fas fa-map-marker-alt text-success me-3 fs-5"></i>
                      <div className="text-start">
                        {sug.titulo} <br/>
                        <span className={darkMode ? 'text-secondary' : 'text-muted'} style={{ fontSize: '0.75rem', fontWeight: 500 }}>{sug.tag}</span>
                      </div>
                    </div>
                    <i className="fas fa-arrow-right opacity-50" style={{ fontSize: '0.8rem', color: darkMode ? '#888' : '#ccc' }}></i>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* BENTO GRID (AGORA COM LINKS FUNCIONAIS) */}
      <section className="container mb-5" style={{ position: 'relative', zIndex: 1 }}>
        <div className="d-flex align-items-center justify-content-between mb-4">
          <h2 className={`fw-bold m-0 ${darkMode ? 'text-white' : 'text-dark'}`}>Experiências em Destaque</h2>
          <Link to="/explorar" className="text-success text-decoration-none fw-bold">Ver todas as opções <i className="fas fa-arrow-right ms-1"></i></Link>
        </div>
        
        <div className="bento-grid d-grid gap-3" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gridTemplateRows: 'repeat(2, 220px)' }}>
          {/* Link para Samba */}
          <Link to="/explorar?busca=samba" className={`bento-item position-relative rounded-4 overflow-hidden text-white text-decoration-none border ${darkMode ? 'border-secondary' : ''}`} style={{ gridColumn: 'span 2', gridRow: 'span 2', backgroundImage: "url('https://diariodocomercio.com.br/wp-content/uploads/2023/01/festa-pic.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <span className="badge bg-warning text-dark position-absolute top-0 start-0 m-3 fw-bold"><i className="fas fa-star me-1"></i> RECOMENDADO</span>
            <div className="position-absolute bottom-0 start-0 w-100 p-4" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)' }}>
              <p className="small mb-1 text-uppercase text-light opacity-75 fw-bold">Vida Noturna</p>
              <h3 className="fw-bold mb-0 text-white">Samba da cantareira: Ingressos Abertos</h3>
            </div>
          </Link>
          
          {/* Link para Botecos */}
          <Link to="/explorar?busca=boteco" className={`bento-item position-relative rounded-4 overflow-hidden text-white text-decoration-none border ${darkMode ? 'border-secondary' : ''}`} style={{ gridColumn: 'span 2', gridRow: 'span 1', backgroundImage: "url('https://conteudo.imguol.com.br/c/entretenimento/d4/2021/02/04/cada-cerveja-tem-um-tipo-especifico-de-copo-para-manter-as-principais-caracteristicas-veja-opcoes-1612483971132_v2_1x1.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <span className="badge bg-warning text-dark position-absolute top-0 start-0 m-3 fw-bold"><i className="fas fa-handshake me-1"></i> PARCEIRO</span>
            <div className="position-absolute bottom-0 start-0 w-100 p-4" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)' }}>
              <h3 className="fw-bold fs-4 mb-0 text-white">Gastronomia Raiz: Os melhores botecos</h3>
            </div>
          </Link>

          {/* Link para Trilhas */}
          <Link to="/explorar?busca=trilha" className={`bento-item position-relative rounded-4 overflow-hidden text-white text-decoration-none border ${darkMode ? 'border-secondary' : ''}`} style={{ gridColumn: 'span 1', gridRow: 'span 1', backgroundImage: "url('https://rotadesonhos.com/wp-content/uploads/2021/02/costao-de-itacoatiara-e-enseada-do-bananal_Moment-1024x576.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div className="position-absolute bottom-0 start-0 w-100 p-4" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)' }}>
              <h3 className="fw-bold fs-5 mb-0 text-white">Trilhas Guiadas</h3>
            </div>
          </Link>

          {/* Link para Cultura */}
          <Link to="/explorar?busca=cultura" className={`bento-item position-relative rounded-4 overflow-hidden text-white text-decoration-none border ${darkMode ? 'border-secondary' : ''}`} style={{ gridColumn: 'span 1', gridRow: 'span 1', backgroundImage: "url('https://www.guiaviagensbrasil.com/imagens/belo-museu-de-arte-contemporanea-niteroi-rj.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div className="position-absolute bottom-0 start-0 w-100 p-4" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)' }}>
              <h3 className="fw-bold fs-5 mb-0 text-white">Cultura e Arte</h3>
            </div>
          </Link>
        </div>
      </section>

      {/* ESPAÇO PUBLICITÁRIO EXTRAS / VITRINE DE PATROCINADOS DO MEIO */}
      {anunciosRestantes.length > 0 && (
        <section className="container mb-5">
          <div className={`p-4 rounded-4 border ${darkMode ? 'bg-dark border-secondary' : 'bg-light'}`}>
            <h5 className={`fw-bold mb-3 ${darkMode ? 'text-white' : 'text-dark'}`}><i className="fas fa-bullhorn text-success me-2"></i>Destaques da Comunidade Business</h5>
            <div className="row g-3">
              {anunciosRestantes.map(anuncio => (
                <div className="col-md-4" key={anuncio.id}>
                  <a href={anuncio.link} target="_blank" rel="noreferrer" className="card border-0 shadow-sm rounded-3 overflow-hidden text-decoration-none h-100 custom-card-hover">
                    <img src={anuncio.imagemUrl} alt={anuncio.titulo} style={{ height: '100px', objectFit: 'cover' }} />
                    <div className={`p-2 small fw-bold text-center text-truncate ${darkMode ? 'bg-secondary text-white' : 'bg-white text-dark'}`}>{anuncio.titulo}</div>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SEÇÃO DE CATEGORIAS (AGORA SÃO LINKS CLIcÁVEIS) */}
      <section className="container my-5 py-4 text-center">
        <h2 className={`fw-bold mb-1 ${darkMode ? 'text-white' : 'text-dark'}`}>Explorando por Categorias</h2>
        <p className={`${darkMode ? 'text-light opacity-75' : 'text-muted'} mb-5`}>Tudo o que Niterói tem para oferecer na palma da sua mão.</p>
        
        <div className="row g-4">
          {/* Categoria 1: Bares -> Leva ao explorar com busca=boemia */}
          <div className="col-md-4">
            <Link to="/explorar?busca=boemia" className="text-decoration-none d-block custom-card-hover h-100">
              <div className={`card border-0 shadow-sm rounded-4 p-4 h-100 ${darkMode ? 'bg-dark border border-secondary' : 'bg-white'}`}>
                <div className="text-success fs-1 mb-3"><i className="fas fa-beer"></i></div>
                <h5 className={`fw-bold ${darkMode ? 'text-white' : 'text-dark'}`}>Bares & Botequim</h5>
                <p className={`small m-0 ${darkMode ? 'text-light opacity-75' : 'text-muted'}`}>Os melhores locais para curtir a noite boêmia.</p>
              </div>
            </Link>
          </div>
          
          {/* Categoria 2: Roteiros -> Leva direto à página de Roteiros */}
          <div className="col-md-4">
            <Link to="/roteiros" className="text-decoration-none d-block custom-card-hover h-100">
              <div className={`card border-0 shadow-sm rounded-4 p-4 h-100 ${darkMode ? 'bg-dark border border-secondary' : 'bg-white'}`}>
                <div className="text-success fs-1 mb-3"><i className="fas fa-map-marked-alt"></i></div>
                <h5 className={`fw-bold ${darkMode ? 'text-white' : 'text-dark'}`}>Roteiros Exclusivos</h5>
                <p className={`small m-0 ${darkMode ? 'text-light opacity-75' : 'text-muted'}`}>Passeios guiados por especialistas locais.</p>
              </div>
            </Link>
          </div>
          
          {/* Categoria 3: Parceiros -> Leva ao Explorar geral para ver tudo */}
          <div className="col-md-4">
            <Link to="/explorar" className="text-decoration-none d-block custom-card-hover h-100">
              <div className={`card border-0 shadow-sm rounded-4 p-4 h-100 ${darkMode ? 'bg-dark border border-secondary' : 'bg-white'}`}>
                <div className="text-success fs-1 mb-3"><i className="fas fa-store"></i></div>
                <h5 className={`fw-bold ${darkMode ? 'text-white' : 'text-dark'}`}>Catálogo Completo</h5>
                <p className={`small m-0 ${darkMode ? 'text-light opacity-75' : 'text-muted'}`}>Estabelecimentos verificados em um só lugar.</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION BUSINESS ORIGINAL */}
      <section className={`business-section py-5 mt-5 ${darkMode ? 'border-top border-secondary' : 'bg-white border-top'}`}>
        <div className="container text-center py-4">
          <div className={`glass-card mx-auto rounded-4 p-5 ${darkMode ? 'bg-dark border border-secondary' : 'bg-light border'}`} style={{ maxWidth: '850px' }}>
            <h2 className={`fw-bold mb-3 ${darkMode ? 'text-white' : 'text-dark'}`}>Conecte seu negócio a novos exploradores.</h2>
            <p className={`${darkMode ? 'text-light opacity-75' : 'text-muted'} mb-4 px-lg-4`}>
              O BoeMinha é a vitrine oficial do turismo autêntico em Niterói. Impulsione seu restaurante, evento ou passeio em nossa plataforma e alcance um público direcionado.
            </p>
            <div className="d-flex flex-wrap justify-content-center gap-3 mt-4">
              <Link to="/midia-kit" className="btn btn-success rounded-pill px-4 py-2 fw-bold">VER MÍDIA KIT</Link>
              <Link to="/anuncie" className="btn btn-outline-success rounded-pill px-4 py-2 fw-bold">SEJA UM PARCEIRO</Link>
            </div>
          </div>
        </div>
      </section>
      
      <style dangerouslySetInnerHTML={{__html: `
        .custom-card-hover { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .custom-card-hover:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.15) !important; }
      `}} />
    </div>
  );
}