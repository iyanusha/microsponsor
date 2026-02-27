import { useState } from 'react';
import { openContractCall } from '@stacks/connect';
import { standardPrincipalCV, uintCV, stringAsciiCV, PostConditionMode } from '@stacks/transactions';
import { useWallet } from '../hooks/useWallet';
import { getNetwork } from '../utils/contracts';
import { isValidStacksAddress } from '../utils/helpers';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ||
  'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
const CONTRACT_NAME = 'stxmicrosponsor';

const ScholarshipForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const { connected, connect } = useWallet();
  const [formData, setFormData] = useState({
    studentAddress: '',
    amount: '',
    milestoneCount: '3',
    category: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!connected) { connect(); return; }
    if (!isValidStacksAddress(formData.studentAddress)) {
      setError('Invalid student Stacks address');
      return;
    }
    if (!formData.amount || Number(formData.amount) <= 0) {
      setError('Enter a valid STX amount');
      return;
    }

    setLoading(true);
    try {
      const amountMicro = Math.floor(Number(formData.amount) * 1_000_000);
      await openContractCall({
        network: getNetwork(),
        anchorMode: 1,
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'create-scholarship',
        functionArgs: [
          standardPrincipalCV(formData.studentAddress),
          uintCV(amountMicro),
          uintCV(parseInt(formData.milestoneCount)),
          standardPrincipalCV(formData.studentAddress),
          stringAsciiCV(formData.category),
        ],
        postConditionMode: PostConditionMode.Allow,
        onFinish: () => {
          setLoading(false);
          onSuccess?.();
        },
        onCancel: () => setLoading(false),
      });
    } catch {
      setError('Transaction failed. Try again.');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div>
        <label className="label">Student Address</label>
        <input
          type="text"
          className="input"
          placeholder="ST..."
          value={formData.studentAddress}
          onChange={(e) => setFormData({ ...formData, studentAddress: e.target.value })}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Amount (STX)</label>
          <input
            type="number"
            className="input"
            placeholder="e.g. 100"
            min="1"
            step="0.01"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="label">Milestones</label>
          <select
            className="input"
            value={formData.milestoneCount}
            onChange={(e) => setFormData({ ...formData, milestoneCount: e.target.value })}
          >
            {[2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>{n} milestones</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="label">Category</label>
        <select
          className="input"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          required
        >
          <option value="">Select a category</option>
          <option value="academic">Academic Excellence</option>
          <option value="technology">Technology and Innovation</option>
          <option value="arts">Arts and Culture</option>
          <option value="sports">Sports Achievement</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`btn-primary w-full justify-center ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
      >
        {loading ? 'Submitting…' : 'Create Scholarship'}
      </button>
    </form>
  );
};

export default ScholarshipForm;
