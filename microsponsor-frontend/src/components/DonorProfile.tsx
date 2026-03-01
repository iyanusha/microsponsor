import { useEffect, useState } from 'react';
import { standardPrincipalCV } from '@stacks/transactions';
import { getDonorProfile } from '../utils/contracts';
import { formatSTX, truncateAddress } from '../utils/helpers';

interface DonorInfo {
  totalDonated: number;
  activeScholarships: number;
  completedScholarships: number;
}

const DonorProfile = ({ address }: { address: string }) => {
  const [donor, setDonor] = useState<DonorInfo | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!address) return;
    setLoading(true);
    getDonorProfile(address)
      .then((result: any) => {
        if (result?.value) {
          const v = result.value;
          setDonor({
            totalDonated: Number(v.data?.['total-donated']?.value ?? 0),
            activeScholarships: Number(v.data?.['active-scholarships']?.value ?? 0),
            completedScholarships: Number(v.data?.['completed-scholarships']?.value ?? 0),
          });
        }
      })
      .catch(() => null)
      .finally(() => setLoading(false));
  }, [address]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-20">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (!donor) return null;

  return (
    <div className="card mb-4">
      <div className="card-header">
        <h3 className="text-base font-medium text-gray-900">Donor Summary</h3>
        <p className="text-xs text-gray-400 font-mono mt-1">{truncateAddress(address)}</p>
      </div>
      <div className="card-body grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-xs text-gray-500">Total Donated</p>
          <p className="text-lg font-semibold text-gray-900">{formatSTX(donor.totalDonated)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Active</p>
          <p className="text-lg font-semibold text-indigo-600">{donor.activeScholarships}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Completed</p>
          <p className="text-lg font-semibold text-green-600">{donor.completedScholarships}</p>
        </div>
      </div>
    </div>
  );
};

export default DonorProfile;
