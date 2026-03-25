import Image from 'next/image';

import { basePath } from '@/app/base-path';
import { Picture } from '@/types';

/**
 * Responsive photo grid that renders a list of {@link Picture} items using
 * Next.js `<Image>` for automatic size optimisation and lazy loading. Displays
 * two columns on mobile and four on medium screens and above.
 *
 * @param props.items - Array of picture metadata objects (file path, dimensions, alt text).
 * @see https://flowbite.com/docs/components/gallery/#default-gallery
 */
export function GridGallery({ items }: { items: Picture[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {items.map((item) => (
        <div key={item.filePath}>
          <Image
            className="rounded-base h-auto max-w-full"
            width={item.width}
            height={item.height}
            src={`${basePath}${item.filePath}`}
            alt={item.description}
          />
        </div>
      ))}
    </div>
  );
}
