import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const temaSalvo = localStorage.getItem('boeMinha_theme') === 'dark';
    setDarkMode(temaSalvo);
  }, []);

  // Quando o tema muda, aplicamos uma classe no <body> inteiro
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode-global');
    } else {
      document.body.classList.remove('dark-mode-global');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    const novoTema = !darkMode;
    setDarkMode(novoTema);
    localStorage.setItem('boeMinha_theme', novoTema ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      
      {/* O TRATOR DO MODO ESCURO: 
        Estas regras esmagam qualquer fundo branco ou texto preto teimoso do site inteiro!
      */}
      <style>
        {`
          /* 1. Fundo geral da página */
          body.dark-mode-global {
            background-color: #121212 !important;
            color: #f8f9fa !important;
          }
          
          /* 2. Força todas as seções principais a soltarem os fundos brancos travados */
          body.dark-mode-global section,
          body.dark-mode-global header,
          body.dark-mode-global main,
          body.dark-mode-global footer,
          body.dark-mode-global .container-fluid {
            background-color: transparent !important;
            background: transparent !important;
          }

          /* 3. Elementos que precisam ser cinza-escuro (Cartões, Modais, Dropdowns) */
          body.dark-mode-global .card,
          body.dark-mode-global .bg-white,
          body.dark-mode-global .bg-light,
          body.dark-mode-global .glass-card,
          body.dark-mode-global .search-box,
          body.dark-mode-global .modal-content,
          body.dark-mode-global [class*="suggestions-box"] {
            background-color: #1e1e1e !important;
            background: #1e1e1e !important;
            color: #f8f9fa !important;
            border-color: #333 !important;
          }

          /* 4. Arruma as Barras de Pesquisa e Formulários (Inputs) */
          body.dark-mode-global .form-control,
          body.dark-mode-global input,
          body.dark-mode-global textarea,
          body.dark-mode-global select {
            background-color: #2a2a2a !important;
            color: #ffffff !important;
            border-color: #444 !important;
          }
          body.dark-mode-global .form-control::placeholder {
            color: #aaaaaa !important;
          }

          /* 5. Salva os textos escuros que ficaram invisíveis */
          body.dark-mode-global .text-dark,
          body.dark-mode-global h1, 
          body.dark-mode-global h2, 
          body.dark-mode-global h3, 
          body.dark-mode-global h4, 
          body.dark-mode-global h5, 
          body.dark-mode-global h6 {
            color: #f8f9fa !important;
          }
          body.dark-mode-global .text-muted {
            color: #aaaaaa !important;
          }

          /* 6. Suaviza as linhas separadoras */
          body.dark-mode-global .border,
          body.dark-mode-global .border-top,
          body.dark-mode-global .border-bottom,
          body.dark-mode-global hr {
            border-color: #333 !important;
          }
        `}
      </style>

      {/* Nossa div base agora obedece o body global */}
      <div style={{ minHeight: '100vh', transition: '0.3s ease' }}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}