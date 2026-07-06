import { useState } from 'react';
import { auth } from '../services/firebase';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await auth.signInWithEmailAndPassword(email, password);
      navigate('/');
    } catch (error) {
      alert("E-mail ou senha incorretos. Tente novamente.");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="container bg-white p-5 rounded-4 shadow-sm" style={{ maxWidth: '400px' }}>
        <h2 className="text-center fw-bold mb-4">Faça seu login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <input 
              type="email" 
              className="form-control p-3" 
              placeholder="E-mail" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <div className="mb-4">
            <input 
              type="password" 
              className="form-control p-3" 
              placeholder="Senha" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          <button type="submit" className="btn btn-primary w-100 p-3 fw-bold rounded-pill">Login</button>
        </form>
        <div className="text-center mt-4">
          <p>Não tem uma conta? <Link to="/cadastro" className="text-primary text-decoration-none">Cadastre-se</Link></p>
        </div>
      </div>
    </div>
  );
}