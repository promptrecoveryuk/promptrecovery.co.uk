// PostCSS is the CSS transformation pipeline that Next.js runs on every
// stylesheet. Tailwind v4 ships its own PostCSS plugin (@tailwindcss/postcss)
// which replaces the separate `tailwindcss` + `autoprefixer` plugins used in
// Tailwind v3. Vendor prefixing is now handled internally by the plugin.
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};

export default config;
