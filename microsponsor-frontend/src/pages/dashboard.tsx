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
      <div className="min-h-screen" style={{ backgroundColor: 'var(--bg)' }}>
        <Head>
          <title>Dashboard - MicroSponsor</title>
        </Head>
        <Header />
        <main className="max-w-7xl mx-auto py-24 px-4 text-center">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
            style={{ backgroundColor: 'var(--accent-lite)' }}
          >
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--accent)' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--text)' }}>
            Connect your wallet to continue
          </h2>
          <p className="mb-8" style={{ color: 'var(--text-muted)' }}>
            You need a Stacks wallet to access your dashboard.
          </p>
          <button onClick={connect} className="btn-primary px-8 py-3 text-base rounded-xl">
            Connect Wallet
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg)' }}>
      <Head>
        <title>Dashboard - MicroSponsor</title>
        <meta name="description" content="MicroSponsor Dashboard" />
      </Head>

      <Header />

      <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8 px-4">
        <div className="mb-6">
          <DonorProfile address={address} />
        </div>
        <div className="mb-8">
          <StudentProfile address={address} />
        </div>

        <div className="card mb-6">
          <div className="card-header flex items-center justify-between">
            <h3 className="text-lg font-bold" style={{ color: 'var(--text)' }}>
              My Scholarships
            </h3>
            <Link href="/scholarships/create" className="btn-primary text-sm">
              + Create Scholarship
            </Link>
          </div>
          <div className="p-4" style={{ borderTop: '1px solid var(--border)' }}>
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
              <div className="text-center py-10">
                <p className="mb-4" style={{ color: 'var(--text-muted)' }}>No scholarships yet.</p>
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
