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

export default ({ titlePre = '' }) => {
  const router = useRouter();

  return (
    <header>
      <Head>
        <title>
          {titlePre ? `${titlePre} | ` : ''}
          {siteMetadata.title}
        </title>
        <meta name="description" content={siteMetadata.description} />
        {/*
        <meta name="og:title" content="My Notion Blog" />
        <meta property="og:image" content={ogImageUrl} />
        <meta name="twitter:site" content="@_ijjk" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={ogImageUrl} />
         */}
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
