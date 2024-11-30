import { useCallback, useState } from 'react';
import { showConnect } from '@stacks/connect';
import { StacksNetwork, StacksMainnet, StacksTestnet } from '@stacks/network';

const ConnectWallet = () => {
  const [address, setAddress] = useState('');
  const network = new StacksTestnet(); // Will change to StacksMainnet for production

  const connect = useCallback(() => {
    showConnect({
      appDetails: {
        name: 'MicroSponsor',
        icon: window.location.origin + '/favicon.ico',
      },
      redirectTo: '/',
      onFinish: (data) => {
        setAddress(data.addresses.testnet); // Will use mainnet for production
        // You can add more functionality here after connection
      },
      userSession: true,
    });
  }, []);

  return (
    <div className="flex items-center justify-center">
      {!address ? (
        <button
          onClick={connect}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 
                   transition-colors duration-200 flex items-center space-x-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
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
      ) : (
        <div className="bg-gray-100 rounded-lg px-4 py-2 flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-gray-700">
            {`${address.slice(0, 6)}...${address.slice(-4)}`}
          </span>
        </div>
      )}
    </div>
  );
};

export default ConnectWallet;
