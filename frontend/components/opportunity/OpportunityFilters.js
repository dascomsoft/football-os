'use client';

import Select from '@/components/ui/Select';
import Input from '@/components/ui/Input';

const LEVELS = [
  { value: '', label: 'Tous les niveaux' },
  { value: 'AMATEUR', label: 'Amateur' },
  { value: 'SEMI_PRO', label: 'Semi-professionnel' },
  { value: 'PROFESSIONAL', label: 'Professionnel' },
  { value: 'ELITE', label: 'Elite' },
];

export default function OpportunityFilters({ values, onChange, showType }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {showType ? (
        <Select
          label="Type"
          value={values.type || ''}
          onChange={(e) => onChange({ ...values, type: e.target.value })}
          options={[
            { value: '', label: 'Tous les types' },
            { value: 'PLAYER', label: 'Joueur' },
            { value: 'COACH', label: 'Coach' },
          ]}
        />
      ) : null}
      <Input
        label="Pays"
        value={values.country || ''}
        onChange={(e) => onChange({ ...values, country: e.target.value })}
        placeholder="Ex : Senegal"
      />
      <Select
        label="Niveau"
        value={values.level || ''}
        onChange={(e) => onChange({ ...values, level: e.target.value })}
        options={LEVELS}
      />
    </div>
  );
}