import React, { useState } from 'react';
import courtsData from './data/courts.json';
import oplaOffices from './data/oplaOffices.json';

function MotionForm() {
  const [formData, setFormData] = useState({
    name: '',
    aNumber: '',
    streetAddress: '',
    city: '',
    state: '',
    postalCode: '',
    currentCourtState: '',
    currentCourt: '',
    newCourtState: '',
    newCourt: '',
    oplaOffice: '',
    reason: '',
    judgeName: '',
    hearingDate: '',
    motionDate: '',
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
      <h1>Moción de Cambio de Corte</h1>
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
        <label>Estado:</label>
        <select name="state" value={formData.state} onChange={handleChange} required>
          <option value="">Selecciona un estado</option>
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
        <label>Corte Actual - Estado:</label>
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
        <select name="currentCourt" value={formData.currentCourt} onChange={handleChange} required>
          <option value="">Selecciona tu corte</option>
          {getCourtsByState(formData.currentCourtState).map((court, index) => (
            <option key={index} value={court}>
              {court}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Nueva Corte - Estado:</label>
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
        <label>Nueva Corte:</label>
        <select name="newCourt" value={formData.newCourt} onChange={handleChange} required>
          <option value="">Selecciona la nueva corte</option>
          {getCourtsByState(formData.newCourtState).map((court, index) => (
            <option key={index} value={court}>
              {court}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Oficina de OPLA:</label>
        <select name="oplaOffice" value={formData.oplaOffice} onChange={handleChange} required>
          <option value="">Selecciona una oficina</option>
          {oplaOffices.map((office, index) => (
            <option key={index} value={office.office}>
              {office.office}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Nombre del Juez:</label>
        <input type="text" name="judgeName" value={formData.judgeName} onChange={handleChange} required />
      </div>
      <div>
        <label>Fecha de Audiencia:</label>
        <input type="date" name="hearingDate" value={formData.hearingDate} onChange={handleChange} required />
      </div>
      <div>
        <label>Fecha de la Moción:</label>
        <input type="date" name="motionDate" value={formData.motionDate} onChange={handleChange} required />
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
