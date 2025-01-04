// FHIRSectionSummary.tsx
import * as React from "react";
import ExpandableSection from "@cloudscape-design/components/expandable-section";

const FHIRSectionSummary: React.FC = () => (
    <div>
        <ExpandableSection headerText="Allergies">
            <p>Mrs. Eva Montalvo has a longstanding history of multiple environmental and food allergies...</p>
        </ExpandableSection>
        <ExpandableSection headerText="Medical History">
            <p>Mrs. Eva Montalvo experienced a facial laceration in 2020 that resolved...</p>
        </ExpandableSection>
        <ExpandableSection headerText="Immunizations">
            <p>Mrs. Eva Montalvo's immunization history includes COVID-19 vaccines in 2021, a Td booster in 2019...</p>
        </ExpandableSection>
    </div>
);

export default FHIRSectionSummary;
