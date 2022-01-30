import { useRouter } from 'next/router';
import fetch from 'node-fetch';
import React, { useEffect, useState } from 'react';

import { Container, Spacer, styled, Text, useModal } from '@nextui-org/react';
import ReactJSXParser from '@zeit/react-jsx-parser';

import Date from '../../components/articles/Date';
import { embedMedia, embedWebPage } from '../../components/articles/Embed';
import { renderHeading } from '../../components/articles/Heading';
import SiblingPost from '../../components/articles/SiblingPost';
import Tags from '../../components/articles/Tags';
import Bio from '../../components/bio';
import components from '../../components/dynamic';
import { Header } from '../../components/header';
import ImageModal from '../../components/imageModal';
import PreviewModeNote from '../../components/previewModeNote';
import { getBlogLink, getDateStr } from '../../lib/blog-helpers';
import getBlogIndex from '../../lib/notion/getBlogIndex';
import getNotionUsers from '../../lib/notion/getNotionUsers';
import getPageData from '../../lib/notion/getPageData';
import { getPostPreview } from '../../lib/notion/getPostPreview';
import { textBlock } from '../../lib/notion/renderers';
import blogStyles from '../../styles/blog.module.css';

export type postDataType = {
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
  Icon?: string;
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
      revalidate: 5
    };
  }
  let afterPost: any | null = null;
  let beforePost: any | null = null;
  // 前後のpostを取得
  for (let i = postIndex - 1; i >= 0; i--) {
    const _afterPost = postsTable[i] || null;
    if (_afterPost && _afterPost.Published === 'No') {
      continue;
    }
    afterPost = _afterPost;
    break;
  }
  for (let i = postIndex + 1; i <= postsTable.length; i++) {
    const _beforePost = postsTable[i] || null;
    if (_beforePost && _beforePost.Published === 'No') {
      continue;
    }
    beforePost = _beforePost;
    break;
  }

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
      previewMode: preview || false
    },
    revalidate: 10
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
  previewMode: boolean;
}

const listTypes = new Set(['bulleted_list', 'numbered_list']);
const RenderPost: React.FC<SlugProps> = props => {
  const { post, beforePost, afterPost, redirect, previewMode } = props;
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

  // 画像のモーダルONOFF
  const { setVisible, bindings } = useModal();
  useEffect(() => {
    if (!bindings.open) {
      setSelectedImage('');
    }
  }, [bindings.open, setSelectedImage]);

  return (
    <Container sm gap={1}>
      <Header
        titlePre={post.Page}
        slug={post.Slug}
        publishedTime={post.Date}
        author={post.Authors[0]}
        tags={post.Tags.length > 0 ? post.Tags.join(',') : ''}
        ogBgImage={headerImageSrc}
        description={post.Preview}
      />
      {selectedImage && (
        <ImageModal bindings={bindings} imageSrc={selectedImage} />
      )}
      <div>
        {headerImageSrc && (
          <div>
            <div className="h-64"></div>
            <div
              className="h-64 absolute w-full left-0"
              style={{ top: '48px' }}
            >
              <div
                className="bg-center bg-cover w-full h-full"
                style={{ backgroundImage: `url(${headerImageSrc})` }}
              />
            </div>
          </div>
        )}
        {previewMode && (
          <PreviewModeNote clearHref={`/api/clear-preview?slug=${post.Slug}`} />
        )}
        <Spacer y={1} />

        <div>
          <Text
            h1
            size="$md"
            css={{
              borderBottom: '1px solid $gray400',
              paddingBottom: '$4'
            }}
          >
            {post.Page || ''}
          </Text>
          <Container
            fluid
            gap={0}
            display="flex"
            justify="space-between"
            alignItems="center"
          >
            <Tags tags={post.Tags} />
            {post.Date && <Date date={getDateStr(post.Date)} />}
          </Container>
        </div>
        <Spacer y={1} />

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
            if (properties?.title) {
              // 最初のタグ
              if (!listTagName) {
                listTagName =
                  components[type === 'bulleted_list' ? 'ul' : 'ol'];
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
          }

          // リストの場合最後まで確認し、toRenderにpushする
          if (listTagName && (isLast || !isList)) {
            toRender.push(
              React.createElement(
                listTagName,
                { key: listLastId! },
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
                              key: item + 'sub-list'
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

          const renderBookmark = ({ link, title, description, format }) => {
            const { bookmark_icon: icon, bookmark_cover: cover } = format;
            toRender.push(
              <div className={blogStyles.bookmark} key={link}>
                <div>
                  <div style={{ display: 'flex' }}>
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      className={blogStyles.bookmarkContentsWrapper}
                      href={link}
                    >
                      <div
                        role="button"
                        className={blogStyles.bookmarkContents}
                      >
                        <div className={blogStyles.bookmarkInfo}>
                          <div className={blogStyles.bookmarkTitle}>
                            {title}
                          </div>
                          <div className={blogStyles.bookmarkDescription}>
                            {description}
                          </div>
                          <div className={blogStyles.bookmarkLinkWrapper}>
                            <img
                              src={icon}
                              className={blogStyles.bookmarkLinkIcon}
                            />
                            <div className={blogStyles.bookmarkLink}>
                              {link}
                            </div>
                          </div>
                        </div>
                        {cover && (
                          <div className={blogStyles.bookmarkCoverWrapper1}>
                            <div className={blogStyles.bookmarkCoverWrapper2}>
                              <div className={blogStyles.bookmarkCoverWrapper3}>
                                <img
                                  src={cover}
                                  className={blogStyles.bookmarkCover}
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </a>
                  </div>
                </div>
              </div>
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
            case 'video': {
              const comp = embedMedia(value, id, type, src => {
                // 指定の画像をlightboxで開く
                setVisible(true);
                setSelectedImage(src);
              });
              toRender.push(comp);
              break;
            }
            case 'embed': {
              const comp = embedWebPage(value, id);
              toRender.push(comp);
              break;
            }
            case 'header':
              toRender.push(renderHeading(id, properties.title, 'h1'));
              break;
            case 'sub_header':
              toRender.push(renderHeading(id, properties.title, 'h2'));
              break;
            case 'sub_sub_header':
              toRender.push(renderHeading(id, properties.title, 'h3'));
              break;
            case 'bookmark':
              const { link, title, description } = properties;
              const { format = {} } = value;
              renderBookmark({ link, title, description, format });
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

      <StyledBioBox>
        <Bio />
      </StyledBioBox>

      <SiblingPost beforePost={beforePost} afterPost={afterPost} />
    </Container>
  );
};

const StyledBioBox = styled('div', {
  marginTop: '$24',
  marginBottom: '$8',
  padding: '$8 0',
  borderTop: '1px solid $gray400',
  borderBottom: '1px solid $gray200'
});

export default RenderPost;
