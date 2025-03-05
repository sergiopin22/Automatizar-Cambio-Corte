import React, { useEffect, useState } from 'react';
import './PdfGenerationAnimation.css';
import StarConfetti from './StarConfetti'; // Importando tu componente existente

const PdfGenerationAnimation = ({ isActive, onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isAnimationActive, setIsAnimationActive] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [showDownloadButton, setShowDownloadButton] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false); // Estado para controlar el confeti

  useEffect(() => {
    if (isActive) {
      // Reiniciamos los estados cuando se activa
      setProgress(0);
      setIsComplete(false);
      setShowDownloadButton(false);
      setShowConfetti(false); // Reiniciar el estado del confeti
      
      // Comenzamos la animación de las líneas después de un breve retraso
      setTimeout(() => {
        setIsAnimationActive(true);
      }, 300);
      
      // Animamos el progreso
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + 1;
          
          // Al llegar al 100%
          if (newProgress >= 100) {
            clearInterval(progressInterval);
            
            // Mostrar animación de completado
            setTimeout(() => {
              setIsComplete(true);
              
              // Activar el confeti y efectos de éxito simultáneamente
              setTimeout(() => {
                setShowConfetti(true);
                
                // Añadir clase de éxito destacado al documento
                const pdfDocument = document.querySelector('.pdf-document');
                if (pdfDocument) {
                  pdfDocument.classList.add('success-highlight');
                  
                  // Quitar la clase después de la animación
                  setTimeout(() => {
                    pdfDocument.classList.remove('success-highlight');
                  }, 1500);
                }
              }, 100);
              
              // Mostrar el botón de descarga
              setTimeout(() => {
                setShowDownloadButton(true);
                
                // Disparar un evento personalizado para señalar que la animación terminó
                const event = new Event('pdfAnimationComplete');
                window.dispatchEvent(event);
              }, 500);
            }, 500);
          }
          
          return newProgress;
        });
      }, 50); // Actualizamos cada 50ms (5 segundos en total)
      
      return () => {
        clearInterval(progressInterval);
      };
    } else {
      setIsAnimationActive(false);
      setShowDownloadButton(false);
      setShowConfetti(false); // Desactivar el confeti cuando se cierra
    }
  }, [isActive, onComplete]);

  // Función para manejar la descarga manual
  const handleDownload = () => {
    // Disparar el evento para iniciar la descarga
    const event = new Event('pdfDownloadRequested');
    window.dispatchEvent(event);
    
    // Mantenemos la animación de confeti por un momento antes de cerrar
    setTimeout(() => {
      if (onComplete) {
        onComplete();
      }
    }, 1500); // Dar tiempo para disfrutar del confeti antes de cerrar
  };

  return (
    <div className={`pdf-animation-overlay ${isActive ? 'active' : ''}`}>
      {/* Componente de confeti de estrellas */}
      <StarConfetti isActive={showConfetti} />
      
      <div className="pdf-animation-container">
        <div className="pdf-document">
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
                  style={{ strokeDashoffset: 100 - progress }}
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