import Link from 'next/link';
import StatusBadge from './StatusBadge';
import { formatSTX, truncateAddress, calculateProgress, formatCategory } from '../utils/helpers';

export interface ScholarshipSummary {
  id: number;
  student: string;
  donor: string;
  amount: number;
  releasedAmount?: number;
  milestoneCount: number;
  completedMilestones: number;
  category: string;
  status: string;
}

interface ScholarshipCardProps {
  scholarship: ScholarshipSummary;
}

const ScholarshipCard = ({ scholarship }: ScholarshipCardProps) => {
  const {
    id, student, donor, amount,
    releasedAmount = 0, milestoneCount,
    completedMilestones, category, status,
  } = scholarship;
  const progress = calculateProgress(completedMilestones, milestoneCount);

  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="card-body">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              {formatCategory(category)}
            </p>
            <h3 className="text-base font-semibold text-gray-900 mt-0.5">
              Scholarship #{id}
            </h3>
          </div>
          <StatusBadge status={status} />
        </div>

        <div className="space-y-1 text-sm text-gray-600 mb-4">
          <p>
            <span className="text-gray-400">Student: </span>
            <span className="font-mono">{truncateAddress(student)}</span>
          </p>
          <p>
            <span className="text-gray-400">Donor: </span>
            <span className="font-mono">{truncateAddress(donor)}</span>
          </p>
          <p>
            <span className="text-gray-400">Amount: </span>
            <span className="font-semibold text-gray-800">{formatSTX(amount)}</span>
            {releasedAmount > 0 && (
              <span className="text-gray-400 ml-1">
                ({formatSTX(releasedAmount)} released)
              </span>
            )}
          </p>
        </div>

        <div>
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>{completedMilestones}/{milestoneCount} milestones</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-indigo-100 rounded-full h-1.5">
            <div
              className="bg-indigo-600 h-1.5 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <Link
          href={`/scholarships/${id}`}
          className="mt-4 block text-sm text-indigo-600 hover:underline"
        >
          View details →
        </Link>
      </div>
    </div>
  );
};

export default ScholarshipCard;
