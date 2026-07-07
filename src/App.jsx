import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './ThemeContext'; // <-- 1. IMPORTAMOS O CÉREBRO AQUI!

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Explorar from './pages/Explorar';
import Roteiros from './pages/Roteiros';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import Perfil from './pages/Perfil';
import Anuncie from './pages/Anuncie';
import Checkout from './pages/Checkout';
import Parceiros from './pages/Parceiros';
import MidiaKit from './pages/MidiaKit';
import FaleConosco from './pages/FaleConosco';
import Institucional from './pages/Institucional';
// Importando as páginas das cidades:
import Niteroi from './pages/cidades/Niteroi';
import Rio from './pages/cidades/Rio';
import SaoGoncalo from './pages/cidades/SaoGoncalo';

// Importando as páginas do rodapé:
import SobreNos from './pages/rodape/SobreNos';
import Faq from './pages/rodape/Faq';
import Termos from './pages/rodape/Termos';
import Politica from './pages/rodape/Politica';

import './index.css';

export default function App() {
  return (
    // 2. O THEMEPROVIDER AGORA ABRAÇA O SITE INTEIRO!
    <ThemeProvider> 
      <BrowserRouter>
        <div className="d-flex flex-column min-vh-100">
          <Navbar />
          
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explorar" element={<Explorar />} />
            <Route path="/roteiros" element={<Roteiros />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/anuncie" element={<Anuncie />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/parceiros" element={<Parceiros />} />
            <Route path="/midia-kit" element={<MidiaKit />} />
            <Route path="/fale-conosco" element={<FaleConosco />} />
            
            {/* Rotas das Cidades */}
            <Route path="/cidades/niteroi" element={<Niteroi />} />
            <Route path="/cidades/rio" element={<Rio />} />
            <Route path="/cidades/saogoncalo" element={<SaoGoncalo />} />

            {/* Rotas do Rodapé */}
            <Route path="/sobre-nos" element={<SobreNos />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/termos" element={<Termos />} />
            <Route path="/politica" element={<Politica />} />

            <Route path="/sobre-nos" element={<Institucional />} />
<Route path="/faq" element={<Institucional />} />
<Route path="/termos" element={<Institucional />} />
<Route path="/politica" element={<Institucional />} />
<Route path="/midia-kit" element={<Institucional />} />
          </Routes>

          <Footer />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}