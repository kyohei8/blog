import * as React from 'react';

import { styled } from '@nextui-org/react';

import { getBlogLink } from '../../lib/blog-helpers';
import SiblingPostLink from './SiblingPostLink';

interface SiblingPostProps {
  beforePost?: any;
  afterPost?: any;
}

/**
 * SiblingPost
 */
const SiblingPost = ({
  beforePost,
  afterPost
}: SiblingPostProps): JSX.Element => (
  <StyledWrapper>
    <StyledLinkWrapper>
      {beforePost && (
        <SiblingPostLink
          title={beforePost.Page}
          url={getBlogLink(beforePost.Slug)}
          chevron="left"
        />
      )}
    </StyledLinkWrapper>
    <StyledBorder />
    <StyledLinkWrapper css={{ textAlign: 'right' }}>
      {afterPost && (
        <SiblingPostLink
          title={afterPost.Page}
          url={getBlogLink(afterPost.Slug)}
          chevron="right"
        />
      )}
    </StyledLinkWrapper>
  </StyledWrapper>
);

const StyledWrapper = styled('div', {
  fontSize: 0,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'stretch',
  padding: '$8 0'
});

const StyledLinkWrapper = styled('div', {
  width: '50%'
});

const StyledBorder = styled('div', {
  width: '1px',
  height: 'auto',
  backgroundColor: '$gray200',
  margin: '0 $8'
});

export default SiblingPost;
