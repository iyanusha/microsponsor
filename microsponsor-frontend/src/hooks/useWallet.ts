import { useState, useCallback, useEffect } from 'react';
import { AppConfig, UserSession, showConnect } from '@stacks/connect';

const appConfig = new AppConfig(['store_write', 'publish_data']);
export const userSession = new UserSession({ appConfig });

export interface WalletState {
  connected: boolean;
  address: string;
  mainnetAddress: string;
  connect: () => void;
  disconnect: () => void;
}

export function useWallet(): WalletState {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState('');
  const [mainnetAddress, setMainnetAddress] = useState('');

  useEffect(() => {
    if (userSession.isUserSignedIn()) {
      const data = userSession.loadUserData();
      setConnected(true);
      setAddress(data.profile.stxAddress.testnet);
      setMainnetAddress(data.profile.stxAddress.mainnet);
    }
  }, []);

  const connect = useCallback(() => {
    showConnect({
      appDetails: {
        name: process.env.NEXT_PUBLIC_APP_NAME || 'MicroSponsor',
        icon: `${process.env.NEXT_PUBLIC_APP_URL || ''}/favicon.ico`,
      },
      redirectTo: '/',
      onFinish: () => {
        if (userSession.isUserSignedIn()) {
          const data = userSession.loadUserData();
          setConnected(true);
          setAddress(data.profile.stxAddress.testnet);
          setMainnetAddress(data.profile.stxAddress.mainnet);
        }
      },
      userSession,
    });
  }, []);

  const disconnect = useCallback(() => {
    userSession.signUserOut('/');
    setConnected(false);
    setAddress('');
    setMainnetAddress('');
  }, []);

  return { connected, address, mainnetAddress, connect, disconnect };
}
