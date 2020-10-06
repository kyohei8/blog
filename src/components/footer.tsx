import Link from 'next/link';
import * as React from 'react';

interface FooterProps {}

/**
 * Footer
 */
const Footer: React.FC<FooterProps> = () => (
  <>
    <footer className="text-xs text-center py-4 text-gray-700 bg-gray-200">
      © {new Date().getFullYear()},{' '}
      <Link href="/">
        <a className="text-gray-700">kyohei</a>
      </Link>
      <br />
      Built with Notion with vercel
    </footer>
  </>
);
export default Footer;
