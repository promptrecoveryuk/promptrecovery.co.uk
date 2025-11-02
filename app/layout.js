import { GoogleAnalytics } from '@next/third-parties/google';
import { Metadata, Viewport } from 'next';

import Navbar from '../components/Navigation/Navbar';
import Footer from '../components/Footer/Footer';
import reportWebVitals from './reportWebVitals';

import './global.css';

/**
 * @type {Metadata}
 */
export const metadata = {
  charset: 'utf-8',
  alternates: { canonical: 'https://promptrecovery.co.uk' },
  openGraph: {
    type: 'website',
    url: 'https://promptrecovery.co.uk',
    title: 'Prompt Recovery',
    description:
      'ROADSIDE RECOVERY YOU CAN RELY ON. SERVING WATFORD & SURROUNDING AREAS. Fast, friendly and affordable help for vehicles under 4 tonnes.',
    siteName: 'Prompt Recovery',
    images: [
      {
        url: 'https://promptrecovery.co.uk/images/image2-1185x593.jpg',
        width: 1185,
        height: 593,
        type: 'image/jpeg',
        alt: 'Nick, Founder of Prompt Recovery',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Prompt Recovery',
    description:
      'ROADSIDE RECOVERY YOU CAN RELY ON. SERVING WATFORD & SURROUNDING AREAS. Fast, friendly and affordable help for vehicles under 4 tonnes.',
    images: [
      {
        url: 'https://promptrecovery.co.uk/images/image2-1185x593.jpg',
        width: 1185,
        height: 593,
        type: 'image/jpeg',
        alt: 'Nick, Founder of Prompt Recovery',
      },
    ],
  },
  formatDetection: { telephone: true },
  icons: 'https://promptrecovery.co.uk/images/logo-128x128.png',
  title: 'Prompt Recovery Ltd | Rapid Response, Prompt Recovery',
  description:
    'ROADSIDE RECOVERY YOU CAN RELY ON. SERVING WATFORD & SURROUNDING AREAS. Fast, friendly and affordable help for vehicles under 4 tonnes.',
  keywords: ['recovery service', 'roadside assistance', 'Watford', 'vehicle recovery', 'prompt recovery'],
};

/**
 * @type {Viewport}
 */
export const viewport = {
  themeColor: '#0a192f',
  colorScheme: 'light',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* Layout UI */}
        {/* Place children where you want to render a page or nested layout */}
        <div className="app">
          <Navbar rating={5} count={39} reviewsUrl="https://www.google.com/maps/place/Prompt+Recovery/@51.68032,-0.3993182,17z/data=!4m8!3m7!1s0xa470618e0a0b3b7f:0xc97900f577ce9f7c!8m2!3d51.68032!4d-0.3967379!9m1!1b1!16s%2Fg%2F11xgsxw_k3?entry=ttu&g_ep=EgoyMDI1MTAyOS4yIKXMDSoASAFQAw%3D%3D" />

          <main className="main-content">{children}</main>

          <Footer />
        </div>
      </body>
      {/* Using next/script for GA may impact page performance. Instead it is
          recommended to use GoogleAnalytics from @next/third-parties/google as
          per https://nextjs.org/docs/messages/next-script-for-ga */}
      <GoogleAnalytics gaId="G-CQ8R13D8MN" />
    </html>
  );
}
reportWebVitals();
