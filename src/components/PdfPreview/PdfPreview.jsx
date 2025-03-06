import React, { useState, useEffect, useRef } from 'react';
import './PdfPreview.css';

const PdfPreview = ({ formData, isOpen, onClose, onConfirm }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);
  const modalRef = useRef(null);

  // Efecto para generar la vista previa cuando se abre el modal
  useEffect(() => {
    if (!isOpen) return;
    
    const generatePreview = async () => {
      setLoading(true);
      setError(null);
      setDebugInfo(null);
      
      try {
        // Mostrar los datos que se enviarán para depuración
        console.log("Datos a enviar:", formData);
        setDebugInfo(JSON.stringify(formData, null, 2));
        
        const formDataObj = new FormData();
        
        // Asegurarnos de que los campos requeridos no sean undefined o null
        formDataObj.append('name', formData.name || '');
        formDataObj.append('aNumber', formData.aNumber || '');
        formDataObj.append('streetAddress', formData.streetAddress || '');
        
        // Añadir el resto de campos
        Object.entries(formData).forEach(([key, value]) => {
          if (key !== 'name' && key !== 'aNumber' && key !== 'streetAddress') {
            formDataObj.append(key, value || '');
          }
        });
        
        const response = await fetch('https://backend-cambio-corte.vercel.app/preview-pdf', {
          method: 'POST',
          body: formDataObj
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error ${response.status}: ${errorText}`);
        }
        
        // Si llegamos aquí, el PDF se ha generado correctamente
        // Redirigir a una nueva pestaña para ver el PDF
        window.open('https://backend-cambio-corte.vercel.app/preview-pdf', '_blank');
        setLoading(false);
        
      } catch (err) {
        console.error("Error al generar vista previa:", err);
        setError(err.message);
        setLoading(false);
      }
    };
    
    generatePreview();
  }, [isOpen, formData]);

  // Handler para clic fuera del modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="pdf-preview-overlay">
      <div className="pdf-preview-modal" ref={modalRef}>
        <div className="pdf-preview-header">
          <h2>Vista Previa de la Moción</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="pdf-preview-content">
          {loading ? (
            <div className="loading-indicator">
              <div className="spinner"></div>
              <p>Preparando vista previa...</p>
            </div>
          ) : error ? (
            <div className="error-message">
              <h3>Error al generar la vista previa:</h3>
              <p>{error}</p>
              <div className="debug-info">
                <h4>Datos enviados:</h4>
                <pre>{debugInfo}</pre>
              </div>
              <button onClick={() => window.open('https://backend-cambio-corte.vercel.app/preview-pdf', '_blank')}>
                Intentar ver vista previa directamente
              </button>
            </div>
          ) : (
            <div className="success-message">
              <p>La vista previa se ha abierto en una nueva pestaña.</p>
              <button onClick={() => window.open('https://backend-cambio-corte.vercel.app/preview-pdf', '_blank')}>
                Abrir vista previa de nuevo
              </button>
            </div>
          )}
        </div>

        <div className="pdf-preview-footer">
          <p className="watermark-notice">
            <strong>Nota:</strong> Esta es solo una vista previa. El documento final no tendrá la marca de agua.
          </p>
          <div className="button-group">
            <button className="cancel-button" onClick={onClose}>Cancelar</button>
            <button className="confirm-button" onClick={onConfirm}>
              Generar PDF Final
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PdfPreview;