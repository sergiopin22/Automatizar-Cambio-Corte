import React, { useEffect, useState, useRef, useCallback, useMemo, lazy, Suspense } from 'react';
import './PdfGenerationAnimation.css';
import StarConfetti from '../StarConfetti/StarConfetti';

// Carga diferida del componente PdfStamp para mejor rendimiento
const PdfStamp = lazy(() => import('../PdfStamp/PdfStamp'));

const PdfGenerationAnimation = ({ isActive, onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isAnimationActive, setIsAnimationActive] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [showDownloadButton, setShowDownloadButton] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showStamp, setShowStamp] = useState(false); // Estado para controlar la visibilidad del sello
  
  // Usamos refs para evitar que los estados cambien inesperadamente
  const isCompleteRef = useRef(false);
  const progressIntervalRef = useRef(null);
  const animationMountedRef = useRef(false);

  // Cálculo optimizado para el offset del progreso
  const progressOffset = useMemo(() => 100 - progress, [progress]);

  // Evitamos que eventos inesperados reinicien la animación
  useEffect(() => {
    const handleScroll = (e) => {
      if (isCompleteRef.current) {
        e.preventDefault();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: false });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Marcar que el componente está montado
  useEffect(() => {
    animationMountedRef.current = true;
    
    return () => {
      animationMountedRef.current = false;
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  // Función para manejar la finalización del proceso
  const handleCompletion = useCallback(() => {
    if (!animationMountedRef.current) return;
    
    setIsComplete(true);
    isCompleteRef.current = true;
    
    // Activar el confeti y efectos de éxito simultáneamente
    setTimeout(() => {
      if (!animationMountedRef.current) return;
      
      setShowConfetti(true);
      
      // Mostrar el sello después de un pequeño retraso
      setTimeout(() => {
        if (!animationMountedRef.current) return;
        setShowStamp(true);
      }, 600); // Tiempo ajustado para mejor coordinación visual
      
      // Añadir clase de éxito destacado al documento
      const pdfDocument = document.querySelector('.pdf-document');
      if (pdfDocument) {
        pdfDocument.classList.add('success-highlight');
        
        // Quitar la clase después de la animación
        setTimeout(() => {
          if (pdfDocument) {
            pdfDocument.classList.remove('success-highlight');
          }
        }, 1500);
      }
    }, 100);
    
    // Mostrar el botón de descarga
    setTimeout(() => {
      if (!animationMountedRef.current) return;
      
      setShowDownloadButton(true);
      
      // Disparar un evento personalizado para señalar que la animación terminó
      const event = new Event('pdfAnimationComplete');
      window.dispatchEvent(event);
    }, 500);
  }, []);

  // Efecto principal para animación de generación
  useEffect(() => {
    if (isActive && animationMountedRef.current) {
      // Reiniciamos los estados cuando se activa
      setProgress(0);
      setIsComplete(false);
      isCompleteRef.current = false;
      setShowDownloadButton(false);
      setShowConfetti(false);
      setShowStamp(false); // Reiniciar visibilidad del sello
      
      // Bloquear el scroll cuando la animación está activa
      document.body.style.overflow = 'hidden';
      
      // Comenzamos la animación de las líneas después de un breve retraso
      const animationTimeout = setTimeout(() => {
        if (!animationMountedRef.current) return;
        setIsAnimationActive(true);
      }, 300);
      
      // Función optimizada para incrementar el progreso
      const incrementProgress = () => {
        setProgress(prev => {
          const newProgress = prev + 1;
          if (newProgress >= 100) {
            clearInterval(progressIntervalRef.current);
            setTimeout(() => handleCompletion(), 500);
            return 100;
          }
          return newProgress;
        });
      };
      
      // Iniciamos el intervalo para incrementar el progreso
      progressIntervalRef.current = setInterval(incrementProgress, 50);
      
      return () => {
        clearTimeout(animationTimeout);
        clearInterval(progressIntervalRef.current);
      };
    } else if (!isActive) {
      // Restaurar el scroll cuando la animación se cierra
      document.body.style.overflow = '';
    }
  }, [isActive, handleCompletion]);

  // Función optimizada para manejar la descarga
  const handleDownload = useCallback(() => {
    // Disparar el evento para iniciar la descarga
    const event = new Event('pdfDownloadRequested');
    window.dispatchEvent(event);
    
    // Mantenemos la animación de confeti por un momento antes de cerrar
    setTimeout(() => {
      if (onComplete && animationMountedRef.current) {
        // Restaurar el scroll antes de cerrar
        document.body.style.overflow = '';
        onComplete();
      }
    }, 1500);
  }, [onComplete]);

  return (
    <div className={`pdf-animation-overlay ${isActive ? 'active' : ''}`}>
      {/* Componente de confeti de estrellas */}
      <StarConfetti isActive={showConfetti} />
      
      <div className="pdf-animation-container">
        <div className="pdf-document">
          {/* Sello del documento cuando se completa - cargado de manera diferida */}
          {showStamp && (
            <Suspense fallback={null}>
              <PdfStamp />
            </Suspense>
          )}
          
          <div className={`pdf-document-content ${isAnimationActive ? 'pdf-animation-active' : ''} ${isComplete ? 'pdf-animation-complete' : ''}`}>
            <div className="pdf-line"></div>
            <div className="pdf-line"></div>
            <div className="pdf-line"></div>
            <div className="pdf-line"></div>
            <div className="pdf-line"></div>
            <div className="pdf-line"></div>
            <div className="pdf-line"></div>
            <div className="pdf-line"></div>
          </div>
          <div className="pdf-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="#cc0e1e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
            </svg>
          </div>
        </div>
        
        {!isComplete ? (
          <div className="pdf-progress">
            <div className="pdf-progress-circle">
              <svg viewBox="0 0 36 36">
                <path className="pdf-progress-bg" d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path 
                  className="pdf-progress-fill" 
                  d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831" 
                  style={{ strokeDashoffset: progressOffset }}
                />
              </svg>
              <div className="pdf-progress-text">{progress}%</div>
            </div>
            <div className="pdf-message">Generando PDF...</div>
          </div>
        ) : (
          <div className="pdf-success-container">
            <div className="pdf-success-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48">
                <circle cx="12" cy="12" r="10" fill="#45d68a" />
                <path d="M9 12l2 2 4-4" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="pdf-success-message">¡Documento generado con éxito!</div>
            {showDownloadButton && (
              <button className="pdf-download-button" onClick={handleDownload}>
                Descargar Moción
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PdfGenerationAnimation;