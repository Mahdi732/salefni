import { useContext } from 'react';
import { AuthContext } from '@contexts/AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// src/hooks/useCreditTypes.js
import { useEffect, useState } from 'react';
import { creditTypesAPI, employmentTypesAPI, jobsAPI } from '@services/api';

export const useCreditTypes = () => {
  const [creditTypes, setCreditTypes] = useState([]);
  const [employmentTypes, setEmploymentTypes] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [creditRes, employRes, jobRes] = await Promise.all([
          creditTypesAPI.getAll(),
          employmentTypesAPI.getAll(),
          jobsAPI.getAll()
        ]);
        setCreditTypes(creditRes.data || []);
        setEmploymentTypes(employRes.data || []);
        setJobs(jobRes.data || []);
      } catch (err) {
        setError(err.message || 'Failed to fetch data');
        console.error('Error fetching credit types:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { creditTypes, employmentTypes, jobs, loading, error };
};