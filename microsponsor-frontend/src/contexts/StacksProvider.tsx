import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';

// ─── Shared context type ───────────────────────────────────────────────────
export interface StacksContextType {
  connected: boolean;
  address: string;       // testnet / mainnet address used for tx
  mainnetAddress: string;
  connecting: boolean;
  connect: () => void;
  disconnect: () => void;
}

const StacksContext = createContext<StacksContextType>({
  connected: false,
  address: '',
  mainnetAddress: '',
  connecting: false,
  connect: () => {},
  disconnect: () => {},
});

// ─── Provider ─────────────────────────────────────────────────────────────
// Lives in _app.tsx so every page shares ONE wallet state.
// @stacks/connect is loaded via dynamic import() — only runs client-side,
// never during SSR.
export function StacksProvider({ children }: { children: ReactNode }) {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState('');
  const [mainnetAddress, setMainnetAddress] = useState('');
  const [connecting, setConnecting] = useState(false);
  // Holds the lazily-loaded module so we can call it from callbacks.
  const modRef = useRef<typeof import('@stacks/connect') | null>(null);

  // ── On mount: load module + restore session ──────────────────────────
  useEffect(() => {
    import('@stacks/connect').then((mod) => {
      modRef.current = mod;
      try {
        const session = mod.getUserSession();
        if (session.isUserSignedIn()) {
          const data = session.loadUserData();
          const testnet = data?.profile?.stxAddress?.testnet ?? '';
          const mainnet = data?.profile?.stxAddress?.mainnet ?? '';
          const isMainnet = process.env.NEXT_PUBLIC_NETWORK === 'mainnet';
          setAddress(isMainnet ? mainnet : testnet);
          setMainnetAddress(mainnet);
          setConnected(true);
        }
      } catch {
        // Not signed in — fine to ignore
      }
    });
  }, []);

  // ── Connect ────────────────────────────────────────────────────────────
  const connect = useCallback(() => {
    const mod = modRef.current;
    if (!mod || connecting) return;

    setConnecting(true);
    mod.showConnect({
      appDetails: {
        name: process.env.NEXT_PUBLIC_APP_NAME || 'MicroSponsor',
        icon: typeof window !== 'undefined'
          ? `${window.location.origin}/favicon.ico`
          : '',
      },
      onFinish: () => {
        try {
          const session = mod.getUserSession();
          if (session.isUserSignedIn()) {
            const data = session.loadUserData();
            const testnet = data?.profile?.stxAddress?.testnet ?? '';
            const mainnet = data?.profile?.stxAddress?.mainnet ?? '';
            const isMainnet = process.env.NEXT_PUBLIC_NETWORK === 'mainnet';
            setAddress(isMainnet ? mainnet : testnet);
            setMainnetAddress(mainnet);
            setConnected(true);
          }
        } catch {}
        setConnecting(false);
      },
      onCancel: () => {
        setConnecting(false);
      },
    });
  }, [connecting]);

  // ── Disconnect ─────────────────────────────────────────────────────────
  const disconnect = useCallback(() => {
    try { modRef.current?.disconnect(); } catch {}
    setConnected(false);
    setAddress('');
    setMainnetAddress('');
  }, []);

  return (
    <StacksContext.Provider
      value={{ connected, address, mainnetAddress, connecting, connect, disconnect }}
    >
      {children}
    </StacksContext.Provider>
  );
}

// ─── Consumer hook ────────────────────────────────────────────────────────
export function useStacks(): StacksContextType {
  return useContext(StacksContext);
}
