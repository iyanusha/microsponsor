import { StacksTestnet, StacksMainnet, StacksNetwork } from '@stacks/network';
import {
  callReadOnlyFunction,
  standardPrincipalCV,
  uintCV,
  stringAsciiCV,
  boolCV,
  PostConditionMode,
  ContractCallOptions,
  openContractCall,
} from '@stacks/transactions';

const isMainnet = process.env.NEXT_PUBLIC_NETWORK === 'mainnet';

export const getNetwork = (): StacksNetwork => {
  return isMainnet ? new StacksMainnet() : new StacksTestnet();
};

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ||
  'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
const CONTRACT_NAME = 'stxmicrosponsor';

export const CLARITY_VERSION = 4;

export const EXPLORER_URL = isMainnet
  ? 'https://explorer.hiro.so'
  : 'https://explorer.hiro.so/?chain=testnet';

// Helper function to create contract call options
export const createContractCallOptions = ({
  functionName,
  functionArgs,
  network = getNetwork(),
}: {
  functionName: string;
  functionArgs: any[];
  network?: StacksNetwork;
}): ContractCallOptions => {
  return {
    network,
    anchorMode: 1,
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName,
    functionArgs,
    postConditionMode: PostConditionMode.Allow,
  };
};

// Read-only contract functions
export const getStudentInfo = async (address: string) => {
  const network = getNetwork();
  try {
    const result = await callReadOnlyFunction({
      network,
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'get-student-info',
      functionArgs: [standardPrincipalCV(address)],
      senderAddress: address,
    });
    return result;
  } catch (error) {
    console.error('Error fetching student info:', error);
    throw error;
  }
};

export const getScholarshipInfo = async (scholarshipId: number) => {
  const network = getNetwork();
  try {
    const result = await callReadOnlyFunction({
      network,
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'get-scholarship-info',
      functionArgs: [uintCV(scholarshipId)],
      senderAddress: CONTRACT_ADDRESS,
    });
    return result;
  } catch (error) {
    console.error('Error fetching scholarship info:', error);
    throw error;
  }
};

export const getMilestoneInfo = async (scholarshipId: number, milestoneId: number) => {
  const network = getNetwork();
  try {
    const result = await callReadOnlyFunction({
      network,
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'get-milestone-info',
      functionArgs: [uintCV(scholarshipId), uintCV(milestoneId)],
      senderAddress: CONTRACT_ADDRESS,
    });
    return result;
  } catch (error) {
    console.error('Error fetching milestone info:', error);
    throw error;
  }
};

export const getDonorProfile = async (address: string) => {
  const network = getNetwork();
  try {
    const result = await callReadOnlyFunction({
      network,
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'get-donor-profile',
      functionArgs: [standardPrincipalCV(address)],
      senderAddress: address,
    });
    return result;
  } catch (error) {
    console.error('Error fetching donor profile:', error);
    throw error;
  }
};

export const getContractStatus = async () => {
  const network = getNetwork();
  const result = await callReadOnlyFunction({
    network,
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'get-contract-status',
    functionArgs: [],
    senderAddress: CONTRACT_ADDRESS,
  });
  return result;
};

export const registerStudent = (
  name: string,
  institution: string,
  emergencyContact: string,
  program: string,
  academicYear: number,
  opts: { onFinish: (data: any) => void; onCancel: () => void }
) =>
  openContractCall({
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

export const getInstitutionInfo = async (institutionName: string) => {
  const network = getNetwork();
  try {
    const result = await callReadOnlyFunction({
      network,
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'get-institution-info',
      functionArgs: [stringAsciiCV(institutionName)],
      senderAddress: CONTRACT_ADDRESS,
    });
    return result;
  } catch (error) {
    console.error('Error fetching institution info:', error);
    throw error;
  }
};

export const getStudentMetrics = async (address: string) => {
  const network = getNetwork();
  try {
    const result = await callReadOnlyFunction({
      network,
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'get-student-metrics',
      functionArgs: [standardPrincipalCV(address)],
      senderAddress: address,
    });
    return result;
  } catch (error) {
    console.error('Error fetching student metrics:', error);
    throw error;
  }
};

export const addMilestone = (
  scholarshipId: number,
  description: string,
  amount: number,
  opts: { onFinish: (data: any) => void; onCancel: () => void }
) =>
  openContractCall({
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
  openContractCall({
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
  openContractCall({
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
