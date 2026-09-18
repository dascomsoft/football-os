import Link from 'next/link';
import StatusBadge from '@/components/ui/StatusBadge';

function initials(firstName, lastName) {
  const a = (firstName || '').trim().charAt(0).toUpperCase();
  const b = (lastName || '').trim().charAt(0).toUpperCase();
  return `${a}${b}` || '?';
}

export default function PlayerCard({ player }) {
  return (
    <Link
      href={`/dashboard/academy/players/${player._id}`}
      className="flex items-center gap-4 rounded-md border border-surface-border bg-surface-raised p-4 transition-colors hover:border-accent/40 hover:bg-surface-overlay"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-overlay text-sm font-medium text-content-secondary">
        {initials(player.firstName, player.lastName)}
      </div>

      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-content-primary">
            {player.firstName} {player.lastName}
          </span>
          <StatusBadge status={player.status} />
        </div>
        <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-content-secondary">
          <span>{player.position}</span>
          <span>{player.age} ans</span>
          <span>{player.nationality}</span>
          <span>Visibilite : {player.visibility}</span>
        </div>
      </div>
    </Link>
  );
}