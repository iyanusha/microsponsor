import { STACKS_TESTNET, STACKS_MAINNET, StacksNetwork } from '@stacks/network';
import {
  fetchCallReadOnlyFunction,
  standardPrincipalCV,
  uintCV,
  stringAsciiCV,
  PostConditionMode,
} from '@stacks/transactions';

// openContractCall is browser-only — loaded lazily to keep @stacks/connect
// out of the SSR bundle entirely.
function getOpenContractCall(): typeof import('@stacks/connect')['openContractCall'] {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require('@stacks/connect').openContractCall;
}

const isMainnet = process.env.NEXT_PUBLIC_NETWORK === 'mainnet';

export const getNetwork = (): StacksNetwork => {
  return isMainnet ? STACKS_MAINNET : STACKS_TESTNET;
};

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ||
  'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
const CONTRACT_NAME = 'stxmicrosponsor';

export const CLARITY_VERSION = 4;

export const EXPLORER_URL = isMainnet
  ? 'https://explorer.hiro.so'
  : 'https://explorer.hiro.so/?chain=testnet';

// ── Read-only functions (SSR-safe) ────────────────────────────────────────

export const getStudentInfo = async (address: string) => {
  const network = getNetwork();
  try {
    return await fetchCallReadOnlyFunction({
      network,
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'get-student-info',
      functionArgs: [standardPrincipalCV(address)],
      senderAddress: address,
    });
  } catch (error) {
    console.error('Error fetching student info:', error);
    throw error;
  }
};

export const getScholarshipInfo = async (scholarshipId: number) => {
  const network = getNetwork();
  try {
    return await fetchCallReadOnlyFunction({
      network,
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'get-scholarship-info',
      functionArgs: [uintCV(scholarshipId)],
      senderAddress: CONTRACT_ADDRESS,
    });
  } catch (error) {
    console.error('Error fetching scholarship info:', error);
    throw error;
  }
};

export const getMilestoneInfo = async (scholarshipId: number, milestoneId: number) => {
  const network = getNetwork();
  try {
    return await fetchCallReadOnlyFunction({
      network,
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'get-milestone-info',
      functionArgs: [uintCV(scholarshipId), uintCV(milestoneId)],
      senderAddress: CONTRACT_ADDRESS,
    });
  } catch (error) {
    console.error('Error fetching milestone info:', error);
    throw error;
  }
};

export const getDonorProfile = async (address: string) => {
  const network = getNetwork();
  try {
    return await fetchCallReadOnlyFunction({
      network,
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'get-donor-profile',
      functionArgs: [standardPrincipalCV(address)],
      senderAddress: address,
    });
  } catch (error) {
    console.error('Error fetching donor profile:', error);
    throw error;
  }
};

export const getContractStatus = async () => {
  const network = getNetwork();
  return fetchCallReadOnlyFunction({
    network,
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'get-contract-status',
    functionArgs: [],
    senderAddress: CONTRACT_ADDRESS,
  });
};

export const getInstitutionInfo = async (institutionName: string) => {
  const network = getNetwork();
  try {
    return await fetchCallReadOnlyFunction({
      network,
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'get-institution-info',
      functionArgs: [stringAsciiCV(institutionName)],
      senderAddress: CONTRACT_ADDRESS,
    });
  } catch (error) {
    console.error('Error fetching institution info:', error);
    throw error;
  }
};

export const getStudentMetrics = async (address: string) => {
  const network = getNetwork();
  try {
    return await fetchCallReadOnlyFunction({
      network,
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'get-student-metrics',
      functionArgs: [standardPrincipalCV(address)],
      senderAddress: address,
    });
  } catch (error) {
    console.error('Error fetching student metrics:', error);
    throw error;
  }
};

// ── Write functions (client-only via lazy require) ────────────────────────

export const registerStudent = (
  name: string,
  institution: string,
  emergencyContact: string,
  program: string,
  academicYear: number,
  opts: { onFinish: (data: any) => void; onCancel: () => void }
) =>
  getOpenContractCall()({
    network: getNetwork(),
    anchorMode: 1,
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'register-student',
    functionArgs: [
      stringAsciiCV(name),
      stringAsciiCV(institution),
      standardPrincipalCV(emergencyContact),
      stringAsciiCV(program),
      uintCV(academicYear),
    ],
    postConditionMode: PostConditionMode.Allow,
    ...opts,
  });

export const addMilestone = (
  scholarshipId: number,
  description: string,
  amount: number,
  opts: { onFinish: (data: any) => void; onCancel: () => void }
) =>
  getOpenContractCall()({
    network: getNetwork(),
    anchorMode: 1,
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'add-milestone',
    functionArgs: [
      uintCV(scholarshipId),
      stringAsciiCV(description),
      uintCV(amount),
    ],
    postConditionMode: PostConditionMode.Allow,
    ...opts,
  });

export const verifyMilestone = (
  scholarshipId: number,
  milestoneId: number,
  opts: { onFinish: (data: any) => void; onCancel: () => void }
) =>
  getOpenContractCall()({
    network: getNetwork(),
    anchorMode: 1,
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'verify-milestone',
    functionArgs: [uintCV(scholarshipId), uintCV(milestoneId)],
    postConditionMode: PostConditionMode.Allow,
    ...opts,
  });

export const completeMilestone = (
  scholarshipId: number,
  milestoneId: number,
  evidence: string,
  opts: { onFinish: (data: any) => void; onCancel: () => void }
) =>
  getOpenContractCall()({
    network: getNetwork(),
    anchorMode: 1,
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'complete-milestone',
    functionArgs: [
      uintCV(scholarshipId),
      uintCV(milestoneId),
      stringAsciiCV(evidence),
    ],
    postConditionMode: PostConditionMode.Allow,
    ...opts,
  });
