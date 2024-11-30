// Format STX amount to display
export const formatSTX = (amount: number): string => {
    return `${(amount / 1000000).toFixed(2)} STX`;
  };
  
  // Truncate wallet address
  export const truncateAddress = (address: string): string => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };
  
  // Format date to readable string
  export const formatDate = (timestamp: number): string => {
    return new Date(timestamp * 1000).toLocaleDateString();
  };
  
  // Validate STX amount
  export const validateSTXAmount = (amount: string): boolean => {
    const num = Number(amount);
    return !isNaN(num) && num > 0 && num <= 1000000; // Example limit of 1M STX
  };
  
  // Calculate milestone progress percentage
  export const calculateProgress = (completed: number, total: number): number => {
    return Math.round((completed / total) * 100);
  };
  
  // Convert category to display name
  export const formatCategory = (category: string): string => {
    return category
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  // Validate student address
  export const isValidStacksAddress = (address: string): boolean => {
    return address.startsWith('ST') && address.length === 41;
  };
