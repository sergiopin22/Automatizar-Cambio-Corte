import React, { useState, useEffect, useRef } from 'react';
import './PdfPreview.css';

/**
 * Componente de vista previa de PDF integrado
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.formData - Datos del formulario para generar el PDF
 * @param {boolean} props.isOpen - Controla si el modal está abierto
 * @param {Function} props.onClose - Función para cerrar el modal
 * @param {Function} props.onConfirm - Función para confirmar y generar el PDF final
 */
const PdfPreview = ({ formData, isOpen, onClose, onConfirm }) => {
  const [loading, setLoading] = useState(true);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [error, setError] = useState(null);
  const modalRef = useRef(null);
  const iframeRef = useRef(null);

  // Generar URL para el iframe cuando se abre el modal
  useEffect(() => {
    if (!isOpen) return;
    
    try {
      setLoading(true);
      
      // Construir URL con parámetros
      const url = new URL("https://backend-cambio-corte.vercel.app/preview-pdf");
      
      // Añadir todos los campos como parámetros
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          url.searchParams.append(key, value);
        }
      });
      
      // Añadir timestamp para evitar caché
      url.searchParams.append('timestamp', Date.now().toString());
      
      setPdfUrl(url.toString());
      setLoading(false);
    } catch (err) {
      console.error("Error al generar URL:", err);
      setError("Error al preparar la vista previa");
      setLoading(false);
    }
  }, [isOpen, formData]);

  // Manejar clic fuera del modal
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

  // Manejar eventos de carga del iframe
  const handleIframeLoad = () => {
    setLoading(false);
  };

  const handleIframeError = () => {
    setError("Error al cargar el PDF. Por favor, inténtelo de nuevo.");
    setLoading(false);
  };

  // Abrir en nueva pestaña como alternativa
  const openInNewTab = () => {
    if (pdfUrl) {
      window.open(pdfUrl, '_blank');
    }
  };

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
              <p>Generando vista previa...</p>
            </div>
          ) : error ? (
            <div className="error-message">
              <h3>Error</h3>
              <p>{error}</p>
              <button onClick={openInNewTab} className="alternate-button">
                Intentar abrir en nueva pestaña
              </button>
            </div>
          ) : (
            <>
              <iframe
                ref={iframeRef}
                src={pdfUrl}
                className="pdf-iframe"
                title="Vista Previa de PDF"
                onLoad={handleIframeLoad}
                onError={handleIframeError}
              ></iframe>
              
              <div className="pdf-actions">
                <button onClick={openInNewTab} className="external-view-button">
                  <span className="icon">↗️</span> Ver en pestaña completa
                </button>
              </div>
            </>
          )}
        </div>

        <div className="pdf-preview-footer">
          <p className="watermark-notice">
            <strong>Nota:</strong> Esta es solo una vista previa. El documento final no tendrá la marca de agua.
          </p>
          <div className="button-group">
            <button className="cancel-button" onClick={onClose}>Cancelar</button>
            <button 
              className="confirm-button" 
              onClick={onConfirm}
              disabled={loading || error}
            >
              Generar PDF Final
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PdfPreview;