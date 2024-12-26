import React from 'react';
import ColumnLayout from '@cloudscape-design/components/column-layout';

interface PatientProfileProps {
  name: string;
  id: string;
  phone: string;
  queue: string;
  verification: string;
}

export const PatientProfile: React.FC<PatientProfileProps> = ({
  name,
  id,
  phone,
  queue,
  verification
}) => {
  return (
    <ColumnLayout columns={2}>
      <div>Name: {name}</div>
      <div>Caller ID: {phone}</div>
      <div>Queue: {queue}</div>
      <div>Verification: {verification}</div>
    </ColumnLayout>
  );
};