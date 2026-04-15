import type { Locator, Page } from '@playwright/test';

type PageTarget = {
  description: string;
  hideSelectors?: string[];
  id: string;
  kind: 'page';
  route: string;
  title: string;
};

type LocatorTarget = {
  description: string;
  id: string;
  kind: 'locator';
  locate: (page: Page) => Locator;
  route: string;
  title: string;
};

export type CopyDiffTarget = PageTarget | LocatorTarget;

export const copyDiffTargets: CopyDiffTarget[] = [
  {
    id: 'navbar',
    title: 'Navbar',
    route: '/',
    description: 'Shared site navigation.',
    kind: 'locator',
    locate: (page) => page.locator('nav').first(),
  },
  {
    id: 'footer',
    title: 'Footer',
    route: '/',
    description: 'Shared site footer.',
    kind: 'locator',
    locate: (page) => page.locator('footer').first(),
  },
  {
    id: 'home-page',
    title: 'Homepage',
    route: '/',
    description: 'Full homepage without shared navbar and footer.',
    kind: 'page',
    hideSelectors: ['nav', 'footer'],
  },
  {
    id: 'about-page',
    title: 'About Page',
    route: '/about/',
    description: 'Full About page without shared navbar and footer.',
    kind: 'page',
    hideSelectors: ['nav', 'footer'],
  },
  {
    id: 'services-page',
    title: 'Services Page',
    route: '/services/',
    description: 'Full Services page without shared navbar and footer.',
    kind: 'page',
    hideSelectors: ['nav', 'footer'],
  },
  {
    id: 'faq-page',
    title: 'FAQ Page',
    route: '/faqs/',
    description: 'Full FAQ page without shared navbar and footer.',
    kind: 'page',
    hideSelectors: ['nav', 'footer'],
  },
  {
    id: 'areas-page',
    title: 'Areas Page',
    route: '/areas/',
    description: 'Full Areas page without shared navbar and footer.',
    kind: 'page',
    hideSelectors: ['nav', 'footer'],
  },
  {
    id: 'blog-page',
    title: 'Blog Page',
    route: '/blog/',
    description: 'Full Blog page without shared navbar and footer.',
    kind: 'page',
    hideSelectors: ['nav', 'footer'],
  },
  {
    id: 'breakdown-service-page',
    title: 'Breakdown Service Page',
    route: '/services/breakdown-recovery-watford/',
    description: 'Full breakdown recovery service page without shared navbar and footer.',
    kind: 'page',
    hideSelectors: ['nav', 'footer'],
  },
  {
    id: 'car-towing-service-page',
    title: 'Car Towing Service Page',
    route: '/services/car-towing-watford/',
    description: 'Full car towing service page without shared navbar and footer.',
    kind: 'page',
    hideSelectors: ['nav', 'footer'],
  },
  {
    id: 'rickmansworth-area-page',
    title: 'Rickmansworth Area Page',
    route: '/areas/rickmansworth/',
    description: 'Full Rickmansworth area page without shared navbar and footer.',
    kind: 'page',
    hideSelectors: ['nav', 'footer'],
  },
  {
    id: 'motorway-blog-post-page',
    title: 'Motorway Breakdown Blog Post',
    route: '/blog/what-to-do-when-your-car-breaks-down-on-the-motorway/',
    description: 'Full motorway breakdown blog post without shared navbar and footer.',
    kind: 'page',
    hideSelectors: ['nav', 'footer'],
  },
];
