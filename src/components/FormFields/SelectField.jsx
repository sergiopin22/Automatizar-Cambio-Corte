// components/FormFields/SelectField.jsx
import React from 'react';
import './SelectField.css';

function SelectField({ label, name, value, onChange, options, required = false, placeholder = "Selecciona una opción" }) {
  return (
    <div className="form-field">
      <label>{label}{required && <span className="required">*</span>}</label>
      <select 
        name={name} 
        value={value} 
        onChange={onChange} 
        required={required}
      >
        <option value="">{placeholder}</option>
        {options.map((option, index) => (
          <option key={index} value={typeof option === 'object' ? option.value : option}>
            {typeof option === 'object' ? option.label : option}
          </option>
        ))}
      </select>
    </div>
  );
}

export default React.memo(SelectField);