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

export default function Explorar() {
  const [atracoes, setAtracoes] = useState(atracoesDb);
  const [filtroAtivo, setFiltroAtivo] = useState('all');
  
  // 1. CRIAMOS O ESTADO PARA O CARRINHO/FAVORITOS
  const [favoritos, setFavoritos] = useState([]); 
  
  const location = useLocation();

  // 2. RECUPERAMOS OS FAVORITOS SALVOS NO NAVEGADOR AO ABRIR A PÁGINA
  useEffect(() => {
    const favsSalvos = JSON.parse(localStorage.getItem('boeMinha_favs')) || [];
    setFavoritos(favsSalvos);
  }, []);

  // 3. FUNÇÃO PARA ADICIONAR OU REMOVER DO CARRINHO/FAVORITOS
  const toggleFav = (id) => {
    let novosFavs;
    if (favoritos.includes(id)) {
      novosFavs = favoritos.filter((f) => f !== id); // Tira da lista
    } else {
      novosFavs = [...favoritos, id]; // Coloca na lista
    }
    setFavoritos(novosFavs);
    localStorage.setItem('boeMinha_favs', JSON.stringify(novosFavs));
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
                
                {/* DIV DA IMAGEM: Adicionei position: relative para o coração flutuar aqui */}
                <div style={{ height: '200px', backgroundImage: `url(${attr.imagem})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
                  
                  {/* BOTÃO DE CORAÇÃO/CARRINHO VOLTOU AQUI */}
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
                    
                    {/* BOTÃO DE VER DETALHES AGORA COM A AÇÃO ONCLICK */}
                    <button 
                      className="btn btn-sm btn-outline-dark fw-bold"
                      onClick={() => alert(`Você clicou para ver os detalhes de: ${attr.titulo}`)}
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
    </div>
  );
}