export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900">MicroSponsor</h1>
        <p className="mt-4 text-gray-600">
          Redirecting to the main application...
        </p>
        <p className="mt-2 text-sm text-gray-500">
          Please visit <a href="/dashboard" className="text-indigo-600 hover:underline">the dashboard</a>
        </p>
      </div>
    </div>
  );
}
