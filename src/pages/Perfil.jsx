import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, firestore } from '../services/firebase';

export default function Perfil() {
  const [user, setUser] = useState(null);
  const [dadosDb, setDadosDb] = useState(null);
  const [pedidos, setPedidos] = useState([]);
  const [meusRoteiros, setMeusRoteiros] = useState([]); // Roteiros criados pelo guia
  const [loading, setLoading] = useState(true);

  // Estados de Edição de Perfil
  const [editandoPerfil, setEditandoPerfil] = useState(false);
  const [perfilForm, setPerfilForm] = useState({ nome: '', fotoUrl: '', biografia: '', diasDisponiveis: [] });

  // Estados para Novo Roteiro (Guia)
  const [modalRoteiro, setModalRoteiro] = useState(false);
  const [novoRoteiro, setNovoRoteiro] = useState({ titulo: '', descricao: '', preco: '', duracao: '', horario: '', imagemUrl: '' });

  // Estados para Avaliação (Turista)
  const [modalAvaliacao, setModalAvaliacao] = useState(null);
  const [nota, setNota] = useState(5);
  const [comentario, setComentario] = useState('');

  const navigate = useNavigate();

  const diasDaSemana = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        carregarDados(currentUser.uid, currentUser.email);
      } else {
        navigate('/login');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const carregarDados = async (uid, email) => {
    try {
      // 1. Busca dados do usuário
      const doc = await firestore.collection('usuarios').doc(uid).get();
      let dadosUsuario = { nome: email.split('@')[0], tipo: 'turista', fotoUrl: '', biografia: '', diasDisponiveis: [] };
      if (doc.exists) {
        dadosUsuario = { ...dadosUsuario, ...doc.data() };
      }
      setDadosDb(dadosUsuario);
      setPerfilForm(dadosUsuario);

      // 2. Busca pedidos (Turista)
      const pedidosSnap = await firestore.collection('usuarios').doc(uid).collection('pedidos').orderBy('dataCompra', 'desc').get();
      setPedidos(pedidosSnap.docs.map(d => ({ id: d.id, ...d.data() })));

      // 3. Busca roteiros criados (Se for Guia)
      if (dadosUsuario.tipo === 'guia') {
        const roteirosSnap = await firestore.collection('roteiros').where('guiaId', '==', uid).get();
        setMeusRoteiros(roteirosSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/login');
  };

  // ================= SALVAR PERFIL =================
  const salvarPerfil = async () => {
    try {
      await firestore.collection('usuarios').doc(user.uid).set(perfilForm, { merge: true });
      setDadosDb(perfilForm);
      setEditandoPerfil(false);
      alert('Perfil atualizado com sucesso!');
    } catch (error) {
      alert('Erro ao salvar perfil.');
    }
  };

  const toggleDia = (dia) => {
    const dias = perfilForm.diasDisponiveis || [];
    if (dias.includes(dia)) {
      setPerfilForm({ ...perfilForm, diasDisponiveis: dias.filter(d => d !== dia) });
    } else {
      setPerfilForm({ ...perfilForm, diasDisponiveis: [...dias, dia] });
    }
  };

  // ================= ROTEIROS DO GUIA =================
  const salvarNovoRoteiro = async (e) => {
    e.preventDefault();
    try {
      const roteiroFinal = {
        ...novoRoteiro,
        preco: parseFloat(novoRoteiro.preco),
        guiaId: user.uid,
        guiaNome: dadosDb.nome,
        guiaFoto: dadosDb.fotoUrl,
        dataCriacao: new Date().toISOString()
      };
      const docRef = await firestore.collection('roteiros').add(roteiroFinal);
      setMeusRoteiros([{ id: docRef.id, ...roteiroFinal }, ...meusRoteiros]);
      setModalRoteiro(false);
      setNovoRoteiro({ titulo: '', descricao: '', preco: '', duracao: '', horario: '', imagemUrl: '' });
      alert('Roteiro publicado com sucesso!');
    } catch (error) {
      alert('Erro ao criar roteiro.');
    }
  };

  const excluirRoteiro = async (id) => {
    if(window.confirm('Tem certeza que deseja excluir este roteiro permanentemente?')) {
      await firestore.collection('roteiros').doc(id).delete();
      setMeusRoteiros(meusRoteiros.filter(r => r.id !== id));
    }
  };

  // ================= AVALIAÇÃO =================
  const enviarAvaliacao = () => {
    alert(`Avaliação de ${nota} estrelas enviada! Obrigado.`);
    setModalAvaliacao(null);
    setNota(5);
    setComentario('');
  };

  if (loading) return <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}><div className="spinner-border text-success"></div></div>;

  // Separa eventos futuros e passados
  const proximosEventos = pedidos.filter(p => p.dataAgendada); // Requer que o pedido tenha data
  const historicoGeral = pedidos.filter(p => !p.dataAgendada);

  return (
    <div style={{ paddingTop: '76px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      
      {/* CABEÇALHO DO PERFIL */}
      <header className="bg-white border-bottom py-5 mb-4 shadow-sm">
        <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
          <div className="d-flex align-items-center">
            {dadosDb?.fotoUrl ? (
              <img src={dadosDb.fotoUrl} alt="Perfil" className="rounded-circle object-fit-cover shadow-sm me-4" style={{ width: '100px', height: '100px', border: '3px solid #2d6a4f' }} />
            ) : (
              <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center fw-bold fs-1 me-4 shadow-sm" style={{ width: '100px', height: '100px' }}>
                {dadosDb?.nome?.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h2 className="fw-bold mb-1 text-dark">{dadosDb?.nome}</h2>
              <p className="text-muted mb-2">{user.email} • <span className="badge bg-success text-uppercase">{dadosDb?.tipo}</span></p>
              <p className="small text-muted fst-italic m-0" style={{ maxWidth: '400px' }}>{dadosDb?.biografia || 'Nenhuma biografia adicionada ainda.'}</p>
            </div>
          </div>
          <div className="d-flex gap-2">
            <button onClick={() => setEditandoPerfil(true)} className="btn btn-outline-success fw-bold rounded-pill px-4"><i className="fas fa-edit me-2"></i>Editar Perfil</button>
            <button onClick={handleLogout} className="btn btn-outline-danger fw-bold rounded-pill px-4"><i className="fas fa-sign-out-alt"></i> Sair</button>
          </div>
        </div>
      </header>

      <main className="container mb-5">
        
        {/* ============================================================ */}
        {/* INTERFACE DO TURISTA (Próximos Eventos & Histórico)          */}
        {/* ============================================================ */}
        {(!dadosDb?.tipo || dadosDb.tipo === 'turista') && (
          <div className="row g-4">
            
            {/* Coluna Esquerda: Próximos Eventos */}
            <div className="col-lg-5">
              <h4 className="fw-bold mb-3 text-dark"><i className="fas fa-calendar-check text-success me-2"></i>Meus Próximos Eventos</h4>
              {proximosEventos.length === 0 ? (
                <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white">
                  <i className="far fa-calendar-times fs-1 text-muted opacity-25 mb-3"></i>
                  <h6 className="fw-bold text-muted">Nenhum evento agendado</h6>
                  <p className="small text-muted mb-4">Que tal explorar Niterói e marcar sua próxima aventura?</p>
                  <button onClick={() => navigate('/explorar')} className="btn btn-success fw-bold rounded-pill">Explorar Roteiros</button>
                </div>
              ) : (
                proximosEventos.map(pedido => (
                  <div key={pedido.id} className="card border-0 shadow-sm rounded-4 p-3 mb-3" style={{ borderLeft: '5px solid #2d6a4f !important' }}>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="fw-bold mb-1 text-dark">{pedido.itens?.[0]?.titulo || 'Ingresso Boeminha'}</h6>
                        <span className="badge bg-light text-dark border mb-2"><i className="far fa-calendar-alt me-1"></i> {pedido.dataAgendada}</span>
                        <p className="small text-muted m-0">Código: #{pedido.id.substring(0,6)}</p>
                      </div>
                      <button className="btn btn-success btn-sm fw-bold rounded-pill">Ver QR Code</button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Coluna Direita: Histórico Geral */}
            <div className="col-lg-7">
              <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
                <h4 className="fw-bold mb-4 text-dark"><i className="fas fa-history text-muted me-2"></i>Histórico de Compras</h4>
                {historicoGeral.length === 0 ? (
                  <p className="text-muted text-center py-4">Nenhuma compra passada registrada.</p>
                ) : (
                  <ul className="list-group list-group-flush">
                    {historicoGeral.map(pedido => (
                      <li key={pedido.id} className="list-group-item px-0 py-3 d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="fw-bold mb-1 text-dark">Pedido #{pedido.id.substring(0, 6)}</h6>
                          <small className="text-muted">Total: R$ {pedido.total.toFixed(2)} | Status: <span className="text-success fw-bold">{pedido.status}</span></small>
                        </div>
                        <button className="btn btn-sm btn-outline-success fw-bold rounded-pill" onClick={() => setModalAvaliacao(pedido)}>
                          <i className="fas fa-star me-1"></i> Avaliar
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* INTERFACE DO GUIA (Agenda & Criação de Roteiros)             */}
        {/* ============================================================ */}
        {dadosDb?.tipo === 'guia' && (
          <div className="row g-4">
            
            {/* Coluna Agenda */}
            <div className="col-lg-4">
              <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-white">
                <h5 className="fw-bold mb-3"><i className="fas fa-clock text-success me-2"></i>Minha Agenda</h5>
                <p className="small text-muted">Selecione os dias da semana que você está disponível para guiar tours:</p>
                <div className="d-flex flex-column gap-2 mb-4">
                  {diasDaSemana.map(dia => (
                    <div key={dia} className="form-check form-switch p-0 d-flex justify-content-between align-items-center bg-light rounded-3 px-3 py-2 border">
                      <label className="form-check-label fw-bold text-dark small m-0">{dia}</label>
                      <input 
                        className="form-check-input m-0" 
                        type="checkbox" 
                        role="switch"
                        checked={perfilForm.diasDisponiveis?.includes(dia)}
                        onChange={() => toggleDia(dia)}
                        style={{ cursor: 'pointer' }}
                      />
                    </div>
                  ))}
                </div>
                <button onClick={salvarPerfil} className="btn btn-dark fw-bold w-100 rounded-pill mt-auto">Salvar Agenda</button>
              </div>
            </div>

            {/* Coluna Gerenciamento de Roteiros */}
            <div className="col-lg-8">
              <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-white">
                <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
                  <h4 className="fw-bold text-dark m-0"><i className="fas fa-map-marked-alt text-success me-2"></i>Meus Roteiros Oficiais</h4>
                  <button onClick={() => setModalRoteiro(true)} className="btn btn-success fw-bold rounded-pill shadow-sm">
                    <i className="fas fa-plus me-2"></i>Novo Roteiro
                  </button>
                </div>
                
                {meusRoteiros.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="fas fa-route fs-1 text-muted opacity-25 mb-3"></i>
                    <h6 className="fw-bold text-muted">Você ainda não tem roteiros</h6>
                    <p className="small text-muted">Crie seu primeiro roteiro para aparecer na página Explorar.</p>
                  </div>
                ) : (
                  <div className="row g-3">
                    {meusRoteiros.map(rot => (
                      <div className="col-md-6" key={rot.id}>
                        <div className="card h-100 border rounded-4 overflow-hidden position-relative">
                          <div style={{ height: '120px', backgroundImage: `url(${rot.imagemUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                          <div className="p-3">
                            <h6 className="fw-bold text-dark mb-1">{rot.titulo}</h6>
                            <p className="small text-muted mb-2"><i className="far fa-clock me-1"></i> {rot.horario} • {rot.duracao}</p>
                            <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top">
                              <span className="fw-bold text-success">R$ {rot.preco}</span>
                              <button onClick={() => excluirRoteiro(rot.id)} className="btn btn-sm btn-outline-danger rounded-pill px-3 fw-bold">
                                <i className="fas fa-trash-alt"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ================= MODAIS ================= */}

      {/* Modal Editar Perfil (Todos) */}
      {editandoPerfil && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0">
              <div className="modal-header border-0 pb-0">
                <h5 className="fw-bold">Editar Meu Perfil</h5>
                <button type="button" className="btn-close" onClick={() => setEditandoPerfil(false)}></button>
              </div>
              <div className="modal-body p-4">
                <div className="mb-3">
                  <label className="form-label small fw-bold text-muted">Nome de Exibição</label>
                  <input type="text" className="form-control bg-light p-3" value={perfilForm.nome} onChange={e => setPerfilForm({...perfilForm, nome: e.target.value})} />
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-bold text-muted">URL da Foto de Perfil (Link da Imagem)</label>
                  <input type="text" className="form-control bg-light p-3" placeholder="https://..." value={perfilForm.fotoUrl} onChange={e => setPerfilForm({...perfilForm, fotoUrl: e.target.value})} />
                  <small className="text-muted" style={{fontSize: '0.7rem'}}>Cole o link de uma imagem da internet para sua foto.</small>
                </div>
                <div className="mb-4">
                  <label className="form-label small fw-bold text-muted">Biografia / Especialidade</label>
                  <textarea className="form-control bg-light p-3" rows="3" value={perfilForm.biografia} onChange={e => setPerfilForm({...perfilForm, biografia: e.target.value})}></textarea>
                </div>
                <button onClick={salvarPerfil} className="btn btn-success fw-bold w-100 rounded-pill p-3">Salvar Alterações</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Novo Roteiro (Guia) */}
      {modalRoteiro && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content rounded-4 border-0">
              <div className="modal-header bg-dark text-white rounded-top-4 border-0">
                <h5 className="fw-bold m-0"><i className="fas fa-route me-2"></i>Criar Novo Roteiro</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setModalRoteiro(false)}></button>
              </div>
              <div className="modal-body p-4 p-md-5">
                <form onSubmit={salvarNovoRoteiro}>
                  <div className="row g-3 mb-3">
                    <div className="col-md-8">
                      <label className="form-label small fw-bold">Título do Passeio/Local</label>
                      <input type="text" className="form-control bg-light p-3" required value={novoRoteiro.titulo} onChange={e => setNovoRoteiro({...novoRoteiro, titulo: e.target.value})} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-bold">Preço (R$)</label>
                      <input type="number" className="form-control bg-light p-3" required min="0" value={novoRoteiro.preco} onChange={e => setNovoRoteiro({...novoRoteiro, preco: e.target.value})} />
                    </div>
                  </div>
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Horário de Início (Ex: 09:00)</label>
                      <input type="time" className="form-control bg-light p-3" required value={novoRoteiro.horario} onChange={e => setNovoRoteiro({...novoRoteiro, horario: e.target.value})} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Duração (Ex: 3 horas)</label>
                      <input type="text" className="form-control bg-light p-3" required value={novoRoteiro.duracao} onChange={e => setNovoRoteiro({...novoRoteiro, duracao: e.target.value})} />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-bold">URL da Imagem do Local (Link)</label>
                    <input type="url" className="form-control bg-light p-3" required placeholder="https://..." value={novoRoteiro.imagemUrl} onChange={e => setNovoRoteiro({...novoRoteiro, imagemUrl: e.target.value})} />
                  </div>
                  <div className="mb-4">
                    <label className="form-label small fw-bold">Descrição Completa</label>
                    <textarea className="form-control bg-light p-3" rows="3" required value={novoRoteiro.descricao} onChange={e => setNovoRoteiro({...novoRoteiro, descricao: e.target.value})}></textarea>
                  </div>
                  <button type="submit" className="btn btn-success fw-bold w-100 rounded-pill p-3 fs-5 shadow-sm">Publicar Roteiro Oficial</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Avaliação (Turista) - Mantido igual */}
      {modalAvaliacao && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0">
              <div className="modal-header bg-dark text-white border-0 rounded-top-4">
                <h5 className="modal-title fw-bold">Avaliar Experiência</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setModalAvaliacao(null)}></button>
              </div>
              <div className="modal-body p-4 text-center">
                <h6 className="fw-bold mb-3">Como foi o pedido #{modalAvaliacao.id.substring(0,8)}?</h6>
                <div className="d-flex justify-content-center gap-2 mb-4 fs-2 text-warning">
                  {[1, 2, 3, 4, 5].map((estrela) => (
                    <i key={estrela} className={`fa-star ${estrela <= nota ? 'fas' : 'far'}`} style={{ cursor: 'pointer' }} onClick={() => setNota(estrela)}></i>
                  ))}
                </div>
                <textarea className="form-control bg-light p-3 mb-3" rows="3" placeholder="Conte para outros exploradores o que você achou..." value={comentario} onChange={(e) => setComentario(e.target.value)}></textarea>
                <button className="btn btn-success fw-bold w-100 rounded-pill p-3" onClick={enviarAvaliacao}>Publicar Avaliação</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}