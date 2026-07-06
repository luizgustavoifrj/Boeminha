import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { firestore } from '../services/firebase';

export default function Roteiros() {
  const navigate = useNavigate();
  const [roteiros, setRoteiros] = useState([]);
  const [loading, setLoading] = useState(true);

  // Roteiros fixos para garantir que a página sempre tenha conteúdo na apresentação
  const roteirosIniciais = [
    {
      id: "rot-1",
      titulo: "Trilha Escondida do Tupinambá",
      descricao: "Descubra mirantes secretos na Mata Atlântica que apenas os locais conhecem. Nível moderado, ideal para aventureiros.",
      duracao: "4 horas",
      preco: 45.00,
      imagem: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Parque_da_Cidade_em_Niter%C3%B3i.jpg/1200px-Parque_da_Cidade_em_Niter%C3%B3i.jpg",
      guia: { nome: "Aline Silva", foto: "https://randomuser.me/api/portraits/women/32.jpg", avaliacao: 4.9, especialidade: "Ecoturismo" }
    },
    {
      id: "rot-2",
      titulo: "Circuito Niemeyer Noturno",
      descricao: "Passeio arquitetônico pelas obras de Oscar Niemeyer à noite, com paradas estratégicas para fotos e muita história.",
      duracao: "3 horas",
      preco: 60.00,
      imagem: "https://www.guiaviagensbrasil.com/imagens/belo-museu-de-arte-contemporanea-niteroi-rj.jpg",
      guia: { nome: "Carlos Eduardo", foto: "https://randomuser.me/api/portraits/men/22.jpg", avaliacao: 4.8, especialidade: "Cultura & História" }
    },
    {
      id: "rot-3",
      titulo: "Tour Gastronômico da Cantareira",
      descricao: "Mergulho cultural com degustação em 3 botecos clássicos da praça. O valor já inclui 3 chopes artesanais e petiscos.",
      duracao: "4 horas",
      preco: 120.00,
      imagem: "https://diariodocomercio.com.br/wp-content/uploads/2023/01/festa-pic.jpg",
      guia: { nome: "Pedro Rocha", foto: "https://randomuser.me/api/portraits/men/45.jpg", avaliacao: 5.0, especialidade: "Boemia & Gastronomia" }
    }
  ];

  useEffect(() => {
    const buscarRoteirosDoBanco = async () => {
      try {
        // Busca os roteiros criados pelos guias no Firebase
        const snapshot = await firestore.collection('roteiros').orderBy('dataCriacao', 'desc').get();
        
        const roteirosDoFirebase = snapshot.docs.map(doc => {
          const dados = doc.data();
          return {
            id: doc.id,
            titulo: dados.titulo,
            descricao: dados.descricao,
            duracao: dados.duracao,
            horario: dados.horario, // Campo extra que o guia preenche
            preco: parseFloat(dados.preco),
            imagem: dados.imagemUrl,
            guia: { 
              nome: dados.guiaNome, 
              foto: dados.guiaFoto || "https://randomuser.me/api/portraits/lego/1.jpg", 
              avaliacao: 5.0, // Nota padrão inicial para novos guias
              especialidade: "Guia Local Especialista" 
            }
          };
        });

        // Junta os roteiros do banco de dados com os iniciais
        setRoteiros([...roteirosDoFirebase, ...roteirosIniciais]);
      } catch (erro) {
        console.error("Erro ao buscar roteiros:", erro);
        // Se der erro de conexão, mostra pelo menos os roteiros iniciais
        setRoteiros(roteirosIniciais);
      } finally {
        setLoading(false);
      }
    };

    buscarRoteirosDoBanco();
  }, []);

  const adicionarAoCarrinho = (roteiro) => {
    const cart = JSON.parse(localStorage.getItem("boeminha_cart")) || [];
    cart.push({
      id: roteiro.id,
      titulo: roteiro.titulo,
      preco: roteiro.preco,
      qtd: 1,
      imagem: roteiro.imagem
    });
    localStorage.setItem("boeminha_cart", JSON.stringify(cart));
    alert(`O roteiro "${roteiro.titulo}" foi adicionado ao seu carrinho!`);
  };

  return (
    <div style={{ paddingTop: '76px', backgroundColor: '#f8fcf9', minHeight: '100vh' }}>
      
      {/* Header Roteiros */}
      <header className="text-center text-white mb-5" style={{ background: 'linear-gradient(135deg, #1b4332 0%, #2d6a4f 100%)', padding: '80px 0' }}>
        <div className="container">
          <h1 className="fw-bold mb-3" style={{ fontSize: '3rem', letterSpacing: '-1px' }}>Roteiros Guiados</h1>
          <p className="lead opacity-75 mx-auto" style={{ maxWidth: '650px' }}>
            Experiências completas desenhadas e conduzidas pelos melhores guias locais da cidade.
          </p>
        </div>
      </header>

      <main className="container mb-5">
        {loading ? (
          <div className="d-flex justify-content-center py-5">
            <div className="spinner-border text-success" role="status"></div>
          </div>
        ) : (
          <div className="row g-5">
            {roteiros.map((roteiro) => (
              <div className="col-lg-4 col-md-6" key={roteiro.id}>
                <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden d-flex flex-column bg-white">
                  
                  {/* Imagem do Roteiro */}
                  <div style={{ height: '220px', backgroundImage: `url(${roteiro.imagem})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
                    <span className="badge bg-dark text-white position-absolute bottom-0 start-0 m-3 p-2 fw-bold shadow-sm">
                      <i className="far fa-clock me-1"></i> {roteiro.horario ? `${roteiro.horario} • ` : ''}{roteiro.duracao}
                    </span>
                  </div>
                  
                  <div className="card-body p-4 d-flex flex-column">
                    
                    {/* Perfil do Guia */}
                    <div className="d-flex align-items-center mb-3 pb-3 border-bottom">
                      <img src={roteiro.guia.foto} alt={roteiro.guia.nome} className="rounded-circle shadow-sm me-3" style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
                      <div>
                        <p className="mb-0 fw-bold text-dark fs-6">{roteiro.guia.nome}</p>
                        <p className="mb-0 small text-muted">{roteiro.guia.especialidade} • <i className="fas fa-star text-warning small"></i> {roteiro.guia.avaliacao}</p>
                      </div>
                    </div>

                    <h4 className="fw-bold text-dark mb-2">{roteiro.titulo}</h4>
                    <p className="text-muted small mb-4 flex-grow-1" style={{ lineHeight: '1.6' }}>{roteiro.descricao}</p>
                    
                    {/* Preço e Botão */}
                    <div className="mt-auto d-flex justify-content-between align-items-center">
                      <div>
                        <span className="d-block small text-muted fw-bold">Por pessoa</span>
                        <span className="fw-bold text-success fs-4">
                          {roteiro.preco > 0 ? `R$ ${roteiro.preco.toFixed(2).replace('.', ',')}` : 'Gratuito'}
                        </span>
                      </div>
                      
                      <button onClick={() => adicionarAoCarrinho(roteiro)} className="btn btn-success fw-bold rounded-pill px-4 shadow-sm">
                        <i className="fas fa-calendar-check me-2"></i> Reservar
                      </button>
                    </div>

                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}