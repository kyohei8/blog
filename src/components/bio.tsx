import { SocialIcon } from 'react-social-icons';

import { Avatar, Container, Spacer } from '@nextui-org/react';

import { siteMetadata } from '../constant';

interface BioProps {}

/**
 * Bio
 */
const Bio: React.FC<BioProps> = () => {
  const { author } = siteMetadata;
  return (
    <Container fluid display="flex" alignItems="center" gap={0} wrap="nowrap">
      <Avatar src="/profile-pic_thumb.jpg" size="xl" />
      <Spacer x={1} />
      <div>
        <div>
          Written by <strong>{author.name}</strong> who lives and works in Tokyo
          🇯🇵 , building useful things 🔧.
        </div>
        <Spacer y={0.25} />
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
    </Container>
  );
};

export default Bio;
