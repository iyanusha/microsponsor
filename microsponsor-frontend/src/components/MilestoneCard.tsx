import { formatSTX } from '../utils/helpers';

interface Milestone {
  id: number;
  description: string;
  amount: number;
  completed: boolean;
  verified: boolean;
}

interface MilestoneCardProps {
  milestone: Milestone;
  scholarshipId: number;
  isStudent?: boolean;
  onComplete?: (milestoneId: number) => void;
}

const MilestoneCard = ({
  milestone,
  isStudent,
  onComplete,
}: MilestoneCardProps) => {
  const statusLabel = milestone.verified
    ? 'Verified'
    : milestone.completed
    ? 'Awaiting Verification'
    : 'Pending';

  const statusClass = milestone.verified
    ? 'badge-success'
    : milestone.completed
    ? 'badge-warning'
    : 'badge-info';

  return (
    <div className="flex items-start justify-between py-4 border-b border-gray-100 last:border-0">
      <div className="flex items-start space-x-3">
        <div
          className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5 ${
            milestone.verified
              ? 'bg-green-100 text-green-600'
              : milestone.completed
              ? 'bg-yellow-100 text-yellow-600'
              : 'bg-gray-100 text-gray-400'
          }`}
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
          <p className="text-sm font-medium text-gray-900">{milestone.description}</p>
          <p className="text-xs text-gray-500 mt-0.5">{formatSTX(milestone.amount)}</p>
        </div>
      </div>

      <div className="flex items-center space-x-3 ml-4">
        <span className={statusClass}>{statusLabel}</span>
        {isStudent && !milestone.completed && !milestone.verified && (
          <button
            onClick={() => onComplete?.(milestone.id)}
            className="btn-secondary text-xs py-1"
          >
            Mark Complete
          </button>
        )}
      </div>
    </div>
  );
};

export default MilestoneCard;
