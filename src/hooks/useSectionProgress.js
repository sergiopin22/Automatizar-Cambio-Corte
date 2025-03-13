import { useState, useEffect } from 'react';

/**
 * Hook personalizado para calcular el progreso de completitud de cada sección del formulario
 * Ahora incluye soporte para dependientes opcionales
 * 
 * @param {object} formData - Datos del formulario
 * @param {object} sections - Definición de secciones con sus campos
 * @returns {object} Objeto con el progreso de cada sección
 */
export function useSectionProgress(formData, sections) {
  const [sectionProgress, setSectionProgress] = useState({
    personalInfo: 0,
    currentCourt: 0,
    newCourt: 0,
    additionalInfo: 0,
    dependents: 0
  });

  useEffect(() => {
    const newProgress = {};
    
    // Calcular progreso para secciones normales
    Object.keys(sections).forEach(section => {
      // Si es sección de dependientes, tratarla de forma especial
      if (section === 'dependents') {
        if (formData.dependents && formData.dependents.length > 0) {
          // Contamos como campos llenos solo aquellos que tengan al menos un valor
          const totalFields = formData.dependents.length * 2; // 2 campos por dependiente
          let filledFields = 0;
          
          formData.dependents.forEach(dependent => {
            if (dependent.name && dependent.name.trim() !== '') filledFields++;
            if (dependent.aNumber && dependent.aNumber.trim() !== '') filledFields++;
          });
          
          // Si hay al menos un dependiente con algún dato, consideramos progreso
          if (filledFields > 0) {
            newProgress[section] = Math.round((filledFields / totalFields) * 100);
          } else {
            // Si todos están vacíos, mostramos como completo porque es opcional
            newProgress[section] = 100;
          }
        } else {
          // Si no hay dependientes, está completo (es opcional)
          newProgress[section] = 100;
        }
      } else {
        // Procesamiento normal para otras secciones
        const fields = sections[section];
        const filledFields = fields.filter(field => {
          // Campos precompletados pero editables se consideran llenos
          if (field === 'cityStateCurrentCourt' || field === 'cityStateFutureCourt' || field === 'oplaOffice') {
            return formData[field] !== '';
          }
          return formData[field] && formData[field].trim() !== '';
        });
        
        // Calcular porcentaje (redondeado a entero)
        newProgress[section] = Math.round((filledFields.length / fields.length) * 100);
      }
    });
    
    setSectionProgress(newProgress);
  }, [formData, sections]);

  return sectionProgress;
}