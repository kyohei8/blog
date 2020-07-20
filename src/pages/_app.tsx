import '../styles/global.css';
import '../styles/prism.css';

import Footer from '../components/footer';

export default ({ Component, pageProps }) => (
  <>
    <div className="mx-auto max-w-3xl pt-6 px-3">
      <Component {...pageProps} />
    </div>
    <Footer />
  </>
);
