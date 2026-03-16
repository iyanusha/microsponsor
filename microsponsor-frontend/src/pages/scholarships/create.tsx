import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Header from '../../components/Header';
import {
  standardPrincipalCV,
  uintCV,
  stringAsciiCV,
  PostConditionMode,
} from '@stacks/transactions';
import { useWallet } from '../../hooks/useWallet';
import { getNetwork } from '../../utils/contracts';
import { isValidStacksAddress } from '../../utils/helpers';
import Toast from '../../components/Toast';

const INPUT_CLS = `input mt-1`;

export default function CreateScholarship() {
  const router = useRouter();
  const { connected, connect } = useWallet();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    studentAddress: '',
    milestoneCount: '3',
    amount: '',
    category: '',
    description: '',
    requirements: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!connected) { connect(); return; }
    if (!isValidStacksAddress(formData.studentAddress)) {
      alert('Invalid student Stacks address');
      setLoading(false);
      return;
    }
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { openContractCall } = require('@stacks/connect');
      const network = getNetwork();
      const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ||
        'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
      const contractName = 'stxmicrosponsor';

      const amountMicro = parseInt(formData.amount) * 1000000;
      const functionArgs = [
        standardPrincipalCV(formData.studentAddress),
        uintCV(amountMicro),
        uintCV(parseInt(formData.milestoneCount)),
        standardPrincipalCV(formData.studentAddress),
        stringAsciiCV(formData.category)
      ];

      await openContractCall({
        network,
        anchorMode: 1,
        contractAddress,
        contractName,
        functionName: 'create-scholarship',
        functionArgs,
        postConditionMode: PostConditionMode.Allow,
        onFinish: (data: any) => {
          console.log('Transaction:', data);
          setLoading(false);
          setSuccess(true);
        },
        onCancel: () => {
          setLoading(false);
        }
      });
    } catch (error) {
      console.error('Error creating scholarship:', error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg)' }}>
      <Head>
        <title>Create Scholarship - MicroSponsor</title>
        <meta name="description" content="Create a new scholarship" />
      </Head>

      <Header />

      <main className="max-w-2xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="card">
          <div className="card-header">
            <h1 className="text-2xl font-extrabold" style={{ color: 'var(--text)' }}>
              Create New Scholarship
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
              Fund a student's education journey on the Stacks blockchain.
            </p>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="studentAddress" className="label">
                  Student Stacks Address
                </label>
                <input
                  type="text"
                  id="studentAddress"
                  className={INPUT_CLS}
                  placeholder="ST..."
                  value={formData.studentAddress}
                  onChange={(e) => setFormData({ ...formData, studentAddress: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="amount" className="label">
                    Amount (STX)
                  </label>
                  <input
                    type="number"
                    id="amount"
                    className={INPUT_CLS}
                    placeholder="e.g. 100"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    required
                    min="1"
                  />
                </div>

                <div>
                  <label htmlFor="milestoneCount" className="label">
                    Milestones
                  </label>
                  <select
                    id="milestoneCount"
                    className={INPUT_CLS}
                    value={formData.milestoneCount}
                    onChange={(e) => setFormData({ ...formData, milestoneCount: e.target.value })}
                  >
                    <option value="3">3 Milestones</option>
                    <option value="4">4 Milestones</option>
                    <option value="5">5 Milestones</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="category" className="label">
                  Category
                </label>
                <select
                  id="category"
                  className={INPUT_CLS}
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                >
                  <option value="">Select a category</option>
                  <option value="academic">Academic Excellence</option>
                  <option value="sports">Sports Achievement</option>
                  <option value="arts">Arts and Culture</option>
                  <option value="technology">Technology and Innovation</option>
                </select>
              </div>

              <div>
                <label htmlFor="description" className="label">
                  Description
                </label>
                <textarea
                  id="description"
                  rows={3}
                  className={INPUT_CLS}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>

              <div>
                <label htmlFor="requirements" className="label">
                  Requirements
                </label>
                <textarea
                  id="requirements"
                  rows={3}
                  className={INPUT_CLS}
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  required
                />
              </div>

              <div className="flex items-center justify-end pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className={`btn-primary px-8 py-3 text-base rounded-xl ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Processing…
                    </span>
                  ) : (
                    'Create Scholarship'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      {success && (
        <Toast
          message="Scholarship created successfully!"
          type="success"
          onDismiss={() => router.push('/dashboard')}
        />
      )}
    </div>
  );
}
