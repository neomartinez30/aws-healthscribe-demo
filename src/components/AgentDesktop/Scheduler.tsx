import React, { useState } from 'react';
import Calendar from "@cloudscape-design/components/calendar";
import Container from "@cloudscape-design/components/container";
import FormField from "@cloudscape-design/components/form-field";
import Select from "@cloudscape-design/components/select";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Box from "@cloudscape-design/components/box";
import Button from "@cloudscape-design/components/button";
import Alert from "@cloudscape-design/components/alert";

const FACILITIES = [
    { label: "Memorial General Hospital", value: "mgh" },
    { label: "City Medical Center", value: "cmc" },
    { label: "Veterans Care Hospital", value: "vch" },
    { label: "Children's Wellness Center", value: "cwc" },
    { label: "University Medical Center", value: "umc" }
];

const DEPARTMENTS = {
    mgh: [
        { label: "Cardiology", value: "cardio" },
        { label: "Orthopedics", value: "ortho" },
        { label: "General Medicine", value: "general" }
    ],
    cmc: [
        { label: "Emergency Medicine", value: "emergency" },
        { label: "Neurology", value: "neuro" },
        { label: "Pediatrics", value: "peds" }
    ],
    vch: [
        { label: "Mental Health", value: "mental" },
        { label: "Physical Therapy", value: "pt" },
        { label: "Primary Care", value: "primary" }
    ],
    cwc: [
        { label: "Pediatric Emergency", value: "peds-er" },
        { label: "Child Development", value: "development" },
        { label: "Pediatric Surgery", value: "peds-surgery" }
    ],
    umc: [
        { label: "Internal Medicine", value: "internal" },
        { label: "Surgery", value: "surgery" },
        { label: "Oncology", value: "onco" }
    ]
};

export default function Scheduler() {
    const [selectedFacility, setSelectedFacility] = useState<any>(null);
    const [selectedDepartment, setSelectedDepartment] = useState<any>(null);
    const [selectedDate, setSelectedDate] = useState<string>("");
    const [showConfirmation, setShowConfirmation] = useState(false);

    const handleSchedule = () => {
        if (selectedFacility && selectedDepartment && selectedDate) {
            setShowConfirmation(true);
        }
    };

    return (
        <Container>
            <SpaceBetween size="l">
                {showConfirmation && (
                    <Alert type="success" dismissible onDismiss={() => setShowConfirmation(false)}>
                        Appointment scheduled successfully at {selectedFacility.label} in {selectedDepartment.label} for {selectedDate}
                    </Alert>
                )}
                
                <FormField label="Select Facility">
                    <Select
                        selectedOption={selectedFacility}
                        onChange={({ detail }) => {
                            setSelectedFacility(detail.selectedOption);
                            setSelectedDepartment(null);
                        }}
                        options={FACILITIES}
                        placeholder="Choose a facility"
                    />
                </FormField>

                <FormField 
                    label="Select Department"
                    errorText={!selectedFacility && "Please select a facility first"}
                >
                    <Select
                        selectedOption={selectedDepartment}
                        onChange={({ detail }) => setSelectedDepartment(detail.selectedOption)}
                        options={selectedFacility ? DEPARTMENTS[selectedFacility.value] : []}
                        placeholder="Choose a department"
                        disabled={!selectedFacility}
                    />
                </FormField>

                <FormField label="Select Date">
                    <Calendar
                        value={selectedDate}
                        onChange={({ detail }) => setSelectedDate(detail.value)}
                        isDateEnabled={(date) => {
                            const d = new Date(date);
                            // Disable weekends and past dates
                            return d >= new Date() && d.getDay() !== 0 && d.getDay() !== 6;
                        }}
                    />
                </FormField>

                <Box textAlign="right">
                    <Button 
                        variant="primary"
                        onClick={handleSchedule}
                        disabled={!selectedFacility || !selectedDepartment || !selectedDate}
                    >
                        Schedule Appointment
                    </Button>
                </Box>
            </SpaceBetween>
        </Container>
    );
}