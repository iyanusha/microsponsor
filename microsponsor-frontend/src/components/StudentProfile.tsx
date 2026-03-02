import { useEffect, useState } from 'react';
import { callReadOnlyFunction, standardPrincipalCV } from '@stacks/transactions';
import { useWallet } from '../hooks/useWallet';
import { getNetwork } from '../utils/contracts';
import { truncateAddress } from '../utils/helpers';

interface StudentInfo {
  name: string;
  institution: string;
  totalReceived: number;
  status: string;
  milestonesCompleted: number;
  verified: boolean;
  program: string;
}

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ||
  'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
const CONTRACT_NAME = 'stxmicrosponsor';

const StudentProfile = ({ address: propAddress }: { address?: string }) => {
  const { address: walletAddress } = useWallet();
  const address = propAddress || walletAddress;

  const [studentInfo, setStudentInfo] = useState<StudentInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!address) return;
    const fetchStudentInfo = async () => {
      setLoading(true);
      try {
        const result: any = await callReadOnlyFunction({
          network: getNetwork(),
          contractAddress: CONTRACT_ADDRESS,
          contractName: CONTRACT_NAME,
          functionName: 'get-student-info',
          functionArgs: [standardPrincipalCV(address)],
          senderAddress: address,
        });
        if (result?.value) {
          const v = result.value;
          setStudentInfo({
            name: v.data?.name?.data || '',
            institution: v.data?.institution?.data || '',
            totalReceived: Number(v.data?.['total-received']?.value ?? 0),
            status: v.data?.status?.data || 'unknown',
            milestonesCompleted: Number(v.data?.['milestones-completed']?.value ?? 0),
            verified: Boolean(v.data?.verified?.value),
            program: v.data?.program?.data || '',
          });
        } else {
          setNotFound(true);
        }
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    fetchStudentInfo();
  }, [address]);

  if (!address) return null;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="card card-body text-center text-gray-500">
        <p>No student profile found for {truncateAddress(address)}.</p>
        <a href="/students/register" className="text-indigo-600 hover:underline mt-2 block">
          Register as a student →
        </a>
      </div>
    );
  }

  if (!studentInfo) return null;

  return (
    <div className="card">
      <div className="card-body">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{studentInfo.name}</h2>
            <p className="text-gray-500 text-sm mt-1">
              {studentInfo.institution} — {studentInfo.program}
            </p>
            <p className="text-gray-400 text-xs mt-1 font-mono">
              {truncateAddress(address)}
            </p>
          </div>
          <div className="flex flex-col items-end space-y-1">
            {studentInfo.verified ? (
              <span className="badge-success">Verified</span>
            ) : (
              <span className="badge-warning">Pending</span>
            )}
            <span className={`badge ${studentInfo.status === 'active' ? 'badge-success' : 'badge-info'}`}>
              {studentInfo.status}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-500">Total Received</p>
            <p className="text-lg font-semibold text-gray-900">
              {(studentInfo.totalReceived / 1_000_000).toFixed(2)} STX
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Milestones Completed</p>
            <p className="text-lg font-semibold text-gray-900">
              {studentInfo.milestonesCompleted}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
