import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../services/firebase';

export default function Cart({ isOpen, onClose }) {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  // Atualiza os itens do carrinho sempre que a aba for aberta
  useEffect(() => {
    if (isOpen) {
      const items = JSON.parse(localStorage.getItem('boeminha_cart')) || [];
      setCartItems(items);
    }
  }, [isOpen]);

  const removerItem = (index) => {
    const novosItens = [...cartItems];
    novosItens.splice(index, 1);
    setCartItems(novosItens);
    localStorage.setItem('boeminha_cart', JSON.stringify(novosItens));
  };

  const calcularTotal = () => {
    return cartItems.reduce((total, item) => {
      const preco = parseFloat(item.preco) || 0;
      const qtd = parseInt(item.qtd) || 1;
      return total + (preco * qtd);
    }, 0);
  };

  const irParaCheckout = () => {
    if (cartItems.length === 0) {
      alert("Adicione algum roteiro ao carrinho primeiro!");
      return;
    }
    if (!auth.currentUser) {
      alert("Você precisa fazer login para finalizar a compra.");
      onClose();
      navigate('/login');
      return;
    }
    onClose();
    navigate('/checkout');
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Fundo escuro */}
      <div className="offcanvas-backdrop fade show" onClick={onClose} style={{ zIndex: 1040 }}></div>
      
      {/* Aba lateral do Carrinho */}
      <div className="offcanvas offcanvas-end show" tabIndex="-1" style={{ visibility: 'visible', zIndex: 1045 }}>
        <div className="offcanvas-header border-bottom">
          <h5 className="offcanvas-title fw-bold">
            <i className="fas fa-shopping-bag text-success me-2"></i>Seu Carrinho
          </h5>
          <button type="button" className="btn-close" onClick={onClose}></button>
        </div>
        
        <div className="offcanvas-body d-flex flex-column">
          <ul className="list-group list-group-flush mb-3 p-0">
            {cartItems.length === 0 ? (
              <li className="list-group-item text-center text-muted mt-4 border-0">Seu carrinho está vazio.</li>
            ) : (
              cartItems.map((item, index) => (
                <li key={index} className="list-group-item d-flex justify-content-between align-items-center px-0 py-3 border-bottom">
                  <div className="d-flex align-items-center gap-3">
                    <div style={{ width: '60px', height: '60px', backgroundImage: `url('${item.imagem}')`, backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: '8px' }}></div>
                    <div>
                      <h6 className="mb-0 fw-bold" style={{ fontSize: '0.9rem' }}>{item.titulo}</h6>
                      <small className="text-success fw-bold">{item.qtd}x R$ {parseFloat(item.preco).toFixed(2).replace('.', ',')}</small>
                    </div>
                  </div>
                  <button className="btn btn-sm btn-light text-danger border" onClick={() => removerItem(index)}>
                    <i className="fas fa-trash"></i>
                  </button>
                </li>
              ))
            )}
          </ul>
          
          <div className="mt-auto pt-3 border-top">
            <div className="d-flex justify-content-between fw-bold mb-3 fs-5">
              <span>Total:</span>
              <span className="text-success">R$ {calcularTotal().toFixed(2).replace('.', ',')}</span>
            </div>
            <button className="btn btn-success fw-bold w-100 py-3 shadow-sm" onClick={irParaCheckout}>
              FINALIZAR COMPRA
            </button>
          </div>
        </div>
      </div>
    </>
  );
}