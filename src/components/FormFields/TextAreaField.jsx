// components/FormFields/TextAreaField.jsx
import React from 'react';
import './TextAreaField.css';

function TextAreaField({ label, name, value, onChange, onBlur, required = false, placeholder = "", rows = 4, style = {} }) {
  return (
    <div className={`form-field ${value ? 'reason-field-active' : ''}`}>
      <label>{label}{required && <span className="required">*</span>}</label>
      <textarea 
        name={name} 
        value={value} 
        onChange={onChange}
        onBlur={onBlur}
        required={required} 
        placeholder={placeholder}
        rows={rows}
        style={style}
      />
    </div>
  );
}

export default React.memo(TextAreaField);