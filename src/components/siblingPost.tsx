import Link from 'next/link';
import * as React from 'react';

import { ChevronLeft, ChevronRight } from '@styled-icons/feather';

interface SiblingPostProps {
  title: string;
  url: string;
  chevron: 'left' | 'right';
}

/**
 * siblingPost
 */
const SiblingPost: React.FC<SiblingPostProps> = ({ title, url, chevron }) => (
  <div
    className={`inline-flex items-center w-full ${
      chevron === 'right' ? 'justify-end' : ''
    }`}
  >
    {chevron === 'left' && (
      <span className="pr-2">
        <ChevronLeft size={24} />
      </span>
    )}
    <Link href="/blog/[slug]" as={url}>
      <a className="text-sm line-clamp-1 sm:line-clamp-2">{title}</a>
    </Link>
    {chevron === 'right' && (
      <span className="pl-2">
        <ChevronRight size={24} />
      </span>
    )}
  </div>
);
export default SiblingPost;
