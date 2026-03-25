/**
 * Renders a row of filled and empty star SVG icons to represent a numeric
 * rating. Stars at indices up to and including `rating` are filled; the
 * remainder are greyed out.
 *
 * @param props.rating - The numeric rating value (e.g. `4.5`).
 * @param props.outOf - Total number of stars to render. Defaults to `5`.
 * @param props.size - Width and height of each star SVG in pixels. Defaults to `24`.
 * @see https://flowbite.com/docs/components/rating/#default-rating
 */
export function Rating({ rating, outOf = 5, size = 24 }: { rating: number; outOf?: number; size?: number }) {
  const stars: React.ReactNode[] = [];

  for (let i = 0; i < outOf; i++) {
    if (i <= rating) {
      stars.push(
        <svg
          key={i}
          className="text-fg-yellow h-5 w-5"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width={size}
          height={size}
          fill="currentColor"
          viewBox={`0 0 ${size} ${size}`}
        >
          <path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z" />
        </svg>
      );
    } else {
      stars.push(
        <svg
          key={i}
          className="text-fg-disabled h-5 w-5"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width={size}
          height={size}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z" />
        </svg>
      );
    }
  }

  return <div className="inline-flex items-center space-x-1">{stars}</div>;
}
