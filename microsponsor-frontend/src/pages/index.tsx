import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';

/* ─────────────────────────────────────────────
   SVG Illustrations
───────────────────────────────────────────── */

function HeroIllustration() {
  return (
    <svg viewBox="0 0 400 320" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-md mx-auto">
      {/* Blockchain nodes */}
      <circle cx="200" cy="130" r="48" fill="#166534" stroke="#4ade80" strokeWidth="2" />
      <circle cx="80"  cy="200" r="28" fill="#0d3d24" stroke="#4ade80" strokeWidth="1.5" />
      <circle cx="320" cy="200" r="28" fill="#0d3d24" stroke="#4ade80" strokeWidth="1.5" />
      <circle cx="130" cy="60"  r="22" fill="#0d3d24" stroke="#86efac" strokeWidth="1.5" />
      <circle cx="270" cy="60"  r="22" fill="#0d3d24" stroke="#86efac" strokeWidth="1.5" />
      <circle cx="60"  cy="110" r="18" fill="#0a3320" stroke="#86efac" strokeWidth="1" />
      <circle cx="340" cy="110" r="18" fill="#0a3320" stroke="#86efac" strokeWidth="1" />

      {/* Connection lines */}
      <line x1="200" y1="130" x2="80"  y2="200" stroke="#4ade80" strokeWidth="1.5" strokeOpacity="0.6" />
      <line x1="200" y1="130" x2="320" y2="200" stroke="#4ade80" strokeWidth="1.5" strokeOpacity="0.6" />
      <line x1="200" y1="130" x2="130" y2="60"  stroke="#4ade80" strokeWidth="1.5" strokeOpacity="0.6" />
      <line x1="200" y1="130" x2="270" y2="60"  stroke="#4ade80" strokeWidth="1.5" strokeOpacity="0.6" />
      <line x1="130" y1="60"  x2="60"  y2="110" stroke="#86efac" strokeWidth="1" strokeOpacity="0.4" />
      <line x1="270" y1="60"  x2="340" y2="110" stroke="#86efac" strokeWidth="1" strokeOpacity="0.4" />
      <line x1="80"  y1="200" x2="60"  y2="110" stroke="#86efac" strokeWidth="1" strokeOpacity="0.4" />
      <line x1="320" y1="200" x2="340" y2="110" stroke="#86efac" strokeWidth="1" strokeOpacity="0.4" />

      {/* Graduation cap on center node */}
      <path d="M186 122 l14-8 14 8-14 8z" fill="#4ade80" />
      <path d="M186 122 l0 10 14 7 14-7 0-10" fill="#22c55e" fillOpacity="0.6" />
      <line x1="214" y1="122" x2="214" y2="138" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" />
      <circle cx="214" cy="140" r="3" fill="#4ade80" />

      {/* Small chain icons on satellite nodes */}
      <text x="80"  y="205" textAnchor="middle" fill="#4ade80" fontSize="12">⛓</text>
      <text x="320" y="205" textAnchor="middle" fill="#4ade80" fontSize="12">⛓</text>
      <text x="130" y="65"  textAnchor="middle" fill="#86efac" fontSize="10">₿</text>
      <text x="270" y="65"  textAnchor="middle" fill="#86efac" fontSize="10">₿</text>

      {/* Pulse rings */}
      <circle cx="200" cy="130" r="60" stroke="#4ade80" strokeWidth="1" strokeOpacity="0.3" strokeDasharray="4 4" />
      <circle cx="200" cy="130" r="75" stroke="#4ade80" strokeWidth="0.5" strokeOpacity="0.15" />

      {/* STX labels */}
      <rect x="152" y="240" width="96" height="28" rx="14" fill="#166534" stroke="#4ade80" strokeWidth="1" />
      <text x="200" y="259" textAnchor="middle" fill="#4ade80" fontSize="12" fontWeight="600">Powered by STX</text>
    </svg>
  );
}

function StudentIllustration() {
  return (
    <svg viewBox="0 0 280 260" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-xs mx-auto">
      {/* Person body */}
      <circle cx="140" cy="70" r="36" fill="var(--accent-lite)" stroke="var(--accent)" strokeWidth="2" />
      {/* Face */}
      <circle cx="132" cy="66" r="3" fill="var(--accent)" />
      <circle cx="148" cy="66" r="3" fill="var(--accent)" />
      <path d="M133 78 q7 6 14 0" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* Body */}
      <path d="M104 148 q0-40 36-40 36 0 36 40z" fill="var(--accent-lite)" stroke="var(--accent)" strokeWidth="1.5" />
      {/* Graduation cap */}
      <path d="M120 42 l20-10 20 10-20 10z" fill="var(--accent)" />
      <path d="M120 42 l0 12 20 8 20-8 0-12" fill="var(--accent)" fillOpacity="0.5" />
      <line x1="160" y1="42" x2="160" y2="56" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" />
      <circle cx="160" cy="58" r="3" fill="var(--accent)" />
      {/* Books */}
      <rect x="64" y="160" width="20" height="72" rx="3" fill="var(--accent)" fillOpacity="0.7" />
      <rect x="88" y="168" width="20" height="64" rx="3" fill="var(--accent)" fillOpacity="0.5" />
      <rect x="112" y="156" width="20" height="76" rx="3" fill="var(--accent)" fillOpacity="0.8" />
      {/* Coin/funding */}
      <circle cx="200" cy="180" r="28" fill="var(--accent)" fillOpacity="0.15" stroke="var(--accent)" strokeWidth="1.5" />
      <circle cx="200" cy="180" r="18" fill="var(--accent)" fillOpacity="0.2" />
      <text x="200" y="186" textAnchor="middle" fill="var(--accent)" fontSize="18" fontWeight="700">$</text>
      {/* Upward arrows for growth */}
      <path d="M228 195 l8-16 8 16" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <line x1="236" y1="195" x2="236" y2="179" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function DonorIllustration() {
  return (
    <svg viewBox="0 0 280 260" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-xs mx-auto">
      {/* Person */}
      <circle cx="100" cy="70" r="34" fill="var(--accent-lite)" stroke="var(--accent)" strokeWidth="2" />
      <circle cx="92" cy="66" r="3" fill="var(--accent)" />
      <circle cx="108" cy="66" r="3" fill="var(--accent)" />
      <path d="M93 78 q7 5 14 0" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M68 146 q0-38 32-38 32 0 32 38z" fill="var(--accent-lite)" stroke="var(--accent)" strokeWidth="1.5" />
      {/* Heart */}
      <path d="M88 54 c0-6 8-10 12-4 4-6 12-2 12 4 0 8-12 16-12 16s-12-8-12-16z" fill="#ef4444" fillOpacity="0.8" />
      {/* Blockchain/network on right */}
      <circle cx="204" cy="100" r="22" fill="var(--accent-lite)" stroke="var(--accent)" strokeWidth="1.5" />
      <circle cx="160" cy="160" r="16" fill="var(--accent-lite)" stroke="var(--accent)" strokeWidth="1" />
      <circle cx="248" cy="160" r="16" fill="var(--accent-lite)" stroke="var(--accent)" strokeWidth="1" />
      <circle cx="204" cy="220" r="16" fill="var(--accent-lite)" stroke="var(--accent)" strokeWidth="1" />
      <line x1="204" y1="100" x2="160" y2="160" stroke="var(--accent)" strokeWidth="1.5" strokeOpacity="0.6" />
      <line x1="204" y1="100" x2="248" y2="160" stroke="var(--accent)" strokeWidth="1.5" strokeOpacity="0.6" />
      <line x1="160" y1="160" x2="204" y2="220" stroke="var(--accent)" strokeWidth="1" strokeOpacity="0.4" />
      <line x1="248" y1="160" x2="204" y2="220" stroke="var(--accent)" strokeWidth="1" strokeOpacity="0.4" />
      <text x="204" y="105" textAnchor="middle" fill="var(--accent)" fontSize="14" fontWeight="700">₿</text>
      <text x="160" y="165" textAnchor="middle" fill="var(--accent)" fontSize="10">✓</text>
      <text x="248" y="165" textAnchor="middle" fill="var(--accent)" fontSize="10">✓</text>
      <text x="204" y="225" textAnchor="middle" fill="var(--accent)" fontSize="10">✓</text>
      {/* Arrow from person to network */}
      <path d="M132 120 q20-10 44-10" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" fill="none" strokeDasharray="4 3" />
      <path d="M168 105 l8 5-8 5" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

/* ─────────────────────────────────────────────
   Section: Hero
───────────────────────────────────────────── */
function HeroSection() {
  return (
    <section
      className="relative overflow-hidden py-20 sm:py-28"
      style={{ background: 'linear-gradient(135deg, #052e16 0%, #166534 50%, #15803d 100%)' }}
    >
      {/* Background grid pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'radial-gradient(circle, #4ade80 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
          <div className="mb-12 lg:mb-0">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold mb-6"
              style={{ backgroundColor: '#166534', color: '#4ade80', border: '1px solid #4ade80' }}>
              <span className="w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse" />
              Live on Stacks Blockchain · 2026
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6" style={{ color: '#f0fdf4' }}>
              Education Funded{' '}
              <span style={{ color: '#4ade80' }}>By the World,</span>{' '}
              Verified by Blockchain
            </h1>
            <p className="text-lg sm:text-xl mb-8 max-w-lg" style={{ color: '#86efac' }}>
              MicroSponsor connects students with donors through transparent,
              milestone-based scholarships powered by Stacks smart contracts —
              backed by Bitcoin.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/scholarships/create"
                className="flex items-center justify-center px-8 py-4 rounded-xl text-base font-semibold text-white shadow-lg transition-all hover:scale-105"
                style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)' }}
              >
                Sponsor a Student
              </Link>
              <Link
                href="/students/register"
                className="flex items-center justify-center px-8 py-4 rounded-xl text-base font-semibold transition-all hover:scale-105"
                style={{ backgroundColor: 'rgba(74,222,128,0.15)', color: '#4ade80', border: '2px solid #4ade80' }}
              >
                Register as Student
              </Link>
            </div>
            <div className="mt-8 flex items-center space-x-6">
              <div className="flex -space-x-2">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2" style={{ backgroundColor: `hsl(${120+i*20},60%,${30+i*5}%)`, borderColor: '#052e16' }} />
                ))}
              </div>
              <p className="text-sm" style={{ color: '#86efac' }}>
                <span className="font-bold" style={{ color: '#4ade80' }}>1,200+</span> students already funded
              </p>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <HeroIllustration />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   Section: Stats Bar
───────────────────────────────────────────── */
const STATS = [
  { value: '1,200+', label: 'Students Funded' },
  { value: '45K',    label: 'STX Distributed' },
  { value: '320',    label: 'Active Donors' },
  { value: '94%',    label: 'Completion Rate' },
];

function StatsBar() {
  return (
    <section style={{ backgroundColor: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl sm:text-4xl font-extrabold" style={{ color: 'var(--accent)' }}>
                {s.value}
              </p>
              <p className="text-sm font-medium mt-1" style={{ color: 'var(--text-muted)' }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   Section: How It Works
───────────────────────────────────────────── */
const STEPS = [
  {
    step: '01',
    title: 'Register Your Profile',
    description: 'Students create a verified profile linked to their Stacks wallet. Donors browse and discover talent.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
  {
    step: '02',
    title: 'Create Milestones',
    description: 'Donors set clear, achievable milestones. Funds are locked in a smart contract until goals are verified.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
  },
  {
    step: '03',
    title: 'Receive Funds',
    description: 'Complete each milestone and funds are automatically released to your wallet. Transparent, instant, secure.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

function HowItWorks() {
  return (
    <section className="py-20" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--accent)' }}>
            Simple Process
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold" style={{ color: 'var(--text)' }}>
            How MicroSponsor Works
          </h2>
          <p className="mt-4 text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-muted)' }}>
            Three steps to a funded education journey on the blockchain.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {STEPS.map((step, i) => (
            <div
              key={step.step}
              className="relative p-8 rounded-2xl transition-transform hover:-translate-y-1"
              style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}
            >
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center mb-6"
                style={{ backgroundColor: 'var(--accent-lite)', color: 'var(--accent)' }}
              >
                {step.icon}
              </div>
              <span
                className="absolute top-6 right-6 text-5xl font-extrabold opacity-10"
                style={{ color: 'var(--accent)' }}
              >
                {step.step}
              </span>
              <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--text)' }}>
                {step.title}
              </h3>
              <p className="leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                {step.description}
              </p>
              {i < STEPS.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 z-10">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--accent)' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   Section: For Students
───────────────────────────────────────────── */
const STUDENT_BENEFITS = [
  'Access funding without traditional credit or collateral',
  'Keep 100% control of your educational path',
  'Transparent milestone tracking visible to all donors',
  'Build a verified on-chain academic reputation',
  'Receive funds directly to your Stacks wallet',
  'Connect with a global community of supporters',
];

function ForStudents() {
  return (
    <section className="py-20" style={{ backgroundColor: 'var(--surface)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
          <div className="mb-12 lg:mb-0">
            <StudentIllustration />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--accent)' }}>
              For Students
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-6" style={{ color: 'var(--text)' }}>
              Your Education,{' '}
              <span style={{ color: 'var(--accent)' }}>Your Terms</span>
            </h2>
            <p className="text-lg mb-8" style={{ color: 'var(--text-muted)' }}>
              Remove traditional barriers to education funding. Let your
              achievements speak — and get paid when you deliver.
            </p>
            <ul className="space-y-4 mb-8">
              {STUDENT_BENEFITS.map((b) => (
                <li key={b} className="flex items-start space-x-3">
                  <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--accent)' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  <span style={{ color: 'var(--text-muted)' }}>{b}</span>
                </li>
              ))}
            </ul>
            <Link href="/students/register" className="btn-primary px-8 py-3 text-base rounded-xl">
              Start Your Journey →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   Section: For Donors
───────────────────────────────────────────── */
const DONOR_BENEFITS = [
  'Fund verified students with blockchain-backed milestones',
  'Real-time transparency — track every STX you send',
  'Milestone-locked contracts ensure accountability',
  'Reclaim unspent funds if milestones go unmet',
  'Build your on-chain impact portfolio',
  'Zero platform fees — 100% goes to students',
];

function ForDonors() {
  return (
    <section className="py-20" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--accent)' }}>
              For Donors
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-6" style={{ color: 'var(--text)' }}>
              Impact You Can{' '}
              <span style={{ color: 'var(--accent)' }}>Verify On-Chain</span>
            </h2>
            <p className="text-lg mb-8" style={{ color: 'var(--text-muted)' }}>
              Your contribution is locked in a smart contract — released only
              when students prove their progress. Give confidently.
            </p>
            <ul className="space-y-4 mb-8">
              {DONOR_BENEFITS.map((b) => (
                <li key={b} className="flex items-start space-x-3">
                  <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--accent)' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  <span style={{ color: 'var(--text-muted)' }}>{b}</span>
                </li>
              ))}
            </ul>
            <Link href="/scholarships/create" className="btn-primary px-8 py-3 text-base rounded-xl">
              Create a Scholarship →
            </Link>
          </div>
          <div className="mt-12 lg:mt-0">
            <DonorIllustration />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   Section: Platform Features
───────────────────────────────────────────── */
const FEATURES = [
  {
    title: 'Fully Transparent',
    description: 'Every transaction is permanently recorded on the Stacks blockchain. Nothing hidden.',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ),
  },
  {
    title: 'Milestone-Gated',
    description: 'Funds release automatically only after each milestone is verified and approved.',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
  },
  {
    title: 'Smart Contracts',
    description: 'Clarity smart contracts on Stacks — secure, auditable, and Bitcoin-settled.',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
  },
  {
    title: 'Global Access',
    description: 'No borders, no banks required. Anyone with a Stacks wallet can participate.',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: 'Institution Verified',
    description: 'Students are registered against verified institutions ensuring credibility.',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    title: 'Direct to Student',
    description: "Funds go straight to the student's wallet. No intermediaries, no delays.",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
  },
];

function PlatformFeatures() {
  return (
    <section className="py-20" style={{ backgroundColor: 'var(--surface)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--accent)' }}>
            Platform Features
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold" style={{ color: 'var(--text)' }}>
            Built Different, Built Better
          </h2>
          <p className="mt-4 text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-muted)' }}>
            Every feature was designed to protect both students and donors.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="p-6 rounded-2xl transition-all hover:shadow-md hover:-translate-y-1"
              style={{ backgroundColor: 'var(--bg)', border: '1px solid var(--border)' }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: 'var(--accent-lite)', color: 'var(--accent)' }}
              >
                {f.icon}
              </div>
              <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text)' }}>
                {f.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   Section: Impact Numbers
───────────────────────────────────────────── */
const IMPACT = [
  { value: '1,200', label: 'Students Funded', sub: 'and counting' },
  { value: '$450K', label: 'Equivalent Value', sub: 'in STX distributed' },
  { value: '320',   label: 'Global Donors', sub: 'across 40+ countries' },
  { value: '94%',   label: 'Milestone Rate', sub: 'completion success' },
];

function ImpactNumbers() {
  return (
    <section
      className="py-24"
      style={{ background: 'linear-gradient(135deg, #052e16 0%, #166534 100%)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: '#86efac' }}>
            Our Impact in Numbers
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold" style={{ color: '#f0fdf4' }}>
            Real Lives. Real Change.
          </h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {IMPACT.map((item) => (
            <div key={item.label} className="text-center">
              <p className="text-5xl sm:text-6xl font-black mb-2" style={{ color: '#4ade80' }}>
                {item.value}
              </p>
              <p className="text-lg font-bold mb-1" style={{ color: '#f0fdf4' }}>
                {item.label}
              </p>
              <p className="text-sm" style={{ color: '#86efac' }}>
                {item.sub}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   Section: CTA
───────────────────────────────────────────── */
function CTASection() {
  return (
    <section className="py-24" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-5xl font-extrabold mb-6" style={{ color: 'var(--text)' }}>
          Ready to Make Education{' '}
          <span style={{ color: 'var(--accent)' }}>Borderless?</span>
        </h2>
        <p className="text-xl mb-10 max-w-2xl mx-auto" style={{ color: 'var(--text-muted)' }}>
          Join thousands of students and donors already transforming lives
          through blockchain-powered micro-scholarships.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/scholarships/create"
            className="flex items-center justify-center px-10 py-4 rounded-xl text-base font-semibold text-white shadow-lg transition-all hover:scale-105"
            style={{ backgroundColor: 'var(--accent)' }}
          >
            Create a Scholarship
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center justify-center px-10 py-4 rounded-xl text-base font-semibold transition-all hover:scale-105"
            style={{ backgroundColor: 'var(--accent-lite)', color: 'var(--accent)', border: '1px solid var(--border)' }}
          >
            View Dashboard
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   Footer
───────────────────────────────────────────── */
function Footer() {
  return (
    <footer style={{ backgroundColor: 'var(--surface)', borderTop: '1px solid var(--border)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="lg:grid lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="mb-8 lg:mb-0 lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <svg className="w-7 h-7" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="14" stroke="var(--accent)" strokeWidth="2" />
                <path d="M10 15l4 4 8-8" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-lg font-bold" style={{ color: 'var(--accent)' }}>MicroSponsor</span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              Decentralized education funding powered by the Stacks blockchain. Transparent, milestone-based, and borderless.
            </p>
          </div>
          {/* Links */}
          <div className="mb-8 lg:mb-0">
            <h4 className="text-sm font-bold uppercase tracking-wide mb-4" style={{ color: 'var(--text)' }}>Platform</h4>
            <ul className="space-y-2">
              {[
                { href: '/scholarships', label: 'Browse Scholarships' },
                { href: '/scholarships/create', label: 'Create Scholarship' },
                { href: '/students', label: 'Students' },
                { href: '/dashboard', label: 'Dashboard' },
              ].map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm hover:underline" style={{ color: 'var(--text-muted)' }}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="mb-8 lg:mb-0">
            <h4 className="text-sm font-bold uppercase tracking-wide mb-4" style={{ color: 'var(--text)' }}>Students</h4>
            <ul className="space-y-2">
              {[
                { href: '/students/register', label: 'Register' },
                { href: '/dashboard', label: 'My Scholarships' },
              ].map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm hover:underline" style={{ color: 'var(--text-muted)' }}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wide mb-4" style={{ color: 'var(--text)' }}>Tech</h4>
            <ul className="space-y-2">
              {[
                'Stacks Blockchain',
                'Clarity Smart Contracts',
                'Bitcoin Settlement',
                'STX Token',
              ].map(t => (
                <li key={t} className="text-sm" style={{ color: 'var(--text-muted)' }}>{t}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-8 flex flex-col sm:flex-row items-center justify-between" style={{ borderTop: '1px solid var(--border)' }}>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            © 2026 MicroSponsor. All rights reserved.
          </p>
          <p className="text-sm mt-2 sm:mt-0" style={{ color: 'var(--text-muted)' }}>
            Built on{' '}
            <span className="font-semibold" style={{ color: 'var(--accent)' }}>Stacks</span>
            {' · '}Secured by{' '}
            <span className="font-semibold" style={{ color: '#f59e0b' }}>Bitcoin</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ─────────────────────────────────────────────
   Page
───────────────────────────────────────────── */
export default function Home() {
  return (
    <>
      <Head>
        <title>MicroSponsor — Decentralized Education Funding on Stacks</title>
        <meta name="description" content="Empower students worldwide through transparent, milestone-based scholarships powered by Stacks blockchain smart contracts. Bitcoin-backed. Zero platform fees." />
        <meta name="keywords" content="blockchain scholarship, decentralized education funding, Stacks blockchain, STX token, micro scholarship, student funding, smart contract scholarship, Bitcoin education, Web3 education, milestone funding, DeFi education, crypto scholarship" />
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <link rel="canonical" href="https://microsponsor.vercel.app/" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="MicroSponsor" />
        <meta property="og:title" content="MicroSponsor — Decentralized Education Funding on Stacks" />
        <meta property="og:description" content="Empower students worldwide through transparent, milestone-based scholarships powered by Stacks blockchain smart contracts. Bitcoin-backed. Zero platform fees." />
        <meta property="og:url" content="https://microsponsor.vercel.app/" />
        <meta property="og:image" content="https://microsponsor.vercel.app/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="en_US" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="MicroSponsor — Decentralized Education Funding on Stacks" />
        <meta name="twitter:description" content="Transparent, milestone-based scholarships on the Stacks blockchain. Bitcoin-backed. Zero platform fees." />
        <meta name="twitter:image" content="https://microsponsor.vercel.app/og-image.png" />
        <meta name="talentapp:project_verification" content="87e8f8d71824c1c53cb1538c8150569764e5a29e02b911edf1aed5fd76d86a2948424fdfe451ab74a6bacdc5803a265ba32da9f170301008071d0cc6a3715037" />
      </Head>
      <div style={{ backgroundColor: 'var(--bg)' }} className="min-h-screen">
        <Header />
        <main>
          <HeroSection />
          <StatsBar />
          <HowItWorks />
          <ForStudents />
          <ForDonors />
          <PlatformFeatures />
          <ImpactNumbers />
          <CTASection />
        </main>
        <Footer />
      </div>
    </>
  );
}
