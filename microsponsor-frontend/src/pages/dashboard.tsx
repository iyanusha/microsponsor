import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';
import StudentProfile from '../components/StudentProfile';
import DonorProfile from '../components/DonorProfile';
import ScholarshipCard, { ScholarshipSummary } from '../components/ScholarshipCard';
import Spinner from '../components/Spinner';
import { useWallet } from '../hooks/useWallet';
import { getScholarshipInfo } from '../utils/contracts';

export default function Dashboard() {
  const { connected, address, connect } = useWallet();
  const [scholarships, setScholarships] = useState<ScholarshipSummary[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!connected || !address) return;
    setLoading(true);
    const load = async () => {
      const results: ScholarshipSummary[] = [];
      for (let i = 1; i <= 50; i++) {
        try {
          const raw: any = await getScholarshipInfo(i);
          if (!raw?.value) break;
          const v = raw.value;
          const donor = v.data?.donor?.address ?? '';
          const student = v.data?.student?.address ?? '';
          if (donor !== address && student !== address) continue;
          results.push({
            id: i,
            student,
            donor,
            amount: Number(v.data?.amount?.value ?? 0),
            releasedAmount: Number(v.data?.['released-amount']?.value ?? 0),
            milestoneCount: Number(v.data?.['milestone-count']?.value ?? 0),
            completedMilestones: Number(v.data?.['completed-milestones']?.value ?? 0),
            category: v.data?.category?.data ?? '',
            status: v.data?.status?.data ?? 'unknown',
          });
        } catch {
          break;
        }
      }
      setScholarships(results);
      setLoading(false);
    };
    load();
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
          <div className="border-t border-gray-200 p-4">
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <Spinner size="md" />
              </div>
            ) : scholarships.length > 0 ? (
              <div className="space-y-4">
                {scholarships.map((s) => (
                  <ScholarshipCard key={s.id} scholarship={s} />
                ))}
              </div>
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
