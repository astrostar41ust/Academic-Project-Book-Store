import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface CartItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
  img_url?: string;
  author?: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  decreaseQuantity: (id: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [guestCart, setGuestCart] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const loadCart = () => {
      if (isAuthenticated && user) {
        // Load user-specific cart
        const userCartKey = `cart_user_${user.id}`;
        const savedCart = localStorage.getItem(userCartKey);
        if (savedCart) {
          setCart(JSON.parse(savedCart));
        }
      } else {
        // Load guest cart
        const savedGuestCart = localStorage.getItem('cart_guest');
        if (savedGuestCart) {
          setGuestCart(JSON.parse(savedGuestCart));
          setCart(JSON.parse(savedGuestCart));
        }
      }
    };

    loadCart();
  }, [isAuthenticated, user]);

  // Handle login: merge guest cart with user cart
  useEffect(() => {
    if (isAuthenticated && user && guestCart.length > 0) {
      // Merge guest cart with user cart
      const userCartKey = `cart_user_${user.id}`;
      const savedUserCart = localStorage.getItem(userCartKey);
      const userCart = savedUserCart ? JSON.parse(savedUserCart) : [];
      
      // Merge carts
      const mergedCart = [...userCart];
      guestCart.forEach((guestItem) => {
        const existingItem = mergedCart.find(item => item.id === guestItem.id);
        if (existingItem) {
          existingItem.quantity += guestItem.quantity;
        } else {
          mergedCart.push(guestItem);
        }
      });

      setCart(mergedCart);
      localStorage.setItem(userCartKey, JSON.stringify(mergedCart));
      
      // Clear guest cart
      localStorage.removeItem('cart_guest');
      setGuestCart([]);
    }
  }, [isAuthenticated, user, guestCart]);

  // Handle logout: clear cart
  useEffect(() => {
    if (!isAuthenticated) {
      setCart([]);
      setGuestCart([]);
    }
  }, [isAuthenticated]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isAuthenticated && user) {
      const userCartKey = `cart_user_${user.id}`;
      localStorage.setItem(userCartKey, JSON.stringify(cart));
    } else {
      localStorage.setItem('cart_guest', JSON.stringify(cart));
    }
  }, [cart, isAuthenticated, user]);

  const addToCart = (item: CartItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const decreaseQuantity = (id: number) => {
    setCart((prevCart) => {
      return prevCart
        .map((cartItem) =>
          cartItem.id === id && cartItem.quantity > 1
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
        )
        .filter((cartItem) => cartItem.quantity > 0);
    });
  };

  const clearCart = () => {
    setCart([]);
    if (isAuthenticated && user) {
      const userCartKey = `cart_user_${user.id}`;
      localStorage.removeItem(userCartKey);
    } else {
      localStorage.removeItem('cart_guest');
    }
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      decreaseQuantity,
      clearCart,
      getTotalItems,
      getTotalPrice
    }}>
      {children}
    </CartContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
