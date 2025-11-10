import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { simulationSchema } from '@utils/validators';
import { Button } from '@components/common/Button';
import { Input } from '@components/common/Input';
import { Select } from '@components/common/Select';
import { useCreditTypes } from '@hooks/useCreditTypes';
import { creditTypesAPI } from '@services/api';

export const SimulationForm = ({ onSimulationComplete }) => {
  const { creditTypes, employmentTypes, jobs, loading } = useCreditTypes();
  const [selectedCreditType, setSelectedCreditType] = useState(null);
  const [amountError, setAmountError] = useState(null);
  
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset
  } = useForm({
    resolver: zodResolver(simulationSchema),
    defaultValues: {
      creditTypeId: '',
      jobId: '',
      amount: 100000,
      months: 12,
      annualRate: 4.2,
      fees: 0,
      insuranceRate: 0
    }
  });

  const creditTypeId = watch('creditTypeId');
  const amount = watch('amount');
  const months = watch('months');

  useEffect(() => {
    if (creditTypeId) {
      const found = creditTypes.find(ct => ct.id === creditTypeId);
      setSelectedCreditType(found);
      if (found) {
        setAmountError(null);
      }
    }
  }, [creditTypeId, creditTypes]);

  useEffect(() => {
    if (selectedCreditType) {
      if (amount < selectedCreditType.minAmount) {
        setAmountError(`Montant minimum: ${selectedCreditType.minAmount} MAD`);
      } else if (amount > selectedCreditType.maxAmount) {
        setAmountError(`Montant maximum: ${selectedCreditType.maxAmount} MAD`);
      } else {
        setAmountError(null);
      }
    }
  }, [amount, selectedCreditType]);

  const onSubmit = async (data) => {
    if (amountError) return;
    try {
      onSimulationComplete(data);
    } catch (error) {
      console.error('Simulation error:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-gray-600">Chargement...</div>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Controller
          name="creditTypeId"
          control={control}
          render={({ field }) => (
            <Select
              label="Type de crédit"
              options={creditTypes}
              error={errors.creditTypeId?.message}
              required
              {...field}
            />
          )}
        />

        <Controller
          name="jobId"
          control={control}
          render={({ field }) => (
            <Select
              label="Métier"
              options={jobs}
              error={errors.jobId?.message}
              required
              {...field}
            />
          )}
        />

        <Controller
          name="amount"
          control={control}
          render={({ field: { onChange, value } }) => (
            <Input
              label="Montant (MAD)"
              type="number"
              error={errors.amount?.message || amountError}
              value={value}
              onChange={(e) => onChange(Number(e.target.value))}
              required
              step="1000"
            />
          )}
        />

        <Controller
          name="months"
          control={control}
          render={({ field: { onChange, value } }) => (
            <Input
              label="Durée (mois)"
              type="number"
              error={errors.months?.message}
              value={value}
              onChange={(e) => onChange(Number(e.target.value))}
              required
              min="6"
              max={selectedCreditType?.maxMonths || 360}
            />
          )}
        />

        <Controller
          name="annualRate"
          control={control}
          render={({ field: { onChange, value } }) => (
            <Input
              label="Taux annuel (%)"
              type="number"
              error={errors.annualRate?.message}
              value={value}
              onChange={(e) => onChange(Number(e.target.value))}
              required
              step="0.1"
              min="0.1"
              max="20"
            />
          )}
        />

        <Controller
          name="fees"
          control={control}
          render={({ field: { onChange, value } }) => (
            <Input
              label="Frais fixes (MAD)"
              type="number"
              error={errors.fees?.message}
              value={value}
              onChange={(e) => onChange(Number(e.target.value))}
              step="100"
              helpText="Optionnel"
            />
          )}
        />

        <Controller
          name="insuranceRate"
          control={control}
          render={({ field: { onChange, value } }) => (
            <Input
              label="Assurance (%)"
              type="number"
              error={errors.insuranceRate?.message}
              value={value}
              onChange={(e) => onChange(Number(e.target.value))}
              step="0.1"
              helpText="Optionnel"
            />
          )}
        />
      </div>

      <div className="flex gap-4">
        <Button
          type="submit"
          disabled={isSubmitting || !!amountError}
          className="flex-1"
        >
          {isSubmitting ? 'Calcul en cours...' : 'Simuler'}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => reset()}
          className="flex-1"
        >
          Réinitialiser
        </Button>
      </div>
    </form>
  );
};