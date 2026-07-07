import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { atracoesDb } from '../data/database';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sugestoes, setSugestoes] = useState([]);
  const [mostrarSugestoes, setMostrarSugestoes] = useState(false);
  
  const navigate = useNavigate();

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

  return (
    <div style={{ paddingTop: '76px' }}>
      <div className="container">
        <div className="ad-banner-top bg-white border border-dashed rounded-3 d-flex align-items-center justify-content-center text-muted text-uppercase" style={{ height: '90px', margin: '20px auto', maxWidth: '1200px', letterSpacing: '2px', fontSize: '0.75rem' }}>
          <i className="fas fa-bullhorn me-2"></i> Espaço Publicitário (728x90)
        </div>
      </div>

      <header className="hero-section text-center position-relative mx-3 mb-5 rounded-4 overflow-hidden" style={{ padding: '100px 0', background: '#1b4332', color: 'white' }}>
        <div className="hero-bg position-absolute top-0 start-0 w-100 h-100" style={{ backgroundImage: 'url(https://www.niteroi.rj.gov.br/wp-content/uploads/2022/05/mac_pordosol.jpg)', opacity: 0.35, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
        <div className="container hero-content position-relative" style={{ zIndex: 10 }}>
          <h1 className="fw-bold mb-3" style={{ fontSize: '3rem', letterSpacing: '-1px' }}>Descubra a verdadeira Niterói.</h1>
          <p className="lead opacity-75 mx-auto mb-4" style={{ maxWidth: '650px' }}>
            Trilhas escondidas, a melhor gastronomia e eventos autênticos mapeados por especialistas.
          </p>
          
          <div className="search-container mx-auto position-relative" style={{ maxWidth: '600px', zIndex: 1050 }}>
            {/* O Z-INDEX 1060 AQUI GARANTE QUE A BARRA NUNCA SERÁ COBERTA POR NADA */}
            <div className="search-box bg-white p-2 rounded-pill d-flex shadow position-relative" style={{ zIndex: 1060 }}>
              <input 
                type="text" 
                className="form-control border-0 bg-transparent shadow-none px-3 fw-medium text-dark" 
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
            
            {/* O DROPDOWN INTELIGENTE AGORA COM TOP: 100% PARA DESCER CORRETAMENTE E MAX-HEIGHT PARA ROLAGEM */}
            {mostrarSugestoes && sugestoes.length > 0 && (
              <div className="position-absolute w-100 bg-white shadow-lg rounded-4 mt-2 py-2" style={{ top: '100%', left: 0, zIndex: 1050, border: '1px solid #eee', maxHeight: '300px', overflowY: 'auto' }}>
                {sugestoes.map((sug) => (
                  <div 
                    key={sug.id} 
                    className="px-4 py-3 text-dark fw-bold d-flex justify-content-between align-items-center"
                    style={{ cursor: 'pointer', transition: '0.2s', fontSize: '0.95rem', borderBottom: '1px solid #f8f9fa' }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f8f9fa'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'white'; }}
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
                        <span className="text-muted" style={{ fontSize: '0.75rem', fontWeight: 500 }}>{sug.tag}</span>
                      </div>
                    </div>
                    <i className="fas fa-arrow-right text-light opacity-50" style={{ fontSize: '0.8rem' }}></i>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      <section className="container mb-5" style={{ position: 'relative', zIndex: 1 }}>
        <div className="d-flex align-items-center justify-content-between mb-4">
          <h2 className="fw-bold m-0 text-dark">Experiências em Destaque</h2>
          <Link to="/explorar" className="text-success text-decoration-none fw-bold">Ver todas as opções <i className="fas fa-arrow-right ms-1"></i></Link>
        </div>
        
        <div className="bento-grid d-grid gap-3" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gridTemplateRows: 'repeat(2, 220px)' }}>
          <a href="https://www.ingresso.com" target="_blank" rel="noreferrer" className="bento-item position-relative rounded-4 overflow-hidden text-white border" style={{ gridColumn: 'span 2', gridRow: 'span 2', backgroundImage: "url('https://diariodocomercio.com.br/wp-content/uploads/2023/01/festa-pic.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <span className="badge bg-warning text-dark position-absolute top-0 start-0 m-3 fw-bold"><i className="fas fa-star me-1"></i> RECOMENDADO</span>
            <div className="position-absolute bottom-0 start-0 w-100 p-4" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)' }}>
              <p className="small mb-1 text-uppercase text-light opacity-75 fw-bold">Vida Noturna</p>
              <h3 className="fw-bold mb-0">Samba da cantareira: Ingressos Abertos</h3>
            </div>
          </a>
          
          <Link to="/explorar?busca=boemia" className="bento-item position-relative rounded-4 overflow-hidden text-white border" style={{ gridColumn: 'span 2', gridRow: 'span 1', backgroundImage: "url('https://conteudo.imguol.com.br/c/entretenimento/d4/2021/02/04/cada-cerveja-tem-um-tipo-especifico-de-copo-para-manter-as-principais-caracteristicas-veja-opcoes-1612483971132_v2_1x1.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <span className="badge bg-warning text-dark position-absolute top-0 start-0 m-3 fw-bold"><i className="fas fa-handshake me-1"></i> PARCEIRO</span>
            <div className="position-absolute bottom-0 start-0 w-100 p-4" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)' }}>
              <h3 className="fw-bold fs-4 mb-0">Gastronomia Raiz: Os melhores botecos</h3>
            </div>
          </Link>

          <Link to="/explorar?busca=natureza" className="bento-item position-relative rounded-4 overflow-hidden text-white border" style={{ gridColumn: 'span 1', gridRow: 'span 1', backgroundImage: "url('https://rotadesonhos.com/wp-content/uploads/2021/02/costao-de-itacoatiara-e-enseada-do-bananal_Moment-1024x576.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div className="position-absolute bottom-0 start-0 w-100 p-4" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)' }}>
              <h3 className="fw-bold fs-5 mb-0">Trilhas Guiadas</h3>
            </div>
          </Link>

          <Link to="/explorar?busca=cultura" className="bento-item position-relative rounded-4 overflow-hidden text-white border" style={{ gridColumn: 'span 1', gridRow: 'span 1', backgroundImage: "url('https://www.guiaviagensbrasil.com/imagens/belo-museu-de-arte-contemporanea-niteroi-rj.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div className="position-absolute bottom-0 start-0 w-100 p-4" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)' }}>
              <h3 className="fw-bold fs-5 mb-0">Cultura e Arte</h3>
            </div>
          </Link>
        </div>
      </section>

      <section className="business-section bg-white border-top py-5 mt-5">
        <div className="container text-center py-4">
          <div className="glass-card mx-auto bg-light rounded-4 p-5 border" style={{ maxWidth: '850px' }}>
            <h2 className="fw-bold mb-3 text-dark">Conecte seu negócio a novos exploradores.</h2>
            <p className="text-muted mb-4 px-lg-4">
              O BoeMinha é a vitrine oficial do turismo autêntico em Niterói. Impulsione seu restaurante, evento ou passeio em nossa plataforma e alcance um público direcionado.
            </p>
            <div className="d-flex flex-wrap justify-content-center gap-3 mt-4">
              <Link to="/midia-kit" className="btn btn-success rounded-pill px-4 py-2 fw-bold">VER MÍDIA KIT</Link>
              <Link to="/anuncie" className="btn btn-outline-success rounded-pill px-4 py-2 fw-bold">SEJA UM PARCEIRO</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}