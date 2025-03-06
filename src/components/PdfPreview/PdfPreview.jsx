import React, { useState, useRef, useEffect } from 'react';
import './PdfPreview.css';

const PdfPreview = ({ formData, isOpen, onClose, onConfirm }) => {
  const [loading, setLoading] = useState(false);
  const modalRef = useRef(null);

  // Manejar clic fuera del modal para cerrarlo
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

  // Función para abrir la vista previa del PDF directamente
  const openPreviewDirectly = () => {
    setLoading(true);

    try {
      // Construir una URL con todos los parámetros del formulario
      const url = new URL("https://backend-cambio-corte.vercel.app/preview-pdf");
      
      // Añadir todos los campos del formulario como parámetros
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          url.searchParams.append(key, value);
        }
      });

      // Añadir un timestamp para evitar caching
      url.searchParams.append('timestamp', Date.now().toString());
      
      // Abrir en una nueva pestaña
      window.open(url.toString(), '_blank');
    } catch (error) {
      console.error("Error al generar URL de vista previa:", error);
    }

    setLoading(false);
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
          <div className="preview-message">
            <h3>Previsualización de Documento</h3>
            <p>Para ver la vista previa de su documento de moción completo:</p>
            <button 
              className="preview-button" 
              onClick={openPreviewDirectly}
              disabled={loading}
            >
              {loading ? "Cargando..." : "Ver Vista Previa"}
            </button>
            <p className="instructions">
              Se abrirá una nueva pestaña con el documento. 
              Una vez revisado, puede regresar aquí para generar la versión final.
            </p>
          </div>
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