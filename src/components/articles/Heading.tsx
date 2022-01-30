import { styled } from '@nextui-org/react';

import { textBlock } from '../../lib/notion/renderers';

const collectText = (el, acc = []) => {
  if (el) {
    if (typeof el === 'string') acc.push(el);
    if (Array.isArray(el)) el.map(item => collectText(item, acc));
    if (typeof el === 'object') collectText(el.props && el.props.children, acc);
  }
  return acc.join('').trim();
};

export const Heading = ({
  children: component,
  id
}: {
  children: any;
  id?: any;
}) => {
  const children = component.props.children || '';
  let text = children;

  if (null == id) {
    id = collectText(text)
      .toLowerCase()
      .replace(/\s/g, '-')
      .replace(/[?!:]/g, '');
  }

  return (
    <a
      href={`#${id}`}
      id={id}
      style={{ color: 'inherit' }}
      className="hover:no-underline"
    >
      {component}
    </a>
  );
};

// create heading
export const renderHeading = (
  id: string,
  title: any[],
  headingType: 'h1' | 'h2' | 'h3'
) => {
  return (
    <Heading key={id}>
      <>
        {headingType === 'h1' && (
          <StyledHeading1>{textBlock(title, true, id)}</StyledHeading1>
        )}
        {headingType === 'h2' && (
          <StyledHeading2>{textBlock(title, true, id)}</StyledHeading2>
        )}
        {headingType === 'h3' && (
          <StyledHeading3>{textBlock(title, true, id)}</StyledHeading3>
        )}
      </>
    </Heading>
  );
};

const StyledHeading1 = styled('h1', {
  fontSize: '1.75rem',
  fontWeight: '$bold',
  marginTop: '$16',
  marginBottom: '$8'
});

const StyledHeading2 = styled('h2', {
  fontSize: '$md',
  fontWeight: '$normal',
  borderBottom: '1px solid $gray200',
  marginTop: '$12',
  marginBottom: '$8',
  paddingBottom: '$2'
});

const StyledHeading3 = styled('h3', {
  fontSize: '$sm',
  fontWeight: '$normal'
});
