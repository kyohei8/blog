import NextLink from 'next/link';
import * as React from 'react';

import { Link, Spacer, styled, useTheme } from '@nextui-org/react';
import { ChevronLeft, ChevronRight } from '@styled-icons/feather';

interface SiblingPostProps {
  title: string;
  url: string;
  chevron: 'left' | 'right';
}

/**
 * SiblingPostLink
 */
const SiblingPostLink: React.FC<SiblingPostProps> = ({
  title,
  url,
  chevron
}) => {
  const { theme } = useTheme();
  return (
    <NextLink href="/blog/[slug]" as={url} prefetch={false} passHref>
      <Link>
        <StyledWrapper>
          {chevron === 'left' && (
            <ChevronLeft size={24} color={theme.colors.primary.value} />
          )}
          <StyledText>{title}</StyledText>
          {chevron === 'right' && (
            <ChevronRight size={24} color={theme.colors.primary.value} />
          )}
        </StyledWrapper>
      </Link>
    </NextLink>
  );
};

const StyledWrapper = styled('span', {
  display: 'inline-flex',
  alignItems: 'center',
  width: '100%'
});
const StyledText = styled('span', {
  flex: 1,
  fontSize: '$xs',
  color: '$primary',
  paddingBottom: '1px',
  display: '-webkit-box',
  '-webkit-line-clamp': 1,
  '-webkit-box-orient': 'vertical',
  overflow: 'hidden'
});

export default SiblingPostLink;
