import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Header from '../../components/Header';
import FormField from '../../components/FormField';
import Toast from '../../components/Toast';
import { useWallet } from '../../hooks/useWallet';
import { registerStudent } from '../../utils/contracts';
import { isValidStacksAddress } from '../../utils/helpers';

const INPUT_CLS = `mt-1 block w-full border border-gray-300 rounded-md shadow-sm
  py-2 px-3 text-sm focus:outline-none
  focus:ring-indigo-500 focus:border-indigo-500`;

const CURRENT_YEAR = new Date().getFullYear();

export default function RegisterStudent() {
  const router = useRouter();
  const { connected, connect } = useWallet();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    name: '',
    institution: '',
    emergencyContact: '',
    program: '',
    academicYear: String(CURRENT_YEAR),
  });

  const validate = () => {
    const e: Record<string, string> = {};
    if (!formData.name.trim()) e.name = 'Name is required';
    if (!formData.institution.trim()) e.institution = 'Institution is required';
    if (!formData.program.trim()) e.program = 'Program is required';
    if (!isValidStacksAddress(formData.emergencyContact)) {
      e.emergencyContact = 'Invalid Stacks address';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!connected) { connect(); return; }
    if (!validate()) return;
    setLoading(true);
    try {
      registerStudent(
        formData.name,
        formData.institution,
        formData.emergencyContact,
        formData.program,
        parseInt(formData.academicYear),
        {
          onFinish: () => { setLoading(false); setSuccess(true); },
          onCancel: () => setLoading(false),
        }
      );
    } catch (err) {
      console.error('Registration error:', err);
      setErrors({ form: 'Transaction failed. Please try again.' });
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
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              Register as Student
            </h1>
            <p className="text-sm text-gray-500 mb-6">
              Your institution must be pre-verified to register.
            </p>

            {errors.form && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
                {errors.form}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <FormField id="name" label="Full Name" error={errors.name}>
                <input
                  id="name"
                  type="text"
                  className={INPUT_CLS}
                  value={formData.name}
                  onChange={(e) => update('name', e.target.value)}
                  maxLength={50}
                  required
                />
              </FormField>

              <FormField
                id="institution"
                label="Institution Name"
                error={errors.institution}
                hint="Must match the exact verified institution name"
              >
                <input
                  id="institution"
                  type="text"
                  className={INPUT_CLS}
                  value={formData.institution}
                  onChange={(e) => update('institution', e.target.value)}
                  maxLength={100}
                  required
                />
              </FormField>

              <FormField id="program" label="Program of Study" error={errors.program}>
                <input
                  id="program"
                  type="text"
                  className={INPUT_CLS}
                  value={formData.program}
                  onChange={(e) => update('program', e.target.value)}
                  maxLength={50}
                  required
                />
              </FormField>

              <div className="grid grid-cols-2 gap-4">
                <FormField id="academicYear" label="Academic Year">
                  <input
                    id="academicYear"
                    type="number"
                    className={INPUT_CLS}
                    value={formData.academicYear}
                    onChange={(e) => update('academicYear', e.target.value)}
                    min="2020"
                    max="2035"
                    required
                  />
                </FormField>

                <FormField
                  id="emergencyContact"
                  label="Emergency Contact"
                  error={errors.emergencyContact}
                  hint="Stacks address (ST...)"
                >
                  <input
                    id="emergencyContact"
                    type="text"
                    className={INPUT_CLS}
                    value={formData.emergencyContact}
                    onChange={(e) => update('emergencyContact', e.target.value)}
                    placeholder="ST..."
                    required
                  />
                </FormField>
              </div>

              <div className="flex justify-end pt-2">
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
