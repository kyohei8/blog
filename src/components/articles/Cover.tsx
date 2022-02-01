import * as React from 'react';

import { styled } from '@nextui-org/react';

interface CoverProps {
  headerImageSrc: string;
  headerImagePosition: number;
}

/**
 * Cover
 */
const Cover = ({
  headerImageSrc,
  headerImagePosition
}: CoverProps): JSX.Element => (
  <StyledWrapper>
    <StyledCover>
      <StyledBgImage
        css={{
          backgroundImage: `url(${headerImageSrc})`,
          backgroundPosition: `center ${headerImagePosition * 1000}%`
        }}
      />
    </StyledCover>
  </StyledWrapper>
);

const StyledWrapper = styled('div', {
  height: '$64'
});

const StyledCover = styled('div', {
  position: 'absolute',
  top: '$16',
  width: '100%',
  height: '$64',
  left: 0
});

const StyledBgImage = styled('div', {
  backgroundSize: 'cover',
  width: '100%',
  height: '100%'
});

export default Cover;
