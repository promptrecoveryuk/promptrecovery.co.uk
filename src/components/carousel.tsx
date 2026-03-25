'use client';

import React, { useEffect, useRef } from 'react';

import { ChevronLeft, ChevronRight } from './icons';

/**
 * Auto-advancing content carousel powered by Flowbite's `Carousel` class.
 * Accepts any number of child elements as slides.
 *
 * Flowbite is loaded via a dynamic `import()` so it is never included in the
 * server bundle. The carousel is initialised programmatically (rather than via
 * `initFlowbite`) so a custom `interval` can be passed. Flowbite's `_rotate()`
 * always keeps three slides visible simultaneously — active, previous, and next
 * — pushing the off-screen ones out of view with `translate-x-full` /
 * `-translate-x-full`. Those classes must be safelisted in `globals.css` via
 * `@source inline()` or they will be purged by Tailwind.
 *
 * @param props.children - Slide content; each direct child becomes one slide.
 * @param props.interval - Milliseconds between automatic slide transitions. Defaults to `10_000`.
 * @see https://flowbite.com/docs/components/carousel/#default-slider
 */
export function Carousel({ children, interval = 10_000 }: { children: React.ReactNode; interval?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Dynamically import Flowbite so it is never bundled server-side.
    // We initialise the carousel ourselves (instead of relying on initFlowbite)
    // so we can pass a custom interval between slides.
    import('flowbite').then(({ Carousel }) => {
      const itemEls = Array.from(el.querySelectorAll('[data-carousel-item]')) as HTMLElement[];
      const items = itemEls.map((itemEl, position) => ({ position, el: itemEl }));

      const carousel = new Carousel(el, items, { interval });
      carousel.cycle();

      // Wire up prev / next / slide-to controls manually (initFlowbite would
      // normally do this when it detects data-carousel="slide" on the element).
      el.querySelector('[data-carousel-prev]')?.addEventListener('click', () => carousel.prev());
      el.querySelector('[data-carousel-next]')?.addEventListener('click', () => carousel.next());
      el.querySelectorAll('[data-carousel-slide-to]').forEach((btn, i) => {
        btn.addEventListener('click', () => carousel.slideTo(i));
      });
    });
  }, [interval]);

  return (
    <div ref={ref} className="relative w-full">
      {/* Carousel wrapper */}
      <div className="rounded-base relative h-72 overflow-hidden md:h-96">
        {React.Children.map(children, (child, i) => (
          // data-carousel-item="active" tells Flowbite which slide to show
          // first. All other items start hidden; Flowbite's JS then toggles
          // the `hidden` class as the user navigates.
          <div key={i} className="hidden duration-700 ease-in-out" data-carousel-item={i === 0 ? 'active' : ''}>
            {child}
          </div>
        ))}
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-5 left-1/2 z-30 flex -translate-x-1/2 space-x-3 rtl:space-x-reverse">
        {React.Children.map(children, (_child, i) => (
          <button
            key={i}
            type="button"
            className="rounded-base focus:ring-yellow h-3 w-3 focus:ring-2"
            aria-current={i === 0 ? 'true' : 'false'}
            aria-label={`Slide ${i + 1}`}
            data-carousel-slide-to={i}
          />
        ))}
      </div>

      {/* Prev control */}
      <button
        type="button"
        className="group absolute start-0 top-0 z-30 flex h-full cursor-pointer items-center justify-center px-4 focus:outline-none"
        data-carousel-prev
      >
        <span className="rounded-base group-focus:ring-yellow inline-flex h-10 w-10 items-center justify-center bg-white/30 group-hover:bg-white/50 group-focus:ring-2 group-focus:outline-none dark:bg-gray-800/30 dark:group-hover:bg-gray-800/60">
          <ChevronLeft className="h-5 w-5 text-white rtl:rotate-180" aria-hidden="true" />
          <span className="sr-only">Previous</span>
        </span>
      </button>

      {/* Next control */}
      <button
        type="button"
        className="group absolute end-0 top-0 z-30 flex h-full cursor-pointer items-center justify-center px-4 focus:outline-none"
        data-carousel-next
      >
        <span className="rounded-base group-focus:ring-yellow inline-flex h-10 w-10 items-center justify-center bg-white/30 group-hover:bg-white/50 group-focus:ring-2 group-focus:outline-none dark:bg-gray-800/30 dark:group-hover:bg-gray-800/60">
          <ChevronRight className="h-5 w-5 text-white rtl:rotate-180" aria-hidden="true" />
          <span className="sr-only">Next</span>
        </span>
      </button>
    </div>
  );
}
