'use client';

import Select from '@/components/ui/Select';
import Input from '@/components/ui/Input';

const POSITIONS = [
  { value: '', label: 'Tous les postes' },
  { value: 'GK', label: 'GK' },
  { value: 'CB', label: 'CB' },
  { value: 'LB', label: 'LB' },
  { value: 'RB', label: 'RB' },
  { value: 'CDM', label: 'CDM' },
  { value: 'CM', label: 'CM' },
  { value: 'CAM', label: 'CAM' },
  { value: 'LW', label: 'LW' },
  { value: 'RW', label: 'RW' },
  { value: 'ST', label: 'ST' },
];

const STATUSES = [
  { value: '', label: 'Tous les statuts' },
  { value: 'ACTIVE', label: 'Actif' },
  { value: 'INACTIVE', label: 'Inactif' },
];

export default function PlayerFilters({ values, onChange }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <Select
        label="Poste"
        value={values.position || ''}
        onChange={(e) => onChange({ ...values, position: e.target.value })}
        options={POSITIONS}
      />
      <Input
        label="Nationalite"
        value={values.nationality || ''}
        onChange={(e) => onChange({ ...values, nationality: e.target.value })}
        placeholder="Ex : Cameroon"
      />
      <Select
        label="Statut"
        value={values.status || ''}
        onChange={(e) => onChange({ ...values, status: e.target.value })}
        options={STATUSES}
      />
    </div>
  );
}