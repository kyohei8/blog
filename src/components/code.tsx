import hl from 'highlight.js';
import * as React from 'react';

const Code = ({ children: text, language = 'plaintext' }) => {
  // 有効なlanguageかどうか
  const lang = hl.getLanguage(language)
    ? hl.highlight(text, { language })
    : hl.highlightAuto(text);
  const code = lang.value;

  return (
    <div className="mb-4">
      <pre className="hljs-pre">
        <code
          className="hljs text-sm md:text-base"
          dangerouslySetInnerHTML={{
            __html: code
          }}
        />
      </pre>
    </div>
  );
};

export default Code;
