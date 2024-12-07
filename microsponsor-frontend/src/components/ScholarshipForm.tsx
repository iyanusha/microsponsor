import { useState } from 'react';
import { ContractCall, openContractCall } from '@stacks/connect';
import { StacksTestnet } from '@stacks/network';
import { standardPrincipalCV, uintCV, stringAsciiCV } from '@stacks/transactions';

const ScholarshipForm = () => {
  const [formData, setFormData] = useState({
    studentAddress: '',
    milestoneCount: '',
    category: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const network = new StacksTestnet(); // Change to StacksMainnet for production
    const contractAddress = 'YOUR_CONTRACT_ADDRESS';
    const contractName = 'microsponsor';

    const functionArgs = [
      standardPrincipalCV(formData.studentAddress),
      uintCV(parseInt(formData.milestoneCount)),
      standardPrincipalCV(formData.studentAddress), // will fund recovery address
      stringAsciiCV(formData.category)
    ];

    const options: ContractCall = {
      network,
      anchorMode: 1,
      contractAddress,
      contractName,
      functionName: 'create-scholarship',
      functionArgs,
      postConditions: [],
      onFinish: (data) => {
        console.log('Transaction:', data);
      },
    };

    await openContractCall(options);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Create New Scholarship
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Student Address
          </label>
          <input
            type="text"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                     focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            value={formData.studentAddress}
            onChange={(e) =>
              setFormData({ ...formData, studentAddress: e.target.value })
            }
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Number of Milestones
          </label>
          <input
            type="number"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                     focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            value={formData.milestoneCount}
            onChange={(e) =>
              setFormData({ ...formData, milestoneCount: e.target.value })
            }
            required
            min="1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                     focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            required
          >
            <option value="">Select a category</option>
            <option value="academic">Academic Excellence</option>
            <option value="sports">Sports Achievement</option>
            <option value="arts">Arts and Culture</option>
            <option value="technology">Technology and Innovation</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md 
                   shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 
                   focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Create Scholarship
        </button>
      </form>
    </div>
  );
};

export default ScholarshipForm;
