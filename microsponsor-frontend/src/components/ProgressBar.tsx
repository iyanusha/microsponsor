interface ProgressBarProps {
  completed: number;
  total: number;
  label?: string;
  showPercent?: boolean;
}

const ProgressBar = ({ completed, total, label, showPercent = true }: ProgressBarProps) => {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div>
      {(label || showPercent) && (
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>{label ?? 'Progress'}</span>
          {showPercent && <span>{pct}%</span>}
        </div>
      )}
      <div className="w-full bg-indigo-100 rounded-full h-2">
        <div
          className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      {total > 0 && (
        <p className="text-xs text-gray-400 mt-1">
          {completed} of {total} complete
        </p>
      )}
    </div>
  );
};

export default ProgressBar;
