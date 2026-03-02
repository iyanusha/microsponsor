interface ErrorBannerProps {
  message: string;
  onDismiss?: () => void;
}

const ErrorBanner = ({ message, onDismiss }: ErrorBannerProps) => (
  <div className="rounded-md bg-red-50 border border-red-200 p-4 flex items-start justify-between">
    <div className="flex items-center space-x-2">
      <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p className="text-sm text-red-700">{message}</p>
    </div>
    {onDismiss && (
      <button onClick={onDismiss} className="ml-4 text-red-400 hover:text-red-600 flex-shrink-0">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    )}
  </div>
);

export default ErrorBanner;
