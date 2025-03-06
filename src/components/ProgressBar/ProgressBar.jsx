import React from 'react';
import './ProgressBar.css';

const ProgressBar = ({ progress }) => {
  // Determinar el color basado en el progreso
  const getColor = () => {
    if (progress === 100) {
      return '#45d68a'; // Verde (color de éxito) cuando está completo
    }
    return '#3a69b9'; // Azul mientras está en progreso
  };

  return (
    <div className="progress-bar-container">
      <div 
        className="progress-bar-fill" 
        style={{ 
          width: `${progress}%`, 
          backgroundColor: getColor()
        }}
      />
    </div>
  );
};

export default ProgressBar;