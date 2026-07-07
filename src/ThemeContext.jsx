import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const temaSalvo = localStorage.getItem('boeMinha_theme') === 'dark';
    setDarkMode(temaSalvo);
  }, []);

  // Quando o tema muda, avisamos o corpo inteiro (body) do HTML
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
      
      {/* 
        A MÁGICA ACONTECE AQUI: 
        Forçamos o Bootstrap a obedecer o modo escuro no site TODO!
      */}
      <style>
        {`
          body.dark-mode-global {
            background-color: #121212 !important;
            color: #f8f9fa !important;
          }
          
          /* Esmaga os fundos brancos teimosos do Bootstrap */
          body.dark-mode-global .bg-white, 
          body.dark-mode-global .bg-light,
          body.dark-mode-global .card {
            background-color: #1e1e1e !important;
            color: #f8f9fa !important;
            border-color: #333 !important;
          }

          /* Arruma os textos que sumiriam no fundo preto */
          body.dark-mode-global .text-dark {
            color: #f8f9fa !important;
          }
          body.dark-mode-global .text-muted {
            color: #aaaaaa !important;
          }

          /* Suaviza as bordas do site */
          body.dark-mode-global .border,
          body.dark-mode-global .border-top,
          body.dark-mode-global .border-bottom {
            border-color: #333 !important;
          }
        `}
      </style>

      <div style={{ minHeight: '100vh', transition: '0.3s ease' }}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}