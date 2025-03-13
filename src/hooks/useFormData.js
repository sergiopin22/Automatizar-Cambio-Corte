// hooks/useFormData.js
import { useState, useCallback, useMemo } from 'react';

export function useFormData(initialState) {
  const [formData, setFormData] = useState(initialState);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleBlur = useCallback((e) => {
    const { name, value } = e.target;
    
    if (typeof value === 'string' && value !== value.trim()) {
      setFormData(prev => ({
        ...prev,
        [name]: value.trim()
      }));
    }
  }, []);

  const updateFormData = useCallback((updates) => {
    setFormData(prev => ({
      ...prev,
      ...updates
    }));
  }, []);

  const cleanedFormData = useMemo(() => {
    const cleanedData = {};
    
    Object.keys(formData).forEach(key => {
      const value = formData[key];
      if (key === 'dependents' && Array.isArray(value)) {
        cleanedData[key] = value.map(dep => {
          const cleanDep = {};
          Object.keys(dep).forEach(depKey => {
            cleanDep[depKey] = typeof dep[depKey] === 'string' ? dep[depKey].trim() : dep[depKey];
          });
          return cleanDep;
        });
      } else {
        cleanedData[key] = typeof value === 'string' ? value.trim() : value;
      }
    });
    
    return cleanedData;
  }, [formData]);

  return {
    formData,
    handleChange,
    handleBlur,
    updateFormData,
    cleanedFormData
  };
}