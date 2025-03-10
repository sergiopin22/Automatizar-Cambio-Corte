import React, { useState, useEffect } from 'react';
import courtsData from './data/courts.json';
import { usStates } from './data/usStates'; // Importamos la nueva lista completa de estados
import PdfGenerationAnimation from './components/PdfGenerationAnimation/PdfGenerationAnimation';
import ProgressBar from './components/ProgressBar/ProgressBar';

function MotionForm({ titulo = "FORMULARIO DE MOCIÓN PARA CAMBIO DE CORTE" }) {
  const [formData, setFormData] = useState({
    // Información Personal (6 campos - añadido residenceState)
    name: '',
    aNumber: '',
    streetAddress: '',
    city: '',
    postalCode: '',
    residenceState: '', // Ahora usará la lista completa de estados
    
    // Corte Actual (6 campos)
    currentCourtState: '',
    currentCourt: '',
    cityStateCurrentCourt: '',
    oplaOffice: '',
    judgeName: '',
    hearingDate: '',
    
    // Nueva Corte (4 campos)
    newCourtState: '',
    newCourt: '',
    cityStateFutureCourt: '',
    motionDate: '',
    
    // Información Adicional (5 campos)
    hearingTime: '',
    reason: '',
    submissionDate: '',
    deliveryMethod: '',
  });

  // Estado para controlar la animación de generación de PDF
  const [showAnimation, setShowAnimation] = useState(false);
  // Estado para almacenar temporalmente la URL del PDF
  const [pdfData, setPdfData] = useState(null);
  // Estado para rastrear el progreso de cada sección
  const [sectionProgress, setSectionProgress] = useState({
    personalInfo: 0,
    currentCourt: 0,
    newCourt: 0,
    additionalInfo: 0
  });

  // Función para verificar si todos los campos requeridos están completos
  const areRequiredFieldsComplete = () => {
    // Lista de campos obligatorios para generar una plantilla válida
    const requiredFields = [
      'name', 
      'aNumber', 
      'streetAddress',
      'city', 
      'residenceState', 
      'postalCode',
      'currentCourtState', 
      'currentCourt',
      'newCourtState', 
      'newCourt',
    ];
    
    // Verifica si algún campo requerido está vacío
    return !requiredFields.some(field => 
      !formData[field] || (typeof formData[field] === 'string' && formData[field].trim() === '')
    );
  };

  // Función para calcular el progreso de cada sección
  const calculateSectionProgress = () => {
    // Definir los campos requeridos en cada sección
    const sections = {
      personalInfo: ['name', 'aNumber', 'streetAddress', 'city', 'residenceState', 'postalCode'],
      currentCourt: ['currentCourtState', 'currentCourt', 'judgeName', 'hearingDate', 'hearingTime'],
      newCourt: ['newCourtState', 'newCourt', 'motionDate'],
      additionalInfo: ['submissionDate', 'deliveryMethod', 'reason']
    };

    // Verificar qué campos están completos
    const newProgress = {};
    
    Object.keys(sections).forEach(section => {
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
    });
    
    setSectionProgress(newProgress);
  };

  // Calcular progreso cada vez que formData cambia
  useEffect(() => {
    calculateSectionProgress();
  }, [formData]);

  // Función para manejar cambios en los campos del formulario
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Función para eliminar espacios al inicio y final cuando se sale del campo
  const handleBlur = (e) => {
    const { name, value } = e.target;
    
    // Solo aplicar trim a valores string y si hay espacios al inicio o final
    if (typeof value === 'string' && value !== value.trim()) {
      setFormData(prevData => ({
        ...prevData,
        [name]: value.trim()
      }));
    }
  };

  // Función para manejar el cambio de plantilla de razón
  const handleReasonTemplateChange = (e) => {
    const templateId = parseInt(e.target.value);
    if (!templateId) return;
    
    // Datos para las plantillas - asegurarnos que no tienen espacios extra
    const name = formData.name?.trim() || '[nombre]';
    const aNumber = formData.aNumber?.trim() || '[número A]';
    const currentCourt = formData.currentCourt?.trim() || '[corte actual]';
    const currentCourtState = formData.currentCourtState?.trim() || '[estado actual]';
    const residenceState = formData.residenceState?.trim() || '[estado residencia]';
    const newCourt = formData.newCourt?.trim() || '[nueva corte]';
    const streetAddress = formData.streetAddress?.trim() || '[dirección]';
    const city = formData.city?.trim() || '[ciudad]';
    const postalCode = formData.postalCode?.trim() || '[código postal]';
    
    // Texto según la plantilla seleccionada
    let templateText = "";
    
    if (templateId === 1) {
      templateText = `Yo, ${name}, con el número de caso ${aNumber}, estoy actualmente asignada a la Corte de Inmigración de ${currentCourt}. Sin embargo, resido en el estado de ${residenceState}, lo que hace que sea muy difícil para mí asistir a mis audiencias en ${currentCourtState} debido a la gran distancia. Además, estoy enfrentando dificultades económicas y no cuento con los recursos necesarios para comprar boletos de viaje ni para cubrir los costos asociados con la gestión de mi caso en ${currentCourtState}, que está muy lejos de mi residencia actual en ${residenceState}.

Por lo tanto, respetuosamente solicito que mi caso sea transferido a la ${newCourt}, la cual está mucho más cerca de mi residencia actual y me permitiría asistir a mis audiencias de una manera más factible. Agradezco enormemente su comprensión y asistencia en este asunto.`;
    } else if (templateId === 2) {
      templateText = `Yo, ${name}, con número de caso ${aNumber}, solicito respetuosamente el cambio de mi caso actualmente asignado a la Corte de Inmigración de ${currentCourt} a la ${newCourt}.

El motivo de esta solicitud es que he cambiado mi residencia permanente de ${currentCourtState} a ${residenceState}, lo que hace extremadamente difícil y costoso para mí asistir a las audiencias en mi corte actual.

Mi nueva dirección está ubicada en ${streetAddress}, ${city}, ${residenceState} ${postalCode}, lo que me sitúa mucho más cerca de la ${newCourt}.

Solicito amablemente que consideren esta petición para facilitar mi participación en el proceso migratorio.`;
    } else if (templateId === 3) {
      templateText = `Yo, ${name}, titular del número de caso ${aNumber}, actualmente asignado/a a la Corte de Inmigración de ${currentCourt}, respetuosamente solicito un cambio de sede a la ${newCourt}.

Esta solicitud se basa en razones familiares, ya que toda mi familia inmediata ahora reside en ${residenceState}. Mantener mi caso en ${currentCourtState} representa una carga significativa ya que debo viajar largas distancias para asistir a mis audiencias, separándome de mis responsabilidades familiares.

Mi domicilio actual está en ${streetAddress}, ${city}, ${residenceState} ${postalCode}, y considero que un cambio a la corte solicitada permitiría una gestión más eficiente de mi caso migratorio mientras mantengo mis obligaciones familiares.

Agradezco su consideración a esta solicitud.`;
    }
    
    // Actualiza el estado con una nueva copia
    const newFormData = {...formData};
    newFormData.reason = templateText;
    setFormData(newFormData);
  };

  // Función para limpiar todos los datos antes de enviar el formulario
  const cleanFormData = (data) => {
    const cleanedData = {};
    
    // Recorrer todas las propiedades y aplicar trim a los strings
    Object.keys(data).forEach(key => {
      const value = data[key];
      cleanedData[key] = typeof value === 'string' ? value.trim() : value;
    });
    
    return cleanedData;
  };

  const getCourtsByState = (state) => {
    const stateData = courtsData.find((item) => item.state === state);
    return stateData ? stateData.courts : [];
  };

  // Función para obtener la ciudad y estado de una corte
  const getCityStateInfoByCourt = (state, courtName) => {
    const stateData = courtsData.find((item) => item.state === state);
    const court = stateData?.courts.find((c) => c.name === courtName);
    return court ? `${court.city}, ${stateData.state}` : '';
  };

  const getOplaOfficeByCourt = (state, courtName) => {
    const stateData = courtsData.find((item) => item.state === state);
    const court = stateData?.courts.find((c) => c.name === courtName);
    return court ? court.oplaOffice : '';
  };

  const getJudgesByCourt = (state, courtName) => {
    const stateData = courtsData.find((item) => item.state === state);
    const court = stateData?.courts.find((c) => c.name === courtName);
    return court ? court.judges : [];
  };

  // Obtener la lista de estados que tienen cortes de inmigración
  const getStatesWithCourts = () => {
    return courtsData.map(data => data.state);
  };

  // Efecto para actualizar la información cuando cambia el estado de la corte actual
  useEffect(() => {
    if (formData.currentCourtState && formData.currentCourt) {
      setFormData(prev => ({
        ...prev,
        cityStateCurrentCourt: getCityStateInfoByCourt(prev.currentCourtState, prev.currentCourt),
        oplaOffice: getOplaOfficeByCourt(prev.currentCourtState, prev.currentCourt)
      }));
    }
  }, [formData.currentCourtState, formData.currentCourt]);

  // Efecto para actualizar la información cuando cambia el estado de la nueva corte
  useEffect(() => {
    if (formData.newCourtState && formData.newCourt) {
      setFormData(prev => ({
        ...prev,
        cityStateFutureCourt: getCityStateInfoByCourt(prev.newCourtState, prev.newCourt)
      }));
    }
  }, [formData.newCourtState, formData.newCourt]);

  // Efecto para manejar el evento de animación completa
  useEffect(() => {
    const handleAnimationComplete = () => {
      // Ya no descargamos automáticamente
      // Ahora esperamos a que el usuario haga clic en el botón
    };
    
    window.addEventListener('pdfAnimationComplete', handleAnimationComplete);
    
    return () => {
      window.removeEventListener('pdfAnimationComplete', handleAnimationComplete);
    };
  }, []);

  // Efecto para manejar el evento de solicitud de descarga manual
  useEffect(() => {
    const handleDownloadRequest = () => {
      if (pdfData) {
        // Descargar el PDF cuando se solicita a través del botón
        const a = document.createElement('a');
        a.href = pdfData.url;
        a.download = pdfData.filename;
        a.click();
        
        // Limpiar el estado
        setPdfData(null);
      }
    };
    
    // Agregamos el evento que escuchará cuando se presione el botón de descarga
    window.addEventListener('pdfDownloadRequested', handleDownloadRequest);
    
    // Limpieza al desmontar
    return () => {
      window.removeEventListener('pdfDownloadRequested', handleDownloadRequest);
    };
  }, [pdfData]);

  const handleCurrentCourtChange = (e) => {
    const selectedCourt = e.target.value;
    setFormData(prev => ({
      ...prev,
      currentCourt: selectedCourt,
      cityStateCurrentCourt: getCityStateInfoByCourt(prev.currentCourtState, selectedCourt),
      oplaOffice: getOplaOfficeByCourt(prev.currentCourtState, selectedCourt),
      judgeName: '', // Se limpia el juez al cambiar la corte
    }));
  };

  const handleNewCourtChange = (e) => {
    const selectedCourt = e.target.value;
    setFormData(prev => ({
      ...prev,
      newCourt: selectedCourt,
      cityStateFutureCourt: getCityStateInfoByCourt(prev.newCourtState, selectedCourt)
    }));
  };

  // Función modificada para incluir la limpieza de espacios
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Limpiar todos los datos antes de enviar
    const cleanedFormData = cleanFormData(formData);
    
    // Mostrar la animación de generación de PDF
    setShowAnimation(true);
    
    try {
      const response = await fetch('https://backend-cambio-corte.vercel.app/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleanedFormData), // Usar los datos limpios
      });

      if (!response.ok) throw new Error('Error al generar el PDF');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      // En lugar de descargar inmediatamente, guardamos la URL para descargar después
      setPdfData({
        url,
        filename: 'motion.pdf'
      });
      
    } catch (error) {
      console.error('Error en handleSubmit:', error);
      alert('Hubo un problema al generar el PDF.');
      
      // Cerrar la animación si hay un error
      setShowAnimation(false);
    }
  };

  // Establecer la fecha actual como valor predeterminado para submissionDate
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setFormData(prev => ({
      ...prev,
      submissionDate: today
    }));
  }, []);

  return (
    <div className="container">
      <h1>{titulo}</h1>
      
      <form onSubmit={handleSubmit}>
        {/* Sección: Información Personal */}
        <div className={`form-section ${sectionProgress.personalInfo === 100 ? 'completed' : ''}`}>
          {/* Barra de progreso para esta sección */}
          <ProgressBar progress={sectionProgress.personalInfo} />
          
          <h2>Información Personal</h2>
          
          <div className="form-field">
            <label>Nombre Completo:</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange}
              onBlur={handleBlur} 
              required 
              placeholder="Nombre completo"
            />
          </div>
          
          <div className="form-field">
            <label>Número A:</label>
            <input 
              type="text" 
              name="aNumber" 
              value={formData.aNumber} 
              onChange={handleChange}
              onBlur={handleBlur} 
              required 
              placeholder="Ej: 123456789"
            />
          </div>
          
          <div className="form-field">
            <label>Dirección:</label>
            <input 
              type="text" 
              name="streetAddress" 
              value={formData.streetAddress} 
              onChange={handleChange}
              onBlur={handleBlur} 
              required 
              placeholder="Dirección completa"
            />
          </div>
          
          <div className="form-field">
            <label>Ciudad de Residencia:</label>
            <input 
              type="text" 
              name="city" 
              value={formData.city} 
              onChange={handleChange}
              onBlur={handleBlur} 
              required 
              placeholder="Ciudad donde vive"
            />
          </div>
          
          {/* Actualizado: Campo para estado de residencia con TODOS los estados */}
          <div className="form-field">
            <label>Estado de Residencia:</label>
            <select 
              name="residenceState" 
              value={formData.residenceState} 
              onChange={handleChange} 
              required
            >
              <option value="">Selecciona un estado</option>
              {usStates.map((state, index) => (
                <option key={index} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-field">
            <label>Código Postal:</label>
            <input 
              type="text" 
              name="postalCode" 
              value={formData.postalCode} 
              onChange={handleChange}
              onBlur={handleBlur} 
              required 
              placeholder="Ej: 90210"
            />
          </div>
        </div>
        
        {/* Sección: Corte Actual */}
        <div className={`form-section ${sectionProgress.currentCourt === 100 ? 'completed' : ''}`}>
          {/* Barra de progreso para esta sección */}
          <ProgressBar progress={sectionProgress.currentCourt} />
          
          <h2>Corte Actual</h2>
          
          <div className="form-field">
            <label>Estado de la Corte Actual:</label>
            <select 
              name="currentCourtState" 
              value={formData.currentCourtState} 
              onChange={handleChange} 
              required
            >
              <option value="">Selecciona un estado</option>
              {courtsData.map((courtData, index) => (
                <option key={index} value={courtData.state}>
                  {courtData.state}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-field">
            <label>Corte Actual:</label>
            <select 
              name="currentCourt" 
              value={formData.currentCourt} 
              onChange={handleCurrentCourtChange} 
              required
            >
              <option value="">Selecciona una corte</option>
              {getCourtsByState(formData.currentCourtState).map((court, index) => (
                <option key={index} value={court.name}>
                  {court.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-field">
            <label>Ciudad y Estado de la Corte Actual:</label>
            <input 
              type="text" 
              name="cityStateCurrentCourt" 
              value={formData.cityStateCurrentCourt} 
              readOnly 
              className="readonly-field"
            />
          </div>
          
          <div className="form-field">
            <label>Oficina de OPLA:</label>
            <input 
              type="text" 
              name="oplaOffice" 
              value={formData.oplaOffice} 
              readOnly 
              className="readonly-field"
            />
          </div>
          
          <div className="form-field">
            <label>Juez Actual:</label>
            <select 
              name="judgeName" 
              value={formData.judgeName} 
              onChange={handleChange} 
              required
            >
              <option value="">Selecciona un juez</option>
              {getJudgesByCourt(formData.currentCourtState, formData.currentCourt).map((judge, index) => (
                <option key={index} value={judge}>
                  {judge}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-field">
            <label>Fecha de la Audiencia Actual:</label>
            <input 
              type="date" 
              name="hearingDate" 
              value={formData.hearingDate} 
              onChange={handleChange} 
              required
            />
          </div>
          <div className="form-field">
            <label>Hora de la Audiencia:</label>
            <input 
              type="time" 
              name="hearingTime" 
              value={formData.hearingTime} 
              onChange={handleChange} 
              required
            />
          </div>
        </div>
        
        {/* Sección: Nueva Corte */}
        <div className={`form-section ${sectionProgress.newCourt === 100 ? 'completed' : ''}`}>
          {/* Barra de progreso para esta sección */}
          <ProgressBar progress={sectionProgress.newCourt} />
          
          <h2>Nueva Corte</h2>
          
          <div className="form-field">
            <label>Estado de la Nueva Corte:</label>
            <select 
              name="newCourtState" 
              value={formData.newCourtState} 
              onChange={handleChange} 
              required
            >
              <option value="">Selecciona un estado</option>
              {courtsData.map((courtData, index) => (
                <option key={index} value={courtData.state}>
                  {courtData.state}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-field">
            <label>Nueva Corte:</label>
            <select 
              name="newCourt" 
              value={formData.newCourt} 
              onChange={handleNewCourtChange} 
              required
            >
              <option value="">Selecciona una corte</option>
              {getCourtsByState(formData.newCourtState).map((court, index) => (
                <option key={index} value={court.name}>
                  {court.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-field">
            <label>Ciudad y Estado de la Nueva Corte:</label>
            <input 
              type="text" 
              name="cityStateFutureCourt" 
              value={formData.cityStateFutureCourt} 
              readOnly 
              className="readonly-field"
            />
          </div>
          
          <div className="form-field">
            <label>Fecha de Presentación de la Moción:</label>
            <input 
              type="date" 
              name="motionDate" 
              value={formData.motionDate} 
              onChange={handleChange} 
              required
            />
          </div>
        </div>
        
        {/* Sección: Información Adicional */}
        <div className={`form-section ${sectionProgress.additionalInfo === 100 ? 'completed' : ''}`}>
          {/* Barra de progreso para esta sección */}
          <ProgressBar progress={sectionProgress.additionalInfo} />
          
          <h2>Información Adicional</h2>
          
          <div className="form-field">
            <label>Fecha de Envío:</label>
            <input 
              type="date" 
              name="submissionDate" 
              value={formData.submissionDate} 
              onChange={handleChange} 
              required
            />
          </div>
          
          <div className="form-field">
            <label>Método de Entrega:</label>
            <select 
              name="deliveryMethod" 
              value={formData.deliveryMethod} 
              onChange={handleChange} 
              required
            >
              <option value="">Selecciona un método</option>
              <option value="Hand Delivery">Entrega en Mano</option>
              <option value="Priority Mail">Correo Prioritario</option>
              <option value="Priority Express">Correo Express</option>
            </select>
          </div>
        </div>
        
        {/* Selector de plantillas condicional */}
        {areRequiredFieldsComplete() ? (
          // Muestra el selector de plantillas solo si todos los campos están completos
          <div className="form-field template-selector">
            <label>Seleccione una plantilla para la razón del cambio:</label>
            <select 
              name="reasonTemplate" 
              onChange={handleReasonTemplateChange}
            >
              <option value="">-- Seleccionar una plantilla --</option>
              <option value="1">Distancia y dificultad económica</option>
              <option value="2">Cambio de residencia</option>
              <option value="3">Razones familiares</option>
            </select>
          </div>
        ) : (
          // Muestra un mensaje informativo si faltan campos por completar
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
        )}
        
        <div className={`form-field reason-field ${formData.reason ? 'reason-field-active' : ''}`}>
          <label>Razón del Cambio:<span className="required">*</span></label>
          <textarea 
            name="reason" 
            value={formData.reason} 
            onChange={handleChange}
            onBlur={handleBlur}
            required 
            placeholder="Explica el motivo para solicitar el cambio de corte"
            rows="8"
            style={{ 
              whiteSpace: 'pre-line',
              color: '#ffffff', 
              backgroundColor: '#1e2b3a'
            }}
          />
        </div>
        
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