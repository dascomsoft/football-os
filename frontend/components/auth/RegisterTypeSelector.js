'use client';

import { Building2, Users, Whistle } from 'lucide-react';

const TYPES = [
  {
    key: 'ACADEMY',
    label: 'Academie',
    description:
      'Gerez les profils sportifs de vos joueurs et recevez des opportunites verifiees.',
    icon: Building2,
  },
  {
    key: 'CLUB',
    label: 'Club',
    description:
      'Creez des demandes de recrutement, consultez des profils presentes par l\'administrateur.',
    icon: Users,
  },
  {
    key: 'COACH',
    label: 'Coach',
    description:
      'Publiez votre profil professionnel et soyez mis en relation avec des clubs.',
    icon: Whistle,
  },
];

export default function RegisterTypeSelector({ selected, onSelect }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {TYPES.map((type) => {
        const Icon = type.icon;
        const active = selected === type.key;

        return (
          <button
            key={type.key}
            type="button"
            onClick={() => onSelect(type.key)}
            className={`flex flex-col items-start gap-3 rounded-md border p-4 text-left transition-colors ${
              active
                ? 'border-accent bg-surface-overlay'
                : 'border-surface-border bg-surface-raised hover:border-accent/40 hover:bg-surface-overlay'
            }`}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-surface-overlay text-content-secondary">
              <Icon size={18} />
            </div>
            <span className="text-sm font-medium text-content-primary">
              {type.label}
            </span>
            <span className="text-xs text-content-secondary">
              {type.description}
            </span>
          </button>
        );
      })}
    </div>
  );
}