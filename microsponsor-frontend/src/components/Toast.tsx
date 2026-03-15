import { useEffect, useState } from 'react';

type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onDismiss?: () => void;
}

const typeStyles: Record<ToastType, string> = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
};

const Toast = ({ message, type = 'success', duration = 4000, onDismiss }: ToastProps) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(false);
      onDismiss?.();
    }, duration);
    return () => clearTimeout(t);
  }, [duration, onDismiss]);

  if (!visible) return null;

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 flex items-center space-x-3 px-4 py-3
                  rounded-md border shadow-lg text-sm max-w-sm ${typeStyles[type]}`}
    >
      <span>{message}</span>
      <button
        onClick={() => { setVisible(false); onDismiss?.(); }}
        className="ml-2 opacity-60 hover:opacity-100"
      >
        ✕
      </button>
    </div>
  );
};

export default Toast;
