import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
// import { useAuth } from '../context/AuthContext';
import { addressAPI } from '../services/api';
import type { Address } from '../types';
import Header from '../components/Header';

type PaymentMethod = 'credit_card' | 'promptpay' | 'bank_transfer' | 'cod';

const CheckoutPage: React.FC = () => {
  const { cart, getTotalPrice, getTotalItems, clearCart } = useCart();
  // const { user } = useAuth();
  const navigate = useNavigate();
  
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit_card');
  // const [loading, setLoading] = useState(false);
  // const [showAddressModal, setShowAddressModal] = useState(false);
  const [processingOrder, setProcessingOrder] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const totalPrice = getTotalPrice();
  const totalItems = getTotalItems();
  const shippingFee = 0; // Free shipping
  const finalTotal = totalPrice + shippingFee;

  useEffect(() => {
    // Redirect if cart is empty (but not if order was just placed)
    if (cart.length === 0 && !orderPlaced) {
      navigate('/cart', { replace: true });
      return;
    }
    
    if (cart.length > 0) {
      loadAddresses();
    }
  }, [cart.length, navigate, orderPlaced]);

  const loadAddresses = async () => {
    // setLoading(true);
    try {
      const data = await addressAPI.getAll();
      setAddresses(data);
      
      // Auto-select default address
      const defaultAddr = data.find(addr => addr.is_default);
      if (defaultAddr) {
        setSelectedAddress(defaultAddr);
      } else if (data.length > 0) {
        setSelectedAddress(data[0]);
      }
    } catch (error) {
      console.error('Error loading addresses:', error);
    } finally {
      // setLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      alert('กรุณาเลือกที่อยู่จัดส่ง');
      return;
    }

    setProcessingOrder(true);
    
    // Save order data before clearing cart
    const orderData = {
      orderNumber: `ORD-${Date.now()}`,
      total: finalTotal,
      address: selectedAddress,
      paymentMethod
    };
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Set flag to prevent redirect to cart
    setOrderPlaced(true);
    
    // Clear cart
    clearCart();
    
    setProcessingOrder(false);
    
    // Small delay to ensure state updates, then navigate
    setTimeout(() => {
      navigate('/order-success', { 
        replace: true,
        state: orderData
      });
    }, 100);
  };

  const paymentMethods = [
    {
      id: 'credit_card',
      name: 'Credit/Debit',
      icon: '💳',
      description: 'Visa, Mastercard, JCB',
    },
    {
      id: 'promptpay',
      name: 'PromptPay',
      icon: '📱',
      description: 'Scan QR Code',
    },
    {
      id: 'bank_transfer',
      name: 'Bank Transfer',
      icon: '🏦',
      description: 'Transfer via bank app',
    },
    {
      id: 'cod',
      name: 'Cash on Delivery',
      icon: '💵',
      description: 'Pay upon delivery',
    },
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 pt-[120px]">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center font-bold">
                  ✓
                </div>
                <span className="ml-2 font-medium text-gray-700">Cart</span>
              </div>
              <div className="w-16 h-1 bg-blue-500"></div>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white flex items-center justify-center font-bold">
                  2
                </div>
                <span className="ml-2 font-medium text-gray-700">Checkout</span>
              </div>
              <div className="w-16 h-1 bg-gray-300"></div>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-300 text-white flex items-center justify-center font-bold">
                  3
                </div>
                <span className="ml-2 font-medium text-gray-400">Complete</span>
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-800 text-center mb-2">Checkout</h1>
            <p className="text-gray-600 text-center">Complete your order</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Address & Payment */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Address Section */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                    <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Shipping Address
                  </h2>
                  {addresses.length < 3 && (
                    <button
                      onClick={() => navigate('/profile')}
                      className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add New Address
                    </button>
                  )}
                </div>

                {addresses.length === 0 ? (
                  <div className="text-center py-8">
                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    <p className="text-gray-600 mb-4">No shipping address available</p>
                    <button
                      onClick={() => navigate('/profile')}
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-2 rounded-lg font-medium"
                    >
                      Add Address
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {addresses.map((address) => (
                      <div
                        key={address.id}
                        onClick={() => setSelectedAddress(address)}
                        className={`border-2 rounded-xl p-5 cursor-pointer transition-all ${
                          selectedAddress?.id === address.id
                            ? 'border-blue-500 bg-blue-50 shadow-md'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-1">
                            <div
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                selectedAddress?.id === address.id
                                  ? 'border-blue-500 bg-blue-500'
                                  : 'border-gray-300'
                              }`}
                            >
                              {selectedAddress?.id === address.id && (
                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="inline-block px-2 py-0.5 bg-gray-200 text-gray-700 text-xs font-medium rounded">
                                {address.label}
                              </span>
                              {address.is_default && (
                                <span className="inline-block px-2 py-0.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs font-medium rounded">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="font-semibold text-gray-800">{address.recipient_name}</p>
                            <p className="text-sm text-gray-600">Phone: {address.phone_number}</p>
                            <p className="text-sm text-gray-700 mt-1">
                              {address.address_line1}
                              {address.address_line2 && `, ${address.address_line2}`}
                            </p>
                            <p className="text-sm text-gray-700">
                              {address.district}, {address.sub_district}, {address.province} {address.postal_code}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Payment Method Section */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  Payment Method
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id as PaymentMethod)}
                      className={`border-2 rounded-xl p-5 cursor-pointer transition-all ${
                        paymentMethod === method.id
                          ? 'border-blue-500 bg-blue-50 shadow-md'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              paymentMethod === method.id
                                ? 'border-blue-500 bg-blue-500'
                                : 'border-gray-300'
                            }`}
                          >
                            {paymentMethod === method.id && (
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-2xl">{method.icon}</span>
                            <span className="font-semibold text-gray-800">{method.name}</span>
                          </div>
                          <p className="text-sm text-gray-600">{method.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Payment Info Box */}
                <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-blue-500 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-blue-900">Secure Payment</p>
                      <p className="text-sm text-blue-700 mt-1">
                        Your payment information is encrypted and secure (Demo Mode - No real charges)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl p-8 sticky top-24">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Summary</h2>

                {/* Order Items */}
                <div className="space-y-4 mb-6 max-h-60 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-3 pb-4 border-b border-gray-100 last:border-0">
                      <div className="flex-shrink-0 w-16 h-20 rounded-lg overflow-hidden bg-gray-100">
                        {item.img_url ? (
                          <img src={item.img_url} alt={item.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-gray-800 truncate">{item.title}</h4>
                        <p className="text-xs text-gray-500 mt-1">Quantity: {item.quantity}</p>
                        <p className="text-sm font-bold text-blue-600 mt-1">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                  <div className="flex justify-between text-gray-600">
                    <span>Total Items ({totalItems} items)</span>
                    <span className="font-semibold">${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping Fee</span>
                    <span className="font-semibold text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Discount</span>
                    <span className="font-semibold text-gray-400">-</span>
                  </div>
                </div>

                {/* Total */}
                <div className="flex justify-between items-center mb-6 pb-6 border-b border-gray-200">
                  <span className="text-xl font-bold text-gray-800">Total</span>
                  <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                    ${finalTotal.toFixed(2)}
                  </span>
                </div>

                {/* Place Order Button */}
                <button
                  onClick={handlePlaceOrder}
                  disabled={!selectedAddress || processingOrder}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none flex items-center justify-center gap-2"
                >
                  {processingOrder ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Confirm Order
                    </>
                  )}
                </button>

                <button
                  onClick={() => navigate('/cart')}
                  className="w-full mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  ← Back to Cart
                </button>

                {/* Trust Badges */}
                <div className="mt-6 pt-6 border-t space-y-3">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Secure Payment</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Free Shipping on All Orders</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Satisfaction Guarantee</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;
