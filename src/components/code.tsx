import hl from 'highlight.js';
import * as React from 'react';

const Code = ({ children: text, language = 'plaintext' }) => {
  const codeElement = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    // 有効なlanguageかどうか
    const lang = hl.getLanguage(language)
      ? hl.highlight(language, text)
      : hl.highlightAuto(text);
    if (codeElement.current) {
      codeElement.current.innerHTML = lang.value;
    }
  }, []);

  return (
    <div className="mb-4">
      <pre>
        <code ref={codeElement} className="hljs">
          {text}
        </code>
      </pre>
    </div>
  );
};

export default Code;
