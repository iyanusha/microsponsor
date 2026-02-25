import { useWallet } from '../hooks/useWallet';
import { truncateAddress } from '../utils/helpers';

const ConnectWallet = () => {
  const { connected, address, connect, disconnect } = useWallet();

  if (connected && address) {
    return (
      <div className="flex items-center space-x-3">
        <div className="bg-gray-100 rounded-lg px-3 py-1.5 flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
          <span className="text-sm text-gray-700 font-mono">
            {truncateAddress(address)}
          </span>
        </div>
        <button
          onClick={disconnect}
          className="text-xs text-gray-500 hover:text-red-600 transition-colors"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={connect}
      className="btn-primary flex items-center space-x-2"
    >
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
        />
      </svg>
      <span>Connect Wallet</span>
    </button>
  );
};

export default ConnectWallet;
