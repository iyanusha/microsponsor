export const formatSTX = (microStx: number): string => {
  return `${(microStx / 1_000_000).toFixed(2)} STX`;
};

export const truncateAddress = (address: string): string => {
  if (!address || address.length < 10) return address || '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const formatDate = (timestamp: number): string => {
  return new Date(timestamp * 1000).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const validateSTXAmount = (amount: string): boolean => {
  const num = Number(amount);
  return !isNaN(num) && num > 0 && num <= 1_000_000;
};

export const calculateProgress = (completed: number, total: number): number => {
  if (!total || total === 0) return 0;
  return Math.round((completed / total) * 100);
};

export const formatCategory = (category: string): string => {
  return category
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const isValidStacksAddress = (address: string): boolean => {
  return (
    typeof address === 'string' &&
    (address.startsWith('ST') || address.startsWith('SP')) &&
    address.length >= 40 &&
    address.length <= 42
  );
};

export const getStatusColor = (status: string): string => {
  const map: Record<string, string> = {
    active: 'badge-success',
    pending: 'badge-warning',
    completed: 'badge-info',
    inactive: 'badge-error',
  };
  return map[status] ?? 'badge-info';
};
