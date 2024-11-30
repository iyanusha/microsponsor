import { useEffect, useState } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import StudentProfile from '../components/StudentProfile';
// import { StacksTestnet } from '@stacks/network';
// import { callReadOnlyFunction } from '@stacks/transactions';

interface Scholarship {
  id: number;
  donor: string;
  amount: number;
  status: string;
  milestonesCompleted: number;
  totalMilestones: number;
}

export default function Dashboard() {
  const [address, setAddress] = useState<string>('');
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real application, you would get this from your authentication state
    const userSession = {
      loadUserData: () => ({
        profile: {
          stxAddress: {
            testnet: 'TEST_ADDRESS', // Replace with actual address
          },
        },
      }),
    };

    const userData = userSession.loadUserData();
    setAddress(userData.profile.stxAddress.testnet);
  }, []);

  // Mock data - replace with actual contract calls
  useEffect(() => {
    const mockScholarships = [
      {
        id: 1,
        donor: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
        amount: 1000,
        status: 'active',
        milestonesCompleted: 2,
        totalMilestones: 5,
      },
      // Add more mock data as needed
    ];
    setScholarships(mockScholarships);
    setLoading(false);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Dashboard - MicroSponsor</title>
        <meta name="description" content="MicroSponsor Dashboard" />
      </Head>

      <Header />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Profile Section */}
        <div className="mb-8">
          {address && <StudentProfile address={address} />}
        </div>

        {/* Active Scholarships */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Active Scholarships
            </h3>
          </div>
          <div className="border-t border-gray-200">
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            ) : scholarships.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {scholarships.map((scholarship) => (
                  <li key={scholarship.id} className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <p className="text-sm font-medium text-gray-900">
                          Scholarship #{scholarship.id}
                        </p>
                        <p className="text-sm text-gray-500">
                          Donor: {`${scholarship.donor.slice(0, 6)}...${scholarship.donor.slice(-4)}`}
                        </p>
                      </div>
                      <div className="flex flex-col items-end">
                        <p className="text-sm font-medium text-gray-900">
                          {scholarship.amount} STX
                        </p>
                        <div className="mt-1">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {scholarship.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="relative pt-1">
                        <div className="flex mb-2 items-center justify-between">
                          <div>
                            <span className="text-xs font-semibold inline-block text-indigo-600">
                              Progress
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-semibold inline-block text-indigo-600">
                              {Math.round((scholarship.milestonesCompleted / scholarship.totalMilestones) * 100)}%
                            </span>
                          </div>
                        </div>
                        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-200">
                          <div
                            style={{
                              width: `${(scholarship.milestonesCompleted / scholarship.totalMilestones) * 100}%`,
                            }}
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-600"
                          ></div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No active scholarships found</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
