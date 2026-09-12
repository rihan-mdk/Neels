import type { Metadata } from 'next';
import ScrollReveal from '@/components/ui/ScrollReveal';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Our Stores',
  description:
    'Visit Neels Designer Studio at our studios in Mumbai and Delhi. Experience the full Neels Designer Studio collection in person and meet our styling team.',
};

const STORES = [
  {
    id: 'mumbai',
    city: 'Mumbai',
    name: 'Neels Designer Studio Mumbai',
    address: 'Kala Ghoda Arts District, 14 Ropewalk Lane, Fort, Mumbai 400 001',
    phone: '+91 22 4567 8900',
    email: 'mumbai@Neels Designer Studio.com',
    hours: 'Monday to Saturday: 11am – 7pm\nSunday: 12pm – 5pm',
    mapUrl: 'https://maps.google.com',
  },
  {
    id: 'delhi',
    city: 'New Delhi',
    name: 'Neels Designer Studio New Delhi',
    address: 'The Qutab Colonnade, 3rd Floor, Mehrauli, New Delhi 110 030',
    phone: '+91 11 4567 8900',
    email: 'delhi@Neels Designer Studio.com',
    hours: 'Monday to Saturday: 11am – 7pm\nSunday: 12pm – 5pm',
    mapUrl: 'https://maps.google.com',
  },
];

export default function StoresPage() {
  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <ScrollReveal>
            <p className={styles.eyebrow}>Our Stores</p>
            <h1 className={styles.title}>Visit Neels Designer Studio</h1>
            <p className={styles.subtitle}>
              Experience the full Neels Designer Studio collection in person at our studios,
              and meet our styling team who will guide you through our current season.
            </p>
          </ScrollReveal>
        </div>

        <div className={styles.storesGrid}>
          {STORES.map((store, i) => (
            <ScrollReveal key={store.id} delay={(i + 1) as 1 | 2}>
              <div className={styles.store}>
                <div className={styles.storeHead}>
                  <span className={styles.storeBrand}>Neels Designer Studio</span>
                  <h2 className={styles.storeCity}>{store.city}</h2>
                </div>
                <div className={styles.storeDetails}>
                  <div className={styles.storeDetail}>
                    <span className={styles.storeDetailLabel}>Address</span>
                    <span className={styles.storeDetailValue}>{store.address}</span>
                  </div>
                  <div className={styles.storeDetail}>
                    <span className={styles.storeDetailLabel}>Telephone</span>
                    <a href={`tel:${store.phone.replace(/\s/g, '')}`} className={styles.storeLink}>
                      {store.phone}
                    </a>
                  </div>
                  <div className={styles.storeDetail}>
                    <span className={styles.storeDetailLabel}>Email</span>
                    <a href={`mailto:${store.email}`} className={styles.storeLink}>
                      {store.email}
                    </a>
                  </div>
                  <div className={styles.storeDetail}>
                    <span className={styles.storeDetailLabel}>Opening Hours</span>
                    <span className={styles.storeDetailValue} style={{ whiteSpace: 'pre-line' }}>
                      {store.hours}
                    </span>
                  </div>
                </div>
                <a
                  href={store.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                >
                  View Location
                </a>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Couture Appointments */}
        <ScrollReveal>
          <div className={styles.appointment}>
            <h2 className={styles.appointmentTitle}>Couture Appointments</h2>
            <p className={styles.appointmentText}>
              Our couture studio is open by private appointment only. To schedule
              a consultation with our design team, please contact us directly or
              visit our Couture page.
            </p>
            <div className={styles.appointmentLinks}>
              <a href="/couture" className="btn btn-primary">
                Learn About Couture
              </a>
              <a href="/contact" className="btn btn-secondary">
                Book an Appointment
              </a>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
