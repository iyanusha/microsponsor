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
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Scholarships - MicroSponsor</title>
        <meta name="description" content="Browse active scholarships" />
      </Head>

      <Header />

      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Scholarships
          </h1>
          <Link href="/scholarships/create" className="btn-primary text-sm">
            Create Scholarship
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Spinner size="lg" />
          </div>
        ) : scholarships.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 mb-4">No scholarships found.</p>
            <Link href="/scholarships/create" className="btn-secondary text-sm">
              Create the first scholarship
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
