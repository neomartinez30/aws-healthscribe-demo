import React, { useState } from 'react';
import {
  Container,
  Header,
  Form,
  FormField,
  Input,
  Select,
  DatePicker,
  Textarea,
  Button,
  SpaceBetween,
} from '@cloudscape-design/components';
import { SelectProps } from '@cloudscape-design/components/select';

const fakeFacilities = [
  { label: 'Facility A', value: 'facility-a' },
  { label: 'Facility B', value: 'facility-b' },
  { label: 'Facility C', value: 'facility-c' },
];

const fakeDepartments = [
  { label: 'Department 1', value: 'department-1' },
  { label: 'Department 2', value: 'department-2' },
  { label: 'Department 3', value: 'department-3' },
];

const SchedulingForm: React.FC = () => {
  const [patientName, setPatientName] = useState('');
  const [selectedFacility, setSelectedFacility] = useState<SelectProps.Option | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<SelectProps.Option | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [notes, setNotes] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Handle form submission
    console.log({
      patientName,
      selectedFacility,
      selectedDepartment,
      selectedDate,
      notes,
    });
  };

  return (
    <Container>
      <Header variant="h1">Clinical Scheduling</Header>
      <Form
        actions={
          <Button variant="primary" onClick={handleSubmit}>
            Submit
          </Button>
        }
      >
        <SpaceBetween size="m">
          <FormField label="Patient Name">
            <Input
              value={patientName}
              onChange={({ detail }) => setPatientName(detail.value)}
            />
          </FormField>
          <FormField label="Facility">
            <Select
              selectedOption={selectedFacility}
              onChange={({ detail }) => setSelectedFacility(detail.selectedOption)}
              options={fakeFacilities}
            />
          </FormField>
          <FormField label="Department">
            <Select
              selectedOption={selectedDepartment}
              onChange={({ detail }) => setSelectedDepartment(detail.selectedOption)}
              options={fakeDepartments}
            />
          </FormField>
          <FormField label="Select Day">
            <DatePicker
              value={selectedDate}
              onChange={({ detail }) => setSelectedDate(detail.value)}
            />
          </FormField>
          <FormField label="Notes">
            <Textarea
              value={notes}
              onChange={({ detail }) => setNotes(detail.value)}
            />
          </FormField>
        </SpaceBetween>
      </Form>
    </Container>
  );
};

export default SchedulingForm;