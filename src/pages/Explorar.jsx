import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { atracoesDb } from '../data/database'; // Importando do arquivo central!

export default function Explorar() {
  const [atracoes, setAtracoes] = useState(atracoesDb);
  const [filtroAtivo, setFiltroAtivo] = useState('all');
  const [favoritos, setFavoritos] = useState([]); 
  const [localSelecionado, setLocalSelecionado] = useState(null);
  const [adicionadoFeedback, setAdicionadoFeedback] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();

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

    if (filtroAtivo === 'favoritos') {
      setAtracoes(atracoesDb.filter(a => novosFavs.includes(a.id)));
    }
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
        preco: local.preco, // Como já é número, passa direto! Matemático e limpo.
        qtd: 1
      });
    }
    localStorage.setItem('boeminha_cart', JSON.stringify(cartSalvo));
  };

  // MAPA COM RECONSTRUÇÃO CONTRA CACHE
  useEffect(() => {
    const container = document.getElementById('map-container');
    if (!container) return;

    const mapa = L.map('map-container').setView([-22.92, -43.08], 12);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap',
    }).addTo(mapa);

    const markersLayer = L.layerGroup().addTo(mapa);

    const obterPinoModerno = (categoria, isFavoritoView) => {
      let cor = '#0077b6'; 
      let icone = 'fa-palette'; 
      
      if (isFavoritoView) {
        cor = '#9b59b6'; 
        icone = 'fa-heart';
      } else if (categoria === 'natureza') {
        cor = '#2d6a4f'; 
        icone = 'fa-tree';
      } else if (categoria === 'boemia') {
        cor = '#d68c45'; 
        icone = 'fa-beer';
      } else if (categoria === 'gastronomia') {
        cor = '#e63946'; 
        icone = 'fa-coffee';
      }

      const pinoHTML = `
        <div style="
          background-color: ${cor};
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          border: 2px solid white;
          box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        ">
          <i class="fas ${icone}" style="color: white; transform: rotate(45deg); font-size: 13px;"></i>
        </div>
      `;

      return L.divIcon({
        className: 'custom-leaflet-pin', 
        html: pinoHTML,
        iconSize: [32, 32],
        iconAnchor: [16, 32], 
        popupAnchor: [0, -32] 
      });
    };

    atracoes.forEach((attr) => {
      if (attr.lat && attr.lng) {
        const iconePronto = obterPinoModerno(attr.categoria, filtroAtivo === 'favoritos');
        L.marker([attr.lat, attr.lng], { icon: iconePronto })
         .bindPopup(`<b>${attr.titulo}</b>`)
         .addTo(markersLayer);
      }
    });

    const bounds = atracoes.filter(a => a.lat && a.lng).map((a) => [a.lat, a.lng]);
    if (bounds.length > 0) {
      mapa.fitBounds(bounds, { padding: [50, 50] });
    }

    return () => {
      mapa.remove();
    };
  }, [atracoes, filtroAtivo]); 

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
      setFiltroAtivo('all');
    } else {
      setAtracoes(atracoesDb);
    }
  }, [location.search]);

  const filtrar = (categoria) => {
    setFiltroAtivo(categoria);
    navigate('?'); 
    if (categoria === 'all') {
      setAtracoes(atracoesDb);
    } else if (categoria === 'favoritos') {
      setAtracoes(atracoesDb.filter(a => favoritos.includes(a.id)));
    } else {
      setAtracoes(atracoesDb.filter(a => a.categoria === categoria));
    }
  };

  return (
    <div style={{ paddingTop: '76px' }}>
      
      <style>
        {`
          .btn-cat-all { color: #343a40; border: 2px solid #343a40; background: transparent; }
          .btn-cat-all:hover, .btn-cat-all.active { background-color: #343a40; color: white; }

          .btn-cat-natureza { color: #2d6a4f; border: 2px solid #2d6a4f; background: transparent; }
          .btn-cat-natureza:hover, .btn-cat-natureza.active { background-color: #2d6a4f; color: white; }

          .btn-cat-boemia { color: #d68c45; border: 2px solid #d68c45; background: transparent; }
          .btn-cat-boemia:hover, .btn-cat-boemia.active { background-color: #d68c45; color: white; }

          .btn-cat-gastronomia { color: #e63946; border: 2px solid #e63946; background: transparent; }
          .btn-cat-gastronomia:hover, .btn-cat-gastronomia.active { background-color: #e63946; color: white; }

          .btn-cat-cultura { color: #0077b6; border: 2px solid #0077b6; background: transparent; }
          .btn-cat-cultura:hover, .btn-cat-cultura.active { background-color: #0077b6; color: white; }

          .btn-cat-favoritos { color: #9b59b6; border: 2px solid #9b59b6; background: transparent; }
          .btn-cat-favoritos:hover, .btn-cat-favoritos.active { background-color: #9b59b6; color: white; }
        `}
      </style>

      <section className="page-header" style={{ background: '#ffffff', padding: '40px 0', borderBottom: '1px solid #eee' }}>
        <div className="container">
          <h1 className="fw-bold text-dark">Explore Niterói</h1>
          <p className="mb-0 text-muted">Encontre a sua próxima experiência autêntica com nossos filtros curados.</p>
        </div>
      </section>

      <main className="container mb-5 mt-4">
        
        <h4 className="fw-bold mb-3">
          <i className="fas fa-map-marked-alt me-2 text-success"></i>
          Visão Geral
        </h4>
        
        <div 
          id="map-container" 
          key={filtroAtivo} 
          style={{ height: '400px', borderRadius: '16px', border: '2px solid #eee', marginBottom: '40px', zIndex: 1, backgroundColor: '#f5f5f5' }}
        ></div>

        <div className="d-flex justify-content-between align-items-center mb-4 mt-5">
          <h4 className="fw-bold m-0">
            {filtroAtivo === 'favoritos' ? 'Sua Lista de Desejos' : 'Catálogo Completo'}
          </h4>
          <span className="small fw-bold text-muted">{atracoes.length} Resultados</span>
        </div>

        <div className="filter-container d-flex gap-2 mb-4 flex-wrap">
          <button className={`btn rounded-pill fw-bold btn-cat-all ${filtroAtivo === 'all' ? 'active' : ''}`} onClick={() => filtrar('all')}>Todos os Locais</button>
          <button className={`btn rounded-pill fw-bold btn-cat-natureza ${filtroAtivo === 'natureza' ? 'active' : ''}`} onClick={() => filtrar('natureza')}><i className="fas fa-tree me-1"></i> Natureza</button>
          <button className={`btn rounded-pill fw-bold btn-cat-boemia ${filtroAtivo === 'boemia' ? 'active' : ''}`} onClick={() => filtrar('boemia')}><i className="fas fa-beer me-1"></i> Boemia</button>
          <button className={`btn rounded-pill fw-bold btn-cat-gastronomia ${filtroAtivo === 'gastronomia' ? 'active' : ''}`} onClick={() => filtrar('gastronomia')}><i className="fas fa-coffee me-1"></i> Gastronomia</button>
          <button className={`btn rounded-pill fw-bold btn-cat-cultura ${filtroAtivo === 'cultura' ? 'active' : ''}`} onClick={() => filtrar('cultura')}><i className="fas fa-palette me-1"></i> Cultura</button>
          
          <button 
            className={`btn rounded-pill fw-bold ms-lg-auto btn-cat-favoritos ${filtroAtivo === 'favoritos' ? 'active' : ''}`} 
            onClick={() => filtrar('favoritos')}
          >
            <i className="fas fa-heart me-1"></i> Meus Favoritos
          </button>
        </div>

        <div className="row g-4">
          {atracoes.length === 0 ? (
            <div className="col-12 text-center py-5">
              <i className="fas fa-search mb-3" style={{ fontSize: '3rem', color: '#ccc' }}></i>
              <h5 className="fw-bold text-muted">Nenhum local encontrado para a sua busca.</h5>
            </div>
          ) : (
            atracoes.map(attr => (
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
                      {/* FORMATAÇÃO DO PREÇO NUMÉRICO NOS CARDS */}
                      <span className="fw-bold text-success">
                        {attr.preco === 0 ? 'Gratuito' : `R$ ${attr.preco.toFixed(2).replace('.', ',')}`}
                      </span>
                      
                      <button 
                        className="btn btn-sm btn-outline-dark fw-bold"
                        onClick={() => {
                          setLocalSelecionado(attr);
                          setAdicionadoFeedback(false);
                        }}
                      >
                        Ver Detalhes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* JANELA MODAL ATUALIZADA */}
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
              overflow: 'hidden', position: 'relative', boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
              maxHeight: '90vh', overflowY: 'auto'
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

            <div style={{ height: '220px', backgroundImage: `url(${localSelecionado.imagem})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
            
            <div className="p-4">
              <span className="badge bg-light text-dark mb-2">{localSelecionado.tag}</span>
              <h3 className="fw-bold mb-1">{localSelecionado.titulo}</h3>
              
              {/* EXIBIÇÃO DOS SUBTÓPICOS DO NOVO BANCO */}
              <div className="mb-3 d-flex gap-1 flex-wrap">
                {localSelecionado.subtopicos?.map((sub, i) => (
                  <span key={i} className="badge bg-secondary opacity-75" style={{ fontSize: '0.7rem' }}>{sub}</span>
                ))}
              </div>

              <p className="text-muted mb-4" style={{ lineHeight: '1.5', fontSize: '0.95rem' }}>{localSelecionado.descricao}</p>
              
              <div className="bg-light p-3 rounded-3 mb-4" style={{ border: '1px solid #eee' }}>
                <div className="d-flex align-items-center mb-2">
                  <i className="far fa-calendar-alt text-success me-3" style={{ width: '20px', textAlign: 'center' }}></i>
                  <span className="text-dark" style={{ fontSize: '0.9rem' }}><strong>Dias:</strong> {localSelecionado.dias}</span>
                </div>
                <div className="d-flex align-items-center mb-2">
                  <i className="far fa-clock text-success me-3" style={{ width: '20px', textAlign: 'center' }}></i>
                  <span className="text-dark" style={{ fontSize: '0.9rem' }}><strong>Horário:</strong> {localSelecionado.horario}</span>
                </div>
                <div className="d-flex align-items-start">
                  <i className="fas fa-map-marker-alt text-success me-3 mt-1" style={{ width: '20px', textAlign: 'center' }}></i>
                  <span className="text-dark" style={{ fontSize: '0.9rem', lineHeight: '1.4' }}><strong>Endereço:</strong> {localSelecionado.endereco}</span>
                </div>

                {/* EXIBIÇÃO DO GUIA CASO EXISTA */}
                {localSelecionado.guia && (
                  <div className="d-flex align-items-center mt-3 pt-3 border-top" style={{ borderColor: '#ddd !important' }}>
                    <img src={localSelecionado.guia.foto} alt={localSelecionado.guia.nome} className="rounded-circle me-3" style={{ width: '36px', height: '36px', objectFit: 'cover' }} />
                    <div>
                      <small className="text-muted d-block" style={{ fontSize: '0.75rem' }}>Condutor/Guia:</small>
                      <strong className="text-dark" style={{ fontSize: '0.85rem' }}>{localSelecionado.guia.nome}</strong>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center pt-2 border-top">
                <h4 className="fw-bold text-success m-0 mb-3 mb-sm-0">
                  {localSelecionado.preco === 0 ? 'Gratuito' : `R$ ${localSelecionado.preco.toFixed(2).replace('.', ',')}`}
                </h4>
                
                {localSelecionado.preco === 0 ? (
                  <div className="badge bg-success px-4 py-2 fs-6 rounded-pill d-flex align-items-center" style={{ gap: '8px' }}>
                    <i className="fas fa-door-open"></i> Acesso Livre
                  </div>
                ) : (
                  <button 
                    className={`btn px-4 py-2 fw-bold rounded-pill ${adicionadoFeedback ? 'btn-dark' : 'btn-success'}`}
                    disabled={adicionadoFeedback}
                    onClick={() => {
                      adicionarAoCarrinho(localSelecionado);
                      setAdicionadoFeedback(true); 
                      
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
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}