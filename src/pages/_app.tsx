import '../styles/global.css';
import '@highlightjs/cdn-assets/styles/tomorrow-night-eighties.min.css';

import { AppProps } from 'next/app';
import * as React from 'react';

import Footer from '../components/footer';

/**
 * _app
 */
const MyApp = ({ Component, pageProps }: AppProps) => (
  <>
    <div
      className="mx-auto max-w-3xl min-h-screen"
      style={{
        paddingBottom: '68px',
        marginBottom: '-68px'
      }}
    >
      <Component {...pageProps} />
    </div>
    <Footer />
  </>
);

export default MyApp;
