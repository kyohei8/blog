import NextLink from 'next/link';
import * as React from 'react';

import { Container, Link, Spacer, Text } from '@nextui-org/react';

import { getBlogLink } from '../../lib/blog-helpers';
import Date from './Date';

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
      {draft && (
        <Text size={12} color="$yellow500" span>
          Draft
        </Text>
      )}
      <NextLink
        href="/blog/[slug]"
        as={getBlogLink(slug)}
        prefetch={false}
        passHref
      >
        <Link>
          <Text color="$primary">
            {icon && <span>{icon}&nbsp;</span>}
            {title}
          </Text>
        </Link>
      </NextLink>
    </div>
  </Container>
);

export default ArticleRow;
