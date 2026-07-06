import { useState } from 'react';
import { auth, db } from '../services/firebase';
import { useNavigate, Link } from 'react-router-dom';

export default function Cadastro() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('');
  const navigate = useNavigate();

  const handleCadastro = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;
      
      // Salva dados adicionais no Realtime Database
      await db.ref('users/' + user.uid).set({
        email: email,
        idade: age
      });

      alert("Cadastro realizado com sucesso!");
      navigate('/login');
    } catch (error) {
      console.error("Erro no cadastro:", error);
      let mensagem = "Ocorreu um erro inesperado.";
      if (error.code === "auth/email-already-in-use") mensagem = "Este e-mail já está sendo utilizado.";
      if (error.code === "auth/weak-password") mensagem = "A senha deve ter no mínimo 6 caracteres.";
      alert(mensagem);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light" style={{ paddingTop: '76px' }}>
      <div className="container bg-white p-5 rounded-4 shadow-sm" style={{ maxWidth: '400px' }}>
        <h2 className="text-center fw-bold mb-4">Crie sua Conta</h2>
        <form onSubmit={handleCadastro}>
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
          <div className="mb-3">
            <input 
              type="password" 
              className="form-control p-3" 
              placeholder="Senha (mínimo 6 caracteres)" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          <div className="mb-4">
            <input 
              type="number" 
              className="form-control p-3" 
              placeholder="Idade" 
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required 
            />
          </div>
          <button type="submit" className="btn btn-primary w-100 p-3 fw-bold rounded-pill">Cadastrar</button>
        </form>
        <div className="text-center mt-4">
          <p>Já tem uma conta? <Link to="/login" className="text-primary text-decoration-none">Faça o login</Link></p>
        </div>
      </div>
    </div>
  );
}