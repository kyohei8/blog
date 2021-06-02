import ArticleRow from '../components/articleRow';
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

export const siteMetadata = {
  title: `kyohei's blog`,
  description: `A personal blog`,
  siteUrl: `https://1k6a.com`,
  disqusId: '1k6a',
  author: {
    name: 'Kyohei Tsukuda',
    photo: '/photo.jpg',
    bio: 'no bio',
    contacts: {
      email: 'mailto:tsukuda.kyouhei@gmail.com',
      facebook: 'https://www.facebook.com/kyoheirt',
      twitter: `https://twitter.com/kyoheiz`,
      github: 'https://github.com/kyohei8'
      // rss: '#'
    }
  }
};

export async function getStaticProps({ preview }) {
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
    unstable_revalidate: 60 // 生成されてからn秒間は同一ページを表示し、60秒移行後にアクセスがあった場合、新しいページを作成する（処理が裏側で動き、次にアクセスした場合新しいものが生成される）。
  };
}

const Index: React.FC<IndexProps> = ({ posts = [], previewMode }) => {
  return (
    <>
      <Header />
      <Bio />
      {previewMode && <PreviewModeNote clearHref={`/api/clear-preview`} />}
      <div className="pb-20">
        {posts.length === 0 && <p>There are no posts yet</p>}
        {posts.map(post => {
          return (
            <ArticleRow
              key={post.Slug}
              date={getDateStr(post.Date)}
              title={post.Page}
              slug={post.Slug}
              icon={post.Icon}
              draft={!postIsPublished(post)}
            />
          );
        })}
      </div>
    </>
  );
};

export default Index;
