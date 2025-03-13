// components/FormSections/FormSection.jsx
import React from 'react';
import './FormSection.css';
import ProgressBar from '../ProgressBar/ProgressBar';

function FormSection({ title, children, progress, isCompleted = false }) {
  return (
    <div className={`form-section ${isCompleted ? 'completed' : ''}`}>
      <ProgressBar progress={progress} />
      <h2>{title}</h2>
      {children}
    </div>
  );
}

export default React.memo(FormSection);