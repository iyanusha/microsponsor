import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../../components/Header';
import ScholarshipCard from '../../components/ScholarshipCard';
import Spinner from '../../components/Spinner';
import { getScholarshipInfo } from '../../utils/contracts';

interface Scholarship {
  id: number;
  student: string;
  donor: string;
  amount: number;
  milestoneCount: number;
  completedMilestones: number;
  category: string;
  status: string;
}

const MAX_SCAN = 20;

export default function ScholarshipsList() {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const results: Scholarship[] = [];
      for (let i = 1; i <= MAX_SCAN; i++) {
        try {
          const raw: any = await getScholarshipInfo(i);
          if (raw?.value) {
            const v = raw.value;
            results.push({
              id: i,
              student: v.data?.student?.address ?? '',
              donor: v.data?.donor?.address ?? '',
              amount: Number(v.data?.amount?.value ?? 0),
              milestoneCount: Number(v.data?.['milestone-count']?.value ?? 0),
              completedMilestones: Number(v.data?.['completed-milestones']?.value ?? 0),
              category: v.data?.category?.data ?? '',
              status: v.data?.status?.data ?? 'unknown',
            });
          }
        } catch {
          break;
        }
      }
      setScholarships(results);
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg)' }}>
      <Head>
        <title>Scholarships - MicroSponsor</title>
        <meta name="description" content="Browse active scholarships" />
      </Head>

      <Header />

      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-extrabold" style={{ color: 'var(--text)' }}>
              Scholarships
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
              Browse active blockchain-backed scholarships
            </p>
          </div>
          <Link href="/scholarships/create" className="btn-primary">
            + Create Scholarship
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Spinner size="lg" />
          </div>
        ) : scholarships.length === 0 ? (
          <div
            className="rounded-2xl text-center py-20 px-6"
            style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
              style={{ backgroundColor: 'var(--accent-lite)' }}
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--accent)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <p className="text-lg font-semibold mb-2" style={{ color: 'var(--text)' }}>No scholarships yet</p>
            <p className="mb-6" style={{ color: 'var(--text-muted)' }}>Be the first to fund a student's education journey.</p>
            <Link href="/scholarships/create" className="btn-primary">
              Create the First Scholarship
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {scholarships.map((s) => (
              <ScholarshipCard key={s.id} scholarship={s} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
