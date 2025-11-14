import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import logo from '../../assets/images/logo-128x128.png';
import styles from './footer.module.css';

function Footer({ reviewsUrl }) {
  const phoneNumber = '07799525650';
  const email = 'nick@promptrecovery.co.uk';

  return (
    <footer className={styles['site-footer']}>
      <div className={styles['footer-content']}>
        <div className={styles['footer-logo']}>
          <Image src={logo} alt="Prompt Recovery" height={128} width={128} />
        </div>
        <div className={styles['footer-links']}>
          <h3>Quick Links</h3>
          <ul>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/about">About</Link>
            </li>
            <li>
              <Link href="/services">Services</Link>
            </li>
            <li>
              <Link href="/faqs">FAQ's</Link>
            </li>
            <li>
              <Link href="/blog">Blog</Link>
            </li>
          </ul>
        </div>
        <div className={styles['footer-contact']}>
          <h3>Contact Us</h3>
          <p>
            Email: <a href={`mailto:${email}`}>{email}</a>
          </p>
          <p>
            Phone: <a href={`tel:${phoneNumber}`}>{phoneNumber}</a>
          </p>
        </div>
        <div className={styles['footer-contact']}>
          <h3>Social Media</h3>
          <p>
            X:{' '}
            <a href="https://x.com/prompt_recovery" target="_blank">
              prompt_recovery
            </a>
          </p>
          <p>
            Facebook:{' '}
            <a href="https://www.facebook.com/promptrecovery" target="_blank">
              promptrecovery
            </a>
          </p>
          <p>
            Google Reviews:{' '}
            <a href={reviewsUrl} target="_blank">
              promptrecovery.co.uk
            </a>
          </p>
        </div>
      </div>
      <div className={styles['footer-bottom']}>
        <p>&copy; {new Date().getFullYear()} Prompt Recovery. All rightsreserved.</p>
        <p>
          Registered company{' '}
          <a href="https://find-and-update.company-information.service.gov.uk/company/16305356" target="_blank">
            16305356
          </a>
          .
        </p>
      </div>
    </footer>
  );
}

export default Footer;
