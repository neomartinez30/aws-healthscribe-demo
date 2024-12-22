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
      <Box margin={{ bottom: 'l' }} textAlign="center">
        <img
          src={src}
          alt={alt}
          style={{ 
            maxWidth: '100%', 
            height: 'auto', 
            cursor: 'pointer',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
          }}
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
          style={{
            maxWidth: '100%',
            maxHeight: 'calc(100vh - 150px)',
            objectFit: 'contain'
          }}
        />
      </Modal>
    </>
  );
}
