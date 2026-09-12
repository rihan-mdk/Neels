'use client';

import React, { useState } from 'react';
import ScrollReveal from '@/components/ui/ScrollReveal';
import styles from './page.module.css';

const CONTACT_DETAILS = [
  {
    label: 'Email',
    value: 'hello@Neels Designer Studio.com',
    href: 'mailto:hello@Neels Designer Studio.com',
  },
  {
    label: 'WhatsApp',
    value: '+91 98765 43210',
    href: 'https://wa.me/919876543210',
  },
  {
    label: 'Couture Appointments',
    value: 'couture@Neels Designer Studio.com',
    href: 'mailto:couture@Neels Designer Studio.com',
  },
];

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', phone: '', subject: '', message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <ScrollReveal>
            <h1 className={styles.title}>
              Let's Create<br />Something Beautiful
            </h1>
            <p className={styles.subtitle}>
              For couture appointments, styling enquiries and general
              questions, our team would love to hear from you.
            </p>
          </ScrollReveal>
        </div>

        <div className={styles.layout}>
          {/* Form */}
          <div className={styles.formCol}>
            {sent ? (
              <div className={styles.success}>
                <p className={styles.successTitle}>Message Received</p>
                <p className={styles.successText}>
                  Thank you for reaching out. Our team will be in touch within
                  24 hours.
                </p>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ marginTop: '24px' }}
                  onClick={() => { setSent(false); setForm({ name: '', email: '', phone: '', subject: '', message: '' }); }}
                >
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.fields}>
                  {[
                    { id: 'contact-name', label: 'Name', key: 'name', type: 'text', required: true },
                    { id: 'contact-email', label: 'Email', key: 'email', type: 'email', required: true },
                    { id: 'contact-phone', label: 'Phone', key: 'phone', type: 'tel', required: false },
                    { id: 'contact-subject', label: 'Subject', key: 'subject', type: 'text', required: false },
                  ].map((field) => (
                    <div key={field.key} className="form-field">
                      <label htmlFor={field.id} className="form-label">
                        {field.label}{field.required ? ' *' : ''}
                      </label>
                      <input
                        id={field.id}
                        type={field.type}
                        required={field.required}
                        value={form[field.key as keyof typeof form]}
                        onChange={(e) => setForm(p => ({ ...p, [field.key]: e.target.value }))}
                        className="form-input"
                      />
                    </div>
                  ))}
                  <div className="form-field" style={{ gridColumn: '1 / -1' }}>
                    <label htmlFor="contact-message" className="form-label">Message *</label>
                    <textarea
                      id="contact-message"
                      required
                      value={form.message}
                      onChange={(e) => setForm(p => ({ ...p, message: e.target.value }))}
                      className="form-textarea"
                      rows={5}
                    />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '50px' }}>
                  Send Enquiry
                </button>
              </form>
            )}
          </div>

          {/* Contact Info */}
          <div className={styles.infoCol}>
            <ScrollReveal>
              <div className={styles.infoSection}>
                <h2 className={styles.infoTitle}>Get in Touch</h2>
                {CONTACT_DETAILS.map((d) => (
                  <div key={d.label} className={styles.contactDetail}>
                    <span className={styles.contactDetailLabel}>{d.label}</span>
                    <a href={d.href} className={styles.contactDetailValue} target={d.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">
                      {d.value}
                    </a>
                  </div>
                ))}
              </div>

              <div className={styles.infoSection} style={{ marginTop: '48px' }}>
                <h2 className={styles.infoTitle}>Our Studios</h2>
                <div className={styles.contactDetail}>
                  <span className={styles.contactDetailLabel}>Mumbai</span>
                  <span className={styles.contactDetailValue} style={{ color: 'var(--color-secondary)' }}>
                    Kala Ghoda, Fort<br />Mumbai 400 001
                  </span>
                </div>
                <div className={styles.contactDetail}>
                  <span className={styles.contactDetailLabel}>New Delhi</span>
                  <span className={styles.contactDetailValue} style={{ color: 'var(--color-secondary)' }}>
                    Mehrauli<br />New Delhi 110 030
                  </span>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </div>
  );
}
