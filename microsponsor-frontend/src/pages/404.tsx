import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';

function NotFoundIllustration() {
  return (
    <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-48 h-36 mx-auto mb-6">
      {/* Broken chain links */}
      <rect x="40" y="65" width="44" height="30" rx="15" stroke="var(--accent)" strokeWidth="2.5" fill="var(--accent-lite)" />
      <rect x="116" y="65" width="44" height="30" rx="15" stroke="var(--accent)" strokeWidth="2.5" fill="var(--accent-lite)" />
      {/* Break mark */}
      <line x1="84" y1="75" x2="90" y2="85" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="90" y1="75" x2="96" y2="85" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" />
      {/* Question marks */}
      <text x="62" y="86" textAnchor="middle" fill="var(--accent)" fontSize="18" fontWeight="700">4</text>
      <text x="100" y="86" textAnchor="middle" fill="var(--accent)" fontSize="18" fontWeight="700">?</text>
      <text x="138" y="86" textAnchor="middle" fill="var(--accent)" fontSize="18" fontWeight="700">4</text>
      {/* Dots */}
      <circle cx="60"  cy="40"  r="4" fill="var(--accent)" fillOpacity="0.4" />
      <circle cx="140" cy="40"  r="4" fill="var(--accent)" fillOpacity="0.4" />
      <circle cx="100" cy="30"  r="3" fill="var(--accent)" fillOpacity="0.3" />
      <circle cx="30"  cy="100" r="3" fill="var(--accent)" fillOpacity="0.3" />
      <circle cx="170" cy="100" r="3" fill="var(--accent)" fillOpacity="0.3" />
    </svg>
  );
}

export default function NotFound() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg)' }}>
      <Head>
        <title>Page Not Found — MicroSponsor</title>
        <meta name="robots" content="noindex" />
      </Head>

      <Header />

      <main className="max-w-md mx-auto py-24 px-4 text-center">
        <NotFoundIllustration />
        <p className="text-7xl font-black mb-4" style={{ color: 'var(--accent)', opacity: 0.2 }}>404</p>
        <h1 className="text-2xl font-bold mb-3" style={{ color: 'var(--text)' }}>
          Page not found
        </h1>
        <p className="mb-8" style={{ color: 'var(--text-muted)' }}>
          The page you are looking for does not exist or has been moved.
        </p>
        <Link href="/" className="btn-primary px-8 py-3 rounded-xl">
          Back to Home
        </Link>
      </main>
    </div>
  );
}
