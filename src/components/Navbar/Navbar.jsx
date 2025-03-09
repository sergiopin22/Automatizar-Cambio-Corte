import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Controla el scroll para cambiar estilos del navbar
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

  // Cierra el menú móvil cuando se cambia el tamaño de la ventana
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && menuOpen) {
        setMenuOpen(false);
        document.body.classList.remove('menu-open'); // Eliminar la clase cuando cambia el tamaño
      }
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [menuOpen]);

  // Función para alternar el menú móvil
  const toggleMenu = () => {
    const newMenuState = !menuOpen;
    setMenuOpen(newMenuState);
    
    // Bloquear scroll cuando el menú está abierto
    if (newMenuState) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }
  };

  // Cierra el menú después de hacer clic en un enlace
  const closeMenu = () => {
    if (menuOpen) {
      setMenuOpen(false);
      document.body.classList.remove('menu-open'); // Eliminar la clase al cerrar el menú
    }
  };

  // Función para determinar si un enlace está activo
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Efecto para limpiar la clase menu-open cuando se desmonta el componente
  useEffect(() => {
    return () => {
      document.body.classList.remove('menu-open');
    };
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>      
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <img src="/Logo_ProTramites.png" alt="Pro Tramites" className="logo-image" />
          <span className="logo-text">Pro Trámites LLC</span>
        </Link>

        {/* Botón de hamburguesa para móviles */}
        <div className="menu-icon" onClick={toggleMenu}>
          <div className={`hamburger ${menuOpen ? 'open' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        {/* Menú de navegación */}
        <ul className={`nav-menu ${menuOpen ? 'active' : ''}`}>
          <li className="nav-item">
            <Link 
              to="/" 
              className={`nav-link ${isActive('/') ? 'active' : ''}`} 
              onClick={closeMenu}
            >
              Inicio
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              to="/mocion" 
              className={`nav-link ${isActive('/mocion') ? 'active' : ''}`} 
              onClick={closeMenu}
            >
              Formulario de Moción
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              to="/herramientas" 
              className={`nav-link ${isActive('/herramientas') ? 'active' : ''}`} 
              onClick={closeMenu}
            >
              Herramientas
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              to="/recursos" 
              className={`nav-link ${isActive('/recursos') ? 'active' : ''}`} 
              onClick={closeMenu}
            >
              Recursos
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              to="/contacto" 
              className={`nav-link ${isActive('/contacto') ? 'active' : ''}`} 
              onClick={closeMenu}
            >
              Contacto
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;