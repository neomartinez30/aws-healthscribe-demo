import React, { useMemo, useState } from 'react';

import Button from '@cloudscape-design/components/button';
import Modal from '@cloudscape-design/components/modal';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Textarea from '@cloudscape-design/components/textarea';
import WaveSurfer from 'wavesurfer.js';

import { DetectEntitiesV2Response } from '@aws-sdk/client-comprehendmedical';

import { useLocalStorage } from '@/hooks/useLocalStorage';
import { ExtractedHealthData } from '@/types/ComprehendMedical';
import {
    IAuraClinicalDocOutput,
    IAuraClinicalDocOutputSection,
    IAuraTranscriptOutput,
    ITranscriptSegments,
} from '@/types/HealthScribe';
import { detectEntitiesFromComprehendMedical } from '@/utils/ComprehendMedicalApi';

import LoadingContainer from '../Common/LoadingContainer';
import ScrollingContainer from '../Common/ScrollingContainer';
import { HighlightId } from '../types';
import { RightPanelActions, RightPanelSettings } from './RightPanelComponents';
import SummarizedConcepts from './SummarizedConcepts';
import { calculateNereUnits } from './rightPanelUtils';
import { processSummarizedSegment } from './summarizedConceptsUtils';

type RightPanelProps = {
    jobLoading: boolean;
    clinicalDocument: IAuraClinicalDocOutput | null;
    transcriptFile: IAuraTranscriptOutput | null;
    highlightId: HighlightId;
    setHighlightId: React.Dispatch<React.SetStateAction<HighlightId>>;
    wavesurfer: React.MutableRefObject<WaveSurfer | undefined>;
};

export default function RightPanel({
    jobLoading,
    clinicalDocument,
    transcriptFile,
    highlightId,
    setHighlightId,
    wavesurfer,
}: RightPanelProps) {
    const [extractingData, setExtractingData] = useState<boolean>(false);
    const [extractedHealthData, setExtractedHealthData] = useState<ExtractedHealthData[]>([]);
    const [rightPanelSettingsOpen, setRightPanelSettingsOpen] = useState<boolean>(false);
    const [showNotesModal, setShowNotesModal] = useState<boolean>(false);
    const [editableNotes, setEditableNotes] = useState<string>('');
    const [acceptableConfidence, setAcceptableConfidence] = useLocalStorage<number>(
        'Insights-Comprehend-Medical-Confidence-Threshold',
        75.0
    );

    const segmentById: { [key: string]: ITranscriptSegments } = useMemo(() => {
        if (transcriptFile == null) return {};
        return transcriptFile.Conversation.TranscriptSegments.reduce((acc, seg) => {
            return { ...acc, [seg.SegmentId]: seg };
        }, {});
    }, [transcriptFile]);

    const hasInsightSections: boolean = useMemo(() => {
        if (typeof clinicalDocument?.ClinicalDocumentation?.Sections === 'undefined') return false;
        return clinicalDocument?.ClinicalDocumentation?.Sections?.length > 0;
    }, [clinicalDocument]);

    async function handleExtractHealthData() {
        if (!Array.isArray(clinicalDocument?.ClinicalDocumentation?.Sections)) return;
        setExtractingData(true);

        const buildExtractedHealthData = [];
        for (const section of clinicalDocument.ClinicalDocumentation.Sections) {
            const sectionEntities: DetectEntitiesV2Response[] = [];
            for (const summary of section.Summary) {
                const summarizedSegment = processSummarizedSegment(summary.SummarizedSegment);
                const detectedEntities = (await detectEntitiesFromComprehendMedical(
                    summarizedSegment
                )) as DetectEntitiesV2Response;
                sectionEntities.push(detectedEntities);
            }
            buildExtractedHealthData.push({
                SectionName: section.SectionName,
                ExtractedEntities: sectionEntities,
            });
        }
        setExtractedHealthData(buildExtractedHealthData);
        setExtractingData(false);
    }

    const clinicalDocumentNereUnits = useMemo(() => calculateNereUnits(clinicalDocument), [clinicalDocument]);

    const handleEditNotes = () => {
        const notesText = clinicalDocument?.ClinicalDocumentation?.Sections
            .map(section => {
                return `${section.SectionName}:\n${section.Summary.map(s => s.SummarizedSegment).join('\n')}\n`;
            })
            .join('\n') || '';
        setEditableNotes(notesText);
        setShowNotesModal(true);
    };

    const handleAddTriageNotes = () => {
        const triageNotes = "\n\nTRIAGE\nProtocol Used: Abdominal Injury (Adult)\nProtocol-Based Disposition: Home Care\n\nPositive Triage Questions:\n* [1] Brief abdominal pain AND [2] no symptoms now (e.g., blow to solar plexus)\n* [1] Abdominal pain (not severe) AND [2] present < 1 hour\n* Small abdominal bruise\n* Small cut (scratch) or abrasion (scrape) is also present";
        setEditableNotes(prev => prev + triageNotes);
    };

    if (jobLoading || clinicalDocument == null) {
        return <LoadingContainer containerTitle="Clinical Notes" text="Loading Clinical Notes" />;
    } else {
        return (
            <>
                <ScrollingContainer
                    containerTitle="Clinical Notes"
                    containerActions={
                        <SpaceBetween direction="horizontal" size="xs">
                            <Button onClick={handleEditNotes}>Edit Notes</Button>
                            <RightPanelActions
                                hasInsightSections={hasInsightSections}
                                dataExtracted={extractedHealthData.length > 0}
                                extractingData={extractingData}
                                clinicalDocumentNereUnits={clinicalDocumentNereUnits}
                                setRightPanelSettingsOpen={setRightPanelSettingsOpen}
                                handleExtractHealthData={handleExtractHealthData}
                            />
                        </SpaceBetween>
                    }
                >
                    <RightPanelSettings
                        rightPanelSettingsOpen={rightPanelSettingsOpen}
                        setRightPanelSettingsOpen={setRightPanelSettingsOpen}
                        acceptableConfidence={acceptableConfidence}
                        setAcceptableConfidence={setAcceptableConfidence}
                    />
                    <SummarizedConcepts
                        sections={clinicalDocument.ClinicalDocumentation.Sections as IAuraClinicalDocOutputSection[]}
                        extractedHealthData={extractedHealthData}
                        acceptableConfidence={acceptableConfidence}
                        highlightId={highlightId}
                        setHighlightId={setHighlightId}
                        segmentById={segmentById}
                        wavesurfer={wavesurfer}
                    />
                </ScrollingContainer>

                <Modal
                    visible={showNotesModal}
                    onDismiss={() => setShowNotesModal(false)}
                    header="Edit Clinical Notes"
                    size="large"
                    footer={
                        <SpaceBetween direction="horizontal" size="xs">
                            <Button onClick={handleAddTriageNotes}>Triage Notes</Button>
                            <Button variant="link" onClick={() => setShowNotesModal(false)}>
                                Cancel
                            </Button>
                            <Button variant="primary" onClick={() => setShowNotesModal(false)}>
                                Save
                            </Button>
                        </SpaceBetween>
                    }
                >
                    <Textarea
                        value={editableNotes}
                        onChange={({ detail }) => setEditableNotes(detail.value)}
                        rows={20}
                        spellcheck
                    />
                </Modal>
            </>
        );
    }
}