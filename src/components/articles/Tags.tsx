import * as React from 'react';

import { Text } from '@nextui-org/react';

interface TagsProps {
  tags: string[];
}

/**
 * Tags
 */
const Tags = ({ tags }: TagsProps): JSX.Element => (
  <div>
    {tags.length > 0 && (
      <>
        {tags.map((tag: string, i) => (
          <Text
            span
            key={tag}
            color="$yellow600"
            size="$xs"
            css={{ fontStyle: 'italic' }}
          >
            {tag}
            {i !== tags.length - 1 ? ', ' : ''}
          </Text>
        ))}
      </>
    )}
  </div>
);
export default Tags;
