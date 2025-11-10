import { useContext } from 'react';
import { SimulationContext } from '@contexts/SimulationContext';

export const useSimulation = () => {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error('useSimulation must be used within SimulationProvider');
  }
  return context;
};

// src/hooks/useApplications.js
import { useEffect, useState, useCallback } from 'react';
import { applicationsAPI, simulationsAPI, creditTypesAPI } from '@services/api';

export const useApplications = (filters = {}) => {
  const [applications, setApplications] = useState([]);
  const [simulations, setSimulations] = useState({});
  const [creditTypes, setCreditTypes] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [appRes, simRes, creditRes] = await Promise.all([
        applicationsAPI.getAll(filters),
        simulationsAPI.getAll(),
        creditTypesAPI.getAll()
      ]);
      
      setApplications(appRes.data || []);
      
      // Create lookups
      const simulationsMap = {};
      (simRes.data || []).forEach(sim => {
        simulationsMap[sim.id] = sim;
      });
      setSimulations(simulationsMap);

      const creditTypesMap = {};
      (creditRes.data || []).forEach(ct => {
        creditTypesMap[ct.id] = ct;
      });
      setCreditTypes(creditTypesMap);
    } catch (err) {
      setError(err.message || 'Failed to fetch applications');
      console.error('Error fetching applications:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const updateApplication = useCallback(async (id, data) => {
    try {
      setError(null);
      await applicationsAPI.update(id, data);
      await fetchApplications();
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  }, [fetchApplications]);

  const deleteApplication = useCallback(async (id) => {
    try {
      setError(null);
      await applicationsAPI.delete(id);
      await fetchApplications();
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  }, [fetchApplications]);

  return {
    applications,
    simulations,
    creditTypes,
    loading,
    error,
    refresh: fetchApplications,
    updateApplication,
    deleteApplication
  };
};