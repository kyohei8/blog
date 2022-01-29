import hl from 'highlight.js';
import * as React from 'react';

import { styled } from '@nextui-org/react';

const Code = ({ children: text, language = 'plaintext' }) => {
  // 有効なlanguageかどうか
  const lang = hl.getLanguage(language)
    ? hl.highlight(text, { language })
    : hl.highlightAuto(text);
  const code = lang.value;

  return (
    <div>
      <StyledPre className="hljs-pre">
        <StyledCode
          className="hljs"
          dangerouslySetInnerHTML={{
            __html: code
          }}
        />
      </StyledPre>
    </div>
  );
};

/* codeタグにdisplay:blockを描くとlighthouseでエラーになるのでこちらに記述する */
/* code タグはinline要素にしないといけない */
const StyledPre = styled('pre', {
  padding: '0.9rem !important',
  margin: '$8 0 !important',
  background: '#2d2d2d',
  color: '#ccc',
  overflowX: 'auto',
  borderRadius: 0
});

const StyledCode = styled('code', {
  lineHeight: 1.4,
  fontSize: '$xs',
  '@sm': {
    fontSize: '$base'
  },
  letterSpacing: 0,
  display: 'inline',
  overflow: 'hidden',
  padding: '0 !important',
  margin: '0 !important'
});

export default Code;
