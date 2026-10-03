import type { Metadata } from 'next';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import CartNotification from '@/components/ui/CartNotification';
import BackToTop from '@/components/ui/BackToTop';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import LenisProvider from '@/components/ui/LenisProvider';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Neels Designer Studio — Contemporary Indian Couture',
    template: '%s — Neels Designer Studio',
  },
  description:
    'Discover Neels Designer Studio, a contemporary Indian couture house creating timeless silhouettes through heritage craftsmanship and modern design. Lehengas, sarees, suits and bespoke couture.',
  keywords: ['Indian couture', 'luxury lehengas', 'bridal sarees', 'Indian fashion', 'bespoke Indian wear', 'Neels Designer Studio'],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://neelsdesignerstudio.com',
    siteName: 'Neels Designer Studio',
    title: 'Neels Designer Studio — Contemporary Indian Couture',
    description:
      'Discover Neels Designer Studio, a contemporary Indian couture house creating timeless silhouettes through heritage craftsmanship and modern design.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=85',
        width: 1200,
        height: 630,
        alt: 'Neels Designer Studio — Contemporary Indian Couture',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Neels Designer Studio — Contemporary Indian Couture',
    description:
      'Contemporary Indian couture created through heritage craftsmanship and modern design.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Inter:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AuthProvider>
          <LenisProvider>
            <WishlistProvider>
              <CartProvider>
                <Header />
                <CartNotification />
                <BackToTop />
                <main id="main-content" tabIndex={-1}>
                  {children}
                </main>
                <Footer />
              </CartProvider>
            </WishlistProvider>
          </LenisProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
