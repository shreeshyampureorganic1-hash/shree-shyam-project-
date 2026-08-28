import React from 'react';
import { useStore } from '../../context/StoreContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast() {
  const { toastMessage } = useStore();

  if (!toastMessage) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />,
    info: <Info className="w-5 h-5 text-gold-400 flex-shrink-0" />
  };

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in max-w-md w-full px-4">
      <div className="bg-forest-900/95 backdrop-blur-md text-ivory-50 border border-gold-500/50 shadow-2xl rounded-2xl p-4 flex items-center space-x-3">
        {icons[toastMessage.type] || icons.success}
        <p className="text-sm font-medium flex-1 text-stone-100">{toastMessage.message}</p>
      </div>
    </div>
  );
}
