import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import * as qs from 'querystring';
import { useMemo } from 'react';

import { Link, styled } from '@nextui-org/react';

// import { useRouter } from 'next/router';
import { siteMetadata } from '../constant';

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
  description?: string;
  ogBgImage?: string;
  ogTextColor?: string;
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
  description,
  ogBgImage,
  ogTextColor
}) => {
  const router = useRouter();
  const title = `${titlePre ? `${titlePre} | ` : ''}${siteMetadata.title}`;
  const desc = description ? description : siteMetadata.description;
  const ogType = `${titlePre ? 'article' : 'website'}`;
  const url = slug ? `${host}/blog/${slug}` : host;

  const isHome = useMemo(() => {
    return router.pathname === '/';
  }, [router.pathname]);

  // og画像を生成
  let ogImageUrl = '';
  if (titlePre) {
    const ogParams: any = {
      title: titlePre
    };
    if (ogTextColor) {
      ogParams.color = ogTextColor;
    }
    if (ogBgImage) {
      ogParams.bg = ogBgImage;
    }
    if (tags) {
      ogParams.tags = tags;
    }
    const query = qs.stringify(ogParams);
    ogImageUrl = `https://1k6a-og-image.vercel.app/image?${query}`;
  }
  return (
    <header>
      <Head>
        <title>{title}</title>
        <meta name="description" content={siteMetadata.description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={desc} />
        <meta property="og:type" content={ogType} />
        <meta property="og:site_name" content={siteMetadata.title} />
        <meta property="og:url" content={url} />
        {ogImageUrl && <meta property="og:image" content={ogImageUrl} />}
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
        <meta name="twitter:description" content={desc} />
        {ogImageUrl && <meta name="twitter:image" content={ogImageUrl} />}
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <StyledNav isHome={isHome}>
        <NextLink href="/" prefetch={false} passHref>
          <Link
            css={{
              color: '$text',
              fontSize: isHome ? '$lg' : '$sm'
            }}
          >
            {siteMetadata.title}
          </Link>
        </NextLink>
      </StyledNav>
      {/* nav Items
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

const StyledNav = styled('nav', {
  display: 'flex',
  alignItems: 'center',
  variants: {
    isHome: {
      true: {
        height: '$24'
      },
      false: {
        height: '$16'
      }
    }
  }
});
