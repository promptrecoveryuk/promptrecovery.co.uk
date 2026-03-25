// Prefix all local image src values with this so they resolve correctly when
// the site is served from a sub-path (e.g. GitHub Pages project pages).
// next/image with `unoptimized: true` does not apply basePath automatically.
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
