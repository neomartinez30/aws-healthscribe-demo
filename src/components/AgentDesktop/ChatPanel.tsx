import React, { useState } from 'react';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Input from '@cloudscape-design/components/input';
import Button from '@cloudscape-design/components/button';
import Box from '@cloudscape-design/components/box';
import { api } from '@/utils/api';

export function ChatPanel() {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!question.trim()) return;
    
    setLoading(true);
    try {
      const result = await api.chatWithSummary({
        question,
        context: '', // This should be populated with the current patient's summary
      });
      setResponse(result.response);
    } catch (error) {
      console.error('Error chatting with summary:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SpaceBetween size="l">
      <Box>
        <SpaceBetween size="s">
          <Input
            value={question}
            onChange={({ detail }) => setQuestion(detail.value)}
            placeholder="Ask a question about the patient's medical history..."
          />
          <Button 
            onClick={handleSubmit}
            loading={loading}
            disabled={!question.trim()}
          >
            Send
          </Button>
        </SpaceBetween>
      </Box>
      
      {response && (
        <Box>
          <h4>Response:</h4>
          <p>{response}</p>
        </Box>
      )}
    </SpaceBetween>
  );
}