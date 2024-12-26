import React from 'react';
import ButtonDropdown from '@cloudscape-design/components/button-dropdown';
import StatusIndicator from '@cloudscape-design/components/status-indicator';
import { AgentState } from '../types';

interface AgentStateControlProps {
  currentState: AgentState;
  onStateChange: (state: AgentState) => void;
}

export const AgentStateControl: React.FC<AgentStateControlProps> = ({
  currentState,
  onStateChange
}) => {
  return (
    <div className="agent-state-container">
      <StatusIndicator type={currentState === 'Available' ? 'success' : 'error'} />
      <ButtonDropdown
        items={[
          { text: 'Available', id: 'Available' },
          { text: 'Offline', id: 'Offline' }
        ]}
        onItemClick={({ detail }) => onStateChange(detail.id as AgentState)}
      >
        Agent State
      </ButtonDropdown>
    </div>
  );
};