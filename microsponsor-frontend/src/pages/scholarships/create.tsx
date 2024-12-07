import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Header from '../../components/Header';
import { openContractCall } from '@stacks/connect';
import { StacksTestnet } from '@stacks/network';
import {
  standardPrincipalCV,
  uintCV,
  stringAsciiCV,
  PostConditionMode,
} from '@stacks/transactions';

export default function CreateScholarship() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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

    try {
      const network = new StacksTestnet();
      const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '';
      const contractName = 'microsponsor';

      const functionArgs = [
        standardPrincipalCV(formData.studentAddress),
        uintCV(parseInt(formData.milestoneCount)),
        standardPrincipalCV(formData.studentAddress), // fund recovery address
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
        onFinish: (data) => {
          console.log('Transaction:', data);
          router.push('/dashboard');
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
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Create Scholarship - MicroSponsor</title>
        <meta name="description" content="Create a new scholarship" />
      </Head>

      <Header />

      <main className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              Create New Scholarship
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="studentAddress" className="block text-sm font-medium text-gray-700">
                  Student Address
                </label>
                <input
                  type="text"
                  id="studentAddress"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 
                           focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={formData.studentAddress}
                  onChange={(e) => setFormData({ ...formData, studentAddress: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                    Amount (STX)
                  </label>
                  <input
                    type="number"
                    id="amount"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 
                             focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    required
                    min="1"
                  />
                </div>

                <div>
                  <label htmlFor="milestoneCount" className="block text-sm font-medium text-gray-700">
                    Number of Milestones
                  </label>
                  <select
                    id="milestoneCount"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 
                             focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  id="category"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 
                           focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  rows={3}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 
                           focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>

              <div>
                <label htmlFor="requirements" className="block text-sm font-medium text-gray-700">
                  Requirements
                </label>
                <textarea
                  id="requirements"
                  rows={3}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 
                           focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  required
                />
              </div>

              <div className="flex items-center justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium 
                           rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 
                           focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                           ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    'Create Scholarship'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
