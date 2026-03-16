import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../../components/Header';
import StatusBadge from '../../components/StatusBadge';
import ProgressBar from '../../components/ProgressBar';
import Spinner from '../../components/Spinner';
import { getStudentInfo, getStudentMetrics } from '../../utils/contracts';
import { formatSTX, truncateAddress } from '../../utils/helpers';
import type { Student, StudentMetrics } from '../../types';

export default function StudentProfile() {
  const router = useRouter();
  const { address } = router.query as { address: string };

  const [student, setStudent] = useState<Student | null>(null);
  const [metrics, setMetrics] = useState<StudentMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!address) return;
    const load = async () => {
      setLoading(true);
      try {
        const raw: any = await getStudentInfo(address);
        if (raw?.value) {
          const v = raw.value;
          setStudent({
            address,
            name: v.data?.name?.data ?? '',
            institution: v.data?.institution?.data ?? '',
            program: v.data?.program?.data ?? '',
            academicYear: Number(v.data?.['academic-year']?.value ?? 0),
            status: v.data?.status?.data ?? 'unknown',
            verified: Boolean(v.data?.verified?.value),
            totalReceived: Number(v.data?.['total-received']?.value ?? 0),
            milestonesCompleted: Number(v.data?.['milestones-completed']?.value ?? 0),
          });
        }

        const mRaw: any = await getStudentMetrics(address);
        if (mRaw?.value) {
          const mv = mRaw.value;
          setMetrics({
            gpa: Number(mv.data?.gpa?.value ?? 0),
            attendanceRate: Number(mv.data?.['attendance-rate']?.value ?? 0),
            completedCourses: Number(mv.data?.['completed-courses']?.value ?? 0),
            totalCredits: Number(mv.data?.['total-credits']?.value ?? 0),
            lastUpdated: Number(mv.data?.['last-updated']?.value ?? 0),
          });
        }
      } catch {
        // not found
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [address]);

  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: 'var(--bg)' }}>
        <Header />
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: 'var(--bg)' }}>
        <Head><title>Student Not Found - MicroSponsor</title></Head>
        <Header />
        <main className="max-w-2xl mx-auto py-16 text-center">
          <p className="mb-4" style={{ color: 'var(--text-muted)' }}>
            Student {truncateAddress(address)} not found.
          </p>
          <Link href="/students/register" className="btn-primary text-sm">
            Register as Student
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg)' }}>
      <Head>
        <title>{student.name} - MicroSponsor</title>
      </Head>
      <Header />

      <main className="max-w-2xl mx-auto py-8 px-4 sm:px-6">
        <div className="card mb-6">
          <div className="card-header flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold" style={{ color: 'var(--text)' }}>{student.name}</h1>
              <p className="text-xs font-mono mt-0.5" style={{ color: 'var(--text-muted)' }}>
                {truncateAddress(address)}
              </p>
            </div>
            <StatusBadge status={student.verified ? 'active' : student.status} />
          </div>

          <div className="card-body space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p style={{ color: 'var(--text-muted)' }}>Institution</p>
                <p className="font-medium" style={{ color: 'var(--text)' }}>{student.institution}</p>
              </div>
              <div>
                <p style={{ color: 'var(--text-muted)' }}>Program</p>
                <p className="font-medium" style={{ color: 'var(--text)' }}>{student.program}</p>
              </div>
              <div>
                <p style={{ color: 'var(--text-muted)' }}>Academic Year</p>
                <p className="font-medium" style={{ color: 'var(--text)' }}>{student.academicYear}</p>
              </div>
              <div>
                <p style={{ color: 'var(--text-muted)' }}>Total Received</p>
                <p className="font-semibold" style={{ color: 'var(--accent)' }}>
                  {formatSTX(student.totalReceived)}
                </p>
              </div>
            </div>

            <div>
              <p className="text-sm mb-2" style={{ color: 'var(--text-muted)' }}>Milestones Completed</p>
              <ProgressBar
                completed={student.milestonesCompleted}
                total={Math.max(student.milestonesCompleted, 1)}
                showPercent={false}
              />
            </div>
          </div>
        </div>

        {metrics && (
          <div className="card">
            <div className="card-header">
              <h2 className="text-base font-semibold" style={{ color: 'var(--text)' }}>
                Academic Metrics
              </h2>
            </div>
            <div className="card-body">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p style={{ color: 'var(--text-muted)' }}>GPA</p>
                  <p className="font-semibold" style={{ color: 'var(--text)' }}>
                    {(metrics.gpa / 100).toFixed(2)}
                  </p>
                </div>
                <div>
                  <p style={{ color: 'var(--text-muted)' }}>Attendance Rate</p>
                  <p className="font-semibold" style={{ color: 'var(--text)' }}>
                    {metrics.attendanceRate}%
                  </p>
                </div>
                <div>
                  <p style={{ color: 'var(--text-muted)' }}>Courses Completed</p>
                  <p className="font-semibold" style={{ color: 'var(--text)' }}>
                    {metrics.completedCourses}
                  </p>
                </div>
                <div>
                  <p style={{ color: 'var(--text-muted)' }}>Total Credits</p>
                  <p className="font-semibold" style={{ color: 'var(--text)' }}>
                    {metrics.totalCredits}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// Makes Vercel create a serverless function so dynamic routing works
export async function getServerSideProps() {
  return { props: {} };
}
