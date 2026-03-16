import { useState, useCallback, useEffect } from 'react';

// Module-level conditional require. Turbopack evaluates typeof window at
// build time: server bundle → branch is dead code, @stacks/connect never
// bundled server-side. Client bundle → branch is live, module is bundled
// synchronously (no async chunk, no "module factory not available" error).
// eslint-disable-next-line @typescript-eslint/no-require-imports
const stacksConnect = typeof window !== 'undefined' ? require('@stacks/connect') : null;

let _userSession: any = null;

function getSession(): any {
  if (!stacksConnect) return null;
  if (!_userSession) {
    const { AppConfig, UserSession } = stacksConnect;
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
    if (!session || !stacksConnect) return;
    stacksConnect.showConnect({
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
