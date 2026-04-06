import Link from 'next/link';

import { ItemWithIcon } from '@/types';

import * as Icons from './icons';

/**
 * Renders a single service or company-value card consisting of a Lucide icon,
 * a title, and a short description. The icon is resolved dynamically from the
 * {@link Icons} barrel using the string name stored in the data JSON.
 *
 * @param props.service - Service data object containing `name`, `description`, and `icon` (Lucide icon name as a string).
 * @param props.href - Optional URL. When supplied, the whole card becomes a link.
 * @see https://preline.co/examples/icon-sections.html#icon-gray-bg-on-hover
 */
export function ServiceItem({ href, service }: { href?: string; service: ItemWithIcon }) {
  const Icon = Icons[service.icon as keyof typeof Icons];
  const content = (
    <>
      <Icon className="size-8 shrink-0" />
      <div>
        <div>
          <h3 className={`text-foreground block font-semibold ${href ? 'underline' : ''}`}>{service.name}</h3>
          <p className="text-muted-foreground-2">{service.description}</p>
          {href && <span className="text-primary hover:text-primary-hover focus:text-primary-focus">Read more →</span>}
        </div>
      </div>
    </>
  );

  if (!href)
    return (
      <div className="group hover:bg-muted-hover focus:bg-muted-focus flex size-full gap-x-4 gap-y-6 rounded-lg p-5 focus:outline-hidden">
        {content}
      </div>
    );

  return (
    <Link
      href={href}
      className="group hover:bg-muted-hover focus:bg-muted-focus block flex size-full gap-x-4 gap-y-6 rounded-lg p-5 focus:outline-hidden"
    >
      {content}
    </Link>
  );
}
