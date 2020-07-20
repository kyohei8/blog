import Prism from 'prismjs';
import * as React from 'react';

const Code = ({ children, language = 'javascript' }) => {
  const codeElement = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    // 多少ディレイをいれないとうまく表示されない・・
    setTimeout(() => {
      if (codeElement.current) {
        codeElement.current.innerHTML = Prism.highlight(
          children,
          Prism.languages[language.toLowerCase()] || Prism.languages.javascript
        );
      }
    }, 1000);
  }, []);

  return (
    <div className="mb-4">
      <pre>
        <code
          ref={codeElement}
          className={`language-${language.toLowerCase()}`}
        >
          {children}
        </code>
      </pre>
    </div>
  );
};

export default Code;
