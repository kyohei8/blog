import Link from 'next/link';
import { useRouter } from 'next/router';
import fetch from 'node-fetch';
import React, { CSSProperties, useEffect, useState } from 'react';

import ReactJSXParser from '@zeit/react-jsx-parser';

import Bio from '../../components/bio';
import components from '../../components/dynamic';
import { Header } from '../../components/header';
import Heading from '../../components/heading';
import ImageModal from '../../components/imageModal';
import SiblingPost from '../../components/siblingPost';
import { getBlogLink, getDateStr } from '../../lib/blog-helpers';
import getBlogIndex from '../../lib/notion/getBlogIndex';
import getNotionUsers from '../../lib/notion/getNotionUsers';
import getPageData from '../../lib/notion/getPageData';
import { getPostPreview } from '../../lib/notion/getPostPreview';
import { textBlock } from '../../lib/notion/renderers';

type postDataType = {
  Authors: string[];
  Date: number;
  Page: string;
  Published: 'Yes' | 'No';
  Slug: string;
  Tags: string[];
  Preview: string;
  content: any[];
  id: string;
  hasTweet?: boolean;
};

// Get the data for each blog post
export async function getStaticProps({ params: { slug }, preview }) {
  // slugからページIDを取得するために,postのリストを取得
  const postsTable = await getBlogIndex();
  const postIndex = postsTable.findIndex(({ Slug: _slug }) => _slug === slug);
  const post = postsTable[postIndex];

  // 存在しないまたは公開していない場合はリダイレクト
  if (!post || (post.Published !== 'Yes' && !preview)) {
    console.log(`Failed to find post for slug: ${slug}`);
    return {
      props: {
        redirect: '/',
        preview: false
      },
      unstable_revalidate: 5
    };
  }
  // 前後のpostを取得
  const afterPost = postsTable[postIndex - 1] || null;
  const beforePost = postsTable[postIndex + 1] || null;

  const postData = await getPageData(post.id);
  post.content = postData.blocks;

  for (let i = 0; i < postData.blocks.length; i++) {
    const { value } = postData.blocks[i];
    const { type, properties } = value;
    if (type == 'tweet') {
      const src = properties.source[0][0];
      // parse id from https://twitter.com/_ijjk/status/TWEET_ID format
      const tweetId = src.split('/')[5].split('?')[0];
      if (!tweetId) continue;

      try {
        const res = await fetch(
          `https://api.twitter.com/1/statuses/oembed.json?id=${tweetId}`
        );
        const json = await res.json();
        properties.html = json.html.split('<script')[0];
        post.hasTweet = true;
      } catch (_) {
        console.log(`Failed to get tweet embed for ${src}`);
      }
    }
  }

  const postPreview = await getPostPreview(post.id);
  post.Preview = postPreview || '';

  const { users } = await getNotionUsers(post.Authors || []);
  post.Authors = Object.keys(users).map(id => users[id].full_name);
  post.Tags = post.Tags ? post.Tags.split(',') : [];

  return {
    props: {
      post,
      afterPost,
      beforePost,
      preview: preview || false
    },
    unstable_revalidate: 10
  };
}

// Return our list of blog posts to prerender
export async function getStaticPaths() {
  const postsTable = await getBlogIndex();
  // we fallback for any unpublished posts to save build time
  // for actually published ones
  const paths = postsTable
    .filter(post => post.Published === 'Yes')
    .map(({ Slug }) => getBlogLink(Slug));
  return {
    paths,
    fallback: true
  };
}
interface SlugProps {
  post: postDataType;
  beforePost: postDataType;
  afterPost: postDataType;
  redirect: string;
  preview: boolean;
}

const listTypes = new Set(['bulleted_list', 'numbered_list']);
const RenderPost: React.FC<SlugProps> = props => {
  const { post, beforePost, afterPost, redirect, preview } = props;
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<string>('');

  let listTagName: string | null = null;
  let listLastId: string | null = null;
  let listMap: {
    [id: string]: {
      key: string;
      isNested?: boolean;
      nested: string[];
      listTagName: string;
      children: React.ReactFragment;
    };
  } = {};

  useEffect(() => {
    const twitterSrc = 'https://platform.twitter.com/widgets.js';
    // make sure to initialize any new widgets loading on
    // client navigation
    if (post && post.hasTweet) {
      if ((window as any)?.twttr?.widgets) {
        (window as any).twttr.widgets.load();
      } else if (!document.querySelector(`script[src="${twitterSrc}"]`)) {
        const script = document.createElement('script');
        script.async = true;
        script.src = twitterSrc;
        document.querySelector('body').appendChild(script);
      }
    }
  }, []);
  useEffect(() => {
    if (redirect && !post) {
      router.replace(redirect);
    }
  }, [redirect, post]);

  // If the page is not yet generated, this will be displayed
  // initially until getStaticProps() finishes running
  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  // if you don't have a post at this point, and are not
  // loading one from fallback then  redirect back to the index
  if (!post) {
    return (
      <div>
        <p>
          Woops! didn't find that post, redirecting you back to the blog index
        </p>
      </div>
    );
  }

  let headerImageSrc = '';
  if (post.content[0]) {
    const { value } = post.content[0];

    // ヘッダ画像
    if (value.parent_table === 'collection') {
      if (value.format && value.format.page_cover) {
        if ((value.format.page_cover as string).startsWith('/images')) {
          headerImageSrc = `https://www.notion.so${value.format.page_cover}`;
        } else {
          headerImageSrc = `/api/asset?assetUrl=${encodeURIComponent(
            value.format.page_cover as string
          )}&blockId=${value.id}`;
        }
      }
    }
  }

  return (
    <>
      <Header
        titlePre={post.Page}
        slug={post.Slug}
        publishedTime={post.Date}
        author={post.Authors[0]}
        tags={post.Tags.length > 0 ? post.Tags.join(',') : ''}
        headerImage={headerImageSrc}
        description={post.Preview}
      />
      {preview && (
        <div>
          <div>
            <b>Note:</b>
            {` `}Viewing in preview mode{' '}
            <Link href={`/api/clear-preview?slug=${post.Slug}`}>
              <button>Exit Preview</button>
            </Link>
          </div>
        </div>
      )}
      {selectedImage && (
        <ImageModal
          onClose={() => {
            setSelectedImage('');
          }}
          imageSrc={selectedImage}
        />
      )}

      <div className="mb-20">
        {headerImageSrc && (
          <div>
            <div className="h-64 mb-8"></div>
            <div
              className="h-64 absolute w-full left-0"
              style={{ top: '54px' }}
            >
              <div
                className="bg-center bg-cover w-full h-full"
                style={{ backgroundImage: `url(${headerImageSrc})` }}
              />
            </div>
          </div>
        )}
        <h1 className="mb-0 text-2xl font-bold pb-2 border-b border-solid border-gray-400">
          {post.Page || ''}
        </h1>
        <div className="flex justify-between mb-6 px-1">
          <div>
            {post.Tags.length > 0 && (
              <>
                {post.Tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="inline-block mr-2 text-sm text-blue-700"
                  >
                    {tag}
                  </span>
                ))}
              </>
            )}
          </div>
          <div className="w-24 text-right">
            {post.Date && (
              <span className="text-sm text-gray-700">
                {getDateStr(post.Date)}
              </span>
            )}
          </div>
        </div>

        {(!post.content || post.content.length === 0) && (
          <p>This post has no content</p>
        )}

        {(post.content || []).map((block, blockIdx) => {
          const { value } = block;
          const { type, properties, id, parent_id } = value;
          const isLast = blockIdx === post.content.length - 1;
          const isList = listTypes.has(type);
          let toRender = [];

          // リストの表示
          if (isList) {
            // 最初のタグ
            if (!listTagName) {
              listTagName = components[type === 'bulleted_list' ? 'ul' : 'ol'];
            }
            listLastId = `list${id}`;

            listMap[id] = {
              key: id,
              nested: [],
              listTagName: components[type === 'bulleted_list' ? 'ul' : 'ol'],
              children: textBlock(properties.title, true, id)
            };

            if (listMap[parent_id]) {
              listMap[id].isNested = true;
              listMap[parent_id].nested.push(id);
            }
          }

          // リストの場合最後まで確認し、toRenderにpushする
          if (listTagName && (isLast || !isList)) {
            toRender.push(
              React.createElement(
                listTagName,
                {
                  key: listLastId!,
                  className: `${
                    listTagName === 'ul' ? 'list-disc' : 'list-decimal'
                  } list-inside mb-6`
                },
                Object.keys(listMap).map(itemId => {
                  if (listMap[itemId].isNested) return null;

                  const createEl = item => {
                    return React.createElement(
                      components.li || 'ul',
                      { key: item.key },
                      item.children,
                      item.nested.length > 0
                        ? React.createElement(
                            // 次のリストのタグを取得
                            listMap[item.nested[0]].listTagName,
                            {
                              key: item + 'sub-list',
                              className: `${
                                listMap[item.nested[0]].listTagName === 'ul'
                                  ? 'list-disc'
                                  : 'list-decimal'
                              } list-inside`
                            },
                            item.nested.map(nestedId => {
                              return createEl(listMap[nestedId]);
                            })
                          )
                        : null
                    );
                  };
                  return createEl(listMap[itemId]);
                })
              )
            );
            listMap = {};
            listLastId = null;
            listTagName = null;
          }

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
              const { format = {} } = value;
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
                    className="transition-opacity duration-200 hover:opacity-75 cursor-zoom-in shadow"
                    onClick={() => {
                      const src = `/api/asset?assetUrl=${encodeURIComponent(
                        display_source as any
                      )}&blockId=${id}`;
                      // 指定の画像をlightboxで開く
                      setSelectedImage(src);
                    }}
                  />
                );
              }

              toRender.push(
                useWrapper ? (
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
            case 'code': {
              if (properties.title) {
                const content = properties.title[0][0];
                const language = properties.language[0][0];

                if (language === 'LiveScript') {
                  // this requires the DOM for now
                  toRender.push(
                    <ReactJSXParser
                      key={id}
                      jsx={content}
                      components={components}
                      componentsOnly={false}
                      renderInpost={false}
                      allowUnknownElements={true}
                      blacklistedTags={['script', 'style']}
                    />
                  );
                } else {
                  const _lang = language
                    ? (language as string).toLowerCase().replace(/ /g, '')
                    : '';
                  toRender.push(
                    <components.Code key={id} language={_lang}>
                      {content}
                    </components.Code>
                  );
                }
              }
              break;
            }
            case 'quote': {
              if (properties.title) {
                toRender.push(
                  React.createElement(
                    components.blockquote,
                    { key: id },
                    properties.title
                  )
                );
              }
              break;
            }
            case 'callout': {
              toRender.push(
                <div className="callout" key={id}>
                  {value.format?.page_icon && (
                    <div>{value.format?.page_icon}</div>
                  )}
                  <div className="text">
                    {textBlock(properties.title, true, id)}
                  </div>
                </div>
              );
              break;
            }
            case 'tweet': {
              if (properties.html) {
                toRender.push(
                  <div
                    dangerouslySetInnerHTML={{ __html: properties.html }}
                    key={id}
                  />
                );
              }
              break;
            }
            default:
              if (
                process.env.NODE_ENV !== 'production' &&
                !listTypes.has(type)
              ) {
                console.log('unknown type', type);
              }
              break;
          }
          return toRender;
        })}
      </div>

      <hr className="pb-4" />
      <Bio />
      <hr />
      <div className="flex flex-row pb-10 pt-4">
        <div className="flex w-1/2 flex-1">
          {beforePost && (
            <SiblingPost
              title={beforePost.Page}
              url={getBlogLink(beforePost.Slug)}
              chevron="left"
            />
          )}
        </div>
        <div className="w-px h-auto bg-gray-400 mx-4" />
        <div className="flex w-1/2 flex-1">
          {afterPost && (
            <SiblingPost
              title={afterPost.Page}
              url={getBlogLink(afterPost.Slug)}
              chevron="right"
            />
          )}
        </div>
      </div>
    </>
  );
};

export default RenderPost;
