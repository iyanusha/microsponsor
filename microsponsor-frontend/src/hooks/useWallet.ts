import { useState, useCallback, useEffect, useRef } from 'react';

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
  // Refs hold the lazily-loaded module and session so callbacks
  // are stable and don't cause stale-closure issues.
  const modRef = useRef<typeof import('@stacks/connect') | null>(null);
  const sessionRef = useRef<any>(null);

  useEffect(() => {
    // Dynamic import — runs client-side only (useEffect never runs on server).
    // @stacks/connect lands in its own async chunk; no shared-chunk collision.
    import('@stacks/connect').then((mod) => {
      modRef.current = mod;
      const { AppConfig, UserSession } = mod;
      if (!sessionRef.current) {
        const cfg = new AppConfig(['store_write', 'publish_data']);
        sessionRef.current = new UserSession({ appConfig: cfg });
      }
      if (sessionRef.current.isUserSignedIn()) {
        const data = sessionRef.current.loadUserData();
        setConnected(true);
        setAddress(data.profile.stxAddress.testnet);
        setMainnetAddress(data.profile.stxAddress.mainnet);
      }
    });
  }, []);

  const connect = useCallback(() => {
    const mod = modRef.current;
    const session = sessionRef.current;
    if (!mod || !session) return;
    mod.showConnect({
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
    sessionRef.current?.signUserOut('/');
    setConnected(false);
    setAddress('');
    setMainnetAddress('');
  }, []);

  return { connected, address, mainnetAddress, connect, disconnect };
}
