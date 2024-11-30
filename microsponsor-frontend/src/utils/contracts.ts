import { StacksTestnet, StacksNetwork } from '@stacks/network';
import { 
  callReadOnlyFunction, 
  standardPrincipalCV, 
  uintCV, 
  stringAsciiCV,
  PostConditionMode,
  ContractCallOptions
} from '@stacks/transactions';

// Network configuration
export const getNetwork = (): StacksNetwork => {
  return new StacksTestnet(); // Change to StacksMainnet for production
};

// Contract details
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '';
const CONTRACT_NAME = 'microsponsor';

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
