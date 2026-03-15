import { useState, useEffect } from 'react';
import { fetchCallReadOnlyFunction, ClarityValue } from '@stacks/transactions';
import { getNetwork } from '../utils/contracts';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ||
  'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
const CONTRACT_NAME = 'stxmicrosponsor';

export function useContractRead<T>(
  functionName: string,
  functionArgs: ClarityValue[],
  senderAddress: string,
  transform: (result: any) => T | null,
  deps: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!senderAddress) return;
    let cancelled = false;

    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchCallReadOnlyFunction({
          network: getNetwork(),
          contractAddress: CONTRACT_ADDRESS,
          contractName: CONTRACT_NAME,
          functionName,
          functionArgs,
          senderAddress,
        });
        if (!cancelled) {
          setData(transform(result));
        }
      } catch (e: any) {
        if (!cancelled) setError(e.message || 'Unknown error');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetch();
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [senderAddress, functionName, ...deps]);

  return { data, loading, error };
}
