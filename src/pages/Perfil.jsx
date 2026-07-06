import { useState, useEffect } from 'react';
import { auth, db } from '../services/firebase';
import { useNavigate } from 'react-router-dom';

export default function Perfil() {
  const [userData, setUserData] = useState({ cpf: '', telefone: '', cep: '' });
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setEmail(user.email);
        db.ref('users/' + user.uid).once('value').then((snapshot) => {
          if (snapshot.exists()) {
            setUserData(snapshot.val());
          }
        });
      } else {
        navigate('/login');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleSave = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (user) {
      try {
        await db.ref('users/' + user.uid).update({
          cpf: userData.cpf || '',
          telefone: userData.telefone || '',
          cep: userData.cep || ''
        });
        alert("Perfil atualizado com sucesso!");
      } catch (error) {
        alert("Ocorreu um erro ao salvar suas informações.");
      }
    }
  };

  return (
    <div className="container" style={{ paddingTop: '120px', maxWidth: '700px', paddingBottom: '60px' }}>
      <div className="bg-white p-5 rounded-4 shadow-sm border">
        <h2 className="fw-bold mb-4">Meu Perfil</h2>
        <form onSubmit={handleSave}>
          <div className="mb-3">
            <label className="form-label fw-bold small">Email</label>
            <input type="email" className="form-control" value={email} readOnly disabled />
          </div>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold small">CPF</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="000.000.000-00"
                value={userData.cpf || ''}
                onChange={(e) => setUserData({...userData, cpf: e.target.value})}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold small">Telefone</label>
              <input 
                type="tel" 
                className="form-control" 
                placeholder="(21) 99999-9999"
                value={userData.telefone || ''}
                onChange={(e) => setUserData({...userData, telefone: e.target.value})}
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="form-label fw-bold small">CEP</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="00000-000"
              value={userData.cep || ''}
              onChange={(e) => setUserData({...userData, cep: e.target.value})}
            />
          </div>
          <button type="submit" className="btn btn-success w-100 fw-bold p-3 rounded-pill">Salvar Alterações</button>
        </form>
      </div>
    </div>
  );
}