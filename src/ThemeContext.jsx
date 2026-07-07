import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const temaSalvo = localStorage.getItem('boeMinha_theme') === 'dark';
    setDarkMode(temaSalvo);
  }, []);

  const toggleDarkMode = () => {
    const novoTema = !darkMode;
    setDarkMode(novoTema);
    localStorage.setItem('boeMinha_theme', novoTema ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      <div style={{
        backgroundColor: darkMode ? '#121212' : '#ffffff',
        color: darkMode ? '#f8f9fa' : '#212529',
        minHeight: '100vh',
        transition: 'background-color 0.3s ease, color 0.3s ease'
      }}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}