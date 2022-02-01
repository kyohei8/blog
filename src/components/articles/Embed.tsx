import { CSSProperties } from 'react';

import { styled } from '@nextui-org/react';

// 画像、動画、iframeのコンポーネント出力
export const embedMedia = (
  value: any,
  id: string,
  type: 'image' | 'video' | 'embed',
  onClick?: (src: string) => void
) => {
  const { format = {} } = value;
  const { block_width, block_height, display_source, block_aspect_ratio } =
    format;

  const baseBlockWidth = 768;
  const roundFactor = Math.pow(10, 2);
  // calculate percentages
  const width = block_width
    ? `${
        Math.round((block_width / baseBlockWidth) * 100 * roundFactor) /
        roundFactor
      }%`
    : block_height || '100%';

  const isImage = type === 'image';
  const useWrapper = block_aspect_ratio && !block_height;
  const childStyle: CSSProperties = useWrapper
    ? {
        width: '100%',
        height: '100%',
        border: 'none',
        position: 'absolute',
        top: 0
      }
    : {
        width,
        border: 'none',
        height: block_height,
        display: 'block',
        maxWidth: '100%'
      };

  let child = null;
  if (isImage) {
    // img
    child = (
      <StyledImage
        key={!useWrapper ? id : undefined}
        src={`/api/asset?assetUrl=${encodeURIComponent(
          display_source as any
        )}&blockId=${id}`}
        alt="An image from Notion"
        style={childStyle}
        loading="lazy"
        onClick={() => {
          const src = `/api/asset?assetUrl=${encodeURIComponent(
            display_source as any
          )}&blockId=${id}`;
          onClick(src);
        }}
      />
    );
  } else {
    // video
    child = (
      <StyledVideo
        key={!useWrapper ? id : undefined}
        src={`/api/asset?assetUrl=${encodeURIComponent(
          display_source as any
        )}&blockId=${id}`}
        controls={!isImage}
        loop={!isImage}
        muted={!isImage}
        autoPlay={!isImage}
        style={childStyle}
      />
    );
  }

  return useWrapper ? (
    <div
      style={{
        paddingTop: `${Math.round(block_aspect_ratio * 100)}%`,
        position: 'relative'
      }}
      className="asset-wrapper shadow-md mb-4"
      key={id}
    >
      {child}
    </div>
  ) : (
    child
  );
};

const StyledImage = styled('img', {
  boxShadow: '$sm',
  margin: '0 auto %8',
  cursor: 'zoom-in',
  '&:hover': {
    opacity: 0.8
  }
});

const StyledVideo = styled('video', {
  boxShadow: '$sm',
  margin: '0 auto $8'
});

export const embedWebPage = (value: any, id: string) => {
  const { format = {} } = value;
  const { block_width, block_height, display_source, block_aspect_ratio } =
    format;

  const baseBlockWidth = 768;
  const roundFactor = Math.pow(10, 2);
  // calculate percentages
  const width = block_width
    ? `${
        Math.round((block_width / baseBlockWidth) * 100 * roundFactor) /
        roundFactor
      }%`
    : block_height || '100%';

  const useWrapper = block_aspect_ratio && !block_height;
  const childStyle: CSSProperties = useWrapper
    ? {
        width: '100%',
        height: '100%',
        border: 'none',
        position: 'absolute',
        top: 0
      }
    : {
        width,
        border: 'none',
        height: block_height,
        display: 'block',
        maxWidth: '100%'
      };

  let child = null;

  if (!value.file_ids) {
    // external resource use iframe
    child = (
      <StyledIframe
        style={childStyle}
        src={display_source}
        key={!useWrapper ? id : undefined}
      />
    );
  }

  return useWrapper ? (
    <div
      style={{
        paddingTop: `${Math.round(block_aspect_ratio * 100)}%`,
        position: 'relative'
      }}
      key={id}
    >
      {child}
    </div>
  ) : (
    child
  );
};

const StyledIframe = styled('iframe', {
  boxShadow: '$sm',
  margin: '0 auto $8'
});
