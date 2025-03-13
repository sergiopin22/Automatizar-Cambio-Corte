// hooks/usePdfGeneration.js
import { useState, useCallback, useEffect } from 'react'; // Añade useEffect aquí

export function usePdfGeneration() {
  const [showAnimation, setShowAnimation] = useState(false);
  const [pdfData, setPdfData] = useState(null);

  const generatePdf = useCallback(async (cleanedFormData) => {
    setShowAnimation(true);
    
    try {
      const response = await fetch('https://backend-cambio-corte.vercel.app/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleanedFormData),
      });

      if (!response.ok) throw new Error('Error al generar el PDF');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      setPdfData({
        url,
        filename: 'motion.pdf'
      });
      
      return true;
    } catch (error) {
      console.error('Error en generatePdf:', error);
      alert('Hubo un problema al generar el PDF.');
      setShowAnimation(false);
      return false;
    }
  }, []);

  useEffect(() => {
    const handleDownloadRequest = () => {
      if (pdfData) {
        const a = document.createElement('a');
        a.href = pdfData.url;
        a.download = pdfData.filename;
        a.click();
        
        setPdfData(null);
      }
    };
    
    window.addEventListener('pdfDownloadRequested', handleDownloadRequest);
    
    return () => {
      window.removeEventListener('pdfDownloadRequested', handleDownloadRequest);
    };
  }, [pdfData]);

  return {
    showAnimation,
    setShowAnimation,
    pdfData,
    generatePdf
  };
}