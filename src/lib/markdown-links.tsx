import Link from 'next/link';
import type { ReactNode } from 'react';

const markdownLinkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;

export function renderMarkdownLinks(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;

  for (const match of text.matchAll(markdownLinkPattern)) {
    const [fullMatch, label, href] = match;
    const index = match.index ?? 0;

    if (index > lastIndex) {
      nodes.push(text.slice(lastIndex, index));
    }

    nodes.push(
      <Link key={`${href}-${index}`} href={href} className="text-brand hover:text-brand-light underline">
        {label}
      </Link>
    );

    lastIndex = index + fullMatch.length;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}

export function stripMarkdownLinks(text: string): string {
  return text.replace(markdownLinkPattern, '$1');
}
