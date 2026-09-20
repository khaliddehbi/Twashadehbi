import React from 'react';
import { useStore } from '../../context/StoreContext';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';

export default function ToastContainer() {
  const { toasts } = useStore();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className="toast-item">
          {toast.type === 'error' ? (
            <AlertCircle size={18} color="#EF4444" />
          ) : (
            <CheckCircle size={18} color="var(--gold-400)" />
          )}
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
}
