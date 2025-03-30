import React, { useState } from 'react';
import Modal from '@cloudscape-design/components/modal';
import Box from '@cloudscape-design/components/box';

interface ImageViewerProps {
  src: string;
  alt: string;
}

export function ImageViewer({ src, alt }: ImageViewerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <>
      <Box className="mb-8 text-center">
        <img
          src={src}
          alt={alt}
          className="max-w-full h-auto cursor-pointer rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
          onClick={() => setIsFullscreen(true)}
        />
      </Box>

      <Modal
        visible={isFullscreen}
        onDismiss={() => setIsFullscreen(false)}
        size="max"
        header={alt}
      >
        <img
          src={src}
          alt={alt}
          className="max-w-full max-h-[calc(100vh-150px)] object-contain"
        />
      </Modal>
    </>
  );
}
