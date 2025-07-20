import React, { useEffect } from 'react';
import { CheckCircleIcon, XCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[10000] pointer-events-none">
      <div className="animate-fade-in pointer-events-auto">
        <div className={`rounded-lg shadow-lg bg-white border px-4 py-2.5 ${
          type === 'success' ? 'border-green-100' : 'border-red-100'
        }`}>
          <div className="flex items-center space-x-2">
            <div className="flex-shrink-0">
              {type === 'success' ? (
                <CheckCircleIcon className="h-5 w-5 text-green-500" />
              ) : (
                <XCircleIcon className="h-5 w-5 text-red-500" />
              )}
            </div>
            <p className={`text-sm font-medium ${
              type === 'success' ? 'text-green-800' : 'text-red-800'
            }`}>
              {message}
            </p>
            <button
              type="button"
              className={`flex-shrink-0 ml-2 -mr-1 rounded-md p-0.5 inline-flex hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                type === 'success' ? 'focus:ring-green-500' : 'focus:ring-red-500'
              }`}
              onClick={onClose}
            >
              <span className="sr-only">Đóng</span>
              <XMarkIcon className="h-4 w-4 text-gray-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Toast; 