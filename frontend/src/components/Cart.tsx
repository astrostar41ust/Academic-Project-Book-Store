import React from 'react';
import { useCart } from '../context/CartContext';

const Cart: React.FC = () => {
  const { cart, addToCart, removeFromCart, decreaseQuantity } = useCart(); // Access addToCart and decreaseQuantity

  // Calculate total price of items in the cart
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="container mx-auto px-4 py-4 pt-[150px]">
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul>
            {cart.map((item) => (
              <li key={item.id} className="flex justify-between items-center border-b py-4">
                <div>
                  <h3 className="font-bold text-lg">{item.title}</h3>
                  <p className="text-gray-600">${item.price.toFixed(2)} x {item.quantity}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => decreaseQuantity(item.id)} // Decrease quantity
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    -
                  </button>
                  <button
                    onClick={() => addToCart(item)} // Increase quantity
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeFromCart(item.id)} // Remove item from cart
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-6 text-right">
            <h3 className="text-xl font-bold">Total: ${totalPrice.toFixed(2)}</h3>
            <button className="bg-blue-500 text-white px-6 py-2 rounded mt-4 hover:bg-blue-600">
              Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
