import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Header from '../../components/Header';
import Toast from '../../components/Toast';
import { useWallet } from '../../hooks/useWallet';
import { registerStudent } from '../../utils/contracts';
import { isValidStacksAddress } from '../../utils/helpers';

const CURRENT_YEAR = new Date().getFullYear();

export default function RegisterStudent() {
  const router = useRouter();
  const { connected, connect } = useWallet();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    institution: '',
    emergencyContact: '',
    program: '',
    academicYear: String(CURRENT_YEAR),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!connected) { connect(); return; }
    if (!isValidStacksAddress(formData.emergencyContact)) {
      setError('Invalid emergency contact address');
      return;
    }
    setLoading(true);
    try {
      registerStudent(
        formData.name,
        formData.institution,
        formData.emergencyContact,
        formData.program,
        parseInt(formData.academicYear),
        {
          onFinish: () => {
            setLoading(false);
            setSuccess(true);
          },
          onCancel: () => setLoading(false),
        }
      );
    } catch (err) {
      console.error('Registration error:', err);
      setError('Transaction failed. Please try again.');
      setLoading(false);
    }
  };

  const update = (field: string, value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Register as Student - MicroSponsor</title>
        <meta name="description" content="Register as a student on MicroSponsor" />
      </Head>

      <Header />

      <main className="max-w-xl mx-auto py-8 px-4 sm:px-6">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Register as Student
            </h1>
            <p className="text-sm text-gray-500 mb-6">
              Your institution must be pre-verified before you can register.
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md
                              text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded-md
                             shadow-sm py-2 px-3 text-sm focus:outline-none
                             focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.name}
                  onChange={(e) => update('name', e.target.value)}
                  maxLength={50}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Institution Name
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded-md
                             shadow-sm py-2 px-3 text-sm focus:outline-none
                             focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.institution}
                  onChange={(e) => update('institution', e.target.value)}
                  maxLength={100}
                  placeholder="Must match verified institution name exactly"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Program of Study
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded-md
                             shadow-sm py-2 px-3 text-sm focus:outline-none
                             focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.program}
                  onChange={(e) => update('program', e.target.value)}
                  maxLength={50}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Academic Year
                  </label>
                  <input
                    type="number"
                    className="mt-1 block w-full border border-gray-300 rounded-md
                               shadow-sm py-2 px-3 text-sm focus:outline-none
                               focus:ring-indigo-500 focus:border-indigo-500"
                    value={formData.academicYear}
                    onChange={(e) => update('academicYear', e.target.value)}
                    min="2020"
                    max="2030"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Emergency Contact Address
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full border border-gray-300 rounded-md
                               shadow-sm py-2 px-3 text-sm focus:outline-none
                               focus:ring-indigo-500 focus:border-indigo-500"
                    value={formData.emergencyContact}
                    onChange={(e) => update('emergencyContact', e.target.value)}
                    placeholder="ST..."
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className={`btn-primary ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {loading ? 'Registering...' : 'Register'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      {success && (
        <Toast
          message="Registration submitted! Await admin verification."
          type="success"
          onDismiss={() => router.push('/dashboard')}
        />
      )}
    </div>
  );
}
