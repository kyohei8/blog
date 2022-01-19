import Link from 'next/link';
import * as React from 'react';

import { getBlogLink } from '../lib/blog-helpers';
import Date from './articles/Date';

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
  <div className="flex justify-start items-start md:items-center flex-col md:flex-row mb-3">
    <div className="mr-2">
      <Date date={date} />
    </div>
    <div className="flex justify-start items-center flex-1">
      {draft && (
        <span className="bg-orange-400 text-white text-xs px-2 rounded pb-px">
          Draft
        </span>
      )}
      <Link href="/blog/[slug]" as={getBlogLink(slug)}>
        <a>
          {icon && <span className="text-lg">{icon}&nbsp;</span>}
          {title}
        </a>
      </Link>
    </div>
  </div>
);

export default ArticleRow;
