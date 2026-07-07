import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, firestore } from '../services/firebase';

export default function Perfil() {
  const [user, setUser] = useState(null);
  const [dadosDb, setDadosDb] = useState(null);
  const [loading, setLoading] = useState(true);

  // Estados por tipo de usuário
  const [pedidos, setPedidos] = useState([]); 
  const [meusRoteiros, setMeusRoteiros] = useState([]); 
  const [solicitacoes, setSolicitacoes] = useState([]); 

  // Estados de Edição de Perfil
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

  // Estados para Admin
  const [solicitacaoSelecionada, setSolicitacaoSelecionada] = useState(null);

  // Estados para Anúncio (Business/Dono)
  const [modalAnuncio, setModalAnuncio] = useState(false);
  const [etapaAnuncio, setEtapaAnuncio] = useState(1);
  const [formAnuncio, setFormAnuncio] = useState({ titulo: '', imagemUrl: '', link: '' });

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
      const doc = await firestore.collection('usuarios').doc(uid).get();
      let dadosUsuario = { nome: email.split('@')[0], tipo: 'turista', fotoUrl: '', biografia: '', diasDisponiveis: [] };
      if (doc.exists) dadosUsuario = { ...dadosUsuario, ...doc.data() };
      
      setDadosDb(dadosUsuario);
      setPerfilForm(dadosUsuario);

      if (dadosUsuario.tipo === 'turista') {
        const pedidosSnap = await firestore.collection('usuarios').doc(uid).collection('pedidos').orderBy('dataCompra', 'desc').get();
        setPedidos(pedidosSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      } else if (dadosUsuario.tipo === 'guia') {
        const roteirosSnap = await firestore.collection('roteiros').where('guiaId', '==', uid).get();
        setMeusRoteiros(roteirosSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      } else if (dadosUsuario.tipo === 'admin') {
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

  // --- FUNÇÕES ADMIN ---
  const aprovarParceiro = async (id) => {
    try {
      await firestore.collection('solicitacoes_parceria').doc(id).update({ status: 'Aprovado' });
      setSolicitacoes(solicitacoes.map(s => s.id === id ? { ...s, status: 'Aprovado' } : s));
      setSolicitacaoSelecionada(null);
    } catch (e) {
      alert("Erro ao aprovar.");
    }
  };

  const reprovarParceiro = async (id) => {
    if (window.confirm("Deseja realmente reprovar esta solicitação?")) {
      try {
        await firestore.collection('solicitacoes_parceria').doc(id).update({ status: 'Reprovado' });
        setSolicitacoes(solicitacoes.map(s => s.id === id ? { ...s, status: 'Reprovado' } : s));
        setSolicitacaoSelecionada(null);
      } catch (e) {
        alert("Erro ao reprovar.");
      }
    }
  };

  const contatarWhatsApp = (numero) => {
    if (!numero) return;
    const numeroLimpo = numero.replace(/\D/g, '');
    window.open(`https://wa.me/55${numeroLimpo}`, '_blank');
  };

  // --- FUNÇÕES GUIA ---
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
        await firestore.collection('roteiros').doc(editandoRoteiroId).update(roteiroFinal);
        setMeusRoteiros(meusRoteiros.map(r => r.id === editandoRoteiroId ? { id: editandoRoteiroId, ...roteiroFinal } : r));
        alert('Roteiro atualizado com sucesso!');
      } else {
        roteiroFinal.dataCriacao = new Date().toISOString();
        const docRef = await firestore.collection('roteiros').add(roteiroFinal);
        setMeusRoteiros([{ id: docRef.id, ...roteiroFinal }, ...meusRoteiros]);
        alert('Roteiro criado com sucesso!');
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

  // --- FUNÇÕES BUSINESS / DONO ---
  const processarPagamentoAnuncio = async (e) => {
    e.preventDefault();
    try {
      await firestore.collection('anuncios_patrocinados').add({
        ...formAnuncio,
        donoId: user.uid,
        donoNome: dadosDb.nome,
        dataCriacao: new Date().toISOString(),
        status: 'Ativo'
      });
      alert('Pagamento aprovado! Seu anúncio já está rodando na página principal.');
      setModalAnuncio(false);
      setEtapaAnuncio(1);
      setFormAnuncio({ titulo: '', imagemUrl: '', link: '' });
    } catch (error) {
      alert('Erro ao processar anúncio.');
    }
  };

  if (loading) return <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}><div className="spinner-border text-success"></div></div>;

  const proximosEventos = pedidos.filter(p => p.dataAgendada);
  const historicoGeral = pedidos.filter(p => !p.dataAgendada);

  return (
    <div style={{ paddingTop: '76px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      
      {/* HEADER PERFIL */}
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
            <button onClick={() => setEditandoPerfil(true)} className="btn btn-outline-success fw-bold rounded-pill px-4">Configurações</button>
            <button onClick={handleLogout} className="btn btn-outline-danger fw-bold rounded-pill px-4">Sair</button>
          </div>
        </div>
      </header>

      <main className="container mb-5">

        {/* ==================== TURISTA ==================== */}
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
                        <h6 className="fw-bold mb-1 text-dark">{pedido.itens?.[0]?.titulo || 'Ingresso'}</h6>
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

        {/* ==================== GUIA ==================== */}
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

        {/* ==================== DONO / BUSINESS ==================== */}
        {dadosDb?.tipo === 'dono' && (
          <div className="row g-4">
            <div className="col-lg-8">
              <div className="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
                <h4 className="fw-bold text-dark mb-4"><i className="fas fa-chart-line text-success me-2"></i>Visão Geral do Seu Negócio</h4>
                <div className="row g-3 text-center">
                  <div className="col-md-4">
                    <div className="p-3 bg-light rounded-3 border">
                      <div className="fs-2 fw-bold text-success">3.402</div>
                      <div className="small text-muted fw-bold text-uppercase">Visualizações</div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="p-3 bg-light rounded-3 border">
                      <div className="fs-2 fw-bold text-success">289</div>
                      <div className="small text-muted fw-bold text-uppercase">Cliques no Site</div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="p-3 bg-dark text-white rounded-3 border border-dark">
                      <div className="fs-2 fw-bold text-warning">4.8 <i className="fas fa-star fs-5"></i></div>
                      <div className="small text-white-50 fw-bold text-uppercase">Nota Média</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="card border-0 shadow-sm rounded-4 p-4 bg-white h-100 text-center d-flex flex-column justify-content-center" style={{ border: '2px dashed #2d6a4f' }}>
                <i className="fas fa-bullhorn text-success fs-1 mb-3"></i>
                <h5 className="fw-bold text-dark mb-2">Espaço Patrocinado</h5>
                <p className="text-muted small mb-4">Destaque o seu estabelecimento na página principal do Boeminha.</p>
                <button onClick={() => setModalAnuncio(true)} className="btn btn-success fw-bold rounded-pill w-100">
                  Criar Anúncio (R$ 49,90/mês)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==================== ADMIN ==================== */}
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
                          <th>WhatsApp</th>
                          <th>Status</th>
                          <th>Ação</th>
                        </tr>
                      </thead>
                      <tbody>
                        {solicitacoes.map(sol => (
                          <tr key={sol.id}>
                            <td className="fw-bold">{sol.nome}</td>
                            <td><span className="badge bg-secondary">{sol.tipo}</span></td>
                            <td className="text-muted small">{sol.whatsapp}</td>
                            <td>
                              <span className={`badge ${sol.status === 'Aprovado' ? 'bg-success' : sol.status === 'Reprovado' ? 'bg-danger' : 'bg-warning text-dark'}`}>
                                {sol.status}
                              </span>
                            </td>
                            <td>
                              <button onClick={() => setSolicitacaoSelecionada(sol)} className="btn btn-sm btn-outline-dark fw-bold rounded-pill">Ver Perfil Completo</button>
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

      {/* Modal Criar Anúncio (Business) */}
      {modalAnuncio && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0">
              <div className="modal-header bg-dark text-white border-0 rounded-top-4">
                <h5 className="fw-bold m-0"><i className="fas fa-bullhorn me-2"></i>Impulsionar Negócio</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => { setModalAnuncio(false); setEtapaAnuncio(1); }}></button>
              </div>
              <div className="modal-body p-4">
                
                {etapaAnuncio === 1 ? (
                  <form onSubmit={(e) => { e.preventDefault(); setEtapaAnuncio(2); }}>
                    <div className="mb-3">
                      <label className="form-label small fw-bold text-muted">Título do Anúncio</label>
                      <input type="text" className="form-control bg-light p-3" required maxLength="50" placeholder="Ex: Prove o melhor chopp!" value={formAnuncio.titulo} onChange={e => setFormAnuncio({...formAnuncio, titulo: e.target.value})} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label small fw-bold text-muted">URL da Imagem</label>
                      <input type="url" className="form-control bg-light p-3" required placeholder="https://..." value={formAnuncio.imagemUrl} onChange={e => setFormAnuncio({...formAnuncio, imagemUrl: e.target.value})} />
                    </div>
                    <div className="mb-4">
                      <label className="form-label small fw-bold text-muted">Link de Destino</label>
                      <input type="url" className="form-control bg-light p-3" required value={formAnuncio.link} onChange={e => setFormAnuncio({...formAnuncio, link: e.target.value})} />
                    </div>
                    <button type="submit" className="btn btn-dark fw-bold w-100 rounded-pill p-3">Ir para Pagamento</button>
                  </form>
                ) : (
                  <form onSubmit={processarPagamentoAnuncio}>
                    <div className="bg-light p-3 rounded-3 border mb-4 text-center">
                      <span className="d-block small text-muted fw-bold text-uppercase mb-1">Plano Mensal</span>
                      <h3 className="fw-bold text-success m-0">R$ 49,90<span className="fs-6 text-muted">/mês</span></h3>
                    </div>
                    <h6 className="fw-bold text-dark mb-3">Dados do Cartão</h6>
                    <div className="mb-3">
                      <input type="text" className="form-control bg-light p-3" placeholder="Número do Cartão" required />
                    </div>
                    <div className="row g-2 mb-4">
                      <div className="col-6"><input type="text" className="form-control bg-light p-3" placeholder="MM/AA" required /></div>
                      <div className="col-6"><input type="text" className="form-control bg-light p-3" placeholder="CVV" required /></div>
                    </div>
                    <div className="d-flex gap-2">
                      <button type="button" onClick={() => setEtapaAnuncio(1)} className="btn btn-outline-secondary fw-bold rounded-pill px-4">Voltar</button>
                      <button type="submit" className="btn btn-success fw-bold w-100 rounded-pill p-3"><i className="fas fa-check me-2"></i>Assinar e Publicar</button>
                    </div>
                  </form>
                )}

              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Visualizar Detalhes da Solicitação (Admin) */}
      {solicitacaoSelecionada && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content rounded-4 border-0">
              <div className="modal-header bg-dark text-white rounded-top-4 border-0">
                <h5 className="fw-bold m-0"><i className="fas fa-user-check me-2"></i>Análise de Parceiro</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setSolicitacaoSelecionada(null)}></button>
              </div>
              <div className="modal-body p-4 bg-light">
                <div className="row g-4">
                  <div className="col-md-6">
                    <div className="bg-white p-3 rounded-4 shadow-sm h-100 border">
                      <h6 className="fw-bold text-success mb-3 border-bottom pb-2">Dados do Contato</h6>
                      <p className="mb-1"><span className="text-muted small fw-bold">Responsável:</span> {solicitacaoSelecionada.nome}</p>
                      <p className="mb-1"><span className="text-muted small fw-bold">E-mail:</span> {solicitacaoSelecionada.email}</p>
                      <p className="mb-1"><span className="text-muted small fw-bold">WhatsApp:</span> {solicitacaoSelecionada.whatsapp}</p>
                      <p className="mb-3"><span className="text-muted small fw-bold">Tipo:</span> <span className="badge bg-dark ms-1">{solicitacaoSelecionada.tipo}</span></p>
                      <p className="small text-muted fst-italic p-2 bg-light rounded border">"{solicitacaoSelecionada.mensagem || 'Sem mensagem extra.'}"</p>
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="bg-white p-3 rounded-4 shadow-sm h-100 border">
                      <h6 className="fw-bold text-success mb-3 border-bottom pb-2">Prévia do Anúncio Submetido</h6>
                      {solicitacaoSelecionada.tituloLocal ? (
                        <>
                          {solicitacaoSelecionada.imagemLocal && (
                            <img src={solicitacaoSelecionada.imagemLocal} alt="Preview" className="img-fluid rounded-3 mb-2" style={{height: '100px', width: '100%', objectFit: 'cover'}} />
                          )}
                          <h6 className="fw-bold text-dark mt-2 mb-1">{solicitacaoSelecionada.tituloLocal}</h6>
                          <div className="d-flex justify-content-between mb-2">
                            <span className="badge bg-light text-dark border"><i className="far fa-clock"></i> {solicitacaoSelecionada.horarioLocal || 'N/A'}</span>
                            <span className="fw-bold text-success">R$ {solicitacaoSelecionada.precoLocal || '0'}</span>
                          </div>
                          <p className="small text-muted" style={{display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>{solicitacaoSelecionada.descricaoLocal}</p>
                        </>
                      ) : (
                        <p className="text-muted small text-center py-4">Este usuário preencheu apenas os dados de contato.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="modal-footer bg-white border-top-0 d-flex justify-content-between p-4 rounded-bottom-4">
                <button onClick={() => contatarWhatsApp(solicitacaoSelecionada.whatsapp)} className="btn btn-outline-success fw-bold rounded-pill">
                  <i className="fab fa-whatsapp fs-5 me-2 align-middle"></i> Chamar no Zap
                </button>
                <div className="d-flex gap-2">
                  <button onClick={() => reprovarParceiro(solicitacaoSelecionada.id)} className="btn btn-outline-danger fw-bold rounded-pill px-4" disabled={solicitacaoSelecionada.status === 'Reprovado'}>
                    <i className="fas fa-times me-1"></i> Reprovar
                  </button>
                  <button onClick={() => aprovarParceiro(solicitacaoSelecionada.id)} className="btn btn-success fw-bold rounded-pill px-4 shadow-sm" disabled={solicitacaoSelecionada.status === 'Aprovado'}>
                    <i className="fas fa-check me-1"></i> Aprovar Perfil
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
    </div>
  );
}