import React, { useEffect, useMemo, useCallback, useState } from 'react';
import { usStates } from './data/usStates';
import PdfGenerationAnimation from './components/PdfGenerationAnimation/PdfGenerationAnimation';

// Componentes reutilizables
import InputField from './components/FormFields/InputField';
import SelectField from './components/FormFields/SelectField';
import TextAreaField from './components/FormFields/TextAreaField';
import FormSection from './components/FormSections/FormSection';
import TemplateSelector from './components/TemplateSelector/TemplateSelector';
import DependentField from './components/FormFields/DependentField';

// Hooks personalizados
import { useFormData } from './hooks/useFormData';
import { useCourtData } from './hooks/useCourtData';
import { useSectionProgress } from './hooks/useSectionProgress';
import { useTemplateText } from './hooks/useTemplateText';
import { usePdfGeneration } from './hooks/usePdfGeneration';

function MotionForm({ titulo = "FORMULARIO DE MOCIÓN PARA CAMBIO DE CORTE" }) {
  // Estado inicial del formulario
  const initialFormState = {
    // Información Personal
    name: '',
    aNumber: '',
    streetAddress: '',
    city: '',
    postalCode: '',
    residenceState: '',
    
    // Corte Actual
    currentCourtState: '',
    currentCourt: '',
    cityStateCurrentCourt: '',
    oplaOffice: '',
    judgeName: '',
    hearingDate: '',
    
    // Nueva Corte
    newCourtState: '',
    newCourt: '',
    cityStateFutureCourt: '',
    motionDate: '',
    
    // Información Adicional
    hearingTime: '',
    reason: '',
    submissionDate: new Date().toISOString().split('T')[0], // Inicializar con la fecha actual
    deliveryMethod: '',

    // Dependientes - comenzar con array vacío
    dependents: []
  };

  // Estado para rastrear dependientes no guardados
  const [unsavedDependents, setUnsavedDependents] = useState([]);

  // Hooks personalizados
  const { 
    formData, 
    handleChange, 
    handleBlur, 
    updateFormData, 
    cleanedFormData 
  } = useFormData(initialFormState);
  
  const { 
    getCourtsByState, 
    getCityStateInfoByCourt, 
    getOplaOfficeByCourt, 
    getJudgesByCourt, 
    statesWithCourts 
  } = useCourtData();
  
  // Definir las secciones para calcular el progreso
  const sections = useMemo(() => ({
    personalInfo: ['name', 'aNumber', 'streetAddress', 'city', 'residenceState', 'postalCode'],
    dependents: [], // No requiere campos obligatorios, pero calculamos el progreso
    currentCourt: ['currentCourtState', 'currentCourt', 'judgeName', 'hearingDate', 'hearingTime'],
    newCourt: ['newCourtState', 'newCourt', 'motionDate'],
    additionalInfo: ['submissionDate', 'deliveryMethod', 'reason']
  }), []);
  
  const sectionProgress = useSectionProgress(formData, sections);
  const getTemplateText = useTemplateText(formData);
  const { showAnimation, setShowAnimation, generatePdf } = usePdfGeneration();
  
  // Definir los campos requeridos
  const requiredFields = useMemo(() => [
    'name', 'aNumber', 'streetAddress', 'city', 'residenceState', 'postalCode',
    'currentCourtState', 'currentCourt', 'newCourtState', 'newCourt',
  ], []);
  
  // Verificar si todos los campos requeridos están completos
  const areRequiredFieldsComplete = useCallback(() => {
    return !requiredFields.some(field => 
      !formData[field] || (typeof formData[field] === 'string' && formData[field].trim() === '')
    );
  }, [formData, requiredFields]);
  
  // Manejadores específicos para los selectores de cortes
  const handleCurrentCourtChange = useCallback((e) => {
    const selectedCourt = e.target.value;
    updateFormData({
      currentCourt: selectedCourt,
      cityStateCurrentCourt: getCityStateInfoByCourt(formData.currentCourtState, selectedCourt),
      oplaOffice: getOplaOfficeByCourt(formData.currentCourtState, selectedCourt),
      judgeName: '', // Se limpia el juez al cambiar la corte
    });
  }, [formData.currentCourtState, getCityStateInfoByCourt, getOplaOfficeByCourt, updateFormData]);

  const handleNewCourtChange = useCallback((e) => {
    const selectedCourt = e.target.value;
    updateFormData({
      newCourt: selectedCourt,
      cityStateFutureCourt: getCityStateInfoByCourt(formData.newCourtState, selectedCourt)
    });
  }, [formData.newCourtState, getCityStateInfoByCourt, updateFormData]);

  // Manejo de plantillas de razón
  const handleReasonTemplateChange = useCallback((e) => {
    const templateId = parseInt(e.target.value);
    if (!templateId) return;
    
    const templateText = getTemplateText(templateId);
    updateFormData({ reason: templateText });
  }, [getTemplateText, updateFormData]);

  // Función para marcar un dependiente como guardado o no guardado
  const setDependentSaveStatus = useCallback((index, isSaved) => {
    setUnsavedDependents(prev => {
      const newStatus = [...prev];
      if (isSaved) {
        // Eliminar este índice de dependientes no guardados
        return newStatus.filter(idx => idx !== index);
      } else if (!newStatus.includes(index)) {
        // Agregar este índice a dependientes no guardados
        return [...newStatus, index];
      }
      return newStatus;
    });
  }, []);

  // Función para manejar el estado de guardado de los dependientes
  const handleDependentSave = useCallback((index, isSaved) => {
    setDependentSaveStatus(index, isSaved);
  }, [setDependentSaveStatus]);

  // Funciones para manejar dependientes
  const handleDependentChange = useCallback((index, name, value) => {
    // Crea una copia profunda del array de dependientes
    const newDependents = JSON.parse(JSON.stringify(formData.dependents));
    
    // Asegúrate de que existe el objeto para este índice
    if (!newDependents[index]) {
      newDependents[index] = {};
    }
    
    // Actualiza el valor específico
    newDependents[index][name] = value;
    
    // Actualiza el estado
    updateFormData({
      dependents: newDependents
    });
  }, [formData.dependents, updateFormData]);

  // Función modificada para agregar un dependiente
  const addDependent = useCallback(() => {
    // Verificar si hay dependientes no guardados
    if (unsavedDependents.length > 0) {
      alert("Por favor guarde el dependiente actual antes de agregar uno nuevo.");
      return;
    }
    
    if (formData.dependents.length < 3) {
      const newIndex = formData.dependents.length;
      
      updateFormData({
        dependents: [
          ...formData.dependents,
          { name: '', aNumber: '' }
        ]
      });
      
      // Marcar el nuevo dependiente como no guardado
      setDependentSaveStatus(newIndex, false);
    }
  }, [formData.dependents, updateFormData, unsavedDependents, setDependentSaveStatus]);

  // Función modificada para eliminar un dependiente
  const removeDependent = useCallback((index) => {
    // Eliminar el dependiente
    updateFormData({
      dependents: formData.dependents.filter((_, i) => i !== index)
    });
    
    // Actualizar los índices en unsavedDependents
    setUnsavedDependents(prev => {
      const newUnsaved = prev.filter(idx => idx !== index)
        .map(idx => idx > index ? idx - 1 : idx);
      return newUnsaved;
    });
  }, [formData.dependents, updateFormData]);

  // Verifica si hay dependientes no guardados
  const hasUnsavedDependents = unsavedDependents.length > 0;

  // Efecto para actualizar información relacionada con la corte actual
  useEffect(() => {
    if (formData.currentCourtState && formData.currentCourt) {
      updateFormData({
        cityStateCurrentCourt: getCityStateInfoByCourt(formData.currentCourtState, formData.currentCourt),
        oplaOffice: getOplaOfficeByCourt(formData.currentCourtState, formData.currentCourt)
      });
    }
  }, [formData.currentCourtState, formData.currentCourt, getCityStateInfoByCourt, getOplaOfficeByCourt, updateFormData]);

  // Efecto para actualizar información relacionada con la nueva corte
  useEffect(() => {
    if (formData.newCourtState && formData.newCourt) {
      updateFormData({
        cityStateFutureCourt: getCityStateInfoByCourt(formData.newCourtState, formData.newCourt)
      });
    }
  }, [formData.newCourtState, formData.newCourt, getCityStateInfoByCourt, updateFormData]);

  // Manejar envío del formulario
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    // Verificar si hay dependientes no guardados
    if (hasUnsavedDependents) {
      alert("Por favor guarde todos los dependientes antes de generar el PDF.");
      return;
    }
    
    // Crear una copia limpia de los datos
    const formDataToSend = {...cleanedFormData};
    
    // Filtrar dependientes vacíos
    formDataToSend.dependents = formDataToSend.dependents.filter(
      dep => dep.name.trim() !== '' || dep.aNumber.trim() !== ''
    );
    
    await generatePdf(formDataToSend);
  }, [cleanedFormData, generatePdf, hasUnsavedDependents]);

  // Verificar campos requeridos
  const requiredFieldsComplete = useMemo(() => areRequiredFieldsComplete(), 
    [areRequiredFieldsComplete]);

  return (
    <div className="container">
      <h1>{titulo}</h1>
      
      <form onSubmit={handleSubmit}>
        {/* Sección: Información Personal */}
        <FormSection 
          title="Información Personal" 
          progress={sectionProgress.personalInfo}
          isCompleted={sectionProgress.personalInfo === 100}
        >
          <InputField 
            label="Nombre Completo"
            name="name" 
            value={formData.name} 
            onChange={handleChange}
            onBlur={handleBlur} 
            required 
            placeholder="Nombre completo"
          />
          
          <InputField 
            label="Número A"
            name="aNumber" 
            value={formData.aNumber} 
            onChange={handleChange}
            onBlur={handleBlur} 
            required 
            placeholder="Ej: 123456789"
          />
          
          <InputField 
            label="Dirección"
            name="streetAddress" 
            value={formData.streetAddress} 
            onChange={handleChange}
            onBlur={handleBlur} 
            required 
            placeholder="Dirección completa"
          />
          
          <InputField 
            label="Ciudad de Residencia"
            name="city" 
            value={formData.city} 
            onChange={handleChange}
            onBlur={handleBlur} 
            required 
            placeholder="Ciudad donde vive"
          />
          
          <SelectField 
            label="Estado de Residencia"
            name="residenceState" 
            value={formData.residenceState} 
            onChange={handleChange} 
            options={usStates}
            required
            placeholder="Selecciona un estado"
          />
          
          <InputField 
            label="Código Postal"
            name="postalCode" 
            value={formData.postalCode} 
            onChange={handleChange}
            onBlur={handleBlur} 
            required 
            placeholder="Ej: 90210"
          />
        </FormSection>
        
        {/* Sección de Dependientes - Movida después de Información Personal */}
        <FormSection 
          title="Dependientes (opcional)" 
          progress={sectionProgress.dependents || 0}
          isCompleted={sectionProgress.dependents === 100}
        >
          <div className="dependents-info">
            <p className="dependents-description">
              Agregue hasta 3 dependientes adicionales que serán incluidos en la moción.
            </p>
            
            {formData.dependents.length > 0 ? (
              formData.dependents.map((dependent, index) => (
                <DependentField 
                  key={index}
                  index={index}
                  dependent={dependent}
                  onChange={handleDependentChange}
                  onRemove={removeDependent}
                  onSaveStatus={handleDependentSave}
                />
              ))
            ) : (
              <p className="no-dependents-message">
                No hay dependientes agregados. Puede agregar hasta 3 dependientes si es necesario.
              </p>
            )}
            
            {formData.dependents.length < 3 && (
              <button 
                type="button" 
                className={`add-dependent-btn no-icon ${hasUnsavedDependents ? 'disabled-btn' : ''}`}
                onClick={addDependent}
                disabled={hasUnsavedDependents}
                title={hasUnsavedDependents ? "Guarde el dependiente actual antes de agregar uno nuevo" : ""}
              >
                AGREGAR {formData.dependents.length === 0 ? 'DEPENDIENTE' : 'OTRO DEPENDIENTE'}
              </button>
            )}
          </div>
        </FormSection>
        
        {/* Sección: Corte Actual */}
        <FormSection 
          title="Corte Actual" 
          progress={sectionProgress.currentCourt}
          isCompleted={sectionProgress.currentCourt === 100}
        >
          <SelectField 
            label="Estado de la Corte Actual"
            name="currentCourtState" 
            value={formData.currentCourtState} 
            onChange={handleChange} 
            options={statesWithCourts}
            required
            placeholder="Selecciona un estado"
          />
          
          <SelectField 
            label="Corte Actual"
            name="currentCourt" 
            value={formData.currentCourt} 
            onChange={handleCurrentCourtChange} 
            options={getCourtsByState(formData.currentCourtState).map(court => court.name)}
            required
            placeholder="Selecciona una corte"
          />
          
          <InputField 
            label="Ciudad y Estado de la Corte Actual"
            name="cityStateCurrentCourt" 
            value={formData.cityStateCurrentCourt} 
            readOnly={true}
          />
          
          <InputField 
            label="Oficina de OPLA"
            name="oplaOffice" 
            value={formData.oplaOffice} 
            readOnly={true}
          />
          
          <SelectField 
            label="Juez Actual"
            name="judgeName" 
            value={formData.judgeName} 
            onChange={handleChange} 
            options={getJudgesByCourt(formData.currentCourtState, formData.currentCourt)}
            required
            placeholder="Selecciona un juez"
          />
          
          <InputField 
            label="Fecha de la Audiencia Actual"
            name="hearingDate" 
            value={formData.hearingDate} 
            onChange={handleChange} 
            required
            type="date"
          />
          
          <InputField 
            label="Hora de la Audiencia"
            name="hearingTime" 
            value={formData.hearingTime} 
            onChange={handleChange} 
            required
            type="time"
          />
        </FormSection>
        
        {/* Sección: Nueva Corte */}
        <FormSection 
          title="Nueva Corte" 
          progress={sectionProgress.newCourt}
          isCompleted={sectionProgress.newCourt === 100}
        >
          <SelectField 
            label="Estado de la Nueva Corte"
            name="newCourtState" 
            value={formData.newCourtState} 
            onChange={handleChange} 
            options={statesWithCourts}
            required
            placeholder="Selecciona un estado"
          />
          
          <SelectField 
            label="Nueva Corte"
            name="newCourt" 
            value={formData.newCourt} 
            onChange={handleNewCourtChange} 
            options={getCourtsByState(formData.newCourtState).map(court => court.name)}
            required
            placeholder="Selecciona una corte"
          />
          
          <InputField 
            label="Ciudad y Estado de la Nueva Corte"
            name="cityStateFutureCourt" 
            value={formData.cityStateFutureCourt} 
            readOnly={true}
          />
          
          <InputField 
            label="Fecha de Presentación de la Moción"
            name="motionDate" 
            value={formData.motionDate} 
            onChange={handleChange} 
            required
            type="date"
          />
        </FormSection>
        
        {/* Sección: Información Adicional */}
        <FormSection 
          title="Información Adicional" 
          progress={sectionProgress.additionalInfo}
          isCompleted={sectionProgress.additionalInfo === 100}
        >
          <InputField 
            label="Fecha de Envío"
            name="submissionDate" 
            value={formData.submissionDate} 
            onChange={handleChange} 
            required
            type="date"
          />
          
          <SelectField 
            label="Método de Entrega"
            name="deliveryMethod" 
            value={formData.deliveryMethod} 
            onChange={handleChange} 
            options={[
              { value: "Hand Delivery", label: "Entrega en Mano" },
              { value: "Priority Mail", label: "Correo Prioritario" },
              { value: "Priority Express", label: "Correo Express" }
            ]}
            required
            placeholder="Selecciona un método"
          />
        </FormSection>
        
        {/* Selector de plantillas condicional */}
        <TemplateSelector 
          onChange={handleReasonTemplateChange} 
          isEnabled={requiredFieldsComplete}
        />
        
        <TextAreaField 
          label="Razón del Cambio"
          name="reason" 
          value={formData.reason} 
          onChange={handleChange}
          onBlur={handleBlur}
          required 
          placeholder="Explica el motivo para solicitar el cambio de corte"
          rows={8}
          style={{ 
            whiteSpace: 'pre-line',
            color: '#ffffff', 
            backgroundColor: '#1e2b3a'
          }}
        />
        
        <button type="submit">Generar PDF</button>
      </form>
      
      {/* Componente de animación de generación de PDF */}
      <PdfGenerationAnimation 
        isActive={showAnimation} 
        onComplete={() => setShowAnimation(false)}
      />
    </div>
  );
}

export default MotionForm;