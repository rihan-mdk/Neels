'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import styles from './CustomSizeModal.module.css';

interface Measurements {
  bust: string;
  waist: string;
  hip: string;
  shoulder: string;
  armhole: string;
  sleeveLength: string;
  height: string;
  lehengaLength: string;
  notes: string;
}

interface CustomSizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (measurements: Measurements) => void;
}

const INITIAL: Measurements = {
  bust: '',
  waist: '',
  hip: '',
  shoulder: '',
  armhole: '',
  sleeveLength: '',
  height: '',
  lehengaLength: '',
  notes: '',
};

export default function CustomSizeModal({
  isOpen,
  onClose,
  onSave,
}: CustomSizeModalProps) {
  const [measurements, setMeasurements] = useState<Measurements>(INITIAL);
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => firstInputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  const handleChange = (field: keyof Measurements, value: string) => {
    setMeasurements((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave?.(measurements);
    onClose();
  };

  if (!isOpen) return null;

  const fields: { key: keyof Measurements; label: string; type?: string }[] = [
    { key: 'bust', label: 'Bust (inches)' },
    { key: 'waist', label: 'Waist (inches)' },
    { key: 'hip', label: 'Hip (inches)' },
    { key: 'shoulder', label: 'Shoulder (inches)' },
    { key: 'armhole', label: 'Armhole (inches)' },
    { key: 'sleeveLength', label: 'Sleeve Length (inches)' },
    { key: 'height', label: 'Height (cm or ft)' },
    { key: 'lehengaLength', label: 'Lehenga Length (inches)' },
  ];

  return (
    <div
      className={styles.backdrop}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="custom-size-title"
    >
      <div className={styles.panel}>
        <div className={styles.header}>
          <h2 id="custom-size-title" className={styles.title}>
            Custom Measurements
          </h2>
          <button
            onClick={onClose}
            className={styles.closeBtn}
            aria-label="Close measurements form"
          >
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>
        <form onSubmit={handleSave} className={styles.form}>
          <p className={styles.intro}>
            All measurements in inches unless otherwise noted. Our team will
            confirm your measurements before crafting begins.
          </p>
          <div className={styles.grid}>
            {fields.map((field, idx) => (
              <div key={field.key} className="form-field">
                <label
                  htmlFor={`measurement-${field.key}`}
                  className="form-label"
                >
                  {field.label}
                </label>
                <input
                  ref={idx === 0 ? firstInputRef : undefined}
                  id={`measurement-${field.key}`}
                  type="text"
                  inputMode="decimal"
                  value={measurements[field.key]}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  className="form-input"
                  placeholder="e.g. 36"
                />
              </div>
            ))}
          </div>
          <div className="form-field" style={{ marginTop: 0 }}>
            <label htmlFor="measurement-notes" className="form-label">
              Additional Notes
            </label>
            <textarea
              id="measurement-notes"
              value={measurements.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              className="form-textarea"
              placeholder="Any special requests, fabric preferences, or styling notes..."
              rows={3}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }}>
            Save Measurements
          </button>
        </form>
      </div>
    </div>
  );
}
