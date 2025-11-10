import React from 'react';
import { Input } from '@components/common/Input';
import { Select } from '@components/common/Select';
import { Button } from '@components/common/Button';
import { CREDIT_STATUS, STATUS_LABELS } from '@utils/constants';

export const FiltersBar = ({ filters, onChange, onRefresh }) => {
  const statusOptions = Object.entries(STATUS_LABELS).map(([id, label]) => ({
    id,
    label
  }));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          placeholder="Rechercher par nom, email ou téléphone..."
          value={filters.searchTerm}
          onChange={(e) => onChange({ ...filters, searchTerm: e.target.value })}
        />

        <Select
          options={statusOptions}
          value={filters.status}
          onChange={(e) => onChange({ ...filters, status: e.target.value })}
        />

        <Button onClick={onRefresh} variant="secondary">
          Actualiser
        </Button>
      </div>
    </div>
  );
};