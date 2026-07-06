import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// BANCO DE DADOS COMPLETO COM AS COORDENADAS
const atracoesDb = [
  // --- CULTURA ---
  {
    id: "mac",
    titulo: "MAC Niterói",
    categoria: "cultura",
    tag: "Arte & Cultura",
    descricao: "A obra-prima de Niemeyer com vista deslumbrante.",
    preco: "R$ 25,00",
    imagem: "https://www.guiaviagensbrasil.com/imagens/belo-museu-de-arte-contemporanea-niteroi-rj.jpg",
    lat: -22.9068, lng: -43.1244
  },
  {
    id: "correios",
    titulo: "Espaço Cultural Correios",
    categoria: "cultura",
    tag: "Arte & História",
    descricao: "Exposições rotativas e grandes eventos culturais no coração da cidade.",
    preco: "Gratuito",
    imagem: "https://images.unsplash.com/photo-1561839561-b13bcfe95249?q=80&w=800",
    lat: -22.8945, lng: -43.1220
  },
  {
    id: "abrigo-bondes",
    titulo: "Centro Cultural Abrigo de Bondes",
    categoria: "cultura",
    tag: "História Local",
    descricao: "Programação cultural riquíssima que preserva a arquitetura histórica.",
    preco: "Gratuito",
    imagem: "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?q=80&w=800",
    lat: -22.8950, lng: -43.1210
  },
  {
    id: "quintal-cultural",
    titulo: "Quintal Centro Cultural",
    categoria: "cultura",
    tag: "Cultura Independente",
    descricao: "O point para oficinas, música boa e eventos da cena independente.",
    preco: "A partir de R$ 15",
    imagem: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800",
    lat: -22.9000, lng: -43.1150
  },

  // --- NATUREZA ---
  {
    id: "costao",
    titulo: "lindoa costão de Itacoatiara",
    categoria: "natureza",
    tag: "Trilha & Mirante",
    descricao: "Trilha clássica com visual panorâmico do Oceano Atlântico.",
    preco: "Gratuito",
    imagem: "https://rotadesonhos.com/wp-content/uploads/2021/02/costao-de-itacoatiara-e-enseada-do-bananal_Moment-1024x576.jpg",
    lat: -22.9760, lng: -43.0275
  },
  {
    id: "parque-cidade",
    titulo: "Parque da Cidade",
    categoria: "natureza",
    tag: "Pôr do Sol",
    descricao: "O mirante perfeito para ver o sol se pôr e saltar de parapente.",
    preco: "Gratuito",
    imagem: "https://www.viajenaviagem.com/wp-content/uploads/2021/07/niteroi-1920x640-1.jpg",
    lat: -22.9158, lng: -43.0858
  },
  {
    id: "mirante-piratininga",
    titulo: "Mirante Praia de Piratininga",
    categoria: "natureza",
    tag: "Vista Panorâmica",
    descricao: "Um cenário incrível, ótimo para curtir o fim de tarde e tirar fotos.",
    preco: "Gratuito",
    imagem: "https://images.unsplash.com/photo-1444464666168-49b626d49cb4?q=80&w=800",
    lat: -22.9600, lng: -43.0600
  },
  {
    id: "mirante-juliana",
    titulo: "Mirante Juliana Marins",
    categoria: "natureza",
    tag: "Mirante & Fotografia",
    descricao: "Vista deslumbrante que rende passeios inesquecíveis e fotos perfeitas.",
    preco: "Gratuito",
    imagem: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800",
    lat: -22.9250, lng: -43.0900
  },

  // --- BOEMIA ---
  {
    id: "cantareira",
    titulo: "Espaço Cultural Estação Cantareira",
    categoria: "boemia",
    tag: "Polo Noturno",
    descricao: "O principal polo de bares e vida noturna, conhecido como a Lapa de Niterói.",
    preco: "Variado",
    imagem: "https://diariodocomercio.com.br/wp-content/uploads/2023/01/festa-pic.jpg",
    lat: -22.9015, lng: -43.1320
  },
  {
    id: "toca-gamba",
    titulo: "Toca da Gamba",
    categoria: "boemia",
    tag: "Samba & Tradição",
    descricao: "Roda de samba ao vivo com aquele clima boêmio que não tem igual.",
    preco: "A partir de R$ 30",
    imagem: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=800",
    lat: -22.8879, lng: -43.1235
  },
  {
    id: "boteco-confraria",
    titulo: "Boteco Confraria",
    categoria: "boemia",
    tag: "Boteco Clássico",
    descricao: "Um dos bares mais conhecidos de Icaraí. Chopp gelado e muita resenha.",
    preco: "Variado",
    imagem: "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?q=80&w=800",
    lat: -22.9060, lng: -43.1090
  },
  {
    id: "portista-bar",
    titulo: "Portista Bar",
    categoria: "boemia",
    tag: "Petiscos & Cerveja",
    descricao: "Bem tradicional! A melhor pedida para petiscos de qualidade e cerveja.",
    preco: "Variado",
    imagem: "https://images.unsplash.com/photo-1538488251391-0e7fa3eb5562?q=80&w=800",
    lat: -22.9015, lng: -43.1080
  },
  {
    id: "center-bar",
    titulo: "Center Bar",
    categoria: "boemia",
    tag: "Música ao Vivo",
    descricao: "Público variado, ambiente descontraído e sempre com música ao vivo.",
    preco: "A partir de R$ 15",
    imagem: "https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?q=80&w=800",
    lat: -22.9100, lng: -43.1050
  },

  // --- GASTRONOMIA ---
  {
    id: "lilia-cafe",
    titulo: "Lilia Café",
    categoria: "gastronomia",
    tag: "Café & Encontros",
    descricao: "Cafeteria intimista e charmosa, o local perfeito para bons encontros.",
    preco: "Variado",
    imagem: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=800",
    lat: -22.9030, lng: -43.1100
  },
  {
    id: "cassia-brunch",
    titulo: "Cassia Confeitaria",
    categoria: "gastronomia",
    tag: "Brunch & Doces",
    descricao: "Especializada em brunch e cafés especiais com doces inesquecíveis.",
    preco: "Variado",
    imagem: "https://images.unsplash.com/photo-1495474472204-51ea99282214?q=80&w=800",
    lat: -22.9110, lng: -43.1070
  },
  {
    id: "matutino-cafe",
    titulo: "Matutino Café",
    categoria: "gastronomia",
    tag: "Café & Trabalho",
    descricao: "Ambiente moderno e tranquilo, excelente para tomar um café e fazer networking.",
    preco: "Variado",
    imagem: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=800",
    lat: -22.9075, lng: -43.1055
  },
  {
    id: "da-vinci-cafe",
    titulo: "Da Vinci's Gourmet",
    categoria: "gastronomia",
    tag: "Café Gourmet",
    descricao: "Ótima opção para degustar um café super bem preparado em um local aconchegante.",
    preco: "Variado",
    imagem: "https://images.unsplash.com/photo-1445116572660-236099ec97a0?q=80&w=800",
    lat: -22.9020, lng: -43.1110
  }
];

const formatarPrecoParaNumero = (precoStr) => {
  if (precoStr.toLowerCase().includes('gratuito')) return 0;
  if (precoStr.toLowerCase().includes('variado')) return 0;
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
        preco: formatarPrecoParaNumero(local.preco), 
        qtd: 1
      });
    }
    localStorage.setItem('boeminha_cart', JSON.stringify(cartSalvo));
  };

  // ======================================================================
  // NOVO EFFECT DO MAPA COM RESET E PINOS TEMÁTICOS EM CSS PURÍSSIMO!
  // ======================================================================
  useEffect(() => {
    // 1. Criamos o mapa direto na função. Toda vez que o código rodar, ele mata o zumbi anterior
    const mapa = L.map('map-container').setView([-22.92, -43.08], 12);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap',
    }).addTo(mapa);

    const markersLayer = L.layerGroup().addTo(mapa);

    // 2. Função que desenha o pino com HTML e põe o ícone certo do FontAwesome lá dentro!
    const obterPinoModerno = (categoria, isFavoritoView) => {
      let cor = '#0077b6'; // Azul Padrão (Cultura)
      let icone = 'fa-palette'; 
      
      if (isFavoritoView) {
        cor = '#9b59b6'; // Roxo para Favoritos
        icone = 'fa-heart';
      } else if (categoria === 'natureza') {
        cor = '#2d6a4f'; // Verde para Natureza
        icone = 'fa-tree';
      } else if (categoria === 'boemia') {
        cor = '#d68c45'; // Laranja para Boemia
        icone = 'fa-beer';
      } else if (categoria === 'gastronomia') {
        cor = '#e63946'; // Vermelho para Gastronomia
        icone = 'fa-coffee';
      }

      // Desenhamos um pino arredondado moderno usando bordas HTML (ponta pra baixo)
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
        className: '', // Deixar vazio força o Leaflet a apagar o pino azul original
        html: pinoHTML,
        iconSize: [32, 32],
        iconAnchor: [16, 32], 
        popupAnchor: [0, -32] 
      });
    };

    // 3. Adiciona os novos pinos temáticos
    atracoes.forEach((attr) => {
      if (attr.lat && attr.lng) {
        const iconePronto = obterPinoModerno(attr.categoria, filtroAtivo === 'favoritos');
        L.marker([attr.lat, attr.lng], { icon: iconePronto })
         .bindPopup(`<b>${attr.titulo}</b>`)
         .addTo(markersLayer);
      }
    });

    // 4. Ajusta o enquadramento do mapa
    const bounds = atracoes.filter(a => a.lat && a.lng).map((a) => [a.lat, a.lng]);
    if (bounds.length > 0) {
      mapa.fitBounds(bounds, { padding: [50, 50] });
    }

    // 5. A CHAVE MÁGICA: Quando o componente recarregar, destrói o mapa antigo da memória!
    return () => {
      mapa.remove();
    };
  }, [atracoes, filtroAtivo]); 
  // ======================================================================

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
    } else if (categoria === 'favoritos') {
      setAtracoes(atracoesDb.filter(a => favoritos.includes(a.id)));
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
        
        <h4 className="fw-bold mb-3">
          <i className="fas fa-map-marked-alt me-2 text-success"></i>
          Visão Geral
        </h4>
        <div 
          id="map-container" 
          style={{ height: '400px', borderRadius: '16px', border: '2px solid #eee', marginBottom: '40px', zIndex: 1, backgroundColor: '#f5f5f5' }}
        ></div>

        <div className="d-flex justify-content-between align-items-center mb-4 mt-5">
          <h4 className="fw-bold m-0">
            {filtroAtivo === 'favoritos' ? 'Sua Lista de Desejos' : 'Catálogo Completo'}
          </h4>
          <span className="small fw-bold text-muted">{atracoes.length} Resultados</span>
        </div>

        <div className="filter-container d-flex gap-2 mb-4 flex-wrap">
          <button className={`btn rounded-pill fw-bold ${filtroAtivo === 'all' ? 'btn-success' : 'btn-outline-secondary'}`} onClick={() => filtrar('all')}>Todos os Locais</button>
          <button className={`btn rounded-pill fw-bold ${filtroAtivo === 'natureza' ? 'btn-success' : 'btn-outline-secondary'}`} onClick={() => filtrar('natureza')}><i className="fas fa-tree me-1"></i> Natureza</button>
          <button className={`btn rounded-pill fw-bold ${filtroAtivo === 'boemia' ? 'btn-success' : 'btn-outline-secondary'}`} onClick={() => filtrar('boemia')}><i className="fas fa-beer me-1"></i> Boemia</button>
          <button className={`btn rounded-pill fw-bold ${filtroAtivo === 'gastronomia' ? 'btn-success' : 'btn-outline-secondary'}`} onClick={() => filtrar('gastronomia')}><i className="fas fa-coffee me-1"></i> Gastronomia</button>
          <button className={`btn rounded-pill fw-bold ${filtroAtivo === 'cultura' ? 'btn-success' : 'btn-outline-secondary'}`} onClick={() => filtrar('cultura')}><i className="fas fa-palette me-1"></i> Cultura</button>
          
          <button 
            className={`btn rounded-pill fw-bold ms-lg-auto ${filtroAtivo === 'favoritos' ? 'btn-danger' : 'btn-outline-danger'}`} 
            onClick={() => filtrar('favoritos')}
          >
            <i className="fas fa-heart me-1"></i> Meus Favoritos
          </button>
        </div>

        <div className="row g-4">
          {atracoes.length === 0 ? (
            <div className="col-12 text-center py-5">
              <i className="fas fa-heart-broken mb-3" style={{ fontSize: '3rem', color: '#ccc' }}></i>
              <h5 className="fw-bold text-muted">Nenhum local encontrado.</h5>
              {filtroAtivo === 'favoritos' && (
                <p className="text-muted">Você ainda não favoritou nenhuma experiência.</p>
              )}
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
                      <span className="fw-bold text-success">{attr.preco}</span>
                      
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
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}