import React, { useState, useRef } from 'react';
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

  // Función para abrir vista previa directamente
  const openPreviewDirectly = () => {
    setLoading(true);
    
    // Verificar campos obligatorios
    if (!formData.name || !formData.aNumber || !formData.streetAddress) {
      alert("Por favor, complete los campos obligatorios: Nombre, Número A y Dirección");
      setLoading(false);
      return;
    }
    
    // Crear formulario para enviar
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://backend-cambio-corte.vercel.app/preview-pdf';
    form.target = '_blank';
    form.style.display = 'none';
    
    // Agregar explícitamente los campos obligatorios primero
    const requiredFields = {
      name: formData.name || '',
      aNumber: formData.aNumber || '',
      streetAddress: formData.streetAddress || ''
    };
    
    // Agregar campos obligatorios
    Object.entries(requiredFields).forEach(([key, value]) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = value;
      form.appendChild(input);
    });
    
    // Agregar el resto de campos
    Object.entries(formData).forEach(([key, value]) => {
      // Saltarse los campos obligatorios ya agregados
      if (key !== 'name' && key !== 'aNumber' && key !== 'streetAddress') {
        if (value !== undefined && value !== null) {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = value.toString();
          form.appendChild(input);
        }
      }
    });
    
    // Agregar formulario al documento y enviarlo
    document.body.appendChild(form);
    form.submit();
    
    // Limpiar
    setTimeout(() => {
      document.body.removeChild(form);
      setLoading(false);
    }, 1000);
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