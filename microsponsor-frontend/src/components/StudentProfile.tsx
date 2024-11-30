import { useEffect, useState } from 'react';
import { callReadOnlyFunction } from '@stacks/transactions';
import { StacksTestnet } from '@stacks/network';

interface StudentInfo {
  name: string;
  institution: string;
  totalReceived: number;
  status: string;
  milestonesCompleted: number;
  verified: boolean;
}

const StudentProfile = ({ address }: { address: string }) => {
  const [studentInfo, setStudentInfo] = useState<StudentInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentInfo = async () => {
      try {
        const network = new StacksTestnet();
        const contractAddress = 'YOUR_CONTRACT_ADDRESS';
        const contractName = 'microsponsor';

        const result = await callReadOnlyFunction({
          network,
          contractAddress,
          contractName,
          functionName: 'get-student-info',
          functionArgs: [address],
          senderAddress: address,
        });

        // Process the result and set student info
        setStudentInfo(result as any); // Type casting needed
      } catch (error) {
        console.error('Error fetching student info:', error);
      } finally {
        setLoading(false);
      }
    };

    if (address) {
      fetchStudentInfo();
    }
  }, [address]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!studentInfo) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No student profile found</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <div className="bg-indigo-100 rounded-full p-3">
            <svg
              className="w-6 h-6 text-indigo-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{studentInfo.name}</h2>
            <p className="text-gray-500">{studentInfo.institution}</p>
          </div>
          {studentInfo.verified && (
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              Verified
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Total Received</h3>
            <p className="mt-1 text-lg font-semibold text-gray-900">
              {studentInfo.totalReceived} STX
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">
              Milestones Completed
            </h3>
            <p className="mt-1 text-lg font-semibold text-gray-900">
              {studentInfo.milestonesCompleted}
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500">Status</h3>
          <p className="mt-1 text-lg font-semibold text-gray-900">
            {studentInfo.status}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
