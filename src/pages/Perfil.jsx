import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, firestore } from '../services/firebase';

export default function Perfil() {
  const [user, setUser] = useState(null);
  const [dadosDb, setDadosDb] = useState(null);
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [disponivel, setDisponivel] = useState(true); // Para guias
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        
        // Busca qual é o tipo de usuário no Firestore
        const doc = await firestore.collection('usuarios').doc(currentUser.uid).get();
        if (doc.exists) {
          setDadosDb(doc.data());
        }

        // Busca o histórico de compras/pedidos
        const pedidosSnapshot = await firestore.collection('usuarios').doc(currentUser.uid).collection('pedidos').orderBy('dataCompra', 'desc').get();
        const listaPedidos = pedidosSnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        setPedidos(listaPedidos);
        
        setLoading(false);
      } else {
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/login');
  };

  // Calcula dias restantes (Simulação para o projeto)
  const calcularDiasParaViagem = () => {
    return 12; // Número fixo para a apresentação
  };

  if (loading) {
    return <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}><div className="spinner-border text-success"></div></div>;
  }

  return (
    <div style={{ paddingTop: '76px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      
      {/* Cabeçalho do Perfil (Comum a todos) */}
      <header className="bg-white border-bottom py-4 mb-4 shadow-sm">
        <div className="container d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center fw-bold fs-3 me-3" style={{ width: '60px', height: '60px' }}>
              {dadosDb?.nome ? dadosDb.nome.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <h4 className="fw-bold mb-0 text-dark">{dadosDb?.nome || 'Usuário'}</h4>
              <p className="text-muted small mb-0">{user.email} | Perfil: <span className="text-success fw-bold text-uppercase">{dadosDb?.tipo || 'Turista'}</span></p>
            </div>
          </div>
          <button onClick={handleLogout} className="btn btn-outline-danger fw-bold rounded-pill px-4">Sair da Conta</button>
        </div>
      </header>

      <main className="container mb-5">
        
        {/* ========================================== */}
        {/* INTERFACE PARA TURISTAS                    */}
        {/* ========================================== */}
        {(!dadosDb?.tipo || dadosDb.tipo === 'turista') && (
          <div className="row g-4">
            <div className="col-lg-4">
              <div className="card border-0 shadow-sm rounded-4 p-4 text-center h-100" style={{ background: 'linear-gradient(135deg, #1b4332, #2d6a4f)', color: 'white' }}>
                <h5 className="fw-bold mb-4 opacity-75">Sua próxima aventura em</h5>
                <div className="display-1 fw-bold">{calcularDiasParaViagem()}</div>
                <h4 className="fw-bold mt-2 mb-4">Dias</h4>
                <p className="small opacity-75">Prepare a mochila! O roteiro "Trilha do Tupinambá" está chegando.</p>
                <button className="btn btn-light text-success fw-bold rounded-pill mt-auto">Ver Detalhes</button>
              </div>
            </div>
            
            <div className="col-lg-8">
              <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
                <h4 className="fw-bold mb-4 text-dark"><i className="fas fa-history text-success me-2"></i>Histórico de Compras</h4>
                
                {pedidos.length === 0 ? (
                  <div className="text-center text-muted py-5">
                    <i className="fas fa-ticket-alt fs-1 mb-3 opacity-25"></i>
                    <p>Você ainda não tem ingressos comprados.</p>
                  </div>
                ) : (
                  <ul className="list-group list-group-flush">
                    {pedidos.map(pedido => (
                      <li key={pedido.id} className="list-group-item px-0 py-3 d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="fw-bold mb-1 text-dark">Pedido #{pedido.id.substring(0, 8)}</h6>
                          <small className="text-muted">Status: <span className="text-success fw-bold">{pedido.status}</span> | Total: R$ {pedido.total.toFixed(2)}</small>
                        </div>
                        <button className="btn btn-sm btn-outline-secondary fw-bold rounded-pill">Avaliar Local</button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* INTERFACE PARA GUIAS                       */}
        {/* ========================================== */}
        {dadosDb?.tipo === 'guia' && (
          <div className="row g-4">
            <div className="col-lg-4">
              <div className="card border-0 shadow-sm rounded-4 p-4 text-center h-100">
                <h5 className="fw-bold mb-3">Status de Agenda</h5>
                <div className={`p-4 rounded-3 mb-4 text-white fw-bold fs-4 ${disponivel ? 'bg-success' : 'bg-secondary'}`}>
                  {disponivel ? 'DISPONÍVEL PARA RESERVAS' : 'AGENDA FECHADA'}
                </div>
                <button onClick={() => setDisponivel(!disponivel)} className={`btn w-100 fw-bold rounded-pill ${disponivel ? 'btn-outline-danger' : 'btn-success'}`}>
                  {disponivel ? 'Pausar Recebimento' : 'Abrir Agenda'}
                </button>
              </div>
            </div>
            <div className="col-lg-8">
              <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4 className="fw-bold text-dark m-0">Meus Roteiros Publicados</h4>
                  <button className="btn btn-success fw-bold rounded-pill"><i className="fas fa-plus me-2"></i>Novo Roteiro</button>
                </div>
                <div className="text-center text-muted py-5 bg-light rounded-3 border border-dashed">
                  <p className="mb-0">Seus roteiros aprovados aparecerão aqui.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* INTERFACE PARA DONOS / BUSINESS            */}
        {/* ========================================== */}
        {dadosDb?.tipo === 'dono' && (
          <div className="row g-4">
            <div className="col-lg-4">
              <div className="card border-0 shadow-sm rounded-4 p-4 text-center h-100">
                <h5 className="fw-bold mb-3">Página do Local</h5>
                <div className="bg-light border rounded-3 mb-3 d-flex align-items-center justify-content-center" style={{ height: '150px' }}>
                  <i className="fas fa-camera fs-1 text-muted opacity-50"></i>
                </div>
                <button className="btn btn-outline-success fw-bold w-100 rounded-pill mb-2"><i className="fas fa-upload me-2"></i>Alterar Foto Principal</button>
                <button className="btn btn-outline-secondary fw-bold w-100 rounded-pill">Editar Informações</button>
              </div>
            </div>
            <div className="col-lg-8">
              <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
                <h4 className="fw-bold text-dark mb-4">Métricas do Mês</h4>
                <div className="row g-3 text-center">
                  <div className="col-md-4">
                    <div className="p-3 bg-light rounded-3 border">
                      <div className="fs-2 fw-bold text-success">342</div>
                      <div className="small text-muted fw-bold text-uppercase">Visitas no Perfil</div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="p-3 bg-light rounded-3 border">
                      <div className="fs-2 fw-bold text-success">89</div>
                      <div className="small text-muted fw-bold text-uppercase">Cliques no Site</div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="p-3 bg-light rounded-3 border">
                      <div className="fs-2 fw-bold text-success">15</div>
                      <div className="small text-muted fw-bold text-uppercase">Avaliações</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}