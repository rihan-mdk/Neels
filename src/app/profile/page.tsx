'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

const MOCK_ORDERS = [
  {
    id: 'NDS-20261001',
    date: '01 Oct 2026',
    status: 'Delivered',
    items: ['Heritage Ivory Embroidered Lehenga'],
    total: '₹ 68,000',
  },
  {
    id: 'NDS-20260918',
    date: '18 Sep 2026',
    status: 'Processing',
    items: ['Kundan Polki Choker Set', 'Antique Gold Marodi Lehenga'],
    total: '₹ 1,12,000',
  },
  {
    id: 'NDS-20260830',
    date: '30 Aug 2026',
    status: 'Delivered',
    items: ['Crimson Heirloom Lehenga'],
    total: '₹ 82,000',
  },
];

const STATUS_COLORS: Record<string, string> = {
  Delivered: 'var(--color-text)',
  Processing: '#b07d3e',
  Cancelled: 'var(--color-muted)',
};

type Tab = 'orders' | 'wishlist' | 'settings';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<Tab>('orders');

  return (
    <div className={styles.page}>
      <div className={styles.inner}>

        {/* ── Profile Hero ── */}
        <div className={styles.hero}>
          <div className={styles.avatarWrap}>
            <div className={styles.avatar}>
              <span className={styles.avatarInitials}>NS</span>
            </div>
            <div className={styles.avatarBadge}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="var(--color-ivory)" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            </div>
          </div>
          <div className={styles.heroText}>
            <p className={styles.eyebrow}>Member Since 2026</p>
            <h1 className={styles.name}>Neels Studio</h1>
            <p className={styles.email}>studio@neelsdesignerstudio.com</p>
          </div>
          <div className={styles.heroActions}>
            <Link href="/contact" className="btn btn-secondary">Book Appointment</Link>
          </div>
        </div>

        {/* ── Stats Row ── */}
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statVal}>3</span>
            <span className={styles.statLabel}>Orders</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <span className={styles.statVal}>5</span>
            <span className={styles.statLabel}>Wishlist</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <span className={styles.statVal}>₹ 2,62,000</span>
            <span className={styles.statLabel}>Total Spent</span>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className={styles.tabs}>
          {(['orders', 'wishlist', 'settings'] as Tab[]).map((tab) => (
            <button
              key={tab}
              className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'orders' ? 'My Orders' : tab === 'wishlist' ? 'Wishlist' : 'Settings'}
            </button>
          ))}
        </div>

        {/* ── Orders Tab ── */}
        {activeTab === 'orders' && (
          <div className={styles.tabContent}>
            <div className={styles.orders}>
              {MOCK_ORDERS.map((order) => (
                <div key={order.id} className={styles.order}>
                  <div className={styles.orderTop}>
                    <div>
                      <p className={styles.orderId}>{order.id}</p>
                      <p className={styles.orderDate}>{order.date}</p>
                    </div>
                    <span
                      className={styles.orderStatus}
                      style={{ color: STATUS_COLORS[order.status] }}
                    >
                      {order.status}
                    </span>
                  </div>
                  <div className={styles.orderItems}>
                    {order.items.map((item) => (
                      <p key={item} className={styles.orderItem}>{item}</p>
                    ))}
                  </div>
                  <div className={styles.orderBottom}>
                    <span className={styles.orderTotal}>{order.total}</span>
                    <Link href="/contact" className={styles.orderLink}>Track Order →</Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Wishlist Tab ── */}
        {activeTab === 'wishlist' && (
          <div className={styles.tabContent}>
            <div className={styles.emptyState}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-muted)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              <p className={styles.emptyTitle}>Your wishlist is empty</p>
              <p className={styles.emptyText}>Save pieces you love and revisit them at any time.</p>
              <Link href="/collections" className="btn btn-primary" style={{ marginTop: '8px' }}>Explore Collections</Link>
            </div>
          </div>
        )}

        {/* ── Settings Tab ── */}
        {activeTab === 'settings' && (
          <div className={styles.tabContent}>
            <div className={styles.settingsGrid}>
              <div className={styles.settingsSection}>
                <h2 className={styles.settingsTitle}>Personal Details</h2>
                <div className={styles.field}>
                  <label className={styles.label}>Full Name</label>
                  <input className={styles.input} defaultValue="Neels Studio" />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Email Address</label>
                  <input className={styles.input} defaultValue="studio@neelsdesignerstudio.com" />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Phone Number</label>
                  <input className={styles.input} defaultValue="+91 98765 43210" />
                </div>
                <button className="btn btn-primary" style={{ marginTop: '8px' }}>Save Changes</button>
              </div>

              <div className={styles.settingsSection}>
                <h2 className={styles.settingsTitle}>Delivery Address</h2>
                <div className={styles.field}>
                  <label className={styles.label}>Address Line 1</label>
                  <input className={styles.input} placeholder="Street, Building" />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>City</label>
                  <input className={styles.input} placeholder="Mumbai" />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>PIN Code</label>
                  <input className={styles.input} placeholder="400 001" />
                </div>
                <button className="btn btn-secondary" style={{ marginTop: '8px' }}>Update Address</button>
              </div>

              <div className={styles.settingsSection} style={{ gridColumn: '1 / -1' }}>
                <h2 className={styles.settingsTitle}>Communication Preferences</h2>
                <div className={styles.toggleRow}>
                  <div>
                    <p className={styles.toggleLabel}>New Arrivals &amp; Collections</p>
                    <p className={styles.toggleDesc}>Be the first to know about new pieces</p>
                  </div>
                  <label className={styles.toggle}>
                    <input type="checkbox" defaultChecked />
                    <span className={styles.toggleSlider} />
                  </label>
                </div>
                <div className={styles.toggleRow}>
                  <div>
                    <p className={styles.toggleLabel}>Order Updates</p>
                    <p className={styles.toggleDesc}>Dispatch and delivery notifications</p>
                  </div>
                  <label className={styles.toggle}>
                    <input type="checkbox" defaultChecked />
                    <span className={styles.toggleSlider} />
                  </label>
                </div>
                <div className={styles.toggleRow}>
                  <div>
                    <p className={styles.toggleLabel}>Exclusive Offers</p>
                    <p className={styles.toggleDesc}>Member-only promotions and events</p>
                  </div>
                  <label className={styles.toggle}>
                    <input type="checkbox" />
                    <span className={styles.toggleSlider} />
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
