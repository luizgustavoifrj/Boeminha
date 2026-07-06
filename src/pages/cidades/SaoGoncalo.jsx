import { useState } from 'react';

export default function SaoGoncalo() {
  const [modalItem, setModalItem] = useState(null);
  const [quantidade, setQuantidade] = useState(1);

  const atracoes = [
    { id: 'strike', titulo: 'Strike São Gonçalo', descricao: 'Boliche moderno com estrutura completa.', preco: 35.00, imagem: 'https://bolixe.com.br/wp-content/uploads/2019/05/4-1-768x768.jpg' },
    { id: 'casa-artes', titulo: 'Casa das Artes Villa Real', descricao: 'Espaço cultural para exposições.', preco: 10.00, imagem: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjaxhLxLenP7HQG2P-5LSIU83hi3UPftrS6O5WFLe7GjhNwkgeMEzwwbXxZBlqzT8wryRF1fHETdJRpJH3u14bET8HpvilO4X8h0RYv1WoyDCxmr6zOz7p8M1JkGsif6dkkPEZBbyYCBLQm/s640/13442318_1034059630016550_7978241371980628582_n.jpg' },
    { id: 'rock-beer', titulo: "Rock 'N Beer Pub (18+)", descricao: 'Pub alternativo com rock e cerveja artesanal.', preco: 30.00, imagem: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQe8-iReFffr6i_RxS7X1f-KuOMpPjgHNi8Bg&s' }
  ];

  const adicionarAoCarrinho = () => {
    const cart = JSON.parse(localStorage.getItem("boeminha_cart")) || [];
    cart.push({ id: modalItem.id, titulo: modalItem.titulo, preco: modalItem.preco, qtd: quantidade, imagem: modalItem.imagem });
    localStorage.setItem("boeminha_cart", JSON.stringify(cart));
    alert(`${quantidade}x ${modalItem.titulo} adicionado ao carrinho!`);
    setModalItem(null);
  };

  return (
    <div style={{ paddingTop: '76px' }}>
      <header className="hero-section text-center text-white position-relative" style={{ padding: '100px 0', background: '#1b4332' }}>
        <div className="position-absolute top-0 start-0 w-100 h-100" style={{ backgroundImage: "url('https://cdn.osaogoncalo.com.br/img/inline/110000/1440x912/imagem-309-1_00116623_3.webp?fallback=%2Fimg%2Finline%2F110000%2Fimagem-309-1_00116623_3.png%3Fxid%3D348311&xid=348311')", opacity: 0.4, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
        <div className="container position-relative" style={{ zIndex: 2 }}>
          <h1 className="display-4 fw-bold mb-3">São Gonçalo</h1>
          <p className="lead">Ingressos para as melhores atrações da cidade</p>
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