import { createTheme } from '@nextui-org/react';

export const siteMetadata = {
  title: `kyohei's blog`,
  description: `A personal blog`,
  siteUrl: `https://1k6a.com`,
  disqusId: '1k6a',
  author: {
    name: 'Kyohei Tsukuda',
    photo: '/photo.jpg',
    bio: 'no bio',
    contacts: {
      email: 'mailto:tsukuda.kyouhei@gmail.com',
      facebook: 'https://www.facebook.com/kyoheirt',
      twitter: `https://twitter.com/kyoheiz`,
      github: 'https://github.com/kyohei8'
      // rss: '#'
    }
  }
};

export const theme = createTheme({
  type: 'light', // light / dark
  theme: {
    fonts: {
      sans: "'Noto Sans JP', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
      mono: 'SF Mono, menlo, consolas, Monaco, Andale Mono, Ubuntu Mono, monospace'
    },
    colors: {
      primary: '#ff3412',
      text: '#000000b3'
    },
    // "space": {},
    fontSizes: {
      tiny: '.75rem',
      xs: '0.875rem',
      base: '1rem',
      sm: '1.25rem',
      md: '1.5rem',
      lg: '2.25rem',
      xl: '3rem'
    },
    // "fontWeights": {},
    // "lineHeights": {},
    letterSpacings: {
      tighter: '0',
      tight: '0',
      normal: '0',
      wide: '0.025em',
      wider: '0.05em',
      widest: '0.1em'
    },
    // @ts-ignore 動作するけど定義されていないみたい。
    breakpoints: {
      sm: '768px'
    }
    // "sizes": {},
    // "borderWidths": {},
    // "borderStyles": {},
    // "radii": {},
    // "shadows": {},
    // "zIndices": {},
    // "transitions": {}
  }
});
