import NextLink from 'next/link';
import * as React from 'react';

import { Container, Link, Spacer } from '@nextui-org/react';

import { getBlogLink } from '../../lib/blog-helpers';
import Date from './Date';
import DraftTag from './DraftTag';

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
  <Container
    fluid
    gap={0}
    display="flex"
    justify="flex-start"
    direction="column"
    alignItems="flex-start"
    css={{
      '@sm': {
        alignItems: 'center',
        flexDirection: 'row'
      }
    }}
  >
    <Date date={date} />
    <Spacer
      x={0.5}
      css={{
        display: 'none',
        '@sm': {
          display: 'inline-block'
        }
      }}
    />
    <div>
      {draft && <DraftTag />}
      <NextLink
        href="/blog/[slug]"
        as={getBlogLink(slug)}
        prefetch={false}
        passHref
      >
        <Link css={{ color: '$primary' }}>
          {icon && <span>{icon}&nbsp;</span>}
          {title}
        </Link>
      </NextLink>
    </div>
  </Container>
);

export default ArticleRow;
