import Image from 'next/image';
import Link from 'next/link';

import { basePath } from '@/app/base-path';
import { ItemWithIconAndPicture } from '@/types';

import * as Icons from './icons';

/**
 * Renders an icon, heading, description, and supporting image for a single
 * item (e.g. a reason to choose the business). The icon is resolved
 * dynamically from the {@link Icons} barrel using the string name stored in
 * the data JSON.
 *
 * @param props.item - Item data including `name`, `description`, `icon` (Lucide icon name), and `picture` metadata.
 * @param props.href - Optional URL. When supplied, the whole card becomes a link.
 */
export function DescriptiveItemWithImage({ href, item }: { href?: string; item: ItemWithIconAndPicture }) {
  const Icon = Icons[item.icon as keyof typeof Icons];
  const content = (
    <>
      <Icon className="size-8 shrink-0" />
      <div className="flex flex-col">
        <h3 className={`text-foreground block font-semibold ${href ? 'underline' : ''}`}>{item.name}</h3>
        <p className="text-muted-foreground-2">{item.description}</p>

        {href && <span className="text-primary hover:text-primary-hover focus:text-primary-focus">Read more →</span>}
        <Image
          className="rounded-base mt-2 max-w-full grow-2"
          width={item.picture.width}
          height={item.picture.height}
          src={`${basePath}${item.picture.filePath1}`}
          alt={item.picture.description}
        />
      </div>
    </>
  );

  if (!href)
    return (
      <div
        id={item.id}
        className="group hover:bg-muted-hover focus:bg-muted-focus flex size-full justify-between gap-x-4 gap-y-6 rounded-lg p-5 focus:outline-hidden"
      >
        {content}
      </div>
    );

  return (
    <Link
      id={item.id}
      href={href}
      className="group hover:bg-muted-hover focus:bg-muted-focus block flex size-full justify-between gap-x-4 gap-y-6 rounded-lg p-5 focus:outline-hidden"
    >
      {content}
    </Link>
  );
}
