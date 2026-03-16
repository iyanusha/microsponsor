import { useState, useEffect, useRef } from 'react';
import { useWallet } from '../hooks/useWallet';
import { truncateAddress } from '../utils/helpers';

// Reads the live STX balance from the Stacks API
function useStxBalance(address: string) {
  const [balance, setBalance] = useState<number | null>(null);
  const isMainnet = process.env.NEXT_PUBLIC_NETWORK === 'mainnet';
  const apiBase = isMainnet
    ? 'https://stacks-node-api.mainnet.stacks.co'
    : 'https://stacks-node-api.testnet.stacks.co';

  useEffect(() => {
    if (!address) { setBalance(null); return; }
    fetch(`${apiBase}/extended/v1/address/${address}/stx`)
      .then((r) => r.json())
      .then((d) => setBalance(parseInt(d.balance ?? '0') / 1_000_000))
      .catch(() => setBalance(null));
  }, [address, apiBase]);

  return balance;
}

export default function ConnectWallet() {
  const { connected, address, connecting, connect, disconnect } = useWallet();
  const balance = useStxBalance(address);
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    if (!open) return;
    const handle = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [open]);

  const copyAddress = () => {
    if (!address) return;
    navigator.clipboard.writeText(address).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // ── Connected state ──────────────────────────────────────────────────
  if (connected && address) {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex items-center space-x-2 rounded-xl px-3 py-2 transition-colors"
          style={{
            backgroundColor: 'var(--accent-lite)',
            border: '1px solid var(--border)',
          }}
          aria-expanded={open}
          aria-haspopup="true"
        >
          {/* Green dot */}
          <span
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: 'var(--accent)' }}
          />
          {/* Balance + address */}
          <span className="text-sm font-semibold" style={{ color: 'var(--accent)' }}>
            {balance !== null ? `${balance.toFixed(2)} STX` : truncateAddress(address)}
          </span>
          {/* Chevron */}
          <svg
            className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`}
            style={{ color: 'var(--accent)' }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Dropdown */}
        {open && (
          <div
            className="absolute right-0 mt-2 w-60 rounded-xl shadow-xl z-50 overflow-hidden"
            style={{
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--border)',
            }}
          >
            {/* Address row */}
            <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
              <p className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
                Wallet Address
              </p>
              <div className="flex items-center justify-between">
                <code className="text-sm font-mono" style={{ color: 'var(--text)' }}>
                  {address.slice(0, 8)}…{address.slice(-6)}
                </code>
                <button
                  onClick={copyAddress}
                  className="p-1.5 rounded-lg transition-colors"
                  style={{ color: 'var(--text-muted)' }}
                  title="Copy address"
                >
                  {copied ? (
                    // Check mark
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--accent)' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    // Copy icon
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Balance row */}
            {balance !== null && (
              <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
                <p className="text-xs font-medium mb-0.5" style={{ color: 'var(--text-muted)' }}>
                  Balance
                </p>
                <p className="text-xl font-bold" style={{ color: 'var(--text)' }}>
                  {balance.toFixed(6)} <span className="text-base font-medium" style={{ color: 'var(--text-muted)' }}>STX</span>
                </p>
              </div>
            )}

            {/* Disconnect */}
            <div className="p-2">
              <button
                onClick={() => { disconnect(); setOpen(false); }}
                className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                style={{ color: '#dc2626' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = '#fef2f2'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
              >
                {/* Logout icon */}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Disconnect Wallet</span>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── Not connected ────────────────────────────────────────────────────
  return (
    <button
      onClick={connect}
      disabled={connecting}
      className={`btn-primary flex items-center space-x-2 ${connecting ? 'opacity-70 cursor-not-allowed' : ''}`}
    >
      {connecting ? (
        <>
          {/* Spinner */}
          <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>Connecting…</span>
        </>
      ) : (
        <>
          {/* Wallet icon */}
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          <span>Connect Wallet</span>
        </>
      )}
    </button>
  );
}
