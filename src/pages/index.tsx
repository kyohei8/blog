import { GetStaticProps } from 'next';

import { Container, Spacer, styled } from '@nextui-org/react';

import ArticleRow from '../components/articles/articleRow';
import Bio from '../components/bio';
import { Header } from '../components/header';
import PreviewModeNote from '../components/previewModeNote';
import { getDateStr, postIsPublished } from '../lib/blog-helpers';
import getBlogIndex from '../lib/notion/getBlogIndex';
import getNotionUsers from '../lib/notion/getNotionUsers';
import { postDataType } from './blog/[slug]';

type IndexProps = {
  posts: postDataType[];
  previewMode: boolean;
};

/**
 * get list of blog articles
 * ISR
 */
export const getStaticProps: GetStaticProps = async ({ preview }) => {
  const postsTable = await getBlogIndex();

  const authorsToGet: Set<string> = new Set();
  const posts: any[] = Object.keys(postsTable)
    .map(slug => {
      const post = postsTable[slug];
      // remove draft posts in production
      if (!preview && !postIsPublished(post)) {
        return null;
      }
      post.Authors = post.Authors || [];
      for (const author of post.Authors) {
        authorsToGet.add(author);
      }
      return post;
    })
    .filter(Boolean);

  const { users } = await getNotionUsers([...authorsToGet]);

  posts.forEach(post => {
    post.Authors = post.Authors.map(id => users[id].full_name);
  });

  return {
    props: {
      previewMode: preview || false,
      posts
    },
    revalidate: 60 // 生成されてからn秒間は同一ページを表示し、60秒移行後にアクセスがあった場合、新しいページを作成する（処理が裏側で動き、次にアクセスした場合新しいものが生成される）。
  };
};

const Index: React.FC<IndexProps> = ({ posts = [], previewMode }) => {
  return (
    <Container sm gap={1}>
      <Header />
      <Bio />
      <Spacer y={1} />
      {previewMode && <PreviewModeNote clearHref={`/api/clear-preview`} />}
      {posts.length === 0 && <p>There are no posts yet</p>}
      {posts.map(post => {
        return (
          <StyledRow>
            <ArticleRow
              key={post.Slug}
              date={getDateStr(post.Date)}
              title={post.Page}
              slug={post.Slug}
              icon={post.Icon}
              draft={!postIsPublished(post)}
            />
          </StyledRow>
        );
      })}
    </Container>
  );
};

const StyledRow = styled('div', {
  marginBottom: '$2'
});

export default Index;
