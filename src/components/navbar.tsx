'use client';
// ^ Needed for two reasons:
// 1. usePathname() is a client hook — but Next.js still calls this component
//    on the server during SSR, so the initial HTML has the correct active
//    state (important for SEO and avoiding a flash on first load).
// 2. The Flowbite mobile-menu toggle (data-collapse-toggle) needs JS to run,
//    so this component needs to be in the browser bundle anyway.

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef } from 'react';

import { basePath } from '@/app/base-path';

import { Menu } from './icons';

const pages: Record<string, string> = {
  Home: '/',
  About: '/about',
  Services: '/services',
  FAQs: '/faqs',
  Blog: '/blog',
};

/**
 * Fixed top navigation bar displaying the site logo, page links, phone and
 * WhatsApp CTAs, and a hamburger menu on mobile. The active page link is
 * determined via `usePathname()`, which Next.js also evaluates during SSR so
 * the correct active state is present in the initial HTML (no flash on load).
 *
 * Flowbite's collapse component is initialised here (rather than in a separate
 * component) because the Navbar already has to be a Client Component for
 * `usePathname()`. It re-initialises on every route change to re-wire the
 * mobile menu toggle after client-side navigation.
 *
 * The mobile menu closes automatically on outside click, Escape key press, or
 * any nav link click.
 *
 * @param props.children - Optional content rendered in a secondary bar beneath
 *   the main nav row (e.g. the aggregate Google rating strip).
 * @param props.phoneNumber - E.164-formatted phone number used for `tel:` and `wa.me` links.
 * @see https://flowbite.com/docs/components/navbar/#sticky-navbar
 */
export default function Navbar({ children, phoneNumber }: { children?: React.ReactNode; phoneNumber: string }) {
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);

  const toggleButton = () => document.querySelector('[data-collapse-toggle="navbar-sticky"]') as HTMLElement | null;

  const closeMenu = useCallback((returnFocus = false) => {
    const menu = document.getElementById('navbar-sticky');
    if (menu && !menu.classList.contains('hidden')) {
      toggleButton()?.click();
      if (returnFocus) toggleButton()?.focus();
    }
  }, []);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) closeMenu();
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMenu(true);
    };
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [closeMenu]);

  useEffect(() => {
    // Initialise Flowbite's collapse component so the mobile hamburger menu
    // works. Done here rather than in a separate component because the Navbar
    // already has to be a client component for usePathname().
    import('flowbite').then(({ initFlowbite }) => initFlowbite());
  }, [
    // Re-run on every navigation so Flowbite re-wires any new DOM after a
    // client-side route change (e.g. reopening the menu on the new page).
    pathname,
  ]);

  const menuItemLinks = Object.entries(pages).map(([pageName, pageRoute]) => {
    // Use exact match for `/` (home) to avoid highlighting it on every page.
    // For all other routes, also match any sub-paths (e.g. /services/tyres
    // still highlights the Services link).
    const isActive =
      pageRoute === '/' ? pathname === '/' : pathname === pageRoute || pathname.startsWith(pageRoute + '/');

    return (
      <li key={pageName}>
        {isActive ? (
          <Link
            href={pageRoute}
            className="text-yellow bg-brand block rounded-sm px-3 py-2 text-xl font-normal hover:underline hover:decoration-2 hover:underline-offset-4 focus-visible:ring-2 md:border-0 md:bg-transparent md:p-0 md:hover:bg-transparent md:dark:hover:bg-transparent"
            aria-current="page"
            onClick={() => closeMenu()}
          >
            {pageName}
          </Link>
        ) : (
          <Link
            href={pageRoute}
            className="hover:text-yellow md:hover:text-yellow focus-visible:ring-yellow block rounded px-3 py-2 text-xl font-normal text-white hover:underline hover:decoration-2 hover:underline-offset-4 focus-visible:ring-2 md:border-0 md:p-0 md:hover:bg-transparent md:dark:hover:bg-transparent"
            onClick={() => closeMenu()}
          >
            {pageName}
          </Link>
        )}
      </li>
    );
  });

  return (
    <nav ref={navRef} className="bg-navy border-default fixed inset-s-0 top-0 z-40 w-full border-b">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between px-4 pt-4 pb-0">
        <Link
          href="/"
          className="focus-visible:ring-yellow flex items-center space-x-3 rounded-sm focus-visible:ring-2 focus-visible:outline-none rtl:space-x-reverse"
        >
          <Image
            src={`${basePath}/images/logo-128x128.png`}
            width={128}
            height={128}
            className="size-18"
            alt="Prompt Recovery Logo"
          />
          <span className="self-center pr-2 text-xl font-semibold whitespace-nowrap text-white">Prompt Recovery</span>
        </Link>
        <div className="flex space-x-3 md:order-2 md:space-x-0 rtl:space-x-reverse">
          <Link
            href={`tel:${phoneNumber}`}
            className="xs:inline bg-brand hover:bg-brand-light focus:ring-yellow rounded-base box-border hidden border border-transparent px-3 py-3 text-xl leading-5 font-normal text-white shadow-xs focus:ring-2 focus:outline-none"
          >
            Call Now
          </Link>
          <Link
            href={`https://wa.me/${phoneNumber}`}
            className="xs:inline focus:ring-yellow rounded-base ml-0 box-border hidden border border-transparent bg-transparent px-2 py-0 text-xl leading-5 font-normal text-white shadow-xs focus:ring-2 focus:outline-none lg:ml-4"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 175.216 175.552"
              width="40"
              height="40"
              className="inline-block align-middle"
            >
              <defs>
                <linearGradient id="b" x1="85.915" x2="86.535" y1="32.567" y2="137.092" gradientUnits="userSpaceOnUse">
                  <stop offset="0" stopColor="#57d163" />
                  <stop offset="1" stopColor="#23b33a" />
                </linearGradient>
                <filter id="a" width="1.115" height="1.114" x="-.057" y="-.057" colorInterpolationFilters="sRGB">
                  <feGaussianBlur stdDeviation="3.531" />
                </filter>
              </defs>
              <path
                fill="#b3b3b3"
                d="m54.532 138.45 2.235 1.324c9.387 5.571 20.15 8.518 31.126 8.523h.023c33.707 0 61.139-27.426 61.153-61.135.006-16.335-6.349-31.696-17.895-43.251A60.75 60.75 0 0 0 87.94 25.983c-33.733 0-61.166 27.423-61.178 61.13a60.98 60.98 0 0 0 9.349 32.535l1.455 2.312-6.179 22.558zm-40.811 23.544L24.16 123.88c-6.438-11.154-9.825-23.808-9.821-36.772.017-40.556 33.021-73.55 73.578-73.55 19.681.01 38.154 7.669 52.047 21.572s21.537 32.383 21.53 52.037c-.018 40.553-33.027 73.553-73.578 73.553h-.032c-12.313-.005-24.412-3.094-35.159-8.954zm0 0"
                filter="url(#a)"
              />
              <path
                fill="#fff"
                d="m12.966 161.238 10.439-38.114a73.42 73.42 0 0 1-9.821-36.772c.017-40.556 33.021-73.55 73.578-73.55 19.681.01 38.154 7.669 52.047 21.572s21.537 32.383 21.53 52.037c-.018 40.553-33.027 73.553-73.578 73.553h-.032c-12.313-.005-24.412-3.094-35.159-8.954z"
              />
              <path
                fill="url(#linearGradient1780)"
                d="M87.184 25.227c-33.733 0-61.166 27.423-61.178 61.13a60.98 60.98 0 0 0 9.349 32.535l1.455 2.312-6.179 22.559 23.146-6.069 2.235 1.324c9.387 5.571 20.15 8.518 31.126 8.524h.023c33.707 0 61.14-27.426 61.153-61.135a60.75 60.75 0 0 0-17.895-43.251 60.75 60.75 0 0 0-43.235-17.929z"
              />
              <path
                fill="url(#b)"
                d="M87.184 25.227c-33.733 0-61.166 27.423-61.178 61.13a60.98 60.98 0 0 0 9.349 32.535l1.455 2.313-6.179 22.558 23.146-6.069 2.235 1.324c9.387 5.571 20.15 8.517 31.126 8.523h.023c33.707 0 61.14-27.426 61.153-61.135a60.75 60.75 0 0 0-17.895-43.251 60.75 60.75 0 0 0-43.235-17.928z"
              />
              <path
                fill="#fff"
                fillRule="evenodd"
                d="M68.772 55.603c-1.378-3.061-2.828-3.123-4.137-3.176l-3.524-.043c-1.226 0-3.218.46-4.902 2.3s-6.435 6.287-6.435 15.332 6.588 17.785 7.506 19.013 12.718 20.381 31.405 27.75c15.529 6.124 18.689 4.906 22.061 4.6s10.877-4.447 12.408-8.74 1.532-7.971 1.073-8.74-1.685-1.226-3.525-2.146-10.877-5.367-12.562-5.981-2.91-.919-4.137.921-4.746 5.979-5.819 7.206-2.144 1.381-3.984.462-7.76-2.861-14.784-9.124c-5.465-4.873-9.154-10.891-10.228-12.73s-.114-2.835.808-3.751c.825-.824 1.838-2.147 2.759-3.22s1.224-1.84 1.836-3.065.307-2.301-.153-3.22-4.032-10.011-5.666-13.647"
              />
            </svg>
          </Link>
          <button
            data-collapse-toggle="navbar-sticky"
            type="button"
            className="text-body rounded-base hover:bg-neutral-secondary-soft hover:text-heading focus:ring-yellow inline-flex h-10 w-10 items-center justify-center p-2 text-sm focus:ring-2 focus:outline-none md:hidden"
            aria-controls="navbar-sticky"
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div className="hidden w-full items-center justify-between md:order-1 md:flex md:w-auto" id="navbar-sticky">
          <ul className="border-default rounded-base mt-4 flex flex-col border px-4 py-4 font-medium md:mt-0 md:flex-row md:space-x-3 md:border-0 md:p-0 lg:space-x-8 rtl:space-x-reverse">
            {menuItemLinks}
          </ul>
        </div>
      </div>
      {children && <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center pb-2">{children}</div>}
    </nav>
  );
}
