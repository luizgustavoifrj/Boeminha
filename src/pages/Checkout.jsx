import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, firestore } from '../services/firebase';

export default function Checkout() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [metodoPagamento, setMetodoPagamento] = useState('cartao'); // 'cartao' ou 'pix'
  const [pixCopiado, setPixCopiado] = useState(false);
  const [dataAgendada, setDataAgendada] = useState(''); // Estado para guardar a data escolhida
  const navigate = useNavigate();

  useEffect(() => {
    // Verifica se o usuário está logado
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        alert("Você precisa estar logado para finalizar a compra.");
        navigate('/login');
      }
    });

    // Puxa os itens do carrinho
    const items = JSON.parse(localStorage.getItem("boeminha_cart")) || [];
    if (items.length === 0) {
      navigate('/explorar');
    } else {
      setCartItems(items);
    }

    return () => unsubscribe();
  }, [navigate]);

  const calcularTotal = () => {
    return cartItems.reduce((total, item) => {
      const preco = parseFloat(item.preco) || 0;
      const qtd = parseInt(item.qtd) || 1;
      return total + (preco * qtd);
    }, 0);
  };

  const processarPagamento = async (e) => {
    e.preventDefault();
    
    if (!dataAgendada) {
      alert("Por favor, selecione a data do seu passeio antes de prosseguir.");
      return;
    }

    setLoading(true);
    
    const user = auth.currentUser;
    if (!user) return;

    try {
      // Salva o pedido no Firestore com a data agendada
      await firestore.collection("usuarios").doc(user.uid).collection("pedidos").add({
        itens: cartItems,
        total: calcularTotal(),
        metodo: metodoPagamento,
        dataCompra: new Date().toISOString(),
        dataAgendada: dataAgendada, // Campo que o Perfil usa para "Próximos Eventos"
        status: "Aprovado",
      });

      // Limpa o carrinho
      localStorage.removeItem("boeminha_cart");
      
      setTimeout(() => {
        alert("Pagamento aprovado! O ingresso já está na aba de Próximos Eventos no seu perfil.");
        navigate('/perfil');
      }, 2000);

    } catch (error) {
      console.error("Erro ao salvar pedido: ", error);
      alert("Erro ao processar o pagamento.");
      setLoading(false);
    }
  };

  const copiarPix = () => {
    navigator.clipboard.writeText("00020126580014br.gov.bcb.pix0136boeminha@ifrj.edu.br5204000053039865802BR5913Boeminha6007Niteroi62070503***6304");
    setPixCopiado(true);
    setTimeout(() => setPixCopiado(false), 3000);
  };

  // Pega a data de hoje para impedir que o usuário agende para o passado
  const hoje = new Date().toISOString().split('T')[0];

  return (
    <div style={{ paddingTop: '76px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <div className="container mt-5 mb-5">
        <h2 className="fw-bold mb-4 text-dark"><i className="fas fa-lock text-success me-2"></i> Checkout Seguro</h2>
        
        <div className="row g-4">
          {/* Coluna Esquerda: Formulário de Pagamento e Data */}
          <div className="col-lg-7">
            <div className="bg-white rounded-4 shadow-sm border p-4 p-md-5">
              
              {/* Escolha da Data */}
              <div className="mb-5 pb-4 border-bottom">
                <h5 className="fw-bold mb-3"><i className="far fa-calendar-alt text-success me-2"></i>Quando será o seu passeio?</h5>
                <label className="form-label small fw-bold text-muted">Selecione o dia na agenda</label>
                <input 
                  type="date" 
                  className="form-control bg-light p-3 fs-5" 
                  min={hoje} 
                  required 
                  value={dataAgendada}
                  onChange={(e) => setDataAgendada(e.target.value)}
                />
              </div>

              <h5 className="fw-bold mb-4">Escolha a forma de pagamento</h5>
              
              {/* Abas de Seleção de Pagamento */}
              <div className="d-flex gap-3 mb-4">
                <button 
                  className={`btn flex-grow-1 fw-bold p-3 rounded-3 ${metodoPagamento === 'cartao' ? 'btn-success' : 'btn-outline-secondary'}`}
                  onClick={() => setMetodoPagamento('cartao')}
                >
                  <i className="fas fa-credit-card me-2"></i> Cartão de Crédito
                </button>
                <button 
                  className={`btn flex-grow-1 fw-bold p-3 rounded-3 ${metodoPagamento === 'pix' ? 'btn-success' : 'btn-outline-secondary'}`}
                  onClick={() => setMetodoPagamento('pix')}
                >
                  <i className="fab fa-pix me-2"></i> PIX
                </button>
              </div>

              <form onSubmit={processarPagamento}>
                
                {/* DADOS PARA CARTÃO DE CRÉDITO */}
                {metodoPagamento === 'cartao' && (
                  <div className="cartao-container animation-fade">
                    <div className="mb-3">
                      <label className="form-label small fw-bold text-muted">Nome no Cartão</label>
                      <input type="text" className="form-control bg-light p-3" required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label small fw-bold text-muted">Número do Cartão</label>
                      <input type="text" className="form-control bg-light p-3" placeholder="0000 0000 0000 0000" required />
                    </div>
                    <div className="row mb-4">
                      <div className="col-6">
                        <label className="form-label small fw-bold text-muted">Validade (MM/AA)</label>
                        <input type="text" className="form-control bg-light p-3" placeholder="12/30" required />
                      </div>
                      <div className="col-6">
                        <label className="form-label small fw-bold text-muted">CVV</label>
                        <input type="text" className="form-control bg-light p-3" placeholder="123" required />
                      </div>
                    </div>
                  </div>
                )}

                {/* DADOS PARA PIX */}
                {metodoPagamento === 'pix' && (
                  <div className="pix-container animation-fade text-center py-4 bg-light rounded-4 mb-4 border">
                    <h6 className="fw-bold text-success mb-3">Escaneie o QR Code abaixo</h6>
                    <img 
                      src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg" 
                      alt="QR Code Pix" 
                      className="img-fluid mb-3 rounded-3 shadow-sm" 
                      style={{ width: '150px' }} 
                    />
                    <p className="small text-muted mb-3">Ou utilize a opção Pix Copia e Cola no seu banco:</p>
                    <button type="button" onClick={copiarPix} className="btn btn-outline-success fw-bold rounded-pill px-4">
                      {pixCopiado ? <><i className="fas fa-check me-2"></i> Código Copiado!</> : <><i className="fas fa-copy me-2"></i> Copiar Código PIX</>}
                    </button>
                  </div>
                )}

                {/* Botão de Finalizar */}
                <button type="submit" className="btn btn-success fw-bold w-100 p-3 rounded-pill shadow-sm mt-2" disabled={loading}>
                  {loading ? (
                    <><i className="fas fa-spinner fa-spin me-2"></i> PROCESSANDO...</>
                  ) : (
                    <><i className="fas fa-check-circle me-2"></i> CONFIRMAR PEDIDO (R$ {calcularTotal().toFixed(2).replace('.', ',')})</>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Coluna Direita: Resumo do Pedido */}
          <div className="col-lg-5">
            <div className="bg-white rounded-4 shadow-sm border p-4 p-md-5 h-100">
              <h5 className="fw-bold mb-4 text-dark">Resumo do Pedido</h5>
              
              <ul className="list-unstyled mb-4">
                {cartItems.map((item, index) => (
                  <li key={index} className="d-flex align-items-center mb-3 pb-3 border-bottom">
                    <div style={{ width: '60px', height: '60px', backgroundImage: `url('${item.imagem}')`, backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: '10px', marginRight: '15px' }}></div>
                    <div className="flex-grow-1">
                      <h6 className="mb-1 fw-bold text-dark" style={{ fontSize: '0.95rem' }}>{item.titulo}</h6>
                      <small className="text-muted">Qtd: {item.qtd}</small>
                    </div>
                    <span className="fw-bold text-success ms-3 text-nowrap">
                      R$ {(parseFloat(item.preco) * item.qtd).toFixed(2).replace('.', ',')}
                    </span>
                  </li>
                ))}
              </ul>
              
              <div className="d-flex justify-content-between border-top pt-3 mt-4">
                <span className="fs-5 fw-bold text-muted">Total a Pagar:</span>
                <span className="fs-4 fw-bold text-success">R$ {calcularTotal().toFixed(2).replace('.', ',')}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}