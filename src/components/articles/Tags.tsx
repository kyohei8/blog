import * as React from 'react';

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
          <span
            key={tag}
            className="inline-block text-sm mr-1 text-pink-500 italic"
          >
            {tag}
            {i !== tags.length - 1 ? ',' : ''}
          </span>
        ))}
      </>
    )}
  </div>
);
export default Tags;
