import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MotionForm from './MotionForm';
import Navbar from './components/Navbar';

function App() {
  const [scrolled, setScrolled] = useState(false);
  
  // Controla el scroll para cambiar clases en el contenedor principal
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    // Limpia el event listener
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <Router>
      <Navbar />
      <div className={`app-container ${scrolled ? 'nav-scrolled' : ''}`}>
        <Routes>
          <Route path="/" element={<MotionForm />} />
          <Route path="/mocion" element={<MotionForm titulo="FORMULARIO DE MOCIÓN PARA CAMBIO DE CORTE" />} />
          <Route path="/herramientas" element={
            <div className="container">
              <h1>Página de Herramientas</h1>
            </div>
          } />
          <Route path="/recursos" element={
            <div className="container">
              <h1>Página de Recursos</h1>
            </div>
          } />
          <Route path="/contacto" element={
            <div className="container">
              <h1>Página de Contacto</h1>
            </div>
          } />
          <Route path="*" element={
            <div className="container">
              <h1>404 - Página no encontrada</h1>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;