type Status = 'active' | 'completed' | 'inactive' | 'pending' | string;

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

const colorMap: Record<string, string> = {
  active: 'bg-green-100 text-green-800',
  completed: 'bg-blue-100 text-blue-800',
  inactive: 'bg-gray-100 text-gray-600',
  pending: 'bg-yellow-100 text-yellow-800',
};

const StatusBadge = ({ status, className = '' }: StatusBadgeProps) => {
  const color = colorMap[status] ?? 'bg-gray-100 text-gray-600';
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full
                  text-xs font-medium capitalize ${color} ${className}`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
