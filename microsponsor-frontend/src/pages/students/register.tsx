import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Header from '../../components/Header';
import FormField from '../../components/FormField';
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
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg)' }}>
      <Head>
        <title>Register as Student - MicroSponsor</title>
        <meta name="description" content="Register as a student on MicroSponsor" />
      </Head>

      <Header />

      <main className="max-w-xl mx-auto py-10 px-4 sm:px-6">
        <div className="card">
          <div className="card-header">
            <h1 className="text-2xl font-extrabold" style={{ color: 'var(--text)' }}>
              Register as Student
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
              Your institution must be pre-verified to register.
            </p>
          </div>
          <div className="card-body">
            {errors.form && (
              <div className="mb-5 p-4 rounded-xl text-sm" style={{ backgroundColor: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }}>
                {errors.form}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <FormField id="name" label="Full Name" error={errors.name}>
                <input
                  id="name"
                  type="text"
                  className="input mt-1"
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
                  className="input mt-1"
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
                  className="input mt-1"
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
                    className="input mt-1"
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
                    className="input mt-1"
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
                  className={`btn-primary px-8 py-3 rounded-xl ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {loading ? 'Registering…' : 'Register'}
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
