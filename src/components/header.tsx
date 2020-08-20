import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

// import { useRouter } from 'next/router';
import { siteMetadata } from '../pages';

// import ExtLink from './ext-link';

// const ogImageUrl = 'https://notion-blog.now.sh/og-image.png';

/*
const navItems: { label: string; page?: string; link?: string }[] = [
  { label: 'Home', page: '/' }
  // { label: 'Blog', page: '/blog' },
];
*/

interface HeaderProps {
  titlePre?: string;
  slug?: string;
  publishedTime?: number;
  author?: string;
  tags?: string;
  headerImage?: string;
}

const host =
  process.env.NODE_ENV !== 'production'
    ? 'http://localhost:3000'
    : 'https://1k6a.com';

export const Header: React.FC<HeaderProps> = ({
  titlePre = '',
  publishedTime,
  author,
  slug,
  tags,
  headerImage
}) => {
  const router = useRouter();
  const title = `${titlePre ? `${titlePre} | ` : ''}${siteMetadata.title}`;
  const ogType = `${titlePre ? 'article' : 'website'}`;
  const url = slug ? `${host}/blog/${slug}` : host;
  return (
    <header>
      <Head>
        <title>{title}</title>
        <meta name="description" content={siteMetadata.description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={siteMetadata.description} />
        <meta property="og:type" content={ogType} />
        <meta property="og:site_name" content={siteMetadata.title} />
        <meta property="og:url" content={url} />
        {headerImage && <meta property="og:image" content={headerImage} />}
        {ogType === 'article' && (
          <>
            {publishedTime && (
              <meta
                property="article:published_time"
                content={new Date(publishedTime).toISOString()}
              />
            )}
            {author && <meta property="article:author" content={author} />}
            {tags && <meta property="article:tag" content={tags} />}
          </>
        )}

        <meta name="twitter:site" content="@kyoheiz" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={siteMetadata.description} />
        {headerImage && <meta name="twitter:image" content={headerImage} />}
      </Head>
      <div className="mb-6">
        <Link href="/">
          {router.pathname === '/' ? (
            <a className="text-current text-4xl">{siteMetadata.title}</a>
          ) : (
            <a className="text-current text-xl">{siteMetadata.title}</a>
          )}
        </Link>
      </div>
      {/*
      <ul>
        {navItems.map(({ label, page, link }) => (
          <li key={label}>
            {page ? (
              <Link href={page}>
                <a className={pathname === page ? 'active' : undefined}>
                  {label}
                </a>
              </Link>
            ) : (
              <ExtLink href={link}>{label}</ExtLink>
            )}
          </li>
        ))}
      </ul>
            */}
    </header>
  );
};
