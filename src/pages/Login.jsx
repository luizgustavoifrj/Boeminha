import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../services/firebase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro('');
    setMensagem('');
    setLoading(true);

    try {
      await auth.signInWithEmailAndPassword(email, senha);
      navigate('/'); // Vai direto pra Home se der certo
    } catch (error) {
      if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
        setErro('E-mail não encontrado ou senha incorreta.');
      } else if (error.code === 'auth/wrong-password') {
        setErro('Senha incorreta. Tente novamente.');
      } else {
        setErro('Erro ao fazer login. Verifique seus dados.');
      }
    } finally {
      setLoading(false);
    }
  };

  const recuperarSenha = async () => {
    if (!email) {
      setErro('Digite seu e-mail no campo acima primeiro para redefinir a senha.');
      return;
    }
    try {
      await auth.sendPasswordResetEmail(email);
      setErro('');
      setMensagem('Um link para redefinir sua senha foi enviado para o seu e-mail!');
    } catch (error) {
      setErro('Não foi possível enviar o e-mail de recuperação.');
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh', background: '#f8f9fa', paddingTop: '76px' }}>
      <div className="card border-0 shadow-lg rounded-4 p-5" style={{ maxWidth: '450px', width: '100%' }}>
        <div className="text-center mb-4">
          <h2 className="fw-bold text-success"><i className="fas fa-leaf me-2"></i>BOEMINHA</h2>
          <p className="text-muted">Faça login para continuar sua jornada.</p>
        </div>

        {erro && <div className="alert alert-danger fw-bold text-center small">{erro}</div>}
        {mensagem && <div className="alert alert-success fw-bold text-center small">{mensagem}</div>}

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label fw-bold small">E-mail</label>
            <input type="email" className="form-control bg-light p-3" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className="mb-4">
            <div className="d-flex justify-content-between">
              <label className="form-label fw-bold small">Senha</label>
              <button type="button" onClick={recuperarSenha} className="btn btn-link p-0 text-success text-decoration-none small fw-bold" style={{ fontSize: '0.8rem' }}>Esqueci a senha</button>
            </div>
            <input type="password" className="form-control bg-light p-3" value={senha} onChange={(e) => setSenha(e.target.value)} required />
          </div>

          <button type="submit" className="btn btn-success fw-bold w-100 p-3 rounded-pill" disabled={loading}>
            {loading ? 'ENTRANDO...' : 'ENTRAR'}
          </button>
        </form>

        <p className="text-center mt-4 text-muted small">
          Ainda não é um explorador? <Link to="/cadastro" className="text-success fw-bold text-decoration-none">Crie sua conta</Link>
        </p>
      </div>
    </div>
  );
}