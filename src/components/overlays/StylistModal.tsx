'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import styles from './StylistModal.module.css';

interface StylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName?: string;
}

export default function StylistModal({ isOpen, onClose, productName }: StylistModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    message: productName ? `I am interested in the ${productName} and would like to request a consultation.` : '',
  });

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      setSubmitted(false);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (!isOpen) return null;

  return (
    <div
      className={styles.backdrop}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="stylist-title"
    >
      <div className={styles.panel}>
        <div className={styles.header}>
          <h2 id="stylist-title" className={styles.title}>
            Contact Our Stylist
          </h2>
          <button onClick={onClose} className={styles.closeBtn} aria-label="Close">
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>

        {submitted ? (
          <div className={styles.success}>
            <p className={styles.successTitle}>Request Received</p>
            <p className={styles.successText}>
              Our stylist team will be in touch within 24 hours to confirm
              your consultation details.
            </p>
            <button onClick={onClose} className="btn btn-secondary" style={{ marginTop: '24px' }}>
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.form}>
            <p className={styles.intro}>
              Request a private consultation with our styling team for
              personalised guidance on your Neels Designer Studio selection.
            </p>

            <div className={styles.fields}>
              {[
                { id: 'stylist-name', label: 'Full Name', key: 'name', type: 'text', required: true },
                { id: 'stylist-email', label: 'Email Address', key: 'email', type: 'email', required: true },
                { id: 'stylist-phone', label: 'Phone Number', key: 'phone', type: 'tel', required: false },
                { id: 'stylist-date', label: 'Preferred Date', key: 'date', type: 'date', required: false },
              ].map((field) => (
                <div key={field.key} className="form-field">
                  <label htmlFor={field.id} className="form-label">
                    {field.label}{field.required && ' *'}
                  </label>
                  <input
                    id={field.id}
                    type={field.type}
                    value={form[field.key as keyof typeof form]}
                    onChange={(e) => setForm((p) => ({ ...p, [field.key]: e.target.value }))}
                    className="form-input"
                    required={field.required}
                  />
                </div>
              ))}

              <div className="form-field">
                <label htmlFor="stylist-message" className="form-label">Message</label>
                <textarea
                  id="stylist-message"
                  value={form.message}
                  onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                  className="form-textarea"
                  rows={4}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              Request a Consultation
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
