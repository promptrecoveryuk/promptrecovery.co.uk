/**
 * Embeds the business location as a responsive Google Maps iframe. The embed
 * URL is hardcoded to the Prompt Recovery address and requires no API key.
 * `loading="lazy"` defers the iframe until it is near the viewport.
 *
 * If the map fails to load in development, try opening the page in an
 * incognito window — ad blockers commonly block Google Maps iframes.
 *
 * @see https://developers.google.com/maps/documentation/embed/get-started
 */
export function GoogleMap() {
  return (
    <div className="google-map-container h-100 w-full">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2473.8810691974904!2d-0.3993181875837495!3d51.680319971735706!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xa470618e0a0b3b7f%3A0xc97900f577ce9f7c!2sPrompt%20Recovery!5e0!3m2!1sen!2suk!4v1762679598360!5m2!1sen!2suk"
        className="google-map h-full w-full rounded shadow-lg ring ring-black/5"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Our Location"
      ></iframe>
    </div>
  );
}
