import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { applicationSchema } from '@utils/validators';
import { Button } from '@components/common/Button';
import { Input } from '@components/common/Input';
import { Select } from '@components/common/Select';
import { useCreditTypes } from '@hooks/useCreditTypes';

export const ApplicationForm = ({ simulation, onSubmit, isLoading }) => {
  const { employmentTypes } = useCreditTypes();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      employmentTypeId: '',
      jobId: simulation?.jobId || '',
      monthlyIncome: 10000,
      comment: ''
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Controller
          name="fullName"
          control={control}
          render={({ field }) => (
            <Input
              label="Nom complet"
              error={errors.fullName?.message}
              required
              {...field}
            />
          )}
        />

        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <Input
              label="Email"
              type="email"
              error={errors.email?.message}
              required
              {...field}
            />
          )}
        />

        <Controller
          name="phone"
          control={control}
          render={({ field }) => (
            <Input
              label="Téléphone"
              type="tel"
              error={errors.phone?.message}
              placeholder="+212612345678"
              required
              {...field}
            />
          )}
        />

        <Controller
          name="employmentTypeId"
          control={control}
          render={({ field }) => (
            <Select
              label="Type d'emploi"
              options={employmentTypes}
              error={errors.employmentTypeId?.message}
              required
              {...field}
            />
          )}
        />

        <Controller
          name="monthlyIncome"
          control={control}
          render={({ field: { onChange, value } }) => (
            <Input
              label="Revenu mensuel (MAD)"
              type="number"
              error={errors.monthlyIncome?.message}
              value={value}
              onChange={(e) => onChange(Number(e.target.value))}
              required
              step="1000"
            />
          )}
        />

        <div></div>

        <Controller
          name="comment"
          control={control}
          render={({ field }) => (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Commentaire
              </label>
              <textarea
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                rows="4"
                placeholder="Informations supplémentaires..."
                {...field}
              />
              {errors.comment?.message && (
                <p className="text-sm text-red-600 mt-1">{errors.comment.message}</p>
              )}
            </div>
          )}
        />
      </div>

      <Button
        type="submit"
        disabled={isSubmitting || isLoading}
        className="w-full"
      >
        {isSubmitting || isLoading ? 'Envoi en cours...' : 'Soumettre la demande'}
      </Button>
    </form>
  );
};