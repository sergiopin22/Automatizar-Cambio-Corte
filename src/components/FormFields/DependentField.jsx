import React, { useState, useEffect } from 'react';
import './DependentField.css';

function DependentField({ index, dependent, onChange, onRemove, onSaveStatus }) {
  const [isEditing, setIsEditing] = useState(
    // Si es un dependiente nuevo o incompleto, comienza en modo edición
    !dependent.name || !dependent.aNumber
  );
  
  // Notificar al componente padre sobre el estado de edición cuando cambia
  useEffect(() => {
    // Si está en modo edición, significa que no está guardado
    if (onSaveStatus) {
      onSaveStatus(index, !isEditing);
    }
  }, [isEditing, index, onSaveStatus]);
  
  // Notificar al componente padre sobre el estado inicial
  useEffect(() => {
    if (onSaveStatus) {
      onSaveStatus(index, !isEditing);
    }
    // Solo ejecutar al montar el componente
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange(index, name, value);
  };
  
  const toggleEdit = () => {
    // Solo permite guardar si ambos campos tienen datos
    if (isEditing && (!dependent.name || !dependent.aNumber)) {
      alert("Debe completar el nombre y número A del dependiente para guardarlo");
      return;
    }
    
    // Cambiar el estado de edición
    setIsEditing(!isEditing);
  };

  return (
    <div className={`dependent-container ${!isEditing ? 'saved-dependent' : ''}`}>
      <div className="dependent-header">
        <h3>Dependiente {index + 1}</h3>
        <div className="dependent-actions">
          {!isEditing && (
            <button 
              type="button" 
              className="edit-dependent-btn no-icon"
              onClick={toggleEdit}
              title="Editar dependiente"
            >
              EDITAR
            </button>
          )}
          <button 
            type="button" 
            className="remove-dependent-btn no-icon"
            onClick={() => onRemove(index)}
            title="Eliminar dependiente"
          >
            ELIMINAR
          </button>
        </div>
      </div>
      
      <div className="dependent-fields">
        <div className="form-field">
          <label>Nombre Completo {<span className="required">*</span>}</label>
          <input 
            type="text"
            name="name"
            value={dependent.name || ''}
            onChange={handleChange}
            required
            placeholder="Nombre completo del dependiente"
            disabled={!isEditing}
            className={!isEditing ? 'readonly-input' : ''}
          />
        </div>
        
        <div className="form-field">
          <label>Número A {<span className="required">*</span>}</label>
          <input 
            type="text"
            name="aNumber"
            value={dependent.aNumber || ''}
            onChange={handleChange}
            required
            placeholder="Ej: 123456789"
            disabled={!isEditing}
            className={!isEditing ? 'readonly-input' : ''}
          />
        </div>
      </div>
      
      {isEditing && (
        <button 
          type="button"
          className={`save-dependent-btn no-icon ${(!dependent.name || !dependent.aNumber) ? 'save-btn-disabled' : ''}`}
          onClick={toggleEdit}
          disabled={!dependent.name || !dependent.aNumber}
        >
          GUARDAR
        </button>
      )}
    </div>
  );
}

export default React.memo(DependentField);