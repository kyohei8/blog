import Link from 'next/link';
import * as React from 'react';

import { getBlogLink } from '../lib/blog-helpers';

interface ArticleRowProps {
  title: string;
  date: string;
  slug: string;
  draft: boolean;
}

/**
 * ArticleRow
 */
const ArticleRow: React.FC<ArticleRowProps> = ({
  date,
  title,
  slug,
  draft
}) => (
  <div className="flex justify-start items-center mb-3">
    {draft && <span>Draft</span>}
    <small className="text-sm mr-2">{date}</small>
    <div className="flex flex-col justify-center">
      <Link href="/blog/[slug]" as={getBlogLink(slug)}>
        <a style={{ boxShadow: `none` }}>{title}</a>
      </Link>
    </div>
    {/*
      <p
        dangerouslySetInnerHTML={{
          __html: node.frontmatter.description || node.excerpt
        }}
      />
      <div>{node.excerpt}</div>
    */}
  </div>
);

export default ArticleRow;
