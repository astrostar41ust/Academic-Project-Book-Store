import React, { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  onConfirm?: () => void;
  confirmText?: string;
  type?: 'info' | 'warning' | 'error' | 'success';
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  onConfirm,
  confirmText = 'OK',
  type = 'info',
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop with animation */}
      <div
        className="absolute inset-0 bg-black transition-opacity duration-500 backdrop-blur-sm"
        style={{ opacity: 0.6 }}
        onClick={onClose}
      />

      {/* Modal with animation */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full mx-4 transform transition-all duration-300 animate-scaleIn">
        {/* Content */}
        <div className="px-8 py-10 text-center">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            {type === 'error' && (
              <div className="w-24 h-24 rounded-full border-4 border-red-400 flex items-center justify-center animate-pulse">
                <svg className="w-14 h-14 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            )}
            {type === 'warning' && (
              <div className="w-24 h-24 rounded-full border-4 border-yellow-400 flex items-center justify-center animate-pulse">
                <svg className="w-14 h-14 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            )}
            {type === 'success' && (
              <div className="w-24 h-24 rounded-full border-4 border-green-400 flex items-center justify-center animate-pulse">
                <svg className="w-14 h-14 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
            {type === 'info' && (
              <div className="w-24 h-24 rounded-full border-4 border-blue-400 flex items-center justify-center animate-pulse">
                <svg className="w-14 h-14 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            )}
          </div>

          {/* Title */}
          <h3 className="text-2xl font-bold text-gray-800 mb-3">{title}</h3>

          {/* Message */}
          <p className="text-gray-600 text-base mb-8">{message}</p>

          {/* OK Button */}
          <button
            onClick={handleConfirm}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            {confirmText}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-scaleIn {
          animation: scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        .animate-pulse {
          animation: pulse 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Modal;
