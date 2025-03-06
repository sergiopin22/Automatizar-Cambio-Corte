import React, { useState, useEffect, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import './PdfPreview.css'; // Archivo CSS para estilos específicos

// Configuración necesaria para react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

/**
 * Componente de vista previa de PDF con marca de agua
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.formData - Datos del formulario para generar el PDF
 * @param {boolean} props.isOpen - Controla si el modal está abierto
 * @param {Function} props.onClose - Función para cerrar el modal
 * @param {Function} props.onConfirm - Función para confirmar y generar el PDF final
 */
const PdfPreview = ({ formData, isOpen, onClose, onConfirm }) => {
  const [pdfBlob, setPdfBlob] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const modalRef = useRef(null);

  // Generar una vista previa del PDF con los datos del formulario
  useEffect(() => {
    if (!isOpen) return;

    const generatePreview = async () => {
      setLoading(true);
      setError(null);

      try {
        // Llamada al endpoint de vista previa (versión con marca de agua)
        const response = await fetch('https://backend-cambio-corte.vercel.app/preview-pdf', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error(`Error al generar la vista previa (${response.status})`);
        }

        const blob = await response.blob();
        setPdfBlob(URL.createObjectURL(blob));
      } catch (err) {
        console.error('Error en la vista previa del PDF:', err);
        setError(err.message || 'Error al generar la vista previa del PDF');
      } finally {
        setLoading(false);
      }
    };

    generatePreview();

    // Limpieza al desmontar
    return () => {
      if (pdfBlob) {
        URL.revokeObjectURL(pdfBlob);
      }
    };
  }, [isOpen, formData]);

  // Manejar el click fuera del modal para cerrarlo
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

  // Manejar el cambio de página en el PDF
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
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

          {error && (
            <div className="error-message">
              <p>❌ {error}</p>
              <button onClick={onClose}>Cerrar</button>
            </div>
          )}

          {pdfBlob && !loading && !error && (
            <Document
              file={pdfBlob}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={(error) => setError('Error al cargar el PDF: ' + error.message)}
              loading={<div className="loading-pdf">Cargando documento...</div>}
            >
              {Array.from(new Array(numPages), (el, index) => (
                <div key={`page_${index + 1}`} className="pdf-page-container">
                  <Page
                    key={`page_${index + 1}`}
                    pageNumber={index + 1}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                    scale={1.2}
                  />
                </div>
              ))}
            </Document>
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