import { useState } from 'react';
import { addMilestone } from '../utils/contracts';
import ErrorBanner from './ErrorBanner';

interface MilestoneFormProps {
  scholarshipId: number;
  onSuccess?: () => void;
}

const MilestoneForm = ({ scholarshipId, onSuccess }: MilestoneFormProps) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!description.trim()) {
      setError('Enter a milestone description');
      return;
    }
    if (!amount || Number(amount) <= 0) {
      setError('Enter a valid amount');
      return;
    }
    setLoading(true);
    try {
      await addMilestone(
        scholarshipId,
        description.trim(),
        Math.floor(Number(amount) * 1_000_000),
        {
          onFinish: () => {
            setLoading(false);
            setDescription('');
            setAmount('');
            onSuccess?.();
          },
          onCancel: () => setLoading(false),
        }
      );
    } catch {
      setError('Transaction failed');
      setLoading(false);
    }
  };

  return (
    <div
      className="rounded-lg p-4 mt-4"
      style={{ border: '1px solid var(--border)' }}
    >
      <h4 className="text-sm font-semibold mb-3" style={{ color: 'var(--text)' }}>
        Add Milestone
      </h4>
      {error && <ErrorBanner message={error} onDismiss={() => setError('')} />}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="label">Description</label>
          <input
            type="text"
            className="input"
            placeholder="e.g. Complete semester 1"
            maxLength={100}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="label">Release Amount (STX)</label>
          <input
            type="number"
            className="input"
            min="1"
            step="0.01"
            placeholder="e.g. 25"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`btn-primary text-sm ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Adding…' : 'Add Milestone'}
        </button>
      </form>
    </div>
  );
};

export default MilestoneForm;
