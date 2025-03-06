import React, { memo } from 'react';
import './PdfStamp.css';

// Utilizamos memo para evitar re-renders innecesarios
const PdfStamp = memo(() => {
  return (
    <div className="pdf-stamp">
      <div className="pdf-stamp-inner">
        <div className="stamp-text">PRO TRÁMITES</div>
      </div>
    </div>
  );
});

PdfStamp.displayName = 'PdfStamp';

export default PdfStamp;