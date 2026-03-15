import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';

export default function ServerError() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Server Error - MicroSponsor</title>
      </Head>

      <Header />

      <main className="max-w-md mx-auto py-24 px-4 text-center">
        <p className="text-6xl font-bold text-red-100 mb-4">500</p>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Something went wrong
        </h1>
        <p className="text-gray-500 mb-8">
          An unexpected error occurred. Please try again later.
        </p>
        <Link href="/" className="btn-primary">
          Back to Home
        </Link>
      </main>
    </div>
  );
}
