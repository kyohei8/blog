import Link from 'next/link';
import * as React from 'react';

import { styled } from '@nextui-org/react';

interface PreviewModeNoteProps {
  clearHref: string;
}

/**
 * PreviewModeNote
 */
const PreviewModeNote: React.FC<PreviewModeNoteProps> = ({ clearHref }) => (
  <div>
    <StyledWrapper>
      <span>
        <b>Note: </b>Viewing in preview mode
      </span>
      <Link href={clearHref} prefetch={false}>
        <a>Exit Preview</a>
      </Link>
    </StyledWrapper>
  </div>
);

const StyledWrapper = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '$4 $8',
  backgroundColor: '$yellow300',
  borderRadius: '$xs',
  boxShadow: '$sm',
  marginBottom: '$4'
});

export default PreviewModeNote;
