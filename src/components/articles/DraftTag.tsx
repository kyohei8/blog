import * as React from 'react';

import { styled } from '@nextui-org/react';

interface DraftTagProps {}

/**
 * DraftTag
 */
const DraftTag = ({}: DraftTagProps): JSX.Element => (
  <StyledWrapper>Draft</StyledWrapper>
);

const StyledWrapper = styled('span', {
  borderRadius: '2px',
  border: '1px solid $yellow500',
  color: '$yellow500',
  fontSize: '$xs',
  padding: '0 $2',
  marginRight: '$4'
});

export default DraftTag;
