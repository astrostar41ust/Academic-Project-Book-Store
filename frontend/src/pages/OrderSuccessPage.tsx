import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import type { Address } from '../types';

interface LocationState {
  orderNumber: string;
  total: number;
  address: Address;
  paymentMethod: string;
}

const OrderSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;

  useEffect(() => {
    // Redirect if no order data
    if (!state) {
      navigate('/', { replace: true });
    }
  }, [state, navigate]);

  if (!state) {
    return null;
  }

  const paymentMethodNames: Record<string, string> = {
    credit_card: 'Credit/Debit',
    promptpay: 'PromptPay',
    bank_transfer: 'Bank Transfer',
    cod: 'Cash on Delivery',
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 pt-[120px]">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Success Animation */}
          <div className="text-center mb-8">
            <div className="inline-block mb-4 relative">
              <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-2xl animate-bounce">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="absolute -inset-2 bg-green-400 rounded-full opacity-20 animate-ping"></div>
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Order Successful!</h1>
            <p className="text-gray-600 text-lg">Thank you for your purchase</p>
          </div>

          {/* Order Details Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
              <div className="flex items-center justify-between text-white">
                <div>
                  <p className="text-sm opacity-90 mb-1">Order Number</p>
                  <p className="text-2xl font-bold">{state.orderNumber}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm opacity-90 mb-1">Order Date</p>
                  <p className="text-lg font-semibold">
                    {new Date().toLocaleDateString('en-EN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              {/* Total Amount */}
              <div className="mb-8 text-center pb-8 border-b border-gray-200">
                <p className="text-gray-600 mb-2">Total Amount</p>
                <p className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  ${state.total.toFixed(2)}
                </p>
              </div>

              {/* Shipping Address */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Shipping Address
                </h3>
                <div className="bg-gray-50 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-block px-2 py-0.5 bg-gray-200 text-gray-700 text-xs font-medium rounded">
                      {state.address.label}
                    </span>
                  </div>
                  <p className="font-semibold text-gray-800 text-lg">{state.address.recipient_name}</p>
                  <p className="text-gray-600 text-sm mt-1">Phone: {state.address.phone_number}</p>
                  <p className="text-gray-700 mt-2">
                    {state.address.address_line1}
                    {state.address.address_line2 && `, ${state.address.address_line2}`}
                  </p>
                  <p className="text-gray-700">
                    {state.address.district}, {state.address.sub_district}
                  </p>
                  <p className="text-gray-700">
                    {state.address.province} {state.address.postal_code}
                  </p>
                </div>
              </div>

              {/* Payment Method */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  Payment Method
                </h3>
                <div className="bg-gray-50 rounded-xl p-5">
                  <p className="font-semibold text-gray-800">
                    {paymentMethodNames[state.paymentMethod] || state.paymentMethod}
                  </p>
                  <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Payment Successful (Demo Mode)
                  </p>
                </div>
              </div>

              {/* Order Status Timeline */}
              <div className="mt-8">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Order Status</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">Order Received</p>
                      <p className="text-sm text-gray-500">We have received your order and are processing it</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                        <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-400">Preparing for Shipment</p>
                      <p className="text-sm text-gray-400">We are preparing your items</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-400">Delivered</p>
                      <p className="text-sm text-gray-400">Your items have been delivered</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate('/books')}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Buy More Books
            </button>
            <button
              onClick={() => navigate('/')}
              className="flex-1 bg-white hover:bg-gray-50 text-gray-700 font-bold py-4 px-6 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg border-2 border-gray-200 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Back to Home
            </button>
          </div>

          {/* Email Confirmation Note */}
          <div className="mt-8 bg-blue-50 border-l-4 border-blue-500 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <div>
                <p className="font-semibold text-blue-900 mb-1">Order information has been sent to your email</p>
                <p className="text-sm text-blue-700">
                  We have sent the order details and receipt to your email. If you have any questions, feel free to contact us anytime.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderSuccessPage;
