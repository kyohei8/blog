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
        borderRadius: '4px',
        padding: 0,
        backgroundColor: '#ccc'
      }}
    >
      <StyledWrapper
        // style={{ backgroundImage: `url(${imageSrc})` }}
        onClick={e => {
          e.stopPropagation();
        }}
      >
        <Loading css={{ position: 'absolute', padding: '$4' }} />
        <img src={imageSrc} style={{ position: 'relative' }} />
      </StyledWrapper>
      {/*
  <div className="image-modal z-20 fixed top-0 left-0 w-full h-full flex justify-center items-center select-none">
    <div className="absolute right-0 top-0 text-white">
      <span
        className="inline-block p-4 cursor-pointer"
        onClick={() => {
          onClose();
        }}
      >
        <X size={32} />
      </span>
    </div>
    <div
      className="w-full h-full py-16"
      onClick={() => {
        onClose();
      }}
    >
      <div
        className="w-full h-full bg-no-repeat bg-center bg-contain"
        style={{ backgroundImage: `url(${imageSrc})` }}
        onClick={e => {
          e.stopPropagation();
        }}
      />
    </div>
  </div>
      */}
    </Modal>
  );
};

const StyledWrapper = styled('div', {
  width: '100%',
  height: '100%',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'contain',
  backgroundPosition: 'center'
});

export default ImageModal;
