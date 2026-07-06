import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

// Banco de dados embutido para o Autocomplete da busca
const atracoesParaSugestao = [
  { titulo: "MAC Niterói", tag: "Arte & Cultura", icon: "fa-palette" },
  { titulo: "Costão de Itacoatiara", tag: "Trilha & Mirante", icon: "fa-tree" },
  { titulo: "Samba da Cantareira", tag: "Música & Bar", icon: "fa-beer" },
  { titulo: "Parque da Cidade", tag: "Pôr do Sol", icon: "fa-tree" },
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sugestoes, setSugestoes] = useState([]);
  const navigate = useNavigate();

  // Lógica do Autocomplete
  const handleSearchInput = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim().length > 0) {
      const filtradas = atracoesParaSugestao.filter(attr => 
        attr.titulo.toLowerCase().includes(query.toLowerCase()) || 
        attr.tag.toLowerCase().includes(query.toLowerCase())
      );
      setSugestoes(filtradas);
    } else {
      setSugestoes([]);
    }
  };

  // Redireciona para a página de Explorar com o termo na URL
  const realizarBusca = (termo) => {
    const busca = termo || searchQuery;
    if (busca.trim() !== '') {
      navigate(`/explorar?busca=${encodeURIComponent(busca)}`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') realizarBusca();
  };

  return (
    <div style={{ paddingTop: '76px' }}>
      {/* Banner de Anúncio Topo */}
      <div className="container">
        <div className="ad-banner-top bg-white border border-dashed rounded-3 d-flex align-items-center justify-content-center text-muted text-uppercase" style={{ height: '90px', margin: '20px auto', maxWidth: '1200px', letterSpacing: '2px', fontSize: '0.75rem' }}>
          <i className="fas fa-bullhorn me-2"></i> Espaço Publicitário (728x90)
        </div>
      </div>

      {/* Hero e Autocomplete */}
      <header className="hero-section text-center position-relative mx-3 mb-5 rounded-4 overflow-hidden" style={{ padding: '100px 0', background: '#1b4332', color: 'white' }}>
        <div className="hero-bg position-absolute top-0 start-0 w-100 h-100" style={{ backgroundImage: 'url(https://www.niteroi.rj.gov.br/wp-content/uploads/2022/05/mac_pordosol.jpg)', opacity: 0.35, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
        <div className="container hero-content position-relative" style={{ zIndex: 2 }}>
          <h1 className="fw-bold mb-3" style={{ fontSize: '3rem', letterSpacing: '-1px' }}>Descubra a verdadeira Niterói.</h1>
          <p className="lead opacity-75 mx-auto mb-4" style={{ maxWidth: '650px' }}>
            Trilhas escondidas, a melhor gastronomia e eventos autênticos mapeados por especialistas.
          </p>
          
          <div className="search-container mx-auto position-relative" style={{ maxWidth: '600px' }}>
            <div className="search-box bg-white p-2 rounded-pill d-flex shadow position-relative" style={{ zIndex: 10 }}>
              <input 
                type="text" 
                className="form-control border-0 bg-transparent shadow-none px-3 fw-medium" 
                placeholder="O que você quer explorar hoje?" 
                value={searchQuery}
                onChange={handleSearchInput}
                onKeyPress={handleKeyPress}
                autoComplete="off"
              />
              <button className="btn btn-success rounded-pill px-4 fw-bold" onClick={() => realizarBusca()}>
                <i className="fas fa-search"></i>
              </button>
            </div>
            
            {/* Caixa de Sugestões do Autocomplete */}
            {sugestoes.length > 0 && (
              <div className="suggestions-box position-absolute bg-white w-100 text-start shadow" style={{ top: '50%', left: 0, borderRadius: '0 0 20px 20px', paddingTop: '35px', zIndex: 5, maxHeight: '250px', overflowY: 'auto' }}>
                {sugestoes.map((attr, index) => (
                  <div 
                    key={index} 
                    className="suggestion-item d-flex align-items-center p-3 border-bottom text-dark" 
                    style={{ cursor: 'pointer', fontWeight: 600 }}
                    onClick={() => {
                      setSearchQuery(attr.titulo);
                      setSugestoes([]);
                      realizarBusca(attr.titulo);
                    }}
                  >
                    <i className={`fas ${attr.icon} text-success me-3 fs-5`}></i>
                    <div>
                      {attr.titulo} <br/>
                      <span style={{ fontSize: '0.75rem', opacity: 0.7, fontWeight: 500 }}>{attr.tag}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Bento Grid Completo */}
      <section className="container mb-5">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <h2 className="fw-bold m-0 text-dark">Experiências em Destaque</h2>
          <Link to="/explorar" className="text-success text-decoration-none fw-bold">Ver todas as opções <i className="fas fa-arrow-right ms-1"></i></Link>
        </div>
        
        <div className="bento-grid d-grid gap-3" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gridTemplateRows: 'repeat(2, 220px)' }}>
          {/* Item 1 */}
          <a href="https://www.ingresso.com" target="_blank" rel="noreferrer" className="bento-item position-relative rounded-4 overflow-hidden text-white border" style={{ gridColumn: 'span 2', gridRow: 'span 2', backgroundImage: "url('https://diariodocomercio.com.br/wp-content/uploads/2023/01/festa-pic.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <span className="badge bg-warning text-dark position-absolute top-0 start-0 m-3 fw-bold"><i className="fas fa-star me-1"></i> RECOMENDADO</span>
            <div className="position-absolute bottom-0 start-0 w-100 p-4" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)' }}>
              <p className="small mb-1 text-uppercase text-light opacity-75 fw-bold">Vida Noturna</p>
              <h3 className="fw-bold mb-0">Samba da Cantareira: Ingressos Abertos</h3>
            </div>
          </a>
          
          {/* Item 2 */}
          <Link to="/explorar" className="bento-item position-relative rounded-4 overflow-hidden text-white border" style={{ gridColumn: 'span 2', gridRow: 'span 1', backgroundImage: "url('https://conteudo.imguol.com.br/c/entretenimento/d4/2021/02/04/cada-cerveja-tem-um-tipo-especifico-de-copo-para-manter-as-principais-caracteristicas-veja-opcoes-1612483971132_v2_1x1.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <span className="badge bg-warning text-dark position-absolute top-0 start-0 m-3 fw-bold"><i className="fas fa-handshake me-1"></i> PARCEIRO</span>
            <div className="position-absolute bottom-0 start-0 w-100 p-4" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)' }}>
              <h3 className="fw-bold fs-4 mb-0">Gastronomia Raiz: Os melhores botecos</h3>
            </div>
          </Link>

          {/* Item 3 */}
          <Link to="/explorar" className="bento-item position-relative rounded-4 overflow-hidden text-white border" style={{ gridColumn: 'span 1', gridRow: 'span 1', backgroundImage: "url('https://rotadesonhos.com/wp-content/uploads/2021/02/costao-de-itacoatiara-e-enseada-do-bananal_Moment-1024x576.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div className="position-absolute bottom-0 start-0 w-100 p-4" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)' }}>
              <h3 className="fw-bold fs-5 mb-0">Trilhas Guiadas</h3>
            </div>
          </Link>

          {/* Item 4 */}
          <Link to="/explorar" className="bento-item position-relative rounded-4 overflow-hidden text-white border" style={{ gridColumn: 'span 1', gridRow: 'span 1', backgroundImage: "url('https://www.guiaviagensbrasil.com/imagens/belo-museu-de-arte-contemporanea-niteroi-rj.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div className="position-absolute bottom-0 start-0 w-100 p-4" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)' }}>
              <h3 className="fw-bold fs-5 mb-0">Cultura e Arte</h3>
            </div>
          </Link>
        </div>
      </section>

      {/* Business Section (Seja um parceiro) */}
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