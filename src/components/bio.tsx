import { SocialIcon } from 'react-social-icons';

import { siteMetadata } from '../pages';

interface BioProps {}

/**
 * Bio
 */
const Bio: React.FC<BioProps> = () => {
  const { author } = siteMetadata;
  return (
    <div className="flex mb-6 items-center">
      <img
        src="/profile-pic_thumb.jpg"
        alt="avatar"
        className="rounded-full mr-4 w-16 h-16 self-start"
      />
      <div>
        <div className="mb-2 md:mb-1">
          Written by <strong>{author.name}</strong> who lives and works in Tokyo
          building useful things.
        </div>
        {Object.keys(author.contacts).map(key => {
          return (
            <SocialIcon
              key={key}
              title={key}
              rel="noopener noreferrer"
              target="_blank"
              style={{
                height: 26,
                width: 26,
                marginLeft: 3,
                marginRight: 3
              }}
              bgColor="#00000038"
              url={author.contacts[key]}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Bio;
