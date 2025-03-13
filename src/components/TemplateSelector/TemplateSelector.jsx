// components/TemplateSelector/TemplateSelector.jsx
import React from 'react';
import './TemplateSelector.css';

function TemplateSelector({ onChange, isEnabled = true }) {
  if (!isEnabled) {
    return (
      <div className="form-field template-info">
        <div className="template-info-message">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <span>Complete todos los campos obligatorios para habilitar las plantillas para la razón de cambio</span>
        </div>
      </div>
    );
  }

  return (
    <div className="form-field template-selector">
      <label>Seleccione una plantilla para la razón del cambio:</label>
      <select 
        name="reasonTemplate" 
        onChange={onChange}
      >
        <option value="">-- Seleccionar una plantilla --</option>
        <option value="1">Distancia y dificultad económica</option>
        <option value="2">Cambio de residencia</option>
        <option value="3">Razones familiares</option>
      </select>
    </div>
  );
}

export default React.memo(TemplateSelector);