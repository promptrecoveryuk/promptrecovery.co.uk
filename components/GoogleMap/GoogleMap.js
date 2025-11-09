import React from 'react';
import './GoogleMap.css';

function GoogleMap() {
  return (
    <div className="google-map-container">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2473.8810691974904!2d-0.3993181875837495!3d51.680319971735706!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xa470618e0a0b3b7f%3A0xc97900f577ce9f7c!2sPrompt%20Recovery!5e0!3m2!1sen!2suk!4v1762679598360!5m2!1sen!2suk"
        className="google-map"
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Our Location"
      ></iframe>
    </div>
  );
}

export default GoogleMap;