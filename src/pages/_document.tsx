import Document, { Head, Html, Main, NextScript } from 'next/document';

import { siteMetadata } from './';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="utf-8" />
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width" />
          <meta name="description" content={siteMetadata.description} />
          {/* <meta name="keywords" content="Keywords" /> */}

          {/*-- Android  --*/}
          <meta name="theme-color" content="#ff7445" />
          <meta name="mobile-web-app-capable" content="yes" />

          {/*-- iOS  --*/}
          <meta
            name="apple-mobile-web-app-title"
            content={siteMetadata.title}
          />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta
            name="apple-mobile-web-app-status-bar-style"
            content="default"
          />

          {/*-- Main Link Tags  --*/}
          <link
            href="icons/favicon-16.png"
            rel="icon"
            type="image/png"
            sizes="16x16"
          />
          <link
            href="icons/favicon-32.png"
            rel="icon"
            type="image/png"
            sizes="32x32"
          />
          <link
            href="icons/favicon-48.png"
            rel="icon"
            type="image/png"
            sizes="48x48"
          />
          {/* <!-- iOS  --> */}
          <link href="icons/apple-touch-icon.png" rel="apple-touch-icon" />
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
            href="icons/sfari-pinned-tab.svg"
            rel="mask-icon"
            color="#5bbad5"
          />

          {/* <!-- Android  --> */}
          <link href="icons/icon-192x192.png" rel="icon" sizes="192x192" />
          {/* <link href="icon-128x128.png" rel="icon" sizes="128x128" /> */}

          {/* <!-- Others --> */}
          <link
            href="icons/favicon.icon"
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
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
