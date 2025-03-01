import React, { useState } from 'react';
import courtsData from './data/courts.json';

function MotionForm() {
  const [formData, setFormData] = useState({
    name: '',
    aNumber: '',
    streetAddress: '',
    city: '',
    residenceState: '', // Nuevo campo: Estado de Residencia
    postalCode: '',
    currentCourtState: '',
    currentCourt: '',
    oplaOffice: '',
    judgeName: '',
    reason: '',
    hearingDate: '',
    hearingTime: '', // Nuevo campo: Hora de la Audiencia
    motionDate: '',
    submissionDate: '',
    deliveryMethod: '',
    newCourtState: '',
    newCourt: '',
  });

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

  const getOplaOfficeByCourt = (courtName) => {
    const stateData = courtsData.find((item) => item.state === formData.currentCourtState);
    const court = stateData?.courts.find((c) => c.name === courtName);
    return court ? court.oplaOffice : '';
  };

  const getJudgesByCourt = (courtName) => {
    const stateData = courtsData.find((item) => item.state === formData.currentCourtState);
    const court = stateData?.courts.find((c) => c.name === courtName);
    return court ? court.judges : [];
  };

  const handleCurrentCourtChange = (e) => {
    const selectedCourt = e.target.value;
    setFormData({
      ...formData,
      currentCourt: selectedCourt,
      oplaOffice: getOplaOfficeByCourt(selectedCourt),
      judgeName: '', // Se limpia el juez al cambiar la corte
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      const a = document.createElement('a');
      a.href = url;
      a.download = 'motion.pdf';
      a.click();
    } catch (error) {
      console.error('Error en handleSubmit:', error);
      alert('Hubo un problema al generar el PDF.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Nombre Completo:</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />
      </div>
      <div>
        <label>Número A:</label>
        <input type="text" name="aNumber" value={formData.aNumber} onChange={handleChange} required />
      </div>
      <div>
        <label>Dirección de Calle:</label>
        <input type="text" name="streetAddress" value={formData.streetAddress} onChange={handleChange} required />
      </div>
      <div>
        <label>Ciudad:</label>
        <input type="text" name="city" value={formData.city} onChange={handleChange} required />
      </div>
      <div>
        <label>Estado de Residencia:</label>
        <select name="residenceState" value={formData.residenceState} onChange={handleChange} required>
          <option value="">Selecciona tu estado de residencia</option>
          {courtsData.map((courtData, index) => (
            <option key={index} value={courtData.state}>
              {courtData.state}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Código Postal:</label>
        <input type="text" name="postalCode" value={formData.postalCode} onChange={handleChange} required />
      </div>
      <div>
        <label>Estado de la Corte Actual:</label>
        <select name="currentCourtState" value={formData.currentCourtState} onChange={handleChange} required>
          <option value="">Selecciona un estado</option>
          {courtsData.map((courtData, index) => (
            <option key={index} value={courtData.state}>
              {courtData.state}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Corte Actual:</label>
        <select name="currentCourt" value={formData.currentCourt} onChange={handleCurrentCourtChange} required>
          <option value="">Selecciona tu corte</option>
          {getCourtsByState(formData.currentCourtState).map((court, index) => (
            <option key={index} value={court.name}>
              {court.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Oficina de OPLA (Fiscalía de la Corte Actual):</label>
        <input type="text" name="oplaOffice" value={formData.oplaOffice} readOnly />
      </div>

      <div>
        <label>Juez Actual:</label>
        <select name="judgeName" value={formData.judgeName} onChange={handleChange} required>
          <option value="">Selecciona un juez</option>
          {getJudgesByCourt(formData.currentCourt).map((judge, index) => (
            <option key={index} value={judge}>
              {judge}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Fecha de Audiencia:</label>
        <input type="date" name="hearingDate" value={formData.hearingDate} onChange={handleChange} required />
      </div>

      <div>
        <label>Hora de la Audiencia:</label>
        <input type="time" name="hearingTime" value={formData.hearingTime} onChange={handleChange} required />
      </div>

      <div>
        <label>Escoge el estado donde quieres pasar tu corte:</label>
        <select name="newCourtState" value={formData.newCourtState} onChange={handleChange} required>
          <option value="">Selecciona un estado</option>
          {courtsData.map((courtData, index) => (
            <option key={index} value={courtData.state}>
              {courtData.state}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Escoge la corte de inmigración:</label>
        <select name="newCourt" value={formData.newCourt} onChange={handleChange} required>
          <option value="">Selecciona una corte</option>
          {getCourtsByState(formData.newCourtState).map((court, index) => (
            <option key={index} value={court.name}>
              {court.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Razón del Cambio:</label>
        <textarea name="reason" value={formData.reason} onChange={handleChange} required />
      </div>
      <button type="submit">Generar PDF</button>
    </form>
  );
}

export default MotionForm;
