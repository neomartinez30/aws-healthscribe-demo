import React, { useState } from 'react';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Input from '@cloudscape-design/components/input';
import Button from '@cloudscape-design/components/button';
import Box from '@cloudscape-design/components/box';
import Icon from '@cloudscape-design/components/icon';
import { api } from '@/utils/api';

interface Message {
  isUser: boolean;
  text: string;
}

export function ChatPanel() {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      isUser: true,
      text: "is this patient at risk of anything?"
    },
    {
      isUser: false,
      text: "Based on the medical record provided, this patient appears to be at risk for the following:\n\nAllergic reactions - The patient has multiple confirmed allergies to substances like peanuts, animal dander, mold, grass pollen, fish, bee venom, ibuprofen, house dust mites, and tree pollen. Some of these allergies have moderate to severe manifestations like angioedema, dyspnea, and skin eruptions.\n\nObesity-related health issues - The record indicates the patient has a body mass index over 30, which is classified as obesity. Obesity increases the risk of conditions like diabetes, heart disease, stroke, and certain cancers.\n\nSocial isolation and intimate partner abuse - The patient's conditions include social isolation, limited social contact, and being a victim of intimate partner abuse. These can negatively impact mental health and overall well-being.\n\nUnhealthy alcohol use - The record notes the patient has an \"unhealthy alcohol drinking behavior,\" which can lead to various health problems if not addressed.\n\nWhile the record does not explicitly state all potential risks, the information provided suggests the patient may benefit from close monitoring and management of their allergies, weight, social support, and alcohol use to mitigate associated health risks."
    }
  ]);

  const handleSubmit = async () => {
    if (!question.trim()) return;
    
    setLoading(true);
    try {
      setMessages(prev => [...prev, { isUser: true, text: question }]);
      const result = await api.chatWithSummary({
        question,
        context: '', // This should be populated with the current patient's summary
      });
      setMessages(prev => [...prev, { isUser: false, text: result.response }]);
    } catch (error) {
      console.error('Error chatting with summary:', error);
    } finally {
      setLoading(false);
      setQuestion('');
    }
  };

  return (
    <SpaceBetween size="l">
      <Box padding="s">
        <div style={{ maxHeight: 'calc(100vh - 300px)', overflow: 'auto' }}>
          {messages.map((message, index) => (
            <Box
              key={index}
              margin={{ bottom: 's' }}
              padding="s"
              color={message.isUser ? "text-body-secondary" : "text-status-info"}
              variant={message.isUser ? "div" : "div"}
              textAlign={message.isUser ? "right" : "left"}
            >
              <Box margin={{ bottom: 'xxxs' }}>
                <Icon name={message.isUser ? "user-profile" : "status-info"} />
                <Box margin={{ left: 'xs' }} display="inline" fontWeight="bold">
                  {message.isUser ? 'You' : 'Assistant'}
                </Box>
              </Box>
              <Box variant="p">
                <span style={{ whiteSpace: 'pre-wrap' }}>{message.text}</span>
              </Box>
            </Box>
          ))}
        </div>
      </Box>
      
      <Box padding={{ top: 's', bottom: 's' }} variant="div">
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
    </SpaceBetween>
  );
}