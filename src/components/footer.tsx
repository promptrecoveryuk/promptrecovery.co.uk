import Image from 'next/image';
import Link from 'next/link';

import { basePath } from '@/app/base-path';

import { Mail, Phone } from './icons';

/**
 * Site-wide footer containing page navigation links, social media links
 * (Facebook, X, Google Reviews, WhatsApp, email, phone), and company
 * registration information.
 *
 * @param props.facebookProfileId - Facebook profile/page ID appended to the Facebook URL.
 * @param props.xProfileId - X (Twitter) handle appended to the X URL.
 * @param props.googleReviewsId - Google Maps place ID used to link to the Google Reviews listing.
 * @param props.phoneNumber - E.164-formatted phone number used for `tel:` and `wa.me` links.
 * @param props.phoneNumberDisplayAs - Human-readable phone number displayed in the contact list.
 * @param props.email - Email address used for the `mailto:` link.
 * @see https://flowbite.com/docs/components/footer/#social-media-icons
 */
export default function Footer({
  facebookProfileId,
  xProfileId,
  googleReviewsId,
  phoneNumber,
  phoneNumberDisplayAs,
  email,
}: {
  facebookProfileId: string;
  xProfileId: string;
  googleReviewsId: string;
  phoneNumber: string;
  phoneNumberDisplayAs: string;
  email: string;
}) {
  return (
    <footer className="bg-navy">
      <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
        <div className="md:flex md:justify-between">
          <div className="mr-4 mb-6 md:mb-0">
            <Link href="/" className="flex items-center md:flex-col lg:flex-row">
              <Image
                src={`${basePath}/images/logo-128x128.png`}
                width={128}
                height={128}
                className="me-3 h-32"
                alt="Prompt Recovery Logo"
              />
              <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">Prompt Recovery</span>
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 sm:gap-6">
            <div>
              <h2 className="text-yellow mb-6 text-sm font-semibold uppercase">Pages</h2>
              <ul className="font-medium text-white">
                <li className="mb-4">
                  <Link href="/about" className="hover:underline">
                    About
                  </Link>
                </li>
                <li className="mb-4">
                  <Link href="/services" className="hover:underline">
                    Services
                  </Link>
                </li>
                <li className="mb-4">
                  <Link href="/faqs" className="hover:underline">
                    FAQs
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:underline">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="text-yellow mb-6 text-sm font-semibold uppercase">Follow us</h2>
              <ul className="font-medium text-white">
                <li className="mb-4">
                  <Link
                    href={`https://www.facebook.com/${facebookProfileId}`}
                    className="hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Facebook
                  </Link>
                </li>
                <li className="mb-4">
                  <Link
                    href={`https://x.com/${xProfileId}`}
                    className="hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    X
                  </Link>
                </li>
                <li>
                  <Link
                    href={`https://www.google.com/maps/place/${googleReviewsId}`}
                    className="hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Google Reviews
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="text-yellow mb-6 text-sm font-semibold uppercase">Contact Us</h2>
              <ul className="font-medium text-white">
                <li className="mb-4">
                  <Link
                    href={`tel:${phoneNumber}`}
                    className="hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {phoneNumberDisplayAs}
                  </Link>
                </li>
                <li className="mb-4">
                  <Link
                    href={`https://wa.me/${phoneNumber}`}
                    className="hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    WhatsApp
                  </Link>
                </li>
                <li>
                  <Link href={`mailto:${email}`} className="hover:underline" target="_blank" rel="noopener noreferrer">
                    {email}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <hr className="border-default my-6 sm:mx-auto lg:my-8" />
        <div className="sm:flex sm:items-center sm:justify-between">
          <span className="inline-block text-sm text-white sm:text-center">
            © 2026{' '}
            <Link href="https://promptrecovery.co.uk/" className="hover:underline">
              Prompt Recovery
            </Link>
            . All Rights Reserved.&nbsp;
          </span>
          <span className="inline-block text-sm text-white sm:text-center">
            Registered company{' '}
            <Link href="https://find-and-update.company-information.service.gov.uk/company/16305356">16305356</Link>.
          </span>
          <div className="mt-4 flex sm:mt-0 sm:justify-center">
            <Link
              href={`https://www.facebook.com/${facebookProfileId}`}
              className="text-white hover:text-white"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                className="h-5 w-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  fillRule="evenodd"
                  d="M13.135 6H15V3h-1.865a4.147 4.147 0 0 0-4.142 4.142V9H7v3h2v9.938h3V12h2.021l.592-3H12V6.591A.6.6 0 0 1 12.592 6h.543Z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="sr-only">Facebook page</span>
            </Link>
            <Link
              href={`https://x.com/${xProfileId}`}
              className="ms-5 text-white hover:text-white"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                className="h-5 w-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M13.795 10.533 20.68 2h-3.073l-5.255 6.517L7.69 2H1l7.806 10.91L1.47 22h3.074l5.705-7.07L15.31 22H22l-8.205-11.467Zm-2.38 2.95L9.97 11.464 4.36 3.627h2.31l4.528 6.317 1.443 2.02 6.018 8.409h-2.31l-4.934-6.89Z" />
              </svg>
              <span className="sr-only">X page</span>
            </Link>
            <Link
              href={`https://www.google.com/maps/place/${googleReviewsId}`}
              className="ms-5 text-white hover:text-white"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                className="h-5 w-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                viewBox="0 0 30 30"
              >
                <path d="M 15.003906 3 C 8.3749062 3 3 8.373 3 15 C 3 21.627 8.3749062 27 15.003906 27 C 25.013906 27 27.269078 17.707 26.330078 13 L 25 13 L 22.732422 13 L 15 13 L 15 17 L 22.738281 17 C 21.848702 20.448251 18.725955 23 15 23 C 10.582 23 7 19.418 7 15 C 7 10.582 10.582 7 15 7 C 17.009 7 18.839141 7.74575 20.244141 8.96875 L 23.085938 6.1289062 C 20.951937 4.1849063 18.116906 3 15.003906 3 z"></path>
              </svg>
              <span className="sr-only">Google reviews</span>
            </Link>
            <Link
              href={`mailto:${email}`}
              className="ms-5 text-white hover:text-white"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Mail size={20} />
              <span className="sr-only">Email</span>
            </Link>
            <Link
              href={`tel:${phoneNumber}`}
              className="ms-5 text-white hover:text-white"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Phone size={18} />
              <span className="sr-only">Phone</span>
            </Link>
            <Link
              href={`https://wa.me/${phoneNumber}`}
              className="ms-5 text-white hover:text-white"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M6.014 8.00613C6.12827 7.1024 7.30277 5.87414 8.23488 6.01043L8.23339 6.00894C9.14051 6.18132 9.85859 7.74261 10.2635 8.44465C10.5504 8.95402 10.3641 9.4701 10.0965 9.68787C9.7355 9.97883 9.17099 10.3803 9.28943 10.7834C9.5 11.5 12 14 13.2296 14.7107C13.695 14.9797 14.0325 14.2702 14.3207 13.9067C14.5301 13.6271 15.0466 13.46 15.5548 13.736C16.3138 14.178 17.0288 14.6917 17.69 15.27C18.0202 15.546 18.0977 15.9539 17.8689 16.385C17.4659 17.1443 16.3003 18.1456 15.4542 17.9421C13.9764 17.5868 8 15.27 6.08033 8.55801C5.97237 8.24048 5.99955 8.12044 6.014 8.00613Z"
                  fill="currentColor"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 23C10.7764 23 10.0994 22.8687 9 22.5L6.89443 23.5528C5.56462 24.2177 4 23.2507 4 21.7639V19.5C1.84655 17.492 1 15.1767 1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12C23 18.0751 18.0751 23 12 23ZM6 18.6303L5.36395 18.0372C3.69087 16.4772 3 14.7331 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C11.0143 21 10.552 20.911 9.63595 20.6038L8.84847 20.3397L6 21.7639V18.6303Z"
                  fill="currentColor"
                />
              </svg>
              <span className="sr-only">WhatsApp</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
