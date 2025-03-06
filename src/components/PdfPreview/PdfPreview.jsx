import React, { useState, useEffect, useRef } from 'react';
import './PdfPreview.css';

/**
 * Componente de vista previa de PDF utilizando iframe en lugar de react-pdf
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.formData - Datos del formulario para generar el PDF
 * @param {boolean} props.isOpen - Controla si el modal está abierto
 * @param {Function} props.onClose - Función para cerrar el modal
 * @param {Function} props.onConfirm - Función para confirmar y generar el PDF final
 */
const PdfPreview = ({ formData, isOpen, onClose, onConfirm }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const modalRef = useRef(null);
  const iframeRef = useRef(null);

  // Generar una vista previa del PDF con los datos del formulario
  useEffect(() => {
    if (!isOpen) return;

    const generatePreview = async () => {
      setLoading(true);
      setError(null);
      setPdfUrl(null);

      try {
        console.log('Enviando solicitud para vista previa...');
        
        // Crear FormData para enviar como multipart/form-data
        const formDataObj = new FormData();
        Object.keys(formData).forEach(key => {
          formDataObj.append(key, formData[key]);
        });

        // Generamos una URL única para evitar problemas de caché
        const timestamp = new Date().getTime();
        const previewUrl = `https://backend-cambio-corte.vercel.app/preview-pdf?t=${timestamp}`;

        // Configurar el iframe tras un breve retraso
        setTimeout(() => {
          setLoading(false);
          setPdfUrl(previewUrl);
        }, 500);
      } catch (err) {
        console.error('Error al preparar vista previa:', err);
        setError(err.message || 'Error al generar la vista previa');
        setLoading(false);
      }
    };

    generatePreview();
  }, [isOpen, formData]);

  // Manejar el clic fuera del modal para cerrarlo
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

  // Función para enviar datos al iframe
  const submitFormToIframe = () => {
    if (iframeRef.current) {
      const form = document.createElement('form');
      form.method = 'POST';
      form.target = 'previewFrame';
      form.action = 'https://backend-cambio-corte.vercel.app/preview-pdf';
      form.style.display = 'none';

      Object.keys(formData).forEach(key => {
        if (formData[key]) {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = formData[key];
          form.appendChild(input);
        }
      });

      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);
    }
  };

  // Iniciar el envío del formulario cuando el iframe está listo
  useEffect(() => {
    if (isOpen && iframeRef.current) {
      submitFormToIframe();
    }
  }, [isOpen, iframeRef.current]);

  if (!isOpen) return null;

  return (
    <div className="pdf-preview-overlay">
      <div className="pdf-preview-modal" ref={modalRef}>
        <div className="pdf-preview-header">
          <h2>Vista Previa de la Moción</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="pdf-preview-content">
          {loading && (
            <div className="loading-indicator">
              <div className="spinner"></div>
              <p>Generando vista previa...</p>
            </div>
          )}

          {error && (
            <div className="error-message">
              <p>❌ {error}</p>
              <button onClick={onClose}>Cerrar</button>
            </div>
          )}

          {!loading && !error && (
            <div className="iframe-container">
              <iframe
                name="previewFrame"
                ref={iframeRef}
                title="Vista Previa PDF"
                className="pdf-iframe"
                onLoad={() => setLoading(false)}
                onError={() => setError('Error al cargar el PDF')}
              />
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