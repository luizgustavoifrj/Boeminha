import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, firestore } from '../services/firebase';
import firebase from 'firebase/compat/app';

export default function Checkout() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        alert("Sessão expirada. Faça login novamente.");
        navigate('/login');
      }
    });

    const items = JSON.parse(localStorage.getItem("boeminha_cart")) || [];
    if (items.length === 0) {
      navigate('/roteiros');
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
    setLoading(true);
    
    const user = auth.currentUser;
    if (!user) return alert("Erro de autenticação.");

    try {
      await firestore.collection("usuarios").doc(user.uid).collection("pedidos").add({
        itens: cartItems,
        total: calcularTotal(),
        dataCompra: firebase.firestore.FieldValue.serverTimestamp(),
        status: "Aprovado",
      });

      localStorage.removeItem("boeminha_cart");
      
      setTimeout(() => {
        alert("Reserva confirmada! Você pode ver seus roteiros no seu perfil.");
        navigate('/perfil');
      }, 1500);

    } catch (error) {
      console.error("Erro ao salvar pedido: ", error);
      alert("Erro ao processar o pagamento.");
      setLoading(false);
    }
  };

  return (
    <div style={{ paddingTop: '76px' }}>
      <div className="container mt-5 mb-5">
        <div className="row bg-white rounded-4 shadow-sm border overflow-hidden">
          
          <div className="col-md-7 p-5">
            <h3 className="fw-bold mb-4 text-success">Pagamento Seguro</h3>
            <form onSubmit={processarPagamento}>
              <h5 className="fw-bold mb-3 mt-4">Dados Pessoais</h5>
              <div className="mb-3">
                <label className="form-label small fw-bold">Nome Completo</label>
                <input type="text" className="form-control" required />
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label small fw-bold">E-mail</label>
                  <input type="email" className="form-control" required />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label small fw-bold">Telefone / WhatsApp</label>
                  <input type="text" className="form-control" required />
                </div>
              </div>

              <h5 className="fw-bold mb-3 mt-4">Cartão de Crédito</h5>
              <div className="mb-3">
                <label className="form-label small fw-bold">Número do Cartão</label>
                <input type="text" className="form-control" placeholder="0000 0000 0000 0000" required />
              </div>
              <div className="row mb-4">
                <div className="col-6">
                  <label className="form-label small fw-bold">Validade</label>
                  <input type="text" className="form-control" placeholder="MM/AA" required />
                </div>
                <div className="col-6">
                  <label className="form-label small fw-bold">CVV</label>
                  <input type="text" className="form-control" placeholder="123" required />
                </div>
              </div>

              <button type="submit" className={`btn fw-bold w-100 p-3 rounded-pill ${loading ? 'btn-success' : 'btn-success'}`} disabled={loading}>
                {loading ? <><i className="fas fa-spinner fa-spin me-2"></i> PROCESSANDO...</> : <><i className="fas fa-lock me-2"></i> CONFIRMAR PAGAMENTO</>}
              </button>
            </form>
          </div>

          <div className="col-md-5 bg-light p-5 border-start">
            <h4 className="fw-bold mb-4">Resumo do Pedido</h4>
            <ul className="list-unstyled mb-4">
              {cartItems.map((item, index) => (
                <li key={index} className="d-flex align-items-center mb-3 pb-3 border-bottom">
                  <div style={{ width: '60px', height: '60px', backgroundImage: `url('${item.imagem}')`, backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: '8px', marginRight: '15px' }}></div>
                  <div className="flex-grow-1">
                    <h6 className="mb-1 fw-bold" style={{ fontSize: '0.95rem' }}>{item.titulo}</h6>
                    <small className="text-muted">{item.qtd}x R$ {parseFloat(item.preco).toFixed(2).replace('.', ',')}</small>
                  </div>
                  <span className="fw-bold text-success ms-3">R$ {(parseFloat(item.preco) * item.qtd).toFixed(2).replace('.', ',')}</span>
                </li>
              ))}
            </ul>
            <div className="d-flex justify-content-between border-top pt-3 mt-4">
              <span className="fs-5 fw-bold text-muted">Total:</span>
              <span className="fs-4 fw-bold text-success">R$ {calcularTotal().toFixed(2).replace('.', ',')}</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}