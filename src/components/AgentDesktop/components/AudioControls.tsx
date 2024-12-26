import React from 'react';
import Button from '@cloudscape-design/components/button';
import Icon from '@cloudscape-design/components/icon';
import SpaceBetween from '@cloudscape-design/components/space-between';

interface AudioControlsProps {
  isMuted: boolean;
  isOnHold: boolean;
  onMute: () => void;
  onHold: () => void;
  onEnd: () => void;
  onTransfer: () => void;
  disabled: boolean;
}

export const AudioControls: React.FC<AudioControlsProps> = ({
  isMuted,
  isOnHold,
  onMute,
  onHold,
  onEnd,
  onTransfer,
  disabled
}) => {
  return (
    <SpaceBetween direction="horizontal" size="xs">
      <Button
        iconName={isMuted ? "microphone-off" : "microphone"}
        onClick={onMute}
        disabled={disabled}
      >
        {isMuted ? "Unmute" : "Mute"}
      </Button>
      <Button
        iconName={isOnHold ? "status-negative" : "status-positive"}
        onClick={onHold}
        disabled={disabled}
      >
        {isOnHold ? "Resume" : "Hold"}
      </Button>
      <Button onClick={onEnd} disabled={disabled}>End</Button>
      <Button onClick={onTransfer} disabled={disabled}>Transfer</Button>
    </SpaceBetween>
  );
};