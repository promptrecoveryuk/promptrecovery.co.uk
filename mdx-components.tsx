import type { MDXComponents } from 'mdx/types';

import { basePath } from './src/app/base-path';

/**
 * Shared MDX element styles. Exported so next-mdx-remote can consume them
 * directly (via the `components` prop on <MDXRemote>), and also used by the
 * `useMDXComponents` hook below which @next/mdx requires for app-router pages.
 */
export const mdxComponents: MDXComponents = {
  h1: ({ children }) => <h1 className="text-heading mt-8 mb-6 text-3xl font-bold">{children}</h1>,
  h2: ({ children }) => <h2 className="text-heading mt-8 mb-4 text-2xl font-semibold">{children}</h2>,
  h3: ({ children }) => <h3 className="text-heading mt-6 mb-3 text-xl font-semibold">{children}</h3>,
  p: ({ children }) => <p className="mb-4 leading-relaxed text-gray-700">{children}</p>,
  ul: ({ children }) => <ul className="mb-4 list-disc space-y-1 pl-6 text-gray-700">{children}</ul>,
  ol: ({ children }) => <ol className="mb-4 list-decimal space-y-1 pl-6 text-gray-700">{children}</ol>,
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>,
  a: ({ href, children }) => {
    const isExternal = href?.startsWith('http://') || href?.startsWith('https://');
    return (
      <a
        href={isExternal ? `${basePath}${href}` : href}
        className="text-brand hover:text-brand-light underline"
        {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {children}
      </a>
    );
  },
  blockquote: ({ children }) => (
    <blockquote className="border-brand my-4 border-l-4 pl-4 text-gray-600 italic">{children}</blockquote>
  ),
  hr: () => <hr className="my-8 border-gray-200" />,
};

/**
 * Required by @next/mdx for the app router.
 * @see https://nextjs.org/docs/app/building-your-application/configuring/mdx
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return { ...mdxComponents, ...components };
}
