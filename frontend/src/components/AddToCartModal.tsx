import React, { useEffect } from 'react';

interface AddToCartModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookTitle: string;
}

const AddToCartModal: React.FC<AddToCartModalProps> = ({ isOpen, onClose, bookTitle }) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black transition-opacity duration-300"
        style={{ opacity: 0.2 }}
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full mx-4 transform transition-all duration-300 animate-scaleIn">
        <div className="px-8 py-10 text-center">
          {/* Shopping Bag Icon with Checkmark */}
          <div className="flex justify-center mb-6 relative">
            {/* Shopping Bag */}
            <div className="relative">
              <svg className="w-24 h-24 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {/* Green Checkmark Circle */}
              <div className="absolute -top-2 -right-2 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center animate-checkBounce shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Message */}
          <h3 className="text-xl font-bold text-gray-800 mb-2">Add to cart successfully</h3>
          <p className="text-sm text-gray-600 line-clamp-2">{bookTitle}</p>
        </div>
      </div>

      <style>{`
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes checkBounce {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.2);
          }
        }

        .animate-scaleIn {
          animation: scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .animate-checkBounce {
          animation: checkBounce 0.6s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default AddToCartModal;
