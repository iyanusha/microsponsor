import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';
import StudentProfile from '../components/StudentProfile';
import { useWallet } from '../hooks/useWallet';
import DonorProfile from '../components/DonorProfile';
import { truncateAddress, formatSTX, calculateProgress } from '../utils/helpers';

interface Scholarship {
  id: number;
  donor: string;
  amount: number;
  status: string;
  milestonesCompleted: number;
  totalMilestones: number;
}

export default function Dashboard() {
  const { connected, address, connect } = useWallet();
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!connected || !address) return;
    setLoading(true);
    // TODO: fetch from contract with getScholarshipInfo
    setLoading(false);
  }, [connected, address]);

  if (!connected) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Head>
          <title>Dashboard - MicroSponsor</title>
        </Head>
        <Header />
        <main className="max-w-7xl mx-auto py-16 px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Connect your wallet to continue
          </h2>
          <p className="text-gray-500 mb-8">
            You need a Stacks wallet to access your dashboard.
          </p>
          <button onClick={connect} className="btn-primary">
            Connect Wallet
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Dashboard - MicroSponsor</title>
        <meta name="description" content="MicroSponsor Dashboard" />
      </Head>

      <Header />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="mb-6">
          <DonorProfile address={address} />
        </div>
        <div className="mb-8">
          <StudentProfile address={address} />
        </div>

        <div className="card mb-6">
          <div className="card-header flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">
              My Scholarships
            </h3>
            <Link href="/scholarships/create" className="btn-primary text-sm">
              Create Scholarship
            </Link>
          </div>
          <div className="border-t border-gray-200">
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
              </div>
            ) : scholarships.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {scholarships.map((s) => (
                  <li key={s.id} className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Scholarship #{s.id}
                        </p>
                        <p className="text-sm text-gray-500">
                          Donor: {truncateAddress(s.donor)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {formatSTX(s.amount)}
                        </p>
                        <span className="badge-success">{s.status}</span>
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Progress</span>
                        <span>{calculateProgress(s.milestonesCompleted, s.totalMilestones)}%</span>
                      </div>
                      <div className="w-full bg-indigo-100 rounded-full h-2">
                        <div
                          className="bg-indigo-600 h-2 rounded-full transition-all"
                          style={{ width: `${calculateProgress(s.milestonesCompleted, s.totalMilestones)}%` }}
                        />
                      </div>
                    </div>
                    <Link
                      href={`/scholarships/${s.id}`}
                      className="mt-2 text-sm text-indigo-600 hover:underline"
                    >
                      View details →
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No scholarships yet.</p>
                <Link href="/scholarships/create" className="btn-secondary text-sm">
                  Create your first scholarship
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
