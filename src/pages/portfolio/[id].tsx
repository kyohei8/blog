import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import React, { CSSProperties } from 'react';

import Heading from '../../components/heading';
import getPageData from '../../lib/notion/getPageData';
import { textBlock } from '../../lib/notion/renderers';
import { normalizeId } from '../../lib/notion/utils';
import { postDataType } from '../blog/[slug]';

interface PortfolioProps {
  post: postDataType;
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: true
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const pageId = params.id || '';
  let post: any = {};
  try {
    const postData = await getPageData(normalizeId(pageId as string));
    post.content = postData.blocks;
  } catch (err) {
    console.warn(
      `Failed to load Notion posts, attempting to auto create table`
    );
    try {
      console.log(`Successfully created table in Notion`);
    } catch (err) {
      console.error(
        `Auto creating table failed, make sure you created a blank page and site the id with BLOG_INDEX_ID in your environment`,
        err
      );
    }
    return { props: {} };
  }
  return {
    props: {
      post
    },
    unstable_revalidate: 10
  };
};

/**
 * Portfolio
 */
const Portfolio: NextPage<PortfolioProps> = ({ post }) => {
  if (!post) {
    return <div>loading...</div>;
  }
  return (
    <div>
      <div className="mb-20">
        {(!post.content || post.content.length === 0) && (
          <p>This post has no content</p>
        )}

        {(post.content || []).map(block => {
          const { value } = block;
          const { type, properties, id } = value;
          let toRender = [];
          const renderHeading = (Type: string | React.ComponentType) => {
            toRender.push(
              <Heading key={id}>
                <Type key={id}>{textBlock(properties.title, true, id)}</Type>
              </Heading>
            );
          };

          switch (type) {
            case 'page':
            case 'divider':
              // todo
              break;
            case 'text':
              if (properties) {
                toRender.push(textBlock(properties.title, false, id));
              }
              break;
            case 'image':
            case 'video':
            case 'embed': {
              const { format = {}, properties } = value;
              const {
                caption
              }: {
                caption?: string[];
              } = properties;
              const {
                block_width,
                block_height,
                display_source,
                block_aspect_ratio
              } = format;
              const baseBlockWidth = 768;
              const roundFactor = Math.pow(10, 2);
              // calculate percentages
              const width = block_width
                ? `${Math.round(
                    (block_width / baseBlockWidth) * 100 * roundFactor
                  ) / roundFactor}%`
                : block_height || '100%';

              const isImage = type === 'image';
              const Comp = isImage ? 'img' : 'video';
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

              if (!isImage && !value.file_ids) {
                // external resource use iframe
                child = (
                  <iframe
                    style={childStyle}
                    src={display_source}
                    key={!useWrapper ? id : undefined}
                    className={!useWrapper ? 'asset-wrapper' : undefined}
                  />
                );
              } else {
                // notion resource
                child = (
                  <Comp
                    key={!useWrapper ? id : undefined}
                    src={`/api/asset?assetUrl=${encodeURIComponent(
                      display_source as any
                    )}&blockId=${id}`}
                    controls={!isImage}
                    alt={`An ${isImage ? 'image' : 'video'} from Notion`}
                    loop={!isImage}
                    muted={!isImage}
                    autoPlay={!isImage}
                    style={childStyle}
                    loading={isImage ? 'lazy' : 'eager'}
                    className="shadow"
                  />
                );
              }

              toRender.push(
                useWrapper ? (
                  <div className="mb-8" key={id}>
                    <div
                      style={{
                        paddingTop: `${Math.round(block_aspect_ratio * 100)}%`,
                        position: 'relative'
                      }}
                      className="asset-wrapper shadow-md"
                    >
                      {child}
                    </div>
                    {caption && <div className="mt-1">{caption[0]}</div>}
                  </div>
                ) : (
                  child
                )
              );
              break;
            }
            case 'header':
              renderHeading('h1');
              break;
            case 'sub_header':
              renderHeading('h2');
              break;
            case 'sub_sub_header':
              renderHeading('h3');
              break;
            default:
              break;
          }
          return toRender;
        })}
      </div>
    </div>
  );
};

export default Portfolio;
