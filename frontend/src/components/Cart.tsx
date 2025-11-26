import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Modal from './Modal';

const Cart: React.FC = () => {
  const { cart, addToCart, removeFromCart, decreaseQuantity, getTotalPrice, getTotalItems } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const totalPrice = getTotalPrice();
  const totalItems = getTotalItems();

  const handleCheckout = () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
    } else {
      navigate('/checkout');
    }
  };

  const handleLoginRedirect = () => {
    setShowLoginModal(false);
    navigate('/login');
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 pt-[120px]">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Shopping Cart</h1>
            <p className="text-gray-600">
              {cart.length === 0 ? 'Your cart is empty' : `${totalItems} item${totalItems > 1 ? 's' : ''} in your cart`}
            </p>
          </div>

          {cart.length === 0 ? (
            /* Empty Cart State */
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <div className="mb-6">
                <svg className="w-32 h-32 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">Your cart is empty</h3>
              <p className="text-gray-500 mb-6">Start adding some books to your cart!</p>
              <button
                onClick={() => navigate('/books')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
              >
                Browse Books
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 p-6"
                  >
                    <div className="flex items-center gap-6">
                      {/* Book Image */}
                      <div className="flex-shrink-0 w-24 h-32 rounded-lg overflow-hidden bg-gray-100">
                        {item.img_url ? (
                          <img 
                            src={item.img_url} 
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                            <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* Book Details */}
                      <div className="flex-grow">
                        <h3 className="text-lg font-bold text-gray-800 mb-1">{item.title}</h3>
                        {item.author && (
                          <p className="text-sm text-gray-600 mb-1">
                            <span className="text-gray-500">by:</span> <span className="font-medium">{item.author}</span>
                          </p>
                        )}
                        <p className="text-sm text-gray-400 mb-2">Item #{item.id}</p>
                        <div className="flex items-center gap-4">
                          <span className="text-xl font-bold text-blue-600">${item.price.toFixed(2)}</span>
                          <span className="text-sm text-gray-500">× {item.quantity}</span>
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex flex-col items-center gap-3">
                        <div className="flex items-center bg-gray-100 rounded-lg">
                          <button
                            onClick={() => decreaseQuantity(item.id)}
                            className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-200 rounded-l-lg transition-colors"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                          </button>
                          <span className="w-12 text-center font-semibold text-gray-800">{item.quantity}</span>
                          <button
                            onClick={() => addToCart(item)}
                            className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-200 rounded-r-lg transition-colors"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center gap-1 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Summary</h2>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal ({totalItems} items)</span>
                      <span className="font-semibold">${totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Shipping</span>
                      <span className="font-semibold text-green-600">Free</span>
                    </div>
                    <div className="border-t pt-4">
                      <div className="flex justify-between text-lg font-bold text-gray-800">
                        <span>Total</span>
                        <span className="text-blue-600">${totalPrice.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleCheckout}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    Proceed to Checkout
                  </button>

                  <div className="mt-4 text-center">
                    <button
                      onClick={() => navigate('/books')}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      ← Continue Shopping
                    </button>
                  </div>

                  {/* Trust Badges */}
                  <div className="mt-6 pt-6 border-t space-y-3">
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Secure Checkout</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Free Shipping</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Easy Returns</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Login Required Modal */}
      <Modal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        title="Error"
        message="Please log in before proceeding"
        onConfirm={handleLoginRedirect}
        confirmText="OK"
        type="error"
      />
    </>
  );
};

export default Cart;
