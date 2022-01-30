import * as React from 'react';

import { Loading, Modal, styled } from '@nextui-org/react';

interface ImageModalProps {
  bindings: { open: boolean; onClose: () => void };
  imageSrc: string;
}

/**
 * ImageModal
 */
const ImageModal: React.FC<ImageModalProps> = ({ bindings, imageSrc }) => {
  return (
    <Modal
      scroll
      noPadding
      width="90%"
      closeButton
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      {...bindings}
      style={{
        maxHeight: 'calc(100vh - 40px)',
        minHeight: '50px',
        borderRadius: 0,
        padding: 0,
        backgroundColor: '#ccc'
      }}
    >
      <StyledWrapper>
        <Loading css={{ position: 'absolute', padding: '$4' }} />
        <img src={imageSrc} style={{ position: 'relative' }} />
      </StyledWrapper>
    </Modal>
  );
};

const StyledWrapper = styled('div', {
  fontSize: 0,
  width: '100%',
  height: '100%',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'contain',
  backgroundPosition: 'center'
});

export default ImageModal;
