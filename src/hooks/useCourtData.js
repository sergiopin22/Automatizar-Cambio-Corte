// hooks/useCourtData.js
import { useCallback } from 'react';
import courtsData from '../data/courts.json';

export function useCourtData() {
  const getCourtsByState = useCallback((state) => {
    const stateData = courtsData.find((item) => item.state === state);
    return stateData ? stateData.courts : [];
  }, []);

  const getCityStateInfoByCourt = useCallback((state, courtName) => {
    const stateData = courtsData.find((item) => item.state === state);
    const court = stateData?.courts.find((c) => c.name === courtName);
    return court ? `${court.city}, ${stateData.state}` : '';
  }, []);

  const getOplaOfficeByCourt = useCallback((state, courtName) => {
    const stateData = courtsData.find((item) => item.state === state);
    const court = stateData?.courts.find((c) => c.name === courtName);
    return court ? court.oplaOffice : '';
  }, []);

  const getJudgesByCourt = useCallback((state, courtName) => {
    const stateData = courtsData.find((item) => item.state === state);
    const court = stateData?.courts.find((c) => c.name === courtName);
    return court ? court.judges : [];
  }, []);

  const statesWithCourts = courtsData.map(data => data.state);

  return {
    getCourtsByState,
    getCityStateInfoByCourt,
    getOplaOfficeByCourt,
    getJudgesByCourt,
    statesWithCourts
  };
}