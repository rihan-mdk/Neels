'use client';

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  useState,
  useRef,
} from 'react';
import { Product, ProductSize } from '@/data/products';

// ============================================================
// Types
// ============================================================

export interface CartItem {
  product: Product;
  size: ProductSize;
  quantity: number;
  cartId: string; // unique: productId + size
}

interface CartState {
  items: CartItem[];
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: Product; size: ProductSize } }
  | { type: 'REMOVE_ITEM'; payload: { cartId: string } }
  | { type: 'INCREASE_QUANTITY'; payload: { cartId: string } }
  | { type: 'DECREASE_QUANTITY'; payload: { cartId: string } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] };

export interface CartNotificationItem {
  product: Product;
  size: ProductSize;
  timestamp: number;
}

interface CartContextValue {
  items: CartItem[];
  addToCart: (product: Product, size: ProductSize) => void;
  removeFromCart: (cartId: string) => void;
  increaseQuantity: (cartId: string) => void;
  decreaseQuantity: (cartId: string) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  isInCart: (productId: string, size: ProductSize) => boolean;
  lastAdded: CartNotificationItem | null;
  dismissNotification: () => void;
}

// ============================================================
// Reducer
// ============================================================

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, size } = action.payload;
      const cartId = `${product.id}-${size}`;
      const existing = state.items.find((i) => i.cartId === cartId);
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.cartId === cartId ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { product, size, quantity: 1, cartId }],
      };
    }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter((i) => i.cartId !== action.payload.cartId),
      };
    case 'INCREASE_QUANTITY':
      return {
        ...state,
        items: state.items.map((i) =>
          i.cartId === action.payload.cartId
            ? { ...i, quantity: i.quantity + 1 }
            : i
        ),
      };
    case 'DECREASE_QUANTITY':
      return {
        ...state,
        items: state.items
          .map((i) =>
            i.cartId === action.payload.cartId
              ? { ...i, quantity: i.quantity - 1 }
              : i
          )
          .filter((i) => i.quantity > 0),
      };
    case 'CLEAR_CART':
      return { items: [] };
    case 'LOAD_CART':
      return { items: action.payload };
    default:
      return state;
  }
}

// ============================================================
// Context
// ============================================================

const CartContext = createContext<CartContextValue | null>(null);

const CART_STORAGE_KEY = 'neelsh_cart_v1';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as CartItem[];
        if (Array.isArray(parsed)) {
          dispatch({ type: 'LOAD_CART', payload: parsed });
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // Persist to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items));
    } catch {
      // ignore
    }
  }, [state.items]);

  const [lastAdded, setLastAdded] = useState<CartNotificationItem | null>(null);
  const notificationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const dismissNotification = useCallback(() => {
    if (notificationTimeoutRef.current) clearTimeout(notificationTimeoutRef.current);
    setLastAdded(null);
  }, []);

  const addToCart = useCallback((product: Product, size: ProductSize) => {
    dispatch({ type: 'ADD_ITEM', payload: { product, size } });
    setLastAdded({ product, size, timestamp: Date.now() });
    if (notificationTimeoutRef.current) clearTimeout(notificationTimeoutRef.current);
    notificationTimeoutRef.current = setTimeout(() => {
      setLastAdded(null);
    }, 6000);
  }, []);

  const removeFromCart = useCallback((cartId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { cartId } });
  }, []);

  const increaseQuantity = useCallback((cartId: string) => {
    dispatch({ type: 'INCREASE_QUANTITY', payload: { cartId } });
  }, []);

  const decreaseQuantity = useCallback((cartId: string) => {
    dispatch({ type: 'DECREASE_QUANTITY', payload: { cartId } });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
  }, []);

  const getCartTotal = useCallback(() => {
    return state.items.reduce((total, item) => {
      const price = item.product.price ?? 0;
      return total + price * item.quantity;
    }, 0);
  }, [state.items]);

  const getCartCount = useCallback(() => {
    return state.items.reduce((count, item) => count + item.quantity, 0);
  }, [state.items]);

  const isInCart = useCallback(
    (productId: string, size: ProductSize) => {
      return state.items.some((i) => i.cartId === `${productId}-${size}`);
    },
    [state.items]
  );

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
        isInCart,
        lastAdded,
        dismissNotification,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
