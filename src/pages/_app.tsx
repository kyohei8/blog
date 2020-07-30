import '../styles/global.css';
import '@highlightjs/cdn-assets/styles/tomorrow-night-eighties.min.css';

import Footer from '../components/footer';

export default ({ Component, pageProps }) => (
  <>
    <div className="flex flex-col min-h-screen">
      <div className="mx-auto max-w-3xl pt-6 px-3 flex-grow">
        <Component {...pageProps} />
      </div>
      <Footer />
    </div>
  </>
);
