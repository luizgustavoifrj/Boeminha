import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// BANCO DE DADOS ATUALIZADO COM DIAS, HORÁRIOS E ENDEREÇOS
const atracoesDb = [
  // --- CULTURA ---
  {
    id: "mac",
    titulo: "MAC Niterói",
    categoria: "cultura",
    tag: "Arte & Cultura",
    descricao: "A obra-prima de Niemeyer com vista deslumbrante e exposições de arte contemporânea incríveis.",
    preco: "R$ 25,00",
    imagem: "https://www.guiaviagensbrasil.com/imagens/belo-museu-de-arte-contemporanea-niteroi-rj.jpg",
    lat: -22.9068, lng: -43.1244,
    dias: "Terça a Domingo",
    horario: "10h às 18h",
    endereco: "Mirante da Boa Viagem, s/n - Boa Viagem"
  },
  {
    id: "correios",
    titulo: "Espaço Cultural Correios",
    categoria: "cultura",
    tag: "Arte & História",
    descricao: "Exposições rotativas e grandes eventos culturais no coração do centro da cidade.",
    preco: "Gratuito",
    imagem: "https://images.unsplash.com/photo-1561839561-b13bcfe95249?q=80&w=800",
    lat: -22.8945, lng: -43.1220,
    dias: "Segunda a Sábado",
    horario: "11h às 18h (Sábados até 17h)",
    endereco: "Av. Visconde do Rio Branco, 481 - Centro"
  },
  {
    id: "abrigo-bondes",
    titulo: "Centro Cultural Abrigo de Bondes",
    categoria: "cultura",
    tag: "História Local",
    descricao: "Programação cultural riquíssima que preserva a arquitetura histórica do transporte da cidade.",
    preco: "Gratuito",
    imagem: "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?q=80&w=800",
    lat: -22.8950, lng: -43.1210,
    dias: "Segunda a Sexta",
    horario: "09h às 18h",
    endereco: "Marquês de Paraná, 100 - Centro"
  },
  {
    id: "quintal-cultural",
    titulo: "Quintal Centro Cultural",
    categoria: "cultura",
    tag: "Cultura Independente",
    descricao: "O point para oficinas, música boa e eventos da cena independente e alternativa de Niterói.",
    preco: "A partir de R$ 15",
    imagem: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800",
    lat: -22.9000, lng: -43.1150,
    dias: "Quarta a Domingo",
    horario: "18h às 01h",
    endereco: "R. Américo Oberlaender, 580 - Sant Rosa"
  },

  // --- NATUREZA ---
  {
    id: "costao",
    titulo: "Costão de Itacoatiara",
    categoria: "natureza",
    tag: "Trilha & Mirante",
    descricao: "Trilha clássica, curta e de intensidade média, com visual panorâmico do Oceano Atlântico.",
    preco: "Gratuito",
    imagem: "https://rotadesonhos.com/wp-content/uploads/2021/02/costao-de-itacoatiara-e-enseada-do-bananal_Moment-1024x576.jpg",
    lat: -22.9760, lng: -43.0275,
    dias: "Todos os dias",
    horario: "08h às 17h (Entrada na trilha)",
    endereco: "Parque Estadual da Serra da Tiririca - Itacoatiara"
  },
  {
    id: "parque-cidade",
    titulo: "Parque da Cidade",
    categoria: "natureza",
    tag: "Pôr do Sol",
    descricao: "O mirante perfeito para ver o sol se pôr atrás das montanhas do Rio e ver os saltos de parapente.",
    preco: "Gratuito",
    imagem: "https://www.viajenaviagem.com/wp-content/uploads/2021/07/niteroi-1920x640-1.jpg",
    lat: -22.9158, lng: -43.0858,
    dias: "Todos os dias",
    horario: "07h às 18h",
    endereco: "Estr. da Viração, s/n - São Francisco"
  },
  {
    id: "mirante-piratininga",
    titulo: "Mirante Praia de Piratininga",
    categoria: "natureza",
    tag: "Vista Panorâmica",
    descricao: "Um cenário incrível com vista limpa do mar, ótimo para curtir o fim de tarde e tirar fotos.",
    preco: "Gratuito",
    imagem: "https://images.unsplash.com/photo-1444464666168-49b626d49cb4?q=80&w=800",
    lat: -22.9600, lng: -43.0600,
    dias: "Aberto 24h",
    horario: "Livre",
    endereco: "Extremo da Praia de Piratininga"
  },
  {
    id: "mirante-juliana",
    titulo: "Mirante Juliana Marins",
    categoria: "natureza",
    tag: "Mirante & Fotografia",
    descricao: "Vista deslumbrante da Região Oceânica que rende passeios inesquecíveis e fotos perfeitas.",
    preco: "Gratuito",
    imagem: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800",
    lat: -22.9250, lng: -43.0900,
    dias: "Todos os dias",
    horario: "Livre",
    endereco: "Estrada Francisco da Cruz Nunes"
  },

  // --- BOEMIA ---
  {
    id: "cantareira",
    titulo: "Espaço Cultural Estação Cantareira",
    categoria: "boemia",
    tag: "Polo Noturno",
    descricao: "O principal polo de bares, universitários e vida noturna, conhecido como a Lapa de Niterói.",
    preco: "Variado",
    imagem: "https://diariodocomercio.com.br/wp-content/uploads/2023/01/festa-pic.jpg",
    lat: -22.9015, lng: -43.1320,
    dias: "Quinta a Domingo",
    horario: "A partir das 18h",
    endereco: "Rua Alexandre Moura, 2A - São Domingos"
  },
  {
    id: "toca-gamba",
    titulo: "Toca da Gamba",
    categoria: "boemia",
    tag: "Samba & Tradição",
    descricao: "Roda de samba ao vivo da mais alta qualidade com aquele clima boêmio que não tem igual.",
    preco: "A partir de R$ 30",
    imagem: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=800",
    lat: -22.8879, lng: -43.1235,
    dias: "Sexta a Domingo",
    horario: "A partir das 19h",
    endereco: "Travessa Carlos Gomes, 23 - Barreto"
  },
  {
    id: "boteco-confraria",
    titulo: "Boteco Confraria",
    categoria: "boemia",
    tag: "Boteco Clássico",
    descricao: "Um dos bares mais conhecidos de Icaraí. Chopp gelado na caneca nevada e muita resenha.",
    preco: "Variado",
    imagem: "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?q=80&w=800",
    lat: -22.9060, lng: -43.1090,
    dias: "Terça a Domingo",
    horario: "11h às 01h",
    endereco: "R. Nóbrega, 237 - Icaraí"
  },
  {
    id: "portista-bar",
    titulo: "Portista Bar",
    categoria: "boemia",
    tag: "Petiscos & Cerveja",
    descricao: "Bem tradicional e aconchegante! A melhor pedida para petiscos de qualidade e cerveja de garrafa.",
    preco: "Variado",
    imagem: "https://images.unsplash.com/photo-1538488251391-0e7fa3eb5562?q=80&w=800",
    lat: -22.9015, lng: -43.1080,
    dias: "Terça a Domingo",
    horario: "17h às 01h",
    endereco: "R. Cel. Tamarindo, 145 - Gragoatá"
  },
  {
    id: "center-bar",
    titulo: "Center Bar",
    categoria: "boemia",
    tag: "Música ao Vivo",
    descricao: "Público variado, ambiente descontraído com mesinhas na calçada e sempre com música ao vivo.",
    preco: "A partir de R$ 15",
    imagem: "https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?q=80&w=800",
    lat: -22.9100, lng: -43.1050,
    dias: "Segunda a Sábado",
    horario: "16h às 02h",
    endereco: "Av. Jansen de Melo, 14 - Centro"
  },

  // --- GASTRONOMIA ---
  {
    id: "lilia-cafe",
    titulo: "Lilia Café",
    categoria: "gastronomia",
    tag: "Café & Encontros",
    descricao: "Cafeteria intimista e charmosa, com grãos selecionados. O local perfeito para bons encontros.",
    preco: "Variado",
    imagem: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=800",
    lat: -22.9030, lng: -43.1100,
    dias: "Segunda a Sábado",
    horario: "09h às 19h",
    endereco: "Rua Gavião Peixoto - Icaraí"
  },
  {
    id: "cassia-brunch",
    titulo: "Cassia Confeitaria",
    categoria: "gastronomia",
    tag: "Brunch & Doces",
    descricao: "Especializada em brunch farto e cafés especiais que acompanham doces finos inesquecíveis.",
    preco: "Variado",
    imagem: "https://images.unsplash.com/photo-1495474472204-51ea99282214?q=80&w=800",
    lat: -22.9110, lng: -43.1070,
    dias: "Terça a Domingo",
    horario: "10h às 20h",
    endereco: "Polo Gastronômico de Icaraí"
  },
  {
    id: "matutino-cafe",
    titulo: "Matutino Café",
    categoria: "gastronomia",
    tag: "Café & Trabalho",
    descricao: "Ambiente moderno e tranquilo, com Wi-Fi rápido, excelente para tomar um café e fazer networking.",
    preco: "Variado",
    imagem: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=800",
    lat: -22.9075, lng: -43.1055,
    dias: "Segunda a Sábado",
    horario: "08h às 19h",
    endereco: "Rua Miguel de Frias - Icaraí"
  },
  {
    id: "da-vinci-cafe",
    titulo: "Da Vinci's Gourmet",
    categoria: "gastronomia",
    tag: "Café Gourmet",
    descricao: "Ótima opção para degustar um café gourmet super bem preparado em um local muito aconchegante.",
    preco: "Variado",
    imagem: "https://images.unsplash.com/photo-1445116572660-236099ec97a0?q=80&w=800",
    lat: -22.9020, lng: -43.1110,
    dias: "Segunda a Sexta",
    horario: "08h às 18h",
    endereco: "Rua Moreira César - Icaraí"
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
  // MAPA REINICIADO DO ZERO A CADA FILTRO (TRAVA ANTI-GHOST)
  // ======================================================================
  useEffect(() => {
    const container = document.getElementById('map-container');
    if (!container) return;

    const mapa = L.map('map-container').setView([-22.92, -43.08], 12);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap',
    }).addTo(mapa);

    const markersLayer = L.layerGroup().addTo(mapa);

    const obterPinoModerno = (categoria, isFavoritoView) => {
      let cor = '#0077b6'; // Azul Padrão (Cultura)
      let icone = 'fa-palette'; 
      
      if (isFavoritoView) {
        cor = '#9b59b6'; // Roxo
        icone = 'fa-heart';
      } else if (categoria === 'natureza') {
        cor = '#2d6a4f'; // Verde
        icone = 'fa-tree';
      } else if (categoria === 'boemia') {
        cor = '#d68c45'; // Laranja
        icone = 'fa-beer';
      } else if (categoria === 'gastronomia') {
        cor = '#e63946'; // Vermelho
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
      
      {/* ESTILOS CUSTOMIZADOS PARA AS CORES DOS BOTÕES DO FILTRO (HOVER E ACTIVE) */}
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

        {/* BOTÕES DE FILTRO AGORA COM AS CORES TEMÁTICAS */}
        <div className="filter-container d-flex gap-2 mb-4 flex-wrap">
          <button className={`btn rounded-pill fw-bold btn-cat-all ${filtroAtivo === 'all' ? 'active' : ''}`} onClick={() => filtrar('all')}>
            Todos os Locais
          </button>
          <button className={`btn rounded-pill fw-bold btn-cat-natureza ${filtroAtivo === 'natureza' ? 'active' : ''}`} onClick={() => filtrar('natureza')}>
            <i className="fas fa-tree me-1"></i> Natureza
          </button>
          <button className={`btn rounded-pill fw-bold btn-cat-boemia ${filtroAtivo === 'boemia' ? 'active' : ''}`} onClick={() => filtrar('boemia')}>
            <i className="fas fa-beer me-1"></i> Boemia
          </button>
          <button className={`btn rounded-pill fw-bold btn-cat-gastronomia ${filtroAtivo === 'gastronomia' ? 'active' : ''}`} onClick={() => filtrar('gastronomia')}>
            <i className="fas fa-coffee me-1"></i> Gastronomia
          </button>
          <button className={`btn rounded-pill fw-bold btn-cat-cultura ${filtroAtivo === 'cultura' ? 'active' : ''}`} onClick={() => filtrar('cultura')}>
            <i className="fas fa-palette me-1"></i> Cultura
          </button>
          
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
              <h3 className="fw-bold mb-3">{localSelecionado.titulo}</h3>
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
              </div>
              
              <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center pt-2 border-top">
                <h4 className="fw-bold text-success m-0 mb-3 mb-sm-0">{localSelecionado.preco}</h4>
                
                {/* LÓGICA DO CARRINHO PARA ITENS GRATUITOS */}
                {localSelecionado.preco.toLowerCase().includes('gratuito') ? (
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