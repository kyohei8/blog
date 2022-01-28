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
      text: '#424242'
    },
    // "space": {},
    fontSizes: {
      xs: '10px'
    }
    // "fontWeights": {},
    // "lineHeights": {},
    // "letterSpacings": {},
    // "sizes": {},
    // "borderWidths": {},
    // "borderStyles": {},
    // "radii": {},
    // "shadows": {},
    // "zIndices": {},
    // "transitions": {}
  }
});
