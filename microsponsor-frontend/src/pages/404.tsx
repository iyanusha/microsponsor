import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Page Not Found - MicroSponsor</title>
      </Head>

      <Header />

      <main className="max-w-md mx-auto py-24 px-4 text-center">
        <p className="text-6xl font-bold text-indigo-200 mb-4">404</p>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Page not found
        </h1>
        <p className="text-gray-500 mb-8">
          The page you are looking for does not exist.
        </p>
        <Link href="/" className="btn-primary">
          Back to Home
        </Link>
      </main>
    </div>
  );
}
