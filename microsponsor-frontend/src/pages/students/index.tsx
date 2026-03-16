import Head from 'next/head';
import Link from 'next/link';
import Header from '../../components/Header';
import { useWallet } from '../../hooks/useWallet';

function EmptyStateIllustration() {
  return (
    <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-40 h-32 mx-auto mb-6">
      {/* Graduation cap */}
      <path d="M60 80 l40-20 40 20-40 20z" fill="var(--accent-lite)" stroke="var(--accent)" strokeWidth="1.5" />
      <path d="M60 80 l0 16 40 16 40-16 0-16" fill="var(--accent)" fillOpacity="0.2" />
      <line x1="140" y1="80" x2="140" y2="100" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" />
      <circle cx="140" cy="104" r="4" fill="var(--accent)" />
      {/* Person silhouettes */}
      <circle cx="80"  cy="128" r="10" fill="var(--accent-lite)" stroke="var(--accent)" strokeWidth="1.5" />
      <circle cx="100" cy="124" r="10" fill="var(--accent-lite)" stroke="var(--accent)" strokeWidth="1.5" />
      <circle cx="120" cy="128" r="10" fill="var(--accent-lite)" stroke="var(--accent)" strokeWidth="1.5" />
      <path d="M66 150 q0-16 14-16 q14 0 14 16" fill="var(--accent)" fillOpacity="0.2" />
      <path d="M86 150 q0-14 14-14 q14 0 14 14" fill="var(--accent)" fillOpacity="0.3" />
      <path d="M106 150 q0-16 14-16 q14 0 14 16" fill="var(--accent)" fillOpacity="0.2" />
      {/* Stars */}
      <circle cx="38" cy="60"  r="3" fill="var(--accent)" fillOpacity="0.6" />
      <circle cx="162" cy="55" r="2" fill="var(--accent)" fillOpacity="0.4" />
      <circle cx="50"  cy="40" r="2" fill="var(--accent)" fillOpacity="0.3" />
    </svg>
  );
}

export default function StudentsIndex() {
  const { connected } = useWallet();

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg)' }}>
      <Head>
        <title>Students — MicroSponsor</title>
        <meta name="description" content="Discover verified students seeking education funding on MicroSponsor. Browse student profiles and support their academic journey through blockchain-backed scholarships." />
        <meta name="keywords" content="student profiles, education funding, blockchain students, Stacks education, verified students, scholarship seekers, Web3 students" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://microsponsor.vercel.app/students" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="MicroSponsor" />
        <meta property="og:title" content="Students — MicroSponsor" />
        <meta property="og:description" content="Discover verified students seeking education funding. Browse profiles and support their academic journey through blockchain-backed scholarships." />
        <meta property="og:url" content="https://microsponsor.vercel.app/students" />
        <meta property="og:image" content="https://microsponsor.vercel.app/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Students — MicroSponsor" />
        <meta name="twitter:description" content="Discover verified students seeking education funding on MicroSponsor." />
        <meta name="twitter:image" content="https://microsponsor.vercel.app/og-image.png" />
      </Head>

      <Header />

      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-extrabold" style={{ color: 'var(--text)' }}>Students</h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Verified students on MicroSponsor</p>
          </div>
          {connected && (
            <Link href="/students/register" className="btn-primary">
              Register as Student
            </Link>
          )}
        </div>

        <div
          className="rounded-2xl text-center py-16 px-6"
          style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          <EmptyStateIllustration />
          <p className="text-lg font-semibold mb-2" style={{ color: 'var(--text)' }}>
            Student directory coming soon
          </p>
          <p className="text-sm mb-2" style={{ color: 'var(--text-muted)' }}>
            Search by wallet address using the URL:
          </p>
          <code
            className="text-xs px-3 py-1 rounded-lg"
            style={{ backgroundColor: 'var(--accent-lite)', color: 'var(--accent)' }}
          >
            /students/[stacks-address]
          </code>
          <div className="mt-8">
            <Link href="/students/register" className="btn-primary">
              Register as Student
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
