import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Header from '../../components/Header';
import MilestoneCard from '../../components/MilestoneCard';
import MilestoneForm from '../../components/MilestoneForm';
import ProgressBar from '../../components/ProgressBar';
import StatusBadge from '../../components/StatusBadge';
import Spinner from '../../components/Spinner';
import { useWallet } from '../../hooks/useWallet';
import { getScholarshipInfo, getMilestoneInfo, completeMilestone } from '../../utils/contracts';
import { formatSTX, truncateAddress, formatCategory, calculateProgress } from '../../utils/helpers';

interface ScholarshipData {
  student: string;
  donor: string;
  amount: number;
  releasedAmount: number;
  milestoneCount: number;
  completedMilestones: number;
  category: string;
  status: string;
}

export default function ScholarshipDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { connected, address } = useWallet();

  const [scholarship, setScholarship] = useState<ScholarshipData | null>(null);
  const [milestones, setMilestones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const scholarshipId = Number(id);

  const load = async () => {
    if (!scholarshipId || isNaN(scholarshipId)) return;
    setLoading(true);
    try {
      const raw: any = await getScholarshipInfo(scholarshipId);
      if (raw?.value) {
        const v = raw.value;
        const count = Number(v.data?.['milestone-count']?.value ?? 0);
        setScholarship({
          student: v.data?.student?.address ?? '',
          donor: v.data?.donor?.address ?? '',
          amount: Number(v.data?.amount?.value ?? 0),
          releasedAmount: Number(v.data?.['released-amount']?.value ?? 0),
          milestoneCount: count,
          completedMilestones: Number(v.data?.['completed-milestones']?.value ?? 0),
          category: v.data?.category?.data ?? '',
          status: v.data?.status?.data ?? 'unknown',
        });

        const ms = [];
        for (let i = 1; i <= Math.min(count, 10); i++) {
          const m: any = await getMilestoneInfo(scholarshipId, i);
          if (m?.value) {
            const mv = m.value;
            ms.push({
              id: i,
              description: mv.data?.description?.data ?? '',
              amount: Number(mv.data?.amount?.value ?? 0),
              completed: Boolean(mv.data?.completed?.value),
              verified: Boolean(mv.data?.verified?.value),
            });
          }
        }
        setMilestones(ms);
      }
    } catch {
      // scholarship not found
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [scholarshipId]);

  const handleComplete = (milestoneId: number) => {
    const evidence = prompt('Enter evidence URL or description:');
    if (!evidence) return;
    completeMilestone(scholarshipId, milestoneId, evidence, {
      onFinish: () => load(),
      onCancel: () => {},
    });
  };

  const isStudent = connected && scholarship && address === scholarship.student;
  const isDonor = connected && scholarship && address === scholarship.donor;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  if (!scholarship) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Head><title>Not Found - MicroSponsor</title></Head>
        <Header />
        <main className="max-w-2xl mx-auto py-16 text-center">
          <p className="text-gray-500">Scholarship #{scholarshipId} not found.</p>
        </main>
      </div>
    );
  }

  const progress = calculateProgress(scholarship.completedMilestones, scholarship.milestoneCount);

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Scholarship #{scholarshipId} - MicroSponsor</title>
      </Head>
      <Header />
      <main className="max-w-3xl mx-auto py-8 px-4 sm:px-6">
        <div className="card mb-6">
          <div className="card-header flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide">
                {formatCategory(scholarship.category)}
              </p>
              <h1 className="text-xl font-bold text-gray-900 mt-0.5">
                Scholarship #{scholarshipId}
              </h1>
            </div>
            <StatusBadge status={scholarship.status} />
          </div>
          <div className="card-body space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400">Student</p>
                <p className="font-mono text-gray-800">{truncateAddress(scholarship.student)}</p>
              </div>
              <div>
                <p className="text-gray-400">Donor</p>
                <p className="font-mono text-gray-800">{truncateAddress(scholarship.donor)}</p>
              </div>
              <div>
                <p className="text-gray-400">Total Amount</p>
                <p className="font-semibold text-gray-900">{formatSTX(scholarship.amount)}</p>
              </div>
              <div>
                <p className="text-gray-400">Released</p>
                <p className="font-semibold text-green-600">{formatSTX(scholarship.releasedAmount)}</p>
              </div>
            </div>
            <ProgressBar
                completed={scholarship.completedMilestones}
                total={scholarship.milestoneCount}
                label={`${scholarship.completedMilestones}/${scholarship.milestoneCount} milestones`}
              />
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="text-base font-semibold text-gray-900">Milestones</h2>
          </div>
          <div className="card-body">
            {milestones.length === 0 ? (
              <p className="text-gray-400 text-sm">No milestones added yet.</p>
            ) : (
              milestones.map((m) => (
                <MilestoneCard
                  key={m.id}
                  milestone={m}
                  scholarshipId={scholarshipId}
                  isStudent={!!isStudent}
                  onComplete={handleComplete}
                />
              ))
            )}
            {isDonor && (
              <MilestoneForm
                scholarshipId={scholarshipId}
                onSuccess={load}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
