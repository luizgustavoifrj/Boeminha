import { useState } from 'react';

export default function Niteroi() {
  const [modalItem, setModalItem] = useState(null);
  const [quantidade, setQuantidade] = useState(1);

  const atracoes = [
    { id: 'mac-niteroi', titulo: 'Museu de Arte Contemporânea', descricao: 'Obra-prima de Oscar Niemeyer com exposições de arte moderna.', preco: 25.00, imagem: 'https://www.guiaviagensbrasil.com/imagens/belo-museu-de-arte-contemporanea-niteroi-rj.jpg' },
    { id: 'bar-boemia', titulo: 'Bar Boemia Social Club (18+)', descricao: 'Bar e casa de shows com clima intimista, música ao vivo.', preco: 40.00, imagem: 'https://images.squarespace-cdn.com/content/v1/648331aed0f6882fac88a261/d1dc395b-c60c-4dc1-b683-d8757d86ddb7/barlesieur-9.jpg' },
    { id: 'fortaleza', titulo: 'Fortaleza de Santa Cruz', descricao: 'Visitas guiadas por um forte histórico do século XVI.', preco: 15.00, imagem: 'https://upload.wikimedia.org/wikipedia/commons/2/28/Fortaleza_de_santa_cruz.jpg' }
  ];

  const adicionarAoCarrinho = () => {
    const cart = JSON.parse(localStorage.getItem("boeminha_cart")) || [];
    cart.push({
      id: modalItem.id,
      titulo: modalItem.titulo,
      preco: modalItem.preco,
      qtd: quantidade,
      imagem: modalItem.imagem
    });
    localStorage.setItem("boeminha_cart", JSON.stringify(cart));
    alert(`${quantidade}x ${modalItem.titulo} adicionado ao carrinho!`);
    setModalItem(null);
  };

  return (
    <div style={{ paddingTop: '76px' }}>
      <header className="hero-section text-center text-white position-relative" style={{ padding: '100px 0', background: '#1b4332' }}>
        <div className="position-absolute top-0 start-0 w-100 h-100" style={{ backgroundImage: "url('https://www.viajenaviagem.com/wp-content/uploads/2021/07/niteroi-1920x640-1.jpg')", opacity: 0.4, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
        <div className="container position-relative" style={{ zIndex: 2 }}>
          <h1 className="display-4 fw-bold mb-3">Niterói</h1>
          <p className="lead">Ingressos para as melhores atrações da Cidade Sorriso</p>
        </div>
      </header>

      <div className="container mb-5 mt-5">
        <div className="row g-4">
          {atracoes.map((attr) => (
            <div className="col-lg-4 col-md-6" key={attr.id}>
              <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden">
                <div style={{ height: '200px', backgroundImage: `url(${attr.imagem})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                <div className="card-body p-4 d-flex flex-column">
                  <h4 className="fw-bold">{attr.titulo}</h4>
                  <p className="text-muted flex-grow-1">{attr.descricao}</p>
                  <button onClick={() => { setModalItem(attr); setQuantidade(1); }} className="btn btn-success w-100 fw-bold rounded-pill">Ver Ingressos</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de Compra */}
      {modalItem && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.6)' }} tabIndex="-1">
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content rounded-4 border-0">
              <div className="modal-header bg-dark text-white border-0 rounded-top-4">
                <h5 className="modal-title fw-bold">Atração</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setModalItem(null)}></button>
              </div>
              <div className="modal-body p-4">
                <div className="row">
                  <div className="col-md-6 mb-3 mb-md-0">
                    <img src={modalItem.imagem} className="img-fluid rounded-4 shadow-sm" alt={modalItem.titulo} />
                  </div>
                  <div className="col-md-6 d-flex flex-column justify-content-center">
                    <h3 className="fw-bold mb-3">{modalItem.titulo}</h3>
                    <p className="text-muted">{modalItem.descricao}</p>
                    <div className="d-flex justify-content-between align-items-center my-3">
                      <h5 className="mb-0 fw-bold">Preço:</h5>
                      <h3 className="text-success mb-0 fw-bold">R$ {modalItem.preco.toFixed(2).replace('.', ',')}</h3>
                    </div>
                    <div className="mb-4">
                      <label className="form-label fw-bold">Quantidade:</label>
                      <div className="input-group" style={{ width: '150px' }}>
                        <button className="btn btn-outline-secondary fw-bold" onClick={() => setQuantidade(q => Math.max(1, q - 1))}>-</button>
                        <input type="number" className="form-control text-center fw-bold" value={quantidade} readOnly />
                        <button className="btn btn-outline-secondary fw-bold" onClick={() => setQuantidade(q => q + 1)}>+</button>
                      </div>
                    </div>
                    <button className="btn btn-success w-100 py-3 fw-bold rounded-pill shadow-sm" onClick={adicionarAoCarrinho}>
                      <i className="fas fa-cart-plus me-2"></i> Adicionar ao Carrinho
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}