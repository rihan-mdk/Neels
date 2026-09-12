'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Minus, Plus } from 'lucide-react';
import { CartItem as CartItemType } from '@/context/CartContext';
import { useCart } from '@/context/CartContext';
import styles from './CartItem.module.css';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { removeFromCart, increaseQuantity, decreaseQuantity } = useCart();

  return (
    <div className={styles.item}>
      <Link href={`/product/${item.product.slug}`} className={styles.imageLink}>
        <div className={styles.image}>
          <Image
            src={item.product.images.primary}
            alt={item.product.name}
            fill
            sizes="100px"
            className={styles.img}
          />
        </div>
      </Link>

      <div className={styles.details}>
        <div className={styles.top}>
          <div>
            <p className={styles.brand}>NEELSH</p>
            <Link
              href={`/product/${item.product.slug}`}
              className={styles.name}
            >
              {item.product.name}
            </Link>
            <p className={styles.size}>Size: {item.size}</p>
          </div>
          <button
            onClick={() => removeFromCart(item.cartId)}
            className={styles.removeBtn}
            aria-label={`Remove ${item.product.name} from bag`}
          >
            <X size={14} strokeWidth={1.5} />
          </button>
        </div>

        <div className={styles.bottom}>
          <div className={styles.qty}>
            <button
              className={styles.qtyBtn}
              onClick={() => decreaseQuantity(item.cartId)}
              aria-label="Decrease quantity"
            >
              <Minus size={12} strokeWidth={1.5} />
            </button>
            <span className={styles.qtyCount}>{item.quantity}</span>
            <button
              className={styles.qtyBtn}
              onClick={() => increaseQuantity(item.cartId)}
              aria-label="Increase quantity"
            >
              <Plus size={12} strokeWidth={1.5} />
            </button>
          </div>
          <p className={styles.price}>
            {item.product.price === null
              ? 'Price on Request'
              : `₹${(item.product.price * item.quantity).toLocaleString('en-IN')}`}
          </p>
        </div>
      </div>
    </div>
  );
}
