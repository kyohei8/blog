import NextLink from 'next/link';
import * as React from 'react';

import { Link, styled, Text } from '@nextui-org/react';

interface FooterProps {}

/**
 * Footer
 */
const Footer: React.FC<FooterProps> = () => (
  <StyledFooter>
    <div>
      © {new Date().getFullYear()},{' '}
      <NextLink href="/" passHref prefetch={false}>
        <Link>
          <Text size="$xs">kyohei tsukuda</Text>
        </Link>
      </NextLink>
      <br />
      Built with Notion with vercel
    </div>
  </StyledFooter>
);

const StyledFooter = styled('footer', {
  marginTop: '$20',
  textAlign: 'center',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '$gray200',
  height: '$16',
  fontSize: '$xs'
});
export default Footer;
