import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';

function ServerErrorIllustration() {
  return (
    <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-48 h-36 mx-auto mb-6">
      {/* Server blocks */}
      <rect x="50" y="40" width="100" height="30" rx="6" fill="var(--accent-lite)" stroke="var(--accent)" strokeWidth="1.5" />
      <rect x="50" y="78" width="100" height="30" rx="6" fill="var(--accent-lite)" stroke="var(--accent)" strokeWidth="1.5" />
      <rect x="50" y="116" width="100" height="30" rx="6" fill="var(--accent-lite)" stroke="var(--accent)" strokeWidth="1.5" />
      {/* Status dots */}
      <circle cx="68" cy="55"  r="5" fill="#22c55e" />
      <circle cx="68" cy="93"  r="5" fill="#ef4444" />
      <circle cx="68" cy="131" r="5" fill="#f59e0b" />
      {/* Error X on middle server */}
      <line x1="120" y1="86" x2="134" y2="100" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="134" y1="86" x2="120" y2="100" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
      {/* Blips */}
      <circle cx="40"  cy="55"  r="3" fill="var(--accent)" fillOpacity="0.3" />
      <circle cx="160" cy="55"  r="3" fill="var(--accent)" fillOpacity="0.3" />
      <circle cx="40"  cy="131" r="3" fill="var(--accent)" fillOpacity="0.3" />
      <circle cx="160" cy="131" r="3" fill="var(--accent)" fillOpacity="0.3" />
    </svg>
  );
}

export default function ServerError() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg)' }}>
      <Head>
        <title>Server Error - MicroSponsor</title>
      </Head>

      <Header />

      <main className="max-w-md mx-auto py-24 px-4 text-center">
        <ServerErrorIllustration />
        <p className="text-7xl font-black mb-4" style={{ color: '#ef4444', opacity: 0.2 }}>500</p>
        <h1 className="text-2xl font-bold mb-3" style={{ color: 'var(--text)' }}>
          Something went wrong
        </h1>
        <p className="mb-8" style={{ color: 'var(--text-muted)' }}>
          An unexpected error occurred. Please try again later.
        </p>
        <Link href="/" className="btn-primary px-8 py-3 rounded-xl">
          Back to Home
        </Link>
      </main>
    </div>
  );
}
