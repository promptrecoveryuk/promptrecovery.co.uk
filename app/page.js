import React from 'react';
import Link from 'next/link';

import styles from './page.module.css';
import ImageSlider from '../components/ImageSlider/ImageSlider';
import image1 from '../assets/images/image1-739x370.jpg';
import image2 from '../assets/images/image2-1185x593.jpg';
import image3 from '../assets/images/image3-1600x739.jpg';

function Home() {
  const phoneNumber = '07799525650';

  const teamImages = [image2, image1, image2, image3];

  return (
    <div className={styles['home-container']}>
      <section className={[styles['section'], styles['hero-section']].join(' ')}>
        <div className={styles['hero-content']}>
          <h1>ROADSIDE RECOVERY YOU CAN RELY ON</h1>
          <h2>SERVING WATFORD & SOURROUNDING AREAS </h2>
          <p>Fast, friendly and affordable help for vehicles under 4 tonnes</p>
          <Link href={`tel:${phoneNumber}`} className={styles['call-now-btn']}>
            CALL NOW
          </Link>
        </div>
      </section>

      <section className={[styles['section'], styles['about-section']].join(' ')}>
        <div className={styles['section-heading']}>
          <h2>About</h2>
        </div>
        <div className={styles['about-content']}>
          <div className={styles['about-text']}>
            <p>
              Prompt Recovery Ltd is a locally trusted roadside recovery company based in Watford. With experience and a
              commitment to fast, reliable service, we're the first call you make when you're stuck.
            </p>
            <Link href="/about" className={styles['learn-more-btn']}>
              Learn more about us
            </Link>
          </div>
        </div>
      </section>
      <section className={[styles['section'], styles['team-slider-section']].join(' ')}>
        <div className={styles['section-heading']}>
          <h2>Our Team</h2>
        </div>
        <div className={styles['team-slider-content']}>
          <ImageSlider images={teamImages} />
        </div>
      </section>

      <section className={[styles['section'], styles['services-section']].join(' ')}>
        <div className={styles['section-heading']}>
          <h2>Services</h2>
        </div>
        <div className={styles['services-grid']}>
          <div className={styles['service-card']}>
            <div className={styles['service-icon']}>✓</div>
            <h3>Fast response times</h3>
            <p>We pride ourselves on quick arrivals to get you back on the road</p>
          </div>
          <div className={styles['service-card']}>
            <div className={styles['service-icon']}>✓</div>
            <h3>Affordable pricing</h3>
            <p>Fair and transparent pricing with no hidden fees</p>
          </div>
          <div className={styles['service-card']}>
            <div className={styles['service-icon']}>✓</div>
            <h3>Local Watford business</h3>
            <p>Supporting our local community with trusted service</p>
          </div>
        </div>
        <Link href="/services" className={styles['view-all-btn']}>
          View all services
        </Link>
      </section>

      <section className={[styles['section'], styles['why-choose-section']].join(' ')}>
        <div className={styles['section-heading']}>
          <h2>Why Choose Us</h2>
        </div>
        <div className={styles['features-list']}>
          <div className={styles['feature-item']}>
            <div className={styles['feature-icon']}>✓</div>
            <p>Fast Response Times</p>
          </div>
          <div className={styles['feature-item']}>
            <div className={styles['feature-icon']}>✓</div>
            <p>Affordable Pricing</p>
          </div>
          <div className={styles['feature-item']}>
            <div className={styles['feature-icon']}>✓</div>
            <p>Local Watford Business</p>
          </div>
          <div className={styles['feature-item']}>
            <div className={styles['feature-icon']}>✓</div>
            <p>Friendly & Professional</p>
          </div>
          <div className={styles['feature-item']}>
            <div className={styles['feature-icon']}>✓</div>
            <p>Fully Insured</p>
          </div>
        </div>
      </section>

      <section className={[styles['section'], styles['map-section']].join(' ')}>
        <div className={styles['section-heading']}>
          <h2>Find Us</h2>
        </div>
        <div className={styles['custom-google-map']}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2473.8810691974904!2d-0.3993181875837495!3d51.680319971735706!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xa470618e0a0b3b7f%3A0xc97900f577ce9f7c!2sPrompt%20Recovery!5e0!3m2!1sen!2suk!4v1762679598360!5m2!1sen!2suk"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Our Location"
          ></iframe>
        </div>
      </section>

      <section className={[styles['section'], styles['cta-section']].join(' ')}>
        <div className={styles['cta-content']}>
          <h2>Need Roadside Assistance?</h2>
          <p>We're available 24/7 for emergency roadside recovery</p>
          <button className={styles['cta-call-btn']}>CALL NOW</button>
        </div>
      </section>
    </div>
  );
}

export default Home;
