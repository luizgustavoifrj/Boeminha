import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const atracoesDb = [
  {
    id: "mac",
    titulo: "MAC Niterói",
    categoria: "cultura",
    tag: "Arte & Cultura",
    descricao: "A obra-prima de Niemeyer com vista deslumbrante.",
    preco: "R$ 25,00",
    imagem: "https://www.guiaviagensbrasil.com/imagens/belo-museu-de-arte-contemporanea-niteroi-rj.jpg",
  },
  {
    id: "costao",
    titulo: "Costão de Itacoatiara",
    categoria: "natureza",
    tag: "Trilha & Mirante",
    descricao: "Trilha clássica com visual do Oceano Atlântico.",
    preco: "Gratuito",
    imagem: "https://rotadesonhos.com/wp-content/uploads/2021/02/costao-de-itacoatiara-e-enseada-do-bananal_Moment-1024x576.jpg",
  },
  {
    id: "cantareira",
    titulo: "Samba da Cantareira",
    categoria: "boemia",
    tag: "Música & Bar",
    descricao: "O polo cultural ferve com samba de raiz e cerveja.",
    preco: "A partir de R$ 10",
    imagem: "https://diariodocomercio.com.br/wp-content/uploads/2023/01/festa-pic.jpg",
  },
  {
    id: "parque-cidade",
    titulo: "Parque da Cidade",
    categoria: "natureza",
    tag: "Pôr do Sol",
    descricao: "O mirante perfeito para ver o sol se pôr.",
    preco: "Gratuito",
    imagem: "https://www.viajenaviagem.com/wp-content/uploads/2021/07/niteroi-1920x640-1.jpg",
  }
];

const formatarPrecoParaNumero = (precoStr) => {
  if (precoStr.toLowerCase().includes('gratuito')) return 0;
  const numeros = precoStr.match(/[\d,]+/);
  if (numeros) {
    return parseFloat(numeros[0].replace(',', '.')); 
  }
  return 0;
};

export default function Explorar() {
  const [atracoes, setAtracoes] = useState(atracoesDb);
  const [filtroAtivo, setFiltroAtivo] = useState('all');
  const [favoritos, setFavoritos] = useState([]); 
  const [localSelecionado, setLocalSelecionado] = useState(null);
  
  // NOVO: Estado para controlar a animação do botão de carrinho
  const [adicionadoFeedback, setAdicionadoFeedback] = useState(false);
  
  const location = useLocation();

  useEffect(() => {
    const favsSalvos = JSON.parse(localStorage.getItem('boeMinha_favs')) || [];
    setFavoritos(favsSalvos);
  }, []);

  const toggleFav = (id) => {
    let novosFavs;
    if (favoritos.includes(id)) {
      novosFavs = favoritos.filter((f) => f !== id); 
    } else {
      novosFavs = [...favoritos, id]; 
    }
    setFavoritos(novosFavs);
    localStorage.setItem('boeMinha_favs', JSON.stringify(novosFavs));
  };

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
        preco: formatarPrecoParaNumero(local.preco), 
        qtd: 1
      });
    }

    localStorage.setItem('boeminha_cart', JSON.stringify(cartSalvo));
    // Tirei o alert daqui!
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const termoBuscado = params.get("busca");
    
    if (termoBuscado) {
      const buscaFormatada = termoBuscado.toLowerCase().trim();
      const filtradas = atracoesDb.filter(attr => 
        attr.titulo.toLowerCase().includes(buscaFormatada) ||
        attr.descricao.toLowerCase().includes(buscaFormatada) ||
        attr.tag.toLowerCase().includes(buscaFormatada)
      );
      setAtracoes(filtradas);
    } else {
      setAtracoes(atracoesDb);
    }
  }, [location.search]);

  const filtrar = (categoria) => {
    setFiltroAtivo(categoria);
    if (categoria === 'all') {
      setAtracoes(atracoesDb);
    } else {
      setAtracoes(atracoesDb.filter(a => a.categoria === categoria));
    }
  };

  return (
    <div style={{ paddingTop: '76px' }}>
      <section className="page-header" style={{ background: '#ffffff', padding: '40px 0', borderBottom: '1px solid #eee' }}>
        <div className="container">
          <h1 className="fw-bold text-dark">Explore Niterói</h1>
          <p className="mb-0 text-muted">Encontre a sua próxima experiência autêntica com nossos filtros curados.</p>
        </div>
      </section>

      <main className="container mb-5 mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="fw-bold m-0">Catálogo Completo</h4>
          <span className="small fw-bold text-muted">{atracoes.length} Resultados</span>
        </div>

        <div className="filter-container d-flex gap-2 mb-4 flex-wrap">
          <button className={`btn rounded-pill fw-bold ${filtroAtivo === 'all' ? 'btn-success' : 'btn-outline-secondary'}`} onClick={() => filtrar('all')}>Todos os Locais</button>
          <button className={`btn rounded-pill fw-bold ${filtroAtivo === 'natureza' ? 'btn-success' : 'btn-outline-secondary'}`} onClick={() => filtrar('natureza')}><i className="fas fa-tree me-1"></i> Natureza</button>
          <button className={`btn rounded-pill fw-bold ${filtroAtivo === 'boemia' ? 'btn-success' : 'btn-outline-secondary'}`} onClick={() => filtrar('boemia')}><i className="fas fa-beer me-1"></i> Boemia</button>
          <button className={`btn rounded-pill fw-bold ${filtroAtivo === 'cultura' ? 'btn-success' : 'btn-outline-secondary'}`} onClick={() => filtrar('cultura')}><i className="fas fa-palette me-1"></i> Cultura</button>
        </div>

        <div className="row g-4">
          {atracoes.map(attr => (
            <div className="col-lg-4 col-md-6" key={attr.id}>
              <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden">
                <div style={{ height: '200px', backgroundImage: `url(${attr.imagem})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
                  <button 
                    onClick={() => toggleFav(attr.id)}
                    style={{
                      position: 'absolute', top: '15px', right: '15px',
                      background: 'rgba(255, 255, 255, 0.9)', border: 'none',
                      width: '36px', height: '36px', borderRadius: '50%',
                      color: favoritos.includes(attr.id) ? '#e63946' : '#ccc',
                      transition: '0.3s', zIndex: 10
                    }}
                  >
                    <i className="fas fa-heart"></i>
                  </button>
                </div>
                <div className="card-body d-flex flex-column p-4">
                  <span className={`badge bg-light text-dark mb-2 align-self-start`}>{attr.tag}</span>
                  <h5 className="fw-bold">{attr.titulo}</h5>
                  <p className="text-muted small flex-grow-1">{attr.descricao}</p>
                  <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
                    <span className="fw-bold text-success">{attr.preco}</span>
                    
                    <button 
                      className="btn btn-sm btn-outline-dark fw-bold"
                      onClick={() => {
                        setLocalSelecionado(attr);
                        setAdicionadoFeedback(false); // Reseta o visual do botão ao abrir um novo
                      }}
                    >
                      Ver Detalhes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* JANELA DO MODAL */}
      {localSelecionado && (
        <div 
          onClick={() => setLocalSelecionado(null)}
          style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 9999,
            display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()} 
            style={{
              background: '#fff', borderRadius: '20px', maxWidth: '500px', width: '100%',
              overflow: 'hidden', position: 'relative', boxShadow: '0 20px 50px rgba(0,0,0,0.3)'
            }}
          >
            <button 
              onClick={() => setLocalSelecionado(null)}
              style={{
                position: 'absolute', top: '15px', right: '15px', zIndex: 10,
                background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%',
                width: '36px', height: '36px', fontWeight: 'bold', cursor: 'pointer'
              }}
            >
              <i className="fas fa-times"></i>
            </button>

            <div style={{ height: '250px', backgroundImage: `url(${localSelecionado.imagem})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
            
            <div className="p-4 p-md-5">
              <span className="badge bg-light text-dark mb-2">{localSelecionado.tag}</span>
              <h3 className="fw-bold mb-3">{localSelecionado.titulo}</h3>
              <p className="text-muted mb-4" style={{ lineHeight: '1.6' }}>{localSelecionado.descricao}</p>
              
              <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center mt-2 pt-4 border-top">
                <h4 className="fw-bold text-success m-0 mb-3 mb-sm-0">{localSelecionado.preco}</h4>
                
                {/* BOTÃO SEM ALERT COM FEEDBACK VISUAL */}
                <button 
                  className={`btn px-4 py-2 fw-bold rounded-pill ${adicionadoFeedback ? 'btn-dark' : 'btn-success'}`}
                  disabled={adicionadoFeedback}
                  onClick={() => {
                    adicionarAoCarrinho(localSelecionado);
                    setAdicionadoFeedback(true); // Muda o botão para "Adicionado!"
                    
                    // Fecha a janela sozinho depois de 1.2 segundos
                    setTimeout(() => {
                      setLocalSelecionado(null);
                      setAdicionadoFeedback(false);
                    }, 1200);
                  }}
                  style={{ transition: '0.3s ease' }}
                >
                  <i className={`fas ${adicionadoFeedback ? 'fa-check' : 'fa-cart-plus'} me-2`}></i>
                  {adicionadoFeedback ? 'Adicionado!' : 'Adicionar ao Carrinho'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}