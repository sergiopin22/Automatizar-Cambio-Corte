import React, { useState, useRef, useEffect } from 'react';
import './PdfPreview.css';

/**
 * Componente de vista previa de PDF utilizando un formulario HTML real e iframe
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.formData - Datos del formulario para generar el PDF
 * @param {boolean} props.isOpen - Controla si el modal está abierto
 * @param {Function} props.onClose - Función para cerrar el modal
 * @param {Function} props.onConfirm - Función para confirmar y generar el PDF final
 */
const PdfPreview = ({ formData, isOpen, onClose, onConfirm }) => {
  const [loading, setLoading] = useState(true);
  const modalRef = useRef(null);
  const formRef = useRef(null);
  const iframeRef = useRef(null);

  // Efecto para enviar el formulario cuando se abre el modal
  useEffect(() => {
    if (isOpen && formRef.current) {
      console.log('Enviando formulario para vista previa...');
      // Pequeño retraso para asegurar que el formulario esté listo
      setTimeout(() => {
        formRef.current.submit();
      }, 500);
    }
  }, [isOpen]);

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

  // Manejar la carga del iframe
  const handleIframeLoad = () => {
    console.log('Iframe cargado');
    setLoading(false);
    
    // Verificar si hay error en el iframe
    try {
      if (iframeRef.current) {
        const iframeContent = iframeRef.current.contentWindow.document.body.textContent;
        if (iframeContent && iframeContent.includes('error')) {
          console.error('Error detectado en el iframe:', iframeContent);
          setLoading(false);
        }
      }
    } catch (err) {
      // Ignora errores CORS al intentar acceder al contenido del iframe
      console.log('No se puede verificar el contenido del iframe debido a restricciones CORS');
    }
  };

  // Manejador de error para el iframe
  const handleIframeError = () => {
    console.error('Error al cargar el iframe');
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
          {loading && (
            <div className="loading-indicator">
              <div className="spinner"></div>
              <p>Generando vista previa...</p>
            </div>
          )}

          {/* Formulario oculto para enviar datos al iframe */}
          <form
            ref={formRef}
            action="https://backend-cambio-corte.vercel.app/preview-pdf"
            method="post"
            target="pdf-frame"
            style={{ display: 'none' }}
          >
            {/* Convertir cada propiedad de formData en un input hidden */}
            {Object.entries(formData).map(([key, value]) => (
              <input key={key} type="hidden" name={key} value={value || ''} />
            ))}
          </form>

          {/* iframe para mostrar el PDF */}
          <iframe
            ref={iframeRef}
            name="pdf-frame"
            className="pdf-iframe"
            title="Vista Previa del PDF"
            onLoad={handleIframeLoad}
            onError={handleIframeError}
          ></iframe>
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