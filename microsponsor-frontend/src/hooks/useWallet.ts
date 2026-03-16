import { useState, useCallback, useEffect } from 'react';
import { AppConfig, UserSession, showConnect } from '@stacks/connect';

let _appConfig: AppConfig | null = null;
let _userSession: UserSession | null = null;

function getSession(): UserSession | null {
  if (typeof window === 'undefined') return null;
  if (!_appConfig) _appConfig = new AppConfig(['store_write', 'publish_data']);
  if (!_userSession) _userSession = new UserSession({ appConfig: _appConfig });
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
