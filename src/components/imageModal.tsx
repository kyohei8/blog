import * as React from 'react';

import { X } from '@styled-icons/feather';

interface ImageModalProps {
  onClose: () => void;
  imageSrc: string;
}

/**
 * ImageModal
 */
const ImageModal: React.FC<ImageModalProps> = ({ onClose, imageSrc }) => (
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
);
export default ImageModal;
