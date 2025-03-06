import React, { useState, useEffect, useRef } from 'react';
import './PdfPreview.css';

const PdfPreview = ({ formData, isOpen, onClose, onConfirm }) => {
  const [loading, setLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const modalRef = useRef(null);

  // Generar URL con parámetros
  useEffect(() => {
    if (isOpen) {
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
          ) : pdfUrl ? (
            <iframe 
              src={pdfUrl} 
              className="pdf-iframe" 
              title="Vista Previa de PDF"
            ></iframe>
          ) : (
            <div className="error-message">Error al generar la URL</div>
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