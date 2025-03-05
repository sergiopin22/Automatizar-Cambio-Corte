import React, { useState, useEffect } from 'react';
import courtsData from './data/courts.json';
import PdfGenerationAnimation from './components/PdfGenerationAnimation/PdfGenerationAnimation';

function MotionForm({ titulo = "FORMULARIO DE MOCIÓN PARA CAMBIO DE CORTE" }) {
  const [formData, setFormData] = useState({
    // Información Personal (6 campos - añadido residenceState)
    name: '',
    aNumber: '',
    streetAddress: '',
    city: '',
    postalCode: '',
    residenceState: '', // Nuevo campo para el estado de residencia
    
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
      if (pdfData) {
        // Descargar el PDF cuando la animación se complete
        const a = document.createElement('a');
        a.href = pdfData.url;
        a.download = pdfData.filename;
        a.click();
        
        // Limpiar el estado
        setPdfData(null);
      }
    };
    
    // Agregamos el evento que escuchará cuando la animación termine
    window.addEventListener('pdfAnimationComplete', handleAnimationComplete);
    
    // Limpieza al desmontar
    return () => {
      window.removeEventListener('pdfAnimationComplete', handleAnimationComplete);
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

  // Función modificada para incluir la animación sincronizada
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mostrar la animación de generación de PDF
    setShowAnimation(true);
    
    try {
      const response = await fetch('https://backend-cambio-corte.vercel.app/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
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
        <div className="form-section">
          <h2>Información Personal</h2>
          
          <div className="form-field">
            <label>Nombre Completo:</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
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
              required 
              placeholder="Ciudad donde vive"
            />
          </div>
          
          {/* Nuevo campo para estado de residencia */}
          <div className="form-field">
            <label>Estado de Residencia:</label>
            <select 
              name="residenceState" 
              value={formData.residenceState} 
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
            <label>Código Postal:</label>
            <input 
              type="text" 
              name="postalCode" 
              value={formData.postalCode} 
              onChange={handleChange} 
              required 
              placeholder="Ej: 90210"
            />
          </div>
        </div>
        
        {/* Sección: Corte Actual */}
        <div className="form-section">
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
        <div className="form-section">
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
        <div className="form-section">
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
        
        <div className="form-field reason-field">
          <label>Razón del Cambio:</label>
          <textarea 
            name="reason" 
            value={formData.reason} 
            onChange={handleChange} 
            required 
            placeholder="Explica el motivo para solicitar el cambio de corte"
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