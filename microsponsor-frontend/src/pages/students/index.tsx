import Head from 'next/head';
import Link from 'next/link';
import Header from '../../components/Header';
import { useWallet } from '../../hooks/useWallet';
import { truncateAddress } from '../../utils/helpers';

export default function StudentsIndex() {
  const { connected } = useWallet();

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Students - MicroSponsor</title>
        <meta name="description" content="Browse MicroSponsor students" />
      </Head>

      <Header />

      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Students</h1>
          {connected ? (
            <Link href="/students/register" className="btn-primary text-sm">
              Register as Student
            </Link>
          ) : null}
        </div>

        <div className="card">
          <div className="card-body text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-300 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 14l9-5-9-5-9 5 9 5zm0 7l-9-5 9-5 9 5-9 5zm0-7v7"
              />
            </svg>
            <p className="text-gray-500 mb-2">
              Student directory coming soon.
            </p>
            <p className="text-sm text-gray-400">
              Search by wallet address using the URL:{' '}
              <code className="bg-gray-100 px-1 rounded text-xs">
                /students/[address]
              </code>
            </p>
            <div className="mt-6">
              <Link href="/students/register" className="btn-secondary text-sm">
                Register as Student
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
