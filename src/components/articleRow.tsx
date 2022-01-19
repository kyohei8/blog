import Link from 'next/link';
import * as React from 'react';

import { getBlogLink } from '../lib/blog-helpers';

interface ArticleRowProps {
  title: string;
  date: string;
  slug: string;
  draft: boolean;
  icon?: string;
}

/**
 * ArticleRow
 */
const ArticleRow: React.FC<ArticleRowProps> = ({
  date,
  title,
  slug,
  icon,
  draft
}) => (
  <div className="flex justify-start items-start md:flex-row flex-col mb-3">
    <small className="text-sm mr-2 mt-1">{date}</small>
    <div className="flex justify-start items-center flex-1">
      {draft && (
        <span className="bg-orange-400 text-white text-xs px-2 rounded pb-px">
          Draft
        </span>
      )}
      <Link href="/blog/[slug]" as={getBlogLink(slug)}>
        <a style={{ boxShadow: `none` }}>
          {icon && <span className="text-lg">{icon}&nbsp;</span>}
          {title}
        </a>
      </Link>
    </div>
  </div>
);

export default ArticleRow;
