import React, { useEffect, useState } from 'react';
import './PdfGenerationAnimation.css';

const PdfGenerationAnimation = ({ isActive, onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isAnimationActive, setIsAnimationActive] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (isActive) {
      // Reiniciamos los estados cuando se activa
      setProgress(0);
      setIsComplete(false);
      
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
              
              // Disparar un evento personalizado para señalar que la animación terminó
              const event = new Event('pdfAnimationComplete');
              window.dispatchEvent(event);
              
              // Cerrar la animación después de mostrar el éxito
              setTimeout(() => {
                if (onComplete) onComplete();
                
                // Resetear estados
                setTimeout(() => {
                  setIsAnimationActive(false);
                  setIsComplete(false);
                }, 500);
              }, 2000);
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
    }
  }, [isActive, onComplete]);

  return (
    <div className={`pdf-animation-overlay ${isActive ? 'active' : ''}`}>
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
        </div>
        <div className="pdf-message" style={{ display: isComplete ? 'none' : 'block' }}>
          Generando PDF...
        </div>
        <div className="pdf-success-message" style={{ display: isComplete ? 'block' : 'none' }}>
          ¡PDF generado con éxito!
        </div>
      </div>
    </div>
  );
};

export default PdfGenerationAnimation;