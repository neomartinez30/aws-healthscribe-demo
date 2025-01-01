import React, { useState } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ExpandableSection from '@cloudscape-design/components/expandable-section';

interface Summary {
  consolidated_summary: string;
  fhir_section_summary: Record<string, string>;
}

export function MedicalHistory() {
  const [summary, setSummary] = useState<Summary | null>(null);

  return (
    <Container
      header={
        <Header variant="h2">
          Medical History
        </Header>
      }
    >
      <SpaceBetween size="l">
        {summary && (
          <>
            <Box>
              <h3>Consolidated Summary</h3>
              <p>{summary.consolidated_summary}</p>
            </Box>
            
            <Box>
              <h3>FHIR Section Summaries</h3>
              {Object.entries(summary.fhir_section_summary).map(([section, content]) => (
                <ExpandableSection headerText={section} key={section}>
                  <p>{content}</p>
                </ExpandableSection>
              ))}
            </Box>
          </>
        )}
      </SpaceBetween>
    </Container>
  );
}