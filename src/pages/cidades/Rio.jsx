import { useState } from 'react';

export default function Rio() {
  const [modalItem, setModalItem] = useState(null);
  const [quantidade, setQuantidade] = useState(1);

  const atracoes = [
    { id: 'pao-de-acucar', titulo: 'Pão de Açúcar', descricao: 'Vista espetacular da cidade e da Baía de Guanabara.', preco: 120.00, imagem: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/11/d7/5c/0d/vista-do-morro-da-urca.jpg?w=900&h=500&s=1' },
    { id: 'museu-amanha', titulo: 'Museu do Amanhã', descricao: 'Arquitetura futurista e exposições interativas.', preco: 80.00, imagem: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjONhHd_-W5IXDd3l6saH50NdMlrzxQoHBjns59WHlATMSqgdUGVCf55mZqWdQl7-6t9fzkTTovXIGS9h_GfnMcGLmLbJJ4a-EwYTdj-h12l0SNuIkm4ZaY9f_9fWf57NrHBtDzh3k4xuvMAEDNkawTQuTUiEySUjOlPYfz1GP79wT6LsKw2JTQDg/s640/estrela-museudoamanh%C3%A3.jpg' },
    { id: 'rio-scenarium', titulo: 'Rio Scenarium (+18)', descricao: 'A melhor festa no coração da Lapa.', preco: 150.00, imagem: 'https://vejario.abril.com.br/wp-content/uploads/2016/11/screen-shot-2015-08-14-at-6-24-03-pm.png?w=685' }
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
        <div className="position-absolute top-0 start-0 w-100 h-100" style={{ backgroundImage: "url('https://blog.123milhas.com/wp-content/uploads/2022/06/conheca-estado-rio-de-janeiro-ipanema-conexao123.jpg')", opacity: 0.4, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
        <div className="container position-relative" style={{ zIndex: 2 }}>
          <h1 className="display-4 fw-bold mb-3">Rio de Janeiro</h1>
          <p className="lead">Ingressos para as melhores atrações da Cidade Maravilhosa</p>
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