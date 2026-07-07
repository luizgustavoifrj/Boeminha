import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { firestore } from '../services/firebase';

export default function Home() {
  const [busca, setBusca] = useState('');
  const [anuncios, setAnuncios] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const buscarAnuncios = async () => {
      try {
        const snapshot = await firestore.collection('anuncios_patrocinados').where('status', '==', 'Ativo').get();
        const lista = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAnuncios(lista);
      } catch (error) {
        console.error("Erro ao buscar anúncios:", error);
      }
    };
    buscarAnuncios();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (busca.trim() !== '') {
      navigate(`/explorar?q=${busca}`);
    }
  };

  const anunciosTopo = anuncios.slice(0, 3);
  const anunciosMeio = anuncios.slice(3, 6);

  return (
    <div style={{ paddingTop: '76px', backgroundColor: '#f8fcf9', minHeight: '100vh' }}>
      
      {/* 1. HERO SECTION ORIGINAL */}
      <section className="position-relative d-flex align-items-center" style={{ minHeight: '80vh', backgroundColor: '#112b20', overflow: 'hidden' }}>
        <div className="position-absolute w-100 h-100" style={{ backgroundImage: "url('https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Museu_de_Arte_Contempor%C3%A2nea_de_Niter%C3%B3i_-_Rio_de_Janeiro%2C_Brasil.jpg/1200px-Museu_de_Arte_Contempor%C3%A2nea_de_Niter%C3%B3i_-_Rio_de_Janeiro%2C_Brasil.jpg')", backgroundSize: 'cover', backgroundPosition: 'center', opacity: '0.4' }}></div>
        <div className="container position-relative py-5" style={{ zIndex: 10 }}>
          <div className="row justify-content-center text-center">
            <div className="col-lg-8">
              <h1 className="display-4 fw-bold text-white mb-3">Descubra a verdadeira essência da cidade.</h1>
              <p className="lead text-white-50 mb-4">Conectamos você às experiências mais autênticas, guias locais e a uma rota inesquecível.</p>
              
              <form onSubmit={handleSearch} className="bg-white p-2 rounded-pill shadow-lg d-flex align-items-center mx-auto" style={{ maxWidth: '550px' }}>
                <i className="fas fa-search text-muted ms-3 fs-5"></i>
                <input type="text" className="form-control border-0 shadow-none bg-transparent py-2 px-3" placeholder="O que você procura hoje?" value={busca} onChange={(e) => setBusca(e.target.value)} />
                <button type="submit" className="btn btn-success fw-bold rounded-pill px-4 py-2">Buscar</button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ESPAÇO PUBLICITÁRIO: CARROSSEL NO TOPO */}
      {anunciosTopo.length > 0 && (
        <section className="container my-4" style={{ position: 'relative', zIndex: 20 }}>
          <div id="carouselPatrocinado" className="carousel slide shadow-sm rounded-4 overflow-hidden bg-white border" data-bs-ride="carousel" data-bs-interval="4000">
            <div className="carousel-inner">
              {anunciosTopo.map((anuncio, index) => (
                <div className={`carousel-item ${index === 0 ? 'active' : ''}`} key={anuncio.id}>
                  <a href={anuncio.link} target="_blank" rel="noopener noreferrer" className="d-block position-relative">
                    <img src={anuncio.imagemUrl} className="d-block w-100" style={{ height: '140px', objectFit: 'cover' }} alt={anuncio.titulo} />
                    <div className="position-absolute bottom-0 start-0 w-100 p-2 text-white bg-dark bg-opacity-75 d-flex justify-content-between align-items-center px-3 small">
                      <span className="badge bg-warning text-dark">PATROCINADO</span>
                      <span className="fw-bold text-truncate ms-2">{anuncio.titulo}</span>
                    </div>
                  </a>
                </div>
              ))}
            </div>
            {anunciosTopo.length > 1 && (
              <>
                <button className="carousel-control-prev" type="button" data-bs-target="#carouselPatrocinado" data-bs-slide="prev">
                  <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#carouselPatrocinado" data-bs-slide="next">
                  <span className="carousel-control-next-icon" aria-hidden="true"></span>
                </button>
              </>
            )}
          </div>
        </section>
      )}

      {/* 2. DESTAQUES ORIGINAIS */}
      <section className="container my-5 py-4">
        <div className="text-center mb-5">
          <h2 className="fw-bold text-dark">Explorando por Categorias</h2>
          <p className="text-muted">Tudo o que Niterói tem para oferecer na palma da sua mão.</p>
        </div>
        <div className="row g-4 text-center">
          <div className="col-md-4">
            <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
              <div className="text-success fs-1 mb-3"><i className="fas fa-beer"></i></div>
              <h5 className="fw-bold">Bares & Botecos</h5>
              <p className="text-muted small">Os melhores locais para curtir a noite boemia.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
              <div className="text-success fs-1 mb-3"><i className="fas fa-route"></i></div>
              <h5 className="fw-bold">Roteiros Exclusivos</h5>
              <p className="text-muted small">Passeios guiados por especialistas locais.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
              <div className="text-success fs-1 mb-3"><i className="fas fa-store"></i></div>
              <h5 className="fw-bold">Parceiros Business</h5>
              <p className="text-muted small">Estabelecimentos verificados e com descontos.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ESPAÇO PUBLICITÁRIO 2: VITRINE ADICIONAL NO MEIO */}
      {anunciosMeio.length > 0 && (
        <section className="container mb-5">
          <div className="bg-light p-4 rounded-4 border">
            <h5 className="fw-bold text-dark mb-3"><i className="fas fa-bullhorn text-success me-2"></i>Destaques da Comunidade</h5>
            <div className="row g-3">
              {anunciosMeio.map(anuncio => (
                <div className="col-md-4" key={anuncio.id}>
                  <a href={anuncio.link} target="_blank" rel="noopener noreferrer" className="card border-0 shadow-sm rounded-3 overflow-hidden text-decoration-none h-100">
                    <img src={anuncio.imagemUrl} alt={anuncio.titulo} style={{ height: '100px', objectFit: 'cover' }} />
                    <div className="p-2 small fw-bold text-dark text-center text-truncate bg-white">{anuncio.titulo}</div>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}