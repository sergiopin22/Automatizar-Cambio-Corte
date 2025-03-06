import React, { useState, useEffect, useRef } from 'react';
import './PdfPreview.css';

const PdfPreview = ({ formData, isOpen, onClose, onConfirm }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  // Generar la URL de vista previa
  const generatePreviewUrl = async () => {
    setLoading(true);
    setError(null);

    try {
      // Crear y enviar formulario directamente para obtener el PDF
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = 'https://backend-cambio-corte.vercel.app/preview-pdf';
      form.target = '_blank'; // Abrir en nueva pestaña
      form.style.display = 'none';

      // Agregar todos los campos del formulario
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = value.toString();
          form.appendChild(input);
        }
      });

      // Añadir el formulario al documento y enviarlo
      document.body.appendChild(form);
      
      // Ya no necesitamos el indicador de carga
      setLoading(false);
      
      return form;
    } catch (err) {
      console.error('Error preparando formulario:', err);
      setError('Error al preparar vista previa');
      setLoading(false);
      return null;
    }
  };

  // Manejar la apertura del PDF en una nueva ventana
  const handleOpenPreview = async () => {
    const form = await generatePreviewUrl();
    if (form) {
      form.submit();
      document.body.removeChild(form);
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

        <div className="pdf-preview-content simplified">
          {loading ? (
            <div className="loading-indicator">
              <div className="spinner"></div>
              <p>Preparando vista previa...</p>
            </div>
          ) : error ? (
            <div className="error-message">
              <p>❌ {error}</p>
            </div>
          ) : (
            <div className="preview-instructions">
              <p>Para visualizar la vista previa del documento PDF:</p>
              <button 
                className="preview-button" 
                onClick={handleOpenPreview}
              >
                Abrir Vista Previa
              </button>
              <p className="info-text">
                Esto abrirá tu documento en una nueva pestaña. 
                Una vez revisado, puedes cerrarla y regresar a esta ventana.
              </p>
            </div>
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