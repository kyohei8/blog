import '../styles/global.css';
import '@highlightjs/cdn-assets/styles/tomorrow-night-eighties.min.css';

import Footer from '../components/footer';

export default ({ Component, pageProps }) => (
  <>
    <div
      className="mx-auto max-w-3xl pt-6 px-3 min-h-screen"
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
