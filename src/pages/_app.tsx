import '../styles/global2.css';
import '@highlightjs/cdn-assets/styles/base16//tomorrow-night.min.css';

import { AppProps } from 'next/app';
import Head from 'next/head';
import * as React from 'react';

import { globalCss, NextUIProvider } from '@nextui-org/react';

import Footer from '../components/footer';
import { siteMetadata, theme } from '../constant';

// !! importantを書かないと上書きされないことがあります！
const globalStyles = globalCss({
  '*': { margin: 0, padding: 0, boxSizing: 'borderBox' },
  p: {
    lineHeight: 1.7,
    marginTop: 0,
    marginBottom: '$8',
    whiteSpace: 'pre-wrap',
    letterSpacing: '0.025rem'
  },
  pre: {
    whiteSpace: 'pre',
    borderRadius: 0
  },

  li: {
    textIndent: '-1.6rem',
    marginLeft: '1.6rem',
    marginBottom: '0'
  },

  'ul, ol': {
    margin: '$2 $0 !important',
    listStyleType: 'disc !important',
    listStylePosition: 'inside',
    whiteSpace: 'pre-wrap',
    lineHeight: 1.7
    // letterSpacing:
  },

  blockquote: {
    fontFamily: '$mono',
    fontStyle: 'italic',
    fontSize: '$base',
    borderRadius: '1px!important',
    backgroundColor: '#fdfdfd!important',
    marginTop: '0!important',
    padding: '$2 $4 $2 $8!important',
    marginBottom: '$8!important',
    lineHeight: 1.5,
    color: ' hsla(0, 0%, 0%, 0.75)!important',
    borderLeft: '0.425rem solid hsla(0, 0%, 0%, 0.13)',
    wordBreak: 'break-word'
  }

  /*
  code: {
    borderRadius: '2px!important',
    backgroundColor: '#e2e2e2cc!important',
    color: '$gray900!important'
  }
  */
});

/**
 * _app
 */
const MyApp = ({ Component, pageProps }: AppProps) => {
  globalStyles();
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width" />
        <meta name="description" content={siteMetadata.description} />
        {/* <meta name="keywords" content="Keywords" /> */}

        {/*-- Android  --*/}
        <meta name="theme-color" content="#ff7445" />
        <meta name="mobile-web-app-capable" content="yes" />

        {/*-- iOS  --*/}
        <meta name="apple-mobile-web-app-title" content={siteMetadata.title} />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />

        {/*-- Main Link Tags  --*/}
        <link
          href="/icons/favicon-16x16.png"
          rel="icon"
          type="image/png"
          sizes="16x16"
        />
        <link
          href="/icons/favicon-32x32.png"
          rel="icon"
          type="image/png"
          sizes="32x32"
        />
        <link
          href="/icons/favicon-48x48.png"
          rel="icon"
          type="image/png"
          sizes="48x48"
        />
        {/* <!-- iOS  --> */}
        <link href="/icons/apple-touch-icon.png" rel="apple-touch-icon" />
        {/*
      <link
        href="touch-icon-ipad.png"
        rel="apple-touch-icon"
        sizes="76x76"
      />
      <link
        href="touch-icon-iphone-retina.png"
        rel="apple-touch-icon"
        sizes="120x120"
      />
      <link
        href="touch-icon-ipad-retina.png"
        rel="apple-touch-icon"
        sizes="152x152"
      />
      */}

        {/* <!-- Startup Image  --> */}
        {/* <link href="touch-icon-start-up-320x480.png" rel="apple-touch-startup-image" /> */}

        {/* <!-- Pinned Tab  --> */}
        <link
          href="/icons/sfari-pinned-tab.svg"
          rel="mask-icon"
          color="#5bbad5"
        />

        {/* <!-- Android  --> */}
        <link href="/icons/icon-192x192.png" rel="icon" sizes="192x192" />
        {/* <link href="icon-128x128.png" rel="icon" sizes="128x128" /> */}

        {/* <!-- Others --> */}
        <link
          href="/icons/favicon.ico"
          rel="shortcut icon"
          type="image/x-icon"
        />

        {/* <!-- Manifest.json  --> */}
        <link href="/manifest.json" rel="manifest"></link>

        {/*-- load webfont --*/}
        <script
          dangerouslySetInnerHTML={{
            __html: `
            WebFontConfig = {
              google: { families: ['Noto Sans JP:200,400,400i,700'] }
            };
            (function() {
              var wf = document.createElement('script');
              wf.src = 'https://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
              wf.type = 'text/javascript';
              wf.async = 'true';
              var s = document.getElementsByTagName('script')[0];
              s.parentNode.insertBefore(wf, s);
            })();
            `
          }}
        ></script>
        {process.env.NODE_ENV === 'production' && (
          <>
            {/*-- Google Analytics --*/}
            <script
              async
              src="https://www.googletagmanager.com/gtag/js?id=UA-143514963-1"
            ></script>
            <script
              dangerouslySetInnerHTML={{
                __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());

                gtag('config', 'UA-143514963-1');
              `
              }}
            ></script>
          </>
        )}
      </Head>
      <NextUIProvider theme={theme}>
        <Component {...pageProps} />
      </NextUIProvider>
      <Footer />
    </>
  );
};

export default MyApp;
