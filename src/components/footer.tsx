import Link from 'next/link';
import * as React from 'react';

interface FooterProps {}

/**
 * Footer
 */
const Footer: React.FC<FooterProps> = () => (
  <>
    <footer className="text-xs text-center flex justify-center items-center text-gray-700 bg-gray-200 h-12">
      <div>
        © {new Date().getFullYear()},{' '}
        <Link href="/">
          <a className="text-gray-700">kyohei tsukuda</a>
        </Link>
        <br />
        Built with Notion with vercel
      </div>
    </footer>
  </>
);
export default Footer;
