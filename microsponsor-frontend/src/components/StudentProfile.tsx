import { useEffect, useState } from 'react';
import Link from 'next/link';
import StatusBadge from './StatusBadge';
import Spinner from './Spinner';
import { useWallet } from '../hooks/useWallet';
import { getStudentInfo } from '../utils/contracts';
import { formatSTX, truncateAddress } from '../utils/helpers';
import type { Student } from '../types';

const StudentProfile = ({ address: propAddress }: { address?: string }) => {
  const { address: walletAddress } = useWallet();
  const address = propAddress || walletAddress;

  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!address) return;
    setLoading(true);
    setNotFound(false);
    getStudentInfo(address)
      .then((raw: any) => {
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
        } else {
          setNotFound(true);
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [address]);

  if (!address) return null;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-24">
        <Spinner size="sm" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="card card-body text-center text-sm" style={{ color: 'var(--text-muted)' }}>
        <p>No student profile for {truncateAddress(address)}.</p>
        <Link
          href="/students/register"
          className="mt-2 block hover:underline"
          style={{ color: 'var(--accent)' }}
        >
          Register as a student →
        </Link>
      </div>
    );
  }

  if (!student) return null;

  return (
    <div className="card">
      <div className="card-body">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-base font-bold" style={{ color: 'var(--text)' }}>
              {student.name}
            </h2>
            <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
              {student.institution} — {student.program}
            </p>
            <p className="text-xs mt-0.5 font-mono" style={{ color: 'var(--text-muted)' }}>
              {truncateAddress(address)}
            </p>
          </div>
          <StatusBadge status={student.verified ? 'active' : 'pending'} />
        </div>

        <div
          className="grid grid-cols-2 gap-4 mt-4 pt-3 text-sm"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          <div>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Total Received</p>
            <p className="font-semibold" style={{ color: 'var(--text)' }}>
              {formatSTX(student.totalReceived)}
            </p>
          </div>
          <div>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Milestones</p>
            <p className="font-semibold" style={{ color: 'var(--text)' }}>
              {student.milestonesCompleted}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
