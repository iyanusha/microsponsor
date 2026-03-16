import StatusBadge from './StatusBadge';
import { formatSTX } from '../utils/helpers';
import type { Milestone } from '../types';

interface MilestoneCardProps {
  milestone: Milestone;
  scholarshipId: number;
  isStudent?: boolean;
  isAdmin?: boolean;
  onComplete?: (milestoneId: number) => void;
  onVerify?: (milestoneId: number) => void;
}

const MilestoneCard = ({
  milestone,
  isStudent,
  isAdmin,
  onComplete,
  onVerify,
}: MilestoneCardProps) => {
  const statusLabel = milestone.verified
    ? 'verified'
    : milestone.completed
    ? 'pending'
    : 'inactive';

  return (
    <div
      className="flex items-start justify-between py-4 last:border-0"
      style={{ borderBottom: '1px solid var(--border)' }}
    >
      <div className="flex items-start space-x-3">
        <div
          className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5"
          style={{
            backgroundColor: milestone.verified
              ? 'var(--accent-lite)'
              : milestone.completed
              ? '#fef9c3'
              : 'var(--border)',
            color: milestone.verified
              ? 'var(--accent)'
              : milestone.completed
              ? '#854d0e'
              : 'var(--text-muted)',
          }}
        >
          {milestone.verified ? (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <span className="text-xs font-bold">{milestone.id}</span>
          )}
        </div>
        <div>
          <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>
            {milestone.description}
          </p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {formatSTX(milestone.amount)}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2 ml-4 flex-shrink-0">
        <StatusBadge status={statusLabel} />
        {isStudent && !milestone.completed && (
          <button
            onClick={() => onComplete?.(milestone.id)}
            className="btn-secondary text-xs py-1"
          >
            Complete
          </button>
        )}
        {isAdmin && milestone.completed && !milestone.verified && (
          <button
            onClick={() => onVerify?.(milestone.id)}
            className="btn-primary text-xs py-1"
          >
            Verify
          </button>
        )}
      </div>
    </div>
  );
};

export default MilestoneCard;
