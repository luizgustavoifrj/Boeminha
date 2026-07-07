import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { atracoesDb } from '../data/database';
import { useTheme } from '../ThemeContext';

export default function Explorar() {
  const { darkMode } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  // ESTADOS PRINCIPAIS
  const [atracoes, setAtracoes] = useState(atracoesDb);
  const [filtroAtivo, setFiltroAtivo] = useState('all');
  const [favoritos, setFavoritos] = useState([]); 
  const [localSelecionado, setLocalSelecionado] = useState(null);
  const [adicionadoFeedback, setAdicionadoFeedback] = useState(false);

  // ESTADOS DA GAVETA DE FILTROS AVANÇADOS
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [precoMax, setPrecoMax] = useState(300);
  const [petFriendly, setPetFriendly] = useState(false);
  const [coberto, setCoberto] = useState(false);
  const [diaSemana, setDiaSemana] = useState('');

  // Carrega favoritos salvos
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
        preco: local.preco,
        qtd: 1
      });
    }
    localStorage.setItem('boeminha_cart', JSON.stringify(cartSalvo));
  };

  // O CÉREBRO UNIFICADO DE FILTRAGEM
  useEffect(() => {
    let resultados = [...atracoesDb];

    const termoBuscado = new URLSearchParams(location.search).get("busca");
    if (termoBuscado) {
      const buscaFormatada = termoBuscado.toLowerCase().trim();
      resultados = resultados.filter(attr => 
        attr.titulo.toLowerCase().includes(buscaFormatada) ||
        attr.descricao.toLowerCase().includes(buscaFormatada) ||
        attr.tag.toLowerCase().includes(buscaFormatada) ||
        attr.categoria.toLowerCase().includes(buscaFormatada)
      );
    }

    if (filtroAtivo === 'favoritos') {
      resultados = resultados.filter(a => favoritos.includes(a.id));
    } else if (filtroAtivo !== 'all') {
      resultados = resultados.filter(a => a.categoria === filtroAtivo);
    }

    resultados = resultados.filter(a => (a.preco || 0) <= precoMax);
    if (petFriendly) resultados = resultados.filter(a => a.petFriendly === true);
    if (coberto) resultados = resultados.filter(a => a.coberto === true);
    if (diaSemana) {
      resultados = resultados.filter(a => a.dias && a.dias.toLowerCase().includes(diaSemana.toLowerCase()));
    }

    setAtracoes(resultados);
  }, [location.search, filtroAtivo, precoMax, petFriendly, coberto, diaSemana, favoritos]);

  const limparFiltrosAvancados = () => {
    setPrecoMax(300);
    setPetFriendly(false);
    setCoberto(false);
    setDiaSemana('');
  };

  // MAPA INTEGRADO
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
        cor = '#f1c40f'; 
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
        
        const popupHTML = `
          <div style="width: 170px; text-align: center; font-family: 'Inter', sans-serif;">
            <div style="width: 100%; height: 100px; background-image: url('${attr.imagem}'); background-size: cover; background-position: center; border-radius: 8px; margin-bottom: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);"></div>
            <h6 style="margin: 0 0 4px 0; font-weight: 800; font-size: 14px; color: #212529;">${attr.titulo}</h6>
            <span style="display: inline-block; padding: 2px 8px; background-color: #f8f9fa; border: 1px solid #dee2e6; border-radius: 12px; font-size: 10px; color: #6c757d; margin-bottom: 10px;">
              ${attr.tag}
            </span>
            <button class="btn btn-success btn-popup-detalhes" data-id="${attr.id}" style="width: 100%; font-size: 12px; font-weight: bold; border-radius: 20px; padding: 6px 0;">
              Ver Detalhes
            </button>
          </div>
        `;

        L.marker([attr.lat, attr.lng], { icon: iconePronto })
         .bindPopup(popupHTML)
         .addTo(markersLayer);
      }
    });

    mapa.on('popupopen', () => {
      const btn = document.querySelector('.btn-popup-detalhes');
      if (btn) {
        btn.onclick = () => {
          const localId = btn.getAttribute('data-id');
          const local = atracoesDb.find(a => a.id === localId);
          if (local) setLocalSelecionado(local);
        };
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

  const filtrar = (categoria) => {
    setFiltroAtivo(categoria);
    navigate('?'); 
  };

  return (
    <div style={{ paddingTop: '76px' }}>
      
      <style>
        {`
          .btn-cat-all { color: ${darkMode ? '#f8f9fa' : '#343a40'}; border: 2px solid ${darkMode ? '#f8f9fa' : '#343a40'}; background: transparent; }
          .btn-cat-all:hover, .btn-cat-all.active { background-color: ${darkMode ? '#f8f9fa' : '#343a40'}; color: ${darkMode ? '#121212' : 'white'}; }

          .btn-cat-natureza { color: #52b788; border: 2px solid #52b788; background: transparent; }
          .btn-cat-natureza:hover, .btn-cat-natureza.active { background-color: #2d6a4f; color: white; border-color: #2d6a4f; }

          .btn-cat-boemia { color: #f1c40f; border: 2px solid #f1c40f; background: transparent; }
          .btn-cat-boemia:hover, .btn-cat-boemia.active { background-color: #d4ac0d; color: white; border-color: #d4ac0d; }

          .btn-cat-gastronomia { color: #e63946; border: 2px solid #e63946; background: transparent; }
          .btn-cat-gastronomia:hover, .btn-cat-gastronomia.active { background-color: #e63946; color: white; }

          .btn-cat-cultura { color: #00b4d8; border: 2px solid #00b4d8; background: transparent; }
          .btn-cat-cultura:hover, .btn-cat-cultura.active { background-color: #0077b6; color: white; border-color: #0077b6; }

          .btn-cat-favoritos { color: #bb86fc; border: 2px solid #bb86fc; background: transparent; }
          .btn-cat-favoritos:hover, .btn-cat-favoritos.active { background-color: #9b59b6; color: white; border-color: #9b59b6; }
          
          .dark-map { filter: invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%); }
          .leaflet-popup-content { margin: 12px 14px !important; line-height: 1.3 !important; }

          .form-switch .form-check-input { width: 2.5rem; height: 1.25rem; cursor: pointer; }
          .form-switch .form-check-input:checked { background-color: #2d6a4f; border-color: #2d6a4f; }
        `}
      </style>

      {/* OVERLAY ESCURO DA GAVETA */}
      {isDrawerOpen && (
        <div 
          onClick={() => setIsDrawerOpen(false)}
          style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1040 }}
        ></div>
      )}

      {/* A GAVETA DE FILTROS AVANÇADOS */}
      <div 
        style={{
          position: 'fixed', top: 0, right: isDrawerOpen ? 0 : '-100%',
          width: '100%', maxWidth: '380px', height: '100vh',
          backgroundColor: darkMode ? '#1e1e1e' : '#ffffff',
          boxShadow: '-5px 0 25px rgba(0,0,0,0.5)',
          transition: 'right 0.3s ease', zIndex: 1050,
          overflowY: 'auto', padding: '30px'
        }}
      >
        <div className="d-flex justify-content-between align-items-center mb-5 mt-4">
          <h4 className={`fw-bold m-0 ${darkMode ? 'text-white' : 'text-dark'}`}><i className="fas fa-sliders-h me-2 text-success"></i> Filtros</h4>
          <button onClick={() => setIsDrawerOpen(false)} className={`btn btn-sm ${darkMode ? 'btn-outline-light' : 'btn-outline-dark'} rounded-circle`} style={{width: '35px', height: '35px'}}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="mb-4">
          <label className={`fw-bold mb-2 ${darkMode ? 'text-white' : 'text-dark'}`}>Preço Máximo: R$ {precoMax}</label>
          <input 
            type="range" className="form-range" min="0" max="300" step="10" 
            value={precoMax} onChange={(e) => setPrecoMax(e.target.value)} 
          />
          <div className="d-flex justify-content-between small text-muted">
            <span>Grátis</span>
            <span>R$ 300+</span>
          </div>
        </div>

        <div className="mb-4">
          <label className={`fw-bold mb-2 ${darkMode ? 'text-white' : 'text-dark'}`}>Dia da Semana</label>
          <select 
            className={`form-select p-3 shadow-sm ${darkMode ? 'bg-dark text-white border-secondary' : 'bg-light text-dark'}`} 
            value={diaSemana} onChange={(e) => setDiaSemana(e.target.value)}
          >
            <option value="">Qualquer dia</option>
            <option value="segunda">Segunda-feira</option>
            <option value="terça">Terça-feira</option>
            <option value="quarta">Quarta-feira</option>
            <option value="quinta">Quinta-feira</option>
            <option value="sexta">Sexta-feira</option>
            <option value="sábado">Sábado</option>
            <option value="domingo">Domingo</option>
          </select>
        </div>

        <div className="mb-4">
          <label className={`fw-bold mb-3 ${darkMode ? 'text-white' : 'text-dark'}`}>Comodidades</label>
          
          <div className={`d-flex justify-content-between align-items-center p-3 rounded-3 mb-2 border ${darkMode ? 'border-secondary' : ''}`}>
            <span className={`${darkMode ? 'text-light' : 'text-dark'} fw-medium`}><i className="fas fa-dog me-2 text-warning"></i> Pet Friendly</span>
            <div className="form-check form-switch m-0">
              <input className="form-check-input" type="checkbox" checked={petFriendly} onChange={(e) => setPetFriendly(e.target.checked)} />
            </div>
          </div>

          <div className={`d-flex justify-content-between align-items-center p-3 rounded-3 border ${darkMode ? 'border-secondary' : ''}`}>
            <span className={`${darkMode ? 'text-light' : 'text-dark'} fw-medium`}><i className="fas fa-umbrella me-2 text-info"></i> Local Coberto</span>
            <div className="form-check form-switch m-0">
              <input className="form-check-input" type="checkbox" checked={coberto} onChange={(e) => setCoberto(e.target.checked)} />
            </div>
          </div>
        </div>

        <button onClick={limparFiltrosAvancados} className="btn btn-outline-danger w-100 fw-bold mt-3 rounded-pill p-3">
          Limpar Filtros
        </button>
      </div>

      <section className="page-header" style={{ background: 'transparent', padding: '40px 0', borderBottom: `1px solid ${darkMode ? '#333' : '#eee'}` }}>
        <div className="container">
          <h1 className="fw-bold">Explore Niterói</h1>
          <p className={`mb-0 ${darkMode ? 'text-light opacity-75' : 'text-muted'}`}>Encontre a sua próxima experiência autêntica com nossos filtros curados.</p>
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
          className={darkMode ? "dark-map" : ""}
          style={{ height: '400px', borderRadius: '16px', border: `2px solid ${darkMode ? '#333' : '#eee'}`, marginBottom: '40px', zIndex: 1 }}
        ></div>

        <div className="d-flex justify-content-between align-items-center mb-4 mt-5">
          <h4 className="fw-bold m-0">
            {filtroAtivo === 'favoritos' ? 'Sua Lista de Desejos' : 'Catálogo Completo'}
          </h4>
          <span className={`small fw-bold ${darkMode ? 'text-light opacity-50' : 'text-muted'}`}>{atracoes.length} Resultados</span>
        </div>

        <div className="filter-container d-flex gap-2 mb-4 flex-wrap align-items-center">
          <button className={`btn rounded-pill fw-bold btn-cat-all ${filtroAtivo === 'all' ? 'active' : ''}`} onClick={() => filtrar('all')}>Todos os Locais</button>
          <button className={`btn rounded-pill fw-bold btn-cat-natureza ${filtroAtivo === 'natureza' ? 'active' : ''}`} onClick={() => filtrar('natureza')}><i className="fas fa-tree me-1"></i> Natureza</button>
          <button className={`btn rounded-pill fw-bold btn-cat-boemia ${filtroAtivo === 'boemia' ? 'active' : ''}`} onClick={() => filtrar('boemia')}><i className="fas fa-beer me-1"></i> Boemia</button>
          <button className={`btn rounded-pill fw-bold btn-cat-gastronomia ${filtroAtivo === 'gastronomia' ? 'active' : ''}`} onClick={() => filtrar('gastronomia')}><i className="fas fa-coffee me-1"></i> Gastronomia</button>
          <button className={`btn rounded-pill fw-bold btn-cat-cultura ${filtroAtivo === 'cultura' ? 'active' : ''}`} onClick={() => filtrar('cultura')}> <i className="fas fa-palette me-1"></i> Cultura</button>
          
          <div className="ms-lg-auto d-flex gap-2">
            <button 
              className={`btn rounded-pill fw-bold ${darkMode ? 'btn-outline-light' : 'btn-outline-dark'}`} 
              onClick={() => setIsDrawerOpen(true)}
            >
              <i className="fas fa-sliders-h me-1"></i> Filtros
              {(precoMax < 300 || petFriendly || coberto || diaSemana) && (
                <span className="position-absolute translate-middle p-1 bg-danger border border-light rounded-circle" style={{marginTop: '5px'}}></span>
              )}
            </button>

            <button className={`btn rounded-pill fw-bold btn-cat-favoritos ${filtroAtivo === 'favoritos' ? 'active' : ''}`} onClick={() => filtrar('favoritos')}>
              <i className="fas fa-heart me-1"></i> Meus Favoritos
            </button>
          </div>
        </div>

        <div className="row g-4">
          {atracoes.length === 0 ? (
            <div className="col-12 text-center py-5">
              <i className="fas fa-search mb-3" style={{ fontSize: '3rem', color: '#ccc' }}></i>
              <h5 className={`fw-bold ${darkMode ? 'text-light opacity-75' : 'text-muted'}`}>Nenhum local atende aos seus filtros.</h5>
              <button onClick={limparFiltrosAvancados} className="btn btn-outline-success rounded-pill mt-3 fw-bold">Limpar Filtros Avançados</button>
            </div>
          ) : (
            atracoes.map(attr => (
              <div className="col-lg-4 col-md-6" key={attr.id}>
                <div className={`card h-100 border-0 shadow-sm rounded-4 overflow-hidden`}>
                  <div style={{ height: '200px', backgroundImage: `url(${attr.imagem})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
                    <button 
                      onClick={() => toggleFav(attr.id)}
                      style={{
                        position: 'absolute', top: '15px', right: '15px',
                        background: darkMode ? 'rgba(30, 30, 30, 0.9)' : 'rgba(255, 255, 255, 0.9)', 
                        border: 'none', width: '36px', height: '36px', borderRadius: '50%',
                        color: favoritos.includes(attr.id) ? '#e63946' : (darkMode ? '#555' : '#ccc'),
                        transition: '0.3s', zIndex: 10
                      }}
                    >
                      <i className="fas fa-heart"></i>
                    </button>
                  </div>
                  <div className="card-body d-flex flex-column p-4">
                    <span className="badge bg-light text-dark mb-2 align-self-start">{attr.tag}</span>
                    <h5 className="fw-bold">{attr.titulo}</h5>
                    <p className="text-muted small flex-grow-1" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{attr.descricao}</p>
                    
                    <div className="d-flex gap-2 mb-3 mt-1">
                       {attr.petFriendly && <span className="badge bg-warning text-dark"><i className="fas fa-dog"></i> Pet</span>}
                       {attr.coberto && <span className="badge bg-info text-dark"><i className="fas fa-umbrella"></i> Coberto</span>}
                    </div>

                    <div className={`d-flex justify-content-between align-items-center pt-3 border-top ${darkMode ? 'border-secondary' : ''}`}>
                      <span className="fw-bold text-success">
                        {!attr.preco || attr.preco === 0 ? 'Gratuito' : `R$ ${attr.preco.toFixed(2).replace('.', ',')}`}
                      </span>
                      
                      <button 
                        className={`btn btn-sm fw-bold ${darkMode ? 'btn-outline-light' : 'btn-outline-dark'}`}
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

      {/* JANELA MODAL DE DETALHES (AGORA COM CARROSSEL) */}
      {localSelecionado && (
        <div 
          onClick={() => setLocalSelecionado(null)}
          style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}
        >
          <div 
            onClick={(e) => e.stopPropagation()} 
            style={{
              background: darkMode ? '#1e1e1e' : '#fff', 
              color: darkMode ? '#fff' : '#212529',
              borderRadius: '20px', maxWidth: '500px', width: '100%', overflow: 'hidden', position: 'relative', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', maxHeight: '90vh', overflowY: 'auto', border: darkMode ? '1px solid #333' : 'none'
            }}
          >
            {/* BOTÃO FECHAR FLUTUANDO ACIMA DO CARROSSEL */}
            <button 
              onClick={() => setLocalSelecionado(null)}
              style={{
                position: 'absolute', top: '15px', right: '15px', zIndex: 1050,
                background: darkMode ? 'rgba(50,50,50,0.9)' : 'rgba(255,255,255,0.9)', 
                color: darkMode ? '#fff' : '#000', border: 'none', borderRadius: '50%', width: '36px', height: '36px', fontWeight: 'bold', cursor: 'pointer'
              }}
            >
              <i className="fas fa-times"></i>
            </button>

            {/* O NOVO CARROSSEL DE FOTOS */}
            <div id="carouselModalDetalhes" className="carousel slide" data-bs-ride="carousel">
              <div className="carousel-inner" style={{ height: '250px' }}>
                {/* Lógica: Se tiver galeria, roda a galeria. Se não, roda a imagem única como fallback! */}
                {(localSelecionado.galeria && localSelecionado.galeria.length > 0 ? localSelecionado.galeria : [localSelecionado.imagem]).map((imgUrl, idx) => (
                  <div className={`carousel-item h-100 ${idx === 0 ? 'active' : ''}`} key={idx}>
                    <div style={{ height: '100%', backgroundImage: `url(${imgUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                  </div>
                ))}
              </div>
              
              {/* Só mostra as setinhas de navegação se houver mais de 1 foto */}
              {(localSelecionado.galeria && localSelecionado.galeria.length > 1) && (
                <>
                  <button className="carousel-control-prev" type="button" data-bs-target="#carouselModalDetalhes" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true" style={{ filter: 'drop-shadow(0px 0px 4px rgba(0,0,0,0.8))' }}></span>
                  </button>
                  <button className="carousel-control-next" type="button" data-bs-target="#carouselModalDetalhes" data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true" style={{ filter: 'drop-shadow(0px 0px 4px rgba(0,0,0,0.8))' }}></span>
                  </button>
                </>
              )}
            </div>
            
            <div className="p-4">
              <span className="badge bg-light text-dark mb-2">{localSelecionado.tag}</span>
              <h3 className="fw-bold mb-1">{localSelecionado.titulo}</h3>
              
              <div className="mb-3 d-flex gap-1 flex-wrap">
                {localSelecionado.subtopicos?.map((sub, i) => (
                  <span key={i} className={`badge ${darkMode ? 'bg-dark text-light border border-secondary' : 'bg-secondary opacity-75'}`} style={{ fontSize: '0.7rem' }}>{sub}</span>
                ))}
              </div>

              <p className={`${darkMode ? 'text-light opacity-75' : 'text-muted'} mb-4`} style={{ lineHeight: '1.5', fontSize: '0.95rem' }}>{localSelecionado.descricao}</p>
              
              <div className={`${darkMode ? 'bg-dark' : 'bg-light'} p-3 rounded-3 mb-4`} style={{ border: `1px solid ${darkMode ? '#333' : '#eee'}` }}>
                
                {(localSelecionado.petFriendly || localSelecionado.coberto) && (
                  <div className="d-flex gap-3 mb-3 pb-2 border-bottom border-secondary">
                    {localSelecionado.petFriendly && <span className="fw-bold small text-warning"><i className="fas fa-dog me-1"></i> Aceita Pets</span>}
                    {localSelecionado.coberto && <span className="fw-bold small text-info"><i className="fas fa-umbrella me-1"></i> Área Coberta</span>}
                  </div>
                )}

                <div className="d-flex align-items-center mb-2">
                  <i className="far fa-calendar-alt text-success me-3" style={{ width: '20px', textAlign: 'center' }}></i>
                  <span style={{ fontSize: '0.9rem' }}><strong>Dias:</strong> {localSelecionado.dias}</span>
                </div>
                <div className="d-flex align-items-center mb-2">
                  <i className="far fa-clock text-success me-3" style={{ width: '20px', textAlign: 'center' }}></i>
                  <span style={{ fontSize: '0.9rem' }}><strong>Horário:</strong> {localSelecionado.horario}</span>
                </div>
                <div className="d-flex align-items-start">
                  <i className="fas fa-map-marker-alt text-success me-3 mt-1" style={{ width: '20px', textAlign: 'center' }}></i>
                  <span style={{ fontSize: '0.9rem', lineHeight: '1.4' }}><strong>Endereço:</strong> {localSelecionado.endereco}</span>
                </div>
              </div>
              
              <div className={`d-flex flex-column flex-sm-row justify-content-between align-items-center pt-2 border-top`} style={{ borderColor: darkMode ? '#333' : '#eee' }}>
                <h4 className="fw-bold text-success m-0 mb-3 mb-sm-0">
                  {!localSelecionado.preco || localSelecionado.preco === 0 ? 'Gratuito' : `R$ ${localSelecionado.preco.toFixed(2).replace('.', ',')}`}
                </h4>
                
                {!localSelecionado.preco || localSelecionado.preco === 0 ? (
                  <div className="badge bg-success px-4 py-2 fs-6 rounded-pill d-flex align-items-center" style={{ gap: '8px' }}>
                    <i className="fas fa-door-open"></i> Acesso Livre
                  </div>
                ) : (
                  <button 
                    className={`btn px-4 py-2 fw-bold rounded-pill ${adicionadoFeedback ? 'btn-light' : 'btn-success'}`}
                    disabled={adicionadoFeedback}
                    onClick={() => {
                      adicionarAoCarrinho(localSelecionado);
                      setAdicionadoFeedback(true); 
                      setTimeout(() => { setLocalSelecionado(null); setAdicionadoFeedback(false); }, 1200);
                    }}
                    style={{ transition: '0.3s ease' }}
                  >
                    <i className={`fas ${adicionadoFeedback ? 'fa-check' : 'fa-cart-plus'} me-2`}></i>
                    {adicionadoFeedback ? 'Adicionado!' : 'Adicionar'}
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