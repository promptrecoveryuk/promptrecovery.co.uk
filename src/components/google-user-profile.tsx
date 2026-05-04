import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { twJoin } from 'tailwind-merge';

import { BackgroundMode, GoogleUser } from '@/types';

/**
 * Renders a Google reviewer's avatar and display name as a linked profile.
 * Accepts an optional slot for additional content (e.g. a star rating and
 * relative review date) rendered beneath the author's name.
 *
 * @param props.userProfile - Reviewer profile data: `author`, `authorPhoto`, and `authorUrl`.
 * @param props.children - Optional content rendered below the author's name inside the link.
 * @param props.bgMode - The background style on which this component will be rendered
 */
export function GoogleUserProfile({
  userProfile,
  children,
  bgMode = 'light',
}: {
  userProfile: GoogleUser;
  children?: React.ReactNode;
  bgMode: BackgroundMode;
}) {
  return (
    <Link
      href={userProfile.authorUrl}
      className="focus-visible:ring-yellow flex items-center gap-2.5 focus-visible:ring-2"
    >
      <Image
        className="h-12 w-12 rounded-full bg-neutral-300"
        width={48}
        height={48}
        src={userProfile.authorPhoto}
        alt={userProfile.author}
      />
      <div className={twJoin('font-medium', bgMode === 'light' ? 'text-heading' : 'text-white')}>
        <div className="text-left">{userProfile.author}</div>
        {children}
      </div>
    </Link>
  );
}
