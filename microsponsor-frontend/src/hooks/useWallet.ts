import { useState, useCallback, useEffect } from 'react';

// Lazy singleton — require() inside a function is never executed during SSR,
// keeping @stacks/connect entirely out of the server bundle.
let _userSession: any = null;

function getSession(): any {
  if (typeof window === 'undefined') return null;
  if (!_userSession) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { AppConfig, UserSession } = require('@stacks/connect');
    const cfg = new AppConfig(['store_write', 'publish_data']);
    _userSession = new UserSession({ appConfig: cfg });
  }
  return _userSession;
}

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
    const session = getSession();
    if (session?.isUserSignedIn()) {
      const data = session.loadUserData();
      setConnected(true);
      setAddress(data.profile.stxAddress.testnet);
      setMainnetAddress(data.profile.stxAddress.mainnet);
    }
  }, []);

  const connect = useCallback(() => {
    const session = getSession();
    if (!session) return;
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { showConnect } = require('@stacks/connect');
    showConnect({
      appDetails: {
        name: process.env.NEXT_PUBLIC_APP_NAME || 'MicroSponsor',
        icon: `${process.env.NEXT_PUBLIC_APP_URL || ''}/favicon.ico`,
      },
      redirectTo: '/',
      onFinish: () => {
        if (session.isUserSignedIn()) {
          const data = session.loadUserData();
          setConnected(true);
          setAddress(data.profile.stxAddress.testnet);
          setMainnetAddress(data.profile.stxAddress.mainnet);
        }
      },
      userSession: session,
    });
  }, []);

  const disconnect = useCallback(() => {
    getSession()?.signUserOut('/');
    setConnected(false);
    setAddress('');
    setMainnetAddress('');
  }, []);

  return { connected, address, mainnetAddress, connect, disconnect };
}
