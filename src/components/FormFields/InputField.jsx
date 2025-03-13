import React from 'react';
import './InputField.css';

function InputField({ label, name, value, onChange, onBlur, required = false, placeholder = "", readOnly = false, type = "text" }) {
  return (
    <div className="form-field">
      <label>{label}{required && <span className="required">*</span>}</label>
      <input 
        type={type} 
        name={name} 
        value={value} 
        onChange={onChange}
        onBlur={onBlur} 
        required={required} 
        placeholder={placeholder}
        readOnly={readOnly}
        className={readOnly ? "readonly-field" : ""}
      />
    </div>
  );
}

export default React.memo(InputField);