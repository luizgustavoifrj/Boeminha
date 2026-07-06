import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth, firestore } from '../services/firebase';

export default function Cadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [tipoUsuario, setTipoUsuario] = useState('turista'); // Padrão: turista
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCadastro = async (e) => {
    e.preventDefault();
    setErro('');
    setLoading(true);

    try {
      // 1. Cria o usuário real no Firebase Auth
      const userCredential = await auth.createUserWithEmailAndPassword(email, senha);
      const user = userCredential.user;

      // 2. Salva os dados e a "role" (tipo de perfil) no banco de dados
      await firestore.collection('usuarios').doc(user.uid).set({
        nome: nome,
        email: email,
        tipo: tipoUsuario,
        dataCadastro: new Date().toISOString()
      });

      // 3. Redireciona direto pro site (logado)
      alert("Conta criada com sucesso! Bem-vindo ao Boeminha.");
      navigate('/');
      
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        setErro('Esse e-mail já está cadastrado em outra conta.');
      } else if (error.code === 'auth/weak-password') {
        setErro('A senha deve ter pelo menos 6 caracteres.');
      } else {
        setErro('Erro ao criar conta. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh', background: '#f8f9fa', paddingTop: '76px' }}>
      <div className="card border-0 shadow-lg rounded-4 p-5" style={{ maxWidth: '500px', width: '100%' }}>
        <div className="text-center mb-4">
          <h2 className="fw-bold text-success"><i className="fas fa-leaf me-2"></i>BOEMINHA</h2>
          <p className="text-muted">Crie sua conta para começar a explorar.</p>
        </div>

        {erro && <div className="alert alert-danger fw-bold text-center">{erro}</div>}

        <form onSubmit={handleCadastro}>
          <div className="mb-3">
            <label className="form-label fw-bold small text-muted">Como você vai usar o Boeminha?</label>
            <select className="form-select bg-light p-3 fw-bold" value={tipoUsuario} onChange={(e) => setTipoUsuario(e.target.value)}>
              <option value="turista">Sou um Explorador / Turista</option>
              <option value="guia">Sou Guia de Turismo (Especialista)</option>
              <option value="dono">Sou Dono de um Estabelecimento (Business)</option>
              <option value="admin">Administrador do Sistema</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold small">Nome Completo</label>
            <input type="text" className="form-control bg-light p-3" value={nome} onChange={(e) => setNome(e.target.value)} required />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold small">E-mail</label>
            <input type="email" className="form-control bg-light p-3" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className="mb-4">
            <label className="form-label fw-bold small">Senha</label>
            <input type="password" className="form-control bg-light p-3" placeholder="Mínimo 6 caracteres" value={senha} onChange={(e) => setSenha(e.target.value)} required minLength="6" />
          </div>

          <button type="submit" className="btn btn-success fw-bold w-100 p-3 rounded-pill" disabled={loading}>
            {loading ? 'CRIANDO CONTA...' : 'CRIAR CONTA'}
          </button>
        </form>

        <p className="text-center mt-4 text-muted small">
          Já tem uma conta? <Link to="/login" className="text-success fw-bold text-decoration-none">Faça login aqui</Link>
        </p>
      </div>
    </div>
  );
}