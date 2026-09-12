import Link from 'next/link';
import styles from './not-found.module.css';

export default function NotFound() {
  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <p className={styles.code}>404</p>
        <h1 className={styles.title}>Page Not Found</h1>
        <p className={styles.text}>
          The piece you're looking for could not be found.
          It may have moved, or the link may be incorrect.
        </p>
        <div className={styles.links}>
          <Link href="/" className="btn btn-primary">
            Return Home
          </Link>
          <Link href="/collections" className="btn btn-secondary">
            Explore Collections
          </Link>
        </div>
      </div>
    </div>
  );
}
