// hooks/useTemplateText.js
import { useCallback } from 'react';

export function useTemplateText(formData) {
  return useCallback((templateId) => {
    if (!templateId) return "";
    
    const name = formData.name?.trim() || '[nombre]';
    const aNumber = formData.aNumber?.trim() || '[número A]';
    const currentCourt = formData.currentCourt?.trim() || '[corte actual]';
    const currentCourtState = formData.currentCourtState?.trim() || '[estado actual]';
    const residenceState = formData.residenceState?.trim() || '[estado residencia]';
    const newCourt = formData.newCourt?.trim() || '[nueva corte]';
    const streetAddress = formData.streetAddress?.trim() || '[dirección]';
    const city = formData.city?.trim() || '[ciudad]';
    const postalCode = formData.postalCode?.trim() || '[código postal]';
    
    if (templateId === 1) {
      return `Yo, ${name}, con el número de caso ${aNumber}, estoy actualmente asignada a la Corte de Inmigración de ${currentCourt}. Sin embargo, resido en el estado de ${residenceState}, lo que hace que sea muy difícil para mí asistir a mis audiencias en ${currentCourtState} debido a la gran distancia. Además, estoy enfrentando dificultades económicas y no cuento con los recursos necesarios para comprar boletos de viaje ni para cubrir los costos asociados con la gestión de mi caso en ${currentCourtState}, que está muy lejos de mi residencia actual en ${residenceState}.

Por lo tanto, respetuosamente solicito que mi caso sea transferido a la ${newCourt}, la cual está mucho más cerca de mi residencia actual y me permitiría asistir a mis audiencias de una manera más factible. Agradezco enormemente su comprensión y asistencia en este asunto.`;
    } else if (templateId === 2) {
      return `Yo, ${name}, con número de caso ${aNumber}, solicito respetuosamente el cambio de mi caso actualmente asignado a la Corte de Inmigración de ${currentCourt} a la ${newCourt}.

El motivo de esta solicitud es que he cambiado mi residencia permanente de ${currentCourtState} a ${residenceState}, lo que hace extremadamente difícil y costoso para mí asistir a las audiencias en mi corte actual.

Mi nueva dirección está ubicada en ${streetAddress}, ${city}, ${residenceState} ${postalCode}, lo que me sitúa mucho más cerca de la ${newCourt}.

Solicito amablemente que consideren esta petición para facilitar mi participación en el proceso migratorio.`;
    } else if (templateId === 3) {
      return `Yo, ${name}, titular del número de caso ${aNumber}, actualmente asignado/a a la Corte de Inmigración de ${currentCourt}, respetuosamente solicito un cambio de sede a la ${newCourt}.

Esta solicitud se basa en razones familiares, ya que toda mi familia inmediata ahora reside en ${residenceState}. Mantener mi caso en ${currentCourtState} representa una carga significativa ya que debo viajar largas distancias para asistir a mis audiencias, separándome de mis responsabilidades familiares.

Mi domicilio actual está en ${streetAddress}, ${city}, ${residenceState} ${postalCode}, y considero que un cambio a la corte solicitada permitiría una gestión más eficiente de mi caso migratorio mientras mantengo mis obligaciones familiares.

Agradezco su consideración a esta solicitud.`;
    }
    
    return "";
  }, [formData]);
}