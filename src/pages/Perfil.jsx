import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, firestore } from '../services/firebase';

export default function Perfil() {
  const [user, setUser] = useState(null);
  const [dadosDb, setDadosDb] = useState(null);
  const [loading, setLoading] = useState(true);

  // Estados por tipo de usuário
  const [pedidos, setPedidos] = useState([]); // Turista
  const [meusRoteiros, setMeusRoteiros] = useState([]); // Guia
  const [solicitacoes, setSolicitacoes] = useState([]); // Admin

  // Estados de Edição de Perfil (Geral)
  const [editandoPerfil, setEditandoPerfil] = useState(false);
  const [perfilForm, setPerfilForm] = useState({ nome: '', fotoUrl: '', biografia: '', diasDisponiveis: [] });

  // Estados para Roteiro (Guia)
  const [modalRoteiro, setModalRoteiro] = useState(false);
  const [editandoRoteiroId, setEditandoRoteiroId] = useState(null);
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
      if (doc.exists) dadosUsuario = { ...dadosUsuario, ...doc.data() };
      
      setDadosDb(dadosUsuario);
      setPerfilForm(dadosUsuario);

      // 2. Carrega dependendo do tipo de perfil
      if (dadosUsuario.tipo === 'turista') {
        const pedidosSnap = await firestore.collection('usuarios').doc(uid).collection('pedidos').orderBy('dataCompra', 'desc').get();
        setPedidos(pedidosSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      } 
      else if (dadosUsuario.tipo === 'guia') {
        const roteirosSnap = await firestore.collection('roteiros').where('guiaId', '==', uid).get();
        setMeusRoteiros(roteirosSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      }
      else if (dadosUsuario.tipo === 'admin') {
        const solSnap = await firestore.collection('solicitacoes_parceria').orderBy('dataEnvio', 'desc').get();
        setSolicitacoes(solSnap.docs.map(d => ({ id: d.id, ...d.data() })));
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

  // ================= FUNÇÕES GERAIS =================
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

  // ================= FUNÇÕES DO GUIA =================
  const abrirNovoRoteiro = () => {
    setEditandoRoteiroId(null);
    setNovoRoteiro({ titulo: '', descricao: '', preco: '', duracao: '', horario: '', imagemUrl: '' });
    setModalRoteiro(true);
  };

  const abrirEdicaoRoteiro = (roteiro) => {
    setEditandoRoteiroId(roteiro.id);
    setNovoRoteiro(roteiro);
    setModalRoteiro(true);
  };

  const salvarOuEditarRoteiro = async (e) => {
    e.preventDefault();
    try {
      const roteiroFinal = {
        ...novoRoteiro,
        preco: parseFloat(novoRoteiro.preco),
        guiaId: user.uid,
        guiaNome: dadosDb.nome,
        guiaFoto: dadosDb.fotoUrl || '',
        dataAtualizacao: new Date().toISOString()
      };

      if (editandoRoteiroId) {
        // Atualiza existente
        await firestore.collection('roteiros').doc(editandoRoteiroId).update(roteiroFinal);
        setMeusRoteiros(meusRoteiros.map(r => r.id === editandoRoteiroId ? { id: editandoRoteiroId, ...roteiroFinal } : r));
        alert('Roteiro atualizado!');
      } else {
        // Cria novo
        roteiroFinal.dataCriacao = new Date().toISOString();
        const docRef = await firestore.collection('roteiros').add(roteiroFinal);
        setMeusRoteiros([{ id: docRef.id, ...roteiroFinal }, ...meusRoteiros]);
        alert('Roteiro publicado!');
      }
      setModalRoteiro(false);
    } catch (error) {
      alert('Erro ao processar roteiro.');
    }
  };

  const excluirRoteiro = async (id) => {
    if(window.confirm('Tem certeza que deseja excluir este roteiro permanentemente?')) {
      await firestore.collection('roteiros').doc(id).delete();
      setMeusRoteiros(meusRoteiros.filter(r => r.id !== id));
    }
  };

  // ================= FUNÇÕES DO ADMIN =================
  const aprovarParceiro = async (id) => {
    try {
      await firestore.collection('solicitacoes_parceria').doc(id).update({ status: 'Aprovado' });
      setSolicitacoes(solicitacoes.map(s => s.id === id ? { ...s, status: 'Aprovado' } : s));
      alert("Parceiro aprovado com sucesso! Um e-mail será enviado a ele.");
    } catch (e) {
      alert("Erro ao aprovar.");
    }
  };

  // ================= RENDERIZAÇÃO =================
  if (loading) return <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}><div className="spinner-border text-success"></div></div>;

  const proximosEventos = pedidos.filter(p => p.dataAgendada);
  const historicoGeral = pedidos.filter(p => !p.dataAgendada);

  return (
    <div style={{ paddingTop: '76px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      
      {/* CABEÇALHO GERAL DO PERFIL */}
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
              {dadosDb?.tipo !== 'admin' && (
                <p className="small text-muted fst-italic m-0" style={{ maxWidth: '400px' }}>{dadosDb?.biografia || 'Nenhuma biografia adicionada ainda.'}</p>
              )}
            </div>
          </div>
          <div className="d-flex gap-2">
            <button onClick={() => setEditandoPerfil(true)} className="btn btn-outline-success fw-bold rounded-pill px-4"><i className="fas fa-cog me-2"></i>Configurações</button>
            <button onClick={handleLogout} className="btn btn-outline-danger fw-bold rounded-pill px-4"><i className="fas fa-sign-out-alt"></i> Sair</button>
          </div>
        </div>
      </header>

      <main className="container mb-5">

        {/* ============================================================ */}
        {/* INTERFACE DO TURISTA */}
        {/* ============================================================ */}
        {(!dadosDb?.tipo || dadosDb.tipo === 'turista') && (
          <div className="row g-4">
            <div className="col-lg-5">
              <h4 className="fw-bold mb-3 text-dark"><i className="fas fa-calendar-check text-success me-2"></i>Meus Próximos Eventos</h4>
              {proximosEventos.length === 0 ? (
                <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white">
                  <i className="far fa-calendar-times fs-1 text-muted opacity-25 mb-3"></i>
                  <h6 className="fw-bold text-muted">Nenhum evento agendado</h6>
                  <button onClick={() => navigate('/explorar')} className="btn btn-success fw-bold rounded-pill mt-3">Explorar Roteiros</button>
                </div>
              ) : (
                proximosEventos.map(pedido => (
                  <div key={pedido.id} className="card border-0 shadow-sm rounded-4 p-3 mb-3" style={{ borderLeft: '5px solid #2d6a4f !important' }}>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="fw-bold mb-1 text-dark">{pedido.itens?.[0]?.titulo || 'Ingresso Boeminha'}</h6>
                        <span className="badge bg-light text-dark border mb-2"><i className="far fa-calendar-alt me-1"></i> {pedido.dataAgendada}</span>
                        <p className="small text-muted m-0">Cód: #{pedido.id.substring(0,6)}</p>
                      </div>
                      <button className="btn btn-success btn-sm fw-bold rounded-pill">Ver QR Code</button>
                    </div>
                  </div>
                ))
              )}
            </div>
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
                        <button className="btn btn-sm btn-outline-success fw-bold rounded-pill" onClick={() => setModalAvaliacao(pedido)}>Avaliar</button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* INTERFACE DO GUIA */}
        {/* ============================================================ */}
        {dadosDb?.tipo === 'guia' && (
          <div className="row g-4">
            <div className="col-lg-4">
              <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-white">
                <h5 className="fw-bold mb-3"><i className="fas fa-clock text-success me-2"></i>Minha Agenda</h5>
                <p className="small text-muted">Dias da semana disponíveis para guiar tours:</p>
                <div className="d-flex flex-column gap-2 mb-4">
                  {diasDaSemana.map(dia => (
                    <div key={dia} className="form-check form-switch p-0 d-flex justify-content-between align-items-center bg-light rounded-3 px-3 py-2 border">
                      <label className="form-check-label fw-bold text-dark small m-0">{dia}</label>
                      <input className="form-check-input m-0" type="checkbox" role="switch" checked={perfilForm.diasDisponiveis?.includes(dia)} onChange={() => toggleDia(dia)} style={{ cursor: 'pointer' }} />
                    </div>
                  ))}
                </div>
                <button onClick={salvarPerfil} className="btn btn-dark fw-bold w-100 rounded-pill mt-auto">Salvar Agenda</button>
              </div>
            </div>
            <div className="col-lg-8">
              <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-white">
                <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
                  <h4 className="fw-bold text-dark m-0"><i className="fas fa-map-marked-alt text-success me-2"></i>Meus Roteiros Oficiais</h4>
                  <button onClick={abrirNovoRoteiro} className="btn btn-success fw-bold rounded-pill shadow-sm">
                    <i className="fas fa-plus me-2"></i>Novo Roteiro
                  </button>
                </div>
                {meusRoteiros.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="fas fa-route fs-1 text-muted opacity-25 mb-3"></i>
                    <h6 className="fw-bold text-muted">Você ainda não tem roteiros</h6>
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
                            <span className="fw-bold text-success d-block mb-3">R$ {rot.preco}</span>
                            <div className="d-flex gap-2">
                              <button onClick={() => abrirEdicaoRoteiro(rot)} className="btn btn-sm btn-outline-secondary w-100 fw-bold rounded-pill"><i className="fas fa-edit"></i> Editar</button>
                              <button onClick={() => excluirRoteiro(rot.id)} className="btn btn-sm btn-outline-danger fw-bold rounded-pill px-3"><i className="fas fa-trash-alt"></i></button>
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

        {/* ============================================================ */}
        {/* INTERFACE DO BUSINESS (DONO) */}
        {/* ============================================================ */}
        {dadosDb?.tipo === 'dono' && (
          <div className="row g-4">
            <div className="col-12">
              <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
                <h4 className="fw-bold text-dark mb-4"><i className="fas fa-chart-line text-success me-2"></i>Visão Geral do Seu Negócio</h4>
                <div className="row g-3 text-center">
                  <div className="col-md-3">
                    <div className="p-3 bg-light rounded-3 border">
                      <div className="fs-2 fw-bold text-success">3.402</div>
                      <div className="small text-muted fw-bold text-uppercase">Visualizações</div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="p-3 bg-light rounded-3 border">
                      <div className="fs-2 fw-bold text-success">289</div>
                      <div className="small text-muted fw-bold text-uppercase">Cliques no Site</div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="p-3 bg-light rounded-3 border">
                      <div className="fs-2 fw-bold text-success">45</div>
                      <div className="small text-muted fw-bold text-uppercase">Avaliações (Mês)</div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="p-3 bg-dark text-white rounded-3 border border-dark">
                      <div className="fs-2 fw-bold text-warning">4.8 <i className="fas fa-star fs-5"></i></div>
                      <div className="small text-white-50 fw-bold text-uppercase">Nota Média</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-white">
                <h5 className="fw-bold mb-3"><i className="fas fa-store text-success me-2"></i>Informações da Página</h5>
                <p className="small text-muted mb-4">Mantenha as informações do seu estabelecimento atualizadas para os turistas.</p>
                
                <div className="mb-3">
                  <label className="small fw-bold text-muted">Nome do Estabelecimento</label>
                  <input type="text" className="form-control bg-light" defaultValue={dadosDb.nome} />
                </div>
                <div className="mb-3">
                  <label className="small fw-bold text-muted">Categoria Principal</label>
                  <select className="form-select bg-light">
                    <option>Bar & Pub</option>
                    <option>Restaurante</option>
                    <option>Casa de Show</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="small fw-bold text-muted">Tags (Comodidades)</label>
                  <div className="d-flex gap-2 flex-wrap">
                    <span className="badge bg-success bg-opacity-10 text-success border-0 px-3 py-2">Pet Friendly <i className="fas fa-times ms-2" style={{cursor:'pointer'}}></i></span>
                    <span className="badge bg-success bg-opacity-10 text-success border-0 px-3 py-2">Música ao Vivo <i className="fas fa-times ms-2" style={{cursor:'pointer'}}></i></span>
                    <span className="badge bg-light text-dark border px-3 py-2" style={{cursor:'pointer'}}><i className="fas fa-plus me-1"></i> Adicionar Tag</span>
                  </div>
                </div>
                <button className="btn btn-success fw-bold w-100 rounded-pill mt-auto">Atualizar Página do Local</button>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-white">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="fw-bold m-0"><i className="fas fa-ticket-alt text-success me-2"></i>Gerador de Cupons</h5>
                  <span className="badge bg-danger">NOVO</span>
                </div>
                <p className="small text-muted mb-4">Crie cupons de desconto exclusivos para os usuários do Boeminha.</p>
                
                <div className="bg-light p-4 rounded-3 border border-dashed mb-4 text-center">
                  <h3 className="fw-bold text-dark text-uppercase letter-spacing" style={{ letterSpacing: '3px' }}>BOEMINHA10</h3>
                  <p className="small text-success fw-bold mb-0">10% OFF • Válido até 30/07</p>
                </div>

                <div className="row g-2 mb-3">
                  <div className="col-8">
                    <input type="text" className="form-control bg-light" placeholder="Nome do Cupom" />
                  </div>
                  <div className="col-4">
                    <input type="text" className="form-control bg-light" placeholder="% OFF" />
                  </div>
                </div>
                <button className="btn btn-outline-dark fw-bold w-100 rounded-pill mt-auto"><i className="fas fa-plus me-2"></i>Criar Nova Promoção</button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* INTERFACE DO ADMIN */}
        {/* ============================================================ */}
        {dadosDb?.tipo === 'admin' && (
          <div className="row g-4">
            <div className="col-12">
              <div className="card border-0 shadow-sm rounded-4 p-4 bg-white" style={{ background: 'linear-gradient(135deg, #112b20, #1b4332)' }}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4 className="fw-bold text-white m-0"><i className="fas fa-shield-alt text-success me-2"></i>Painel do Administrador</h4>
                  <span className="badge bg-success">SISTEMA ATIVO</span>
                </div>
                <div className="row g-3">
                  <div className="col-md-4">
                    <div className="p-3 bg-white bg-opacity-10 rounded-3 text-white border border-secondary">
                      <h6 className="fw-bold opacity-75">Usuários Totais</h6>
                      <div className="fs-3 fw-bold">1.284</div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="p-3 bg-white bg-opacity-10 rounded-3 text-white border border-secondary">
                      <h6 className="fw-bold opacity-75">Guias Ativos</h6>
                      <div className="fs-3 fw-bold">32</div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="p-3 bg-white bg-opacity-10 rounded-3 text-white border border-secondary">
                      <h6 className="fw-bold opacity-75">Vendas (Mês)</h6>
                      <div className="fs-3 fw-bold">R$ 14.590,00</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12">
              <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
                <h5 className="fw-bold mb-4 text-dark"><i className="fas fa-inbox text-success me-2"></i>Fila de Aprovação de Parceiros</h5>
                {solicitacoes.length === 0 ? (
                  <p className="text-muted">Nenhuma solicitação pendente.</p>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover align-middle">
                      <thead className="table-light">
                        <tr>
                          <th>Nome</th>
                          <th>Tipo</th>
                          <th>E-mail</th>
                          <th>Status</th>
                          <th>Ação</th>
                        </tr>
                      </thead>
                      <tbody>
                        {solicitacoes.map(sol => (
                          <tr key={sol.id}>
                            <td className="fw-bold">{sol.nome}</td>
                            <td><span className="badge bg-secondary">{sol.tipo}</span></td>
                            <td className="text-muted small">{sol.email}</td>
                            <td>
                              <span className={`badge ${sol.status === 'Aprovado' ? 'bg-success' : 'bg-warning text-dark'}`}>
                                {sol.status}
                              </span>
                            </td>
                            <td>
                              {sol.status !== 'Aprovado' && (
                                <button onClick={() => aprovarParceiro(sol.id)} className="btn btn-sm btn-success fw-bold rounded-pill">Aprovar</button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </main>

      {/* ================= MODAIS ================= */}

      {/* Modal Editar Perfil (Comum a Todos) */}
      {editandoPerfil && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0">
              <div className="modal-header border-0 pb-0">
                <h5 className="fw-bold">Configurações da Conta</h5>
                <button type="button" className="btn-close" onClick={() => setEditandoPerfil(false)}></button>
              </div>
              <div className="modal-body p-4">
                <div className="mb-3">
                  <label className="form-label small fw-bold text-muted">Nome de Exibição</label>
                  <input type="text" className="form-control bg-light p-3" value={perfilForm.nome} onChange={e => setPerfilForm({...perfilForm, nome: e.target.value})} />
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-bold text-muted">URL da Foto de Perfil (Link)</label>
                  <input type="text" className="form-control bg-light p-3" placeholder="https://..." value={perfilForm.fotoUrl} onChange={e => setPerfilForm({...perfilForm, fotoUrl: e.target.value})} />
                </div>
                <div className="mb-4">
                  <label className="form-label small fw-bold text-muted">Biografia / Descrição</label>
                  <textarea className="form-control bg-light p-3" rows="3" value={perfilForm.biografia} onChange={e => setPerfilForm({...perfilForm, biografia: e.target.value})}></textarea>
                </div>
                <button onClick={salvarPerfil} className="btn btn-success fw-bold w-100 rounded-pill p-3">Salvar Alterações</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Novo/Editar Roteiro (Guia) */}
      {modalRoteiro && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content rounded-4 border-0">
              <div className="modal-header bg-dark text-white rounded-top-4 border-0">
                <h5 className="fw-bold m-0"><i className="fas fa-route me-2"></i>{editandoRoteiroId ? 'Editar Roteiro' : 'Criar Novo Roteiro'}</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setModalRoteiro(false)}></button>
              </div>
              <div className="modal-body p-4 p-md-5">
                <form onSubmit={salvarOuEditarRoteiro}>
                  <div className="row g-3 mb-3">
                    <div className="col-md-8">
                      <label className="form-label small fw-bold">Título do Passeio</label>
                      <input type="text" className="form-control bg-light p-3" required value={novoRoteiro.titulo} onChange={e => setNovoRoteiro({...novoRoteiro, titulo: e.target.value})} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-bold">Preço (R$)</label>
                      <input type="number" className="form-control bg-light p-3" required min="0" value={novoRoteiro.preco} onChange={e => setNovoRoteiro({...novoRoteiro, preco: e.target.value})} />
                    </div>
                  </div>
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Horário de Início</label>
                      <input type="time" className="form-control bg-light p-3" required value={novoRoteiro.horario} onChange={e => setNovoRoteiro({...novoRoteiro, horario: e.target.value})} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Duração</label>
                      <input type="text" className="form-control bg-light p-3" required value={novoRoteiro.duracao} onChange={e => setNovoRoteiro({...novoRoteiro, duracao: e.target.value})} />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-bold">URL da Imagem do Local</label>
                    <input type="url" className="form-control bg-light p-3" required value={novoRoteiro.imagemUrl} onChange={e => setNovoRoteiro({...novoRoteiro, imagemUrl: e.target.value})} />
                  </div>
                  <div className="mb-4">
                    <label className="form-label small fw-bold">Descrição Completa</label>
                    <textarea className="form-control bg-light p-3" rows="3" required value={novoRoteiro.descricao} onChange={e => setNovoRoteiro({...novoRoteiro, descricao: e.target.value})}></textarea>
                  </div>
                  <button type="submit" className="btn btn-success fw-bold w-100 rounded-pill p-3 fs-5 shadow-sm">
                    {editandoRoteiroId ? 'Salvar Alterações' : 'Publicar Roteiro Oficial'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Avaliação (Turista) */}
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
                <textarea className="form-control bg-light p-3 mb-3" rows="3" placeholder="Conte o que você achou..." value={comentario} onChange={(e) => setComentario(e.target.value)}></textarea>
                <button className="btn btn-success fw-bold w-100 rounded-pill p-3" onClick={() => { alert('Enviado com sucesso!'); setModalAvaliacao(null); }}>Publicar Avaliação</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}