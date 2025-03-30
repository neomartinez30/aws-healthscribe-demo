import React, { useEffect, useMemo, useState } from 'react';
import TextContent from '@cloudscape-design/components/text-content';
import toast from 'react-hot-toast';
import WaveSurfer from 'wavesurfer.js';
import { ExtractedHealthData, SummarySectionEntityMapping } from '@/types/ComprehendMedical';
import { IAuraClinicalDocOutputSection, ITranscriptSegments } from '@/types/HealthScribe';
import { HighlightId } from '../types';
import { SummaryListDefault } from './SummaryList';
import { SECTION_ORDER } from './sectionOrder';
import { mergeHealthScribeOutputWithComprehendMedicalOutput } from './summarizedConceptsUtils';

type SummarizedConceptsProps = {
    sections: IAuraClinicalDocOutputSection[];
    extractedHealthData: ExtractedHealthData[];
    acceptableConfidence: number;
    highlightId: HighlightId;
    setHighlightId: React.Dispatch<React.SetStateAction<HighlightId>>;
    segmentById: {
        [key: string]: ITranscriptSegments;
    };
    wavesurfer: React.MutableRefObject<WaveSurfer | undefined>;
};

export default function SummarizedConcepts({
    sections,
    extractedHealthData,
    acceptableConfidence,
    highlightId,
    setHighlightId,
    segmentById,
    wavesurfer,
}: SummarizedConceptsProps) {
    const [currentId, setCurrentId] = useState(0);
    const [currentSegment, setCurrentSegment] = useState<string>('');

    useEffect(() => {
        if (!highlightId.selectedSegmentId) setCurrentSegment('');
    }, [highlightId]);

    const sectionsWithExtractedData: SummarySectionEntityMapping[] = useMemo(
        () => mergeHealthScribeOutputWithComprehendMedicalOutput(sections, extractedHealthData),
        [sections, extractedHealthData]
    );

    function handleSegmentClick(SummarizedSegment: string, EvidenceLinks: { SegmentId: string }[]) {
        let currentIdLocal = currentId;
        if (currentSegment !== SummarizedSegment) {
            setCurrentSegment(SummarizedSegment);
            setCurrentId(0);
            currentIdLocal = 0;
        }
        const id = EvidenceLinks[currentIdLocal].SegmentId;
        const newHighlightId = {
            allSegmentIds: EvidenceLinks.map((i) => i.SegmentId),
            selectedSegmentId: id,
        };
        setHighlightId(newHighlightId);

        const current = wavesurfer.current?.getDuration();
        const toastId = currentIdLocal + 1;
        if (current) {
            const seekId = segmentById[id].BeginAudioTime / current;
            wavesurfer.current?.seekTo(seekId);
            if (currentIdLocal < EvidenceLinks.length - 1) {
                setCurrentId(currentIdLocal + 1);
            } else {
                setCurrentId(0);
            }

            toast.success(`Jump Successful. Sentence ${toastId} of ${EvidenceLinks.length}`);
        } else if (!current) {
            if (currentIdLocal < EvidenceLinks.length - 1) {
                setCurrentId(currentIdLocal + 1);
            } else {
                setCurrentId(0);
            }
            toast.success(`Jump Successful. Sentence ${toastId} of ${EvidenceLinks.length}. Audio not yet ready`);
        } else {
            toast.error('Unable to jump to that Clinical Attribute');
        }
    }

    const sbarSections = useMemo(() => {
        const sbarMap = {
            'CHIEF_COMPLIANT': 'SITUATION',
            'HISTORY_OF_PRESENT_ILLNESS': 'SITUATION',
            'PAST_MEDICAL_HISTORY': 'BACKGROUND',
            'PAST_FAMILY_HISTORY': 'BACKGROUND',
            'PAST_SOCIAL_HISTORY': 'BACKGROUND',
            'PHYSICAL_EXAMINATION': 'ASSESSMENT',
            'DIAGNOSTIC_TESTING': 'ASSESSMENT',
            'ASSESSMENT': 'ASSESSMENT',
            'PLAN': 'RECOMMENDATION'
        };

        return SECTION_ORDER.map(sbarSection => {
            const relevantSections = sections.filter(section => 
                sbarMap[section.SectionName as keyof typeof sbarMap] === sbarSection
            );
            return {
                SectionName: sbarSection,
                Summary: relevantSections.flatMap(section => section.Summary)
            };
        });
    }, [sections]);

    return (
        <>
            {sbarSections.map(({ SectionName, Summary }, i) => {
                const sectionExtractedHealthData = sectionsWithExtractedData.find((s) => s.SectionName === SectionName);
                return (
                    <div key={`insightsSection_${i}`}>
                        <TextContent>
                            <h4>{SectionName}</h4>
                        </TextContent>
                        <SummaryListDefault
                            sectionName={SectionName}
                            summary={Summary}
                            summaryExtractedHealthData={sectionExtractedHealthData?.Summary}
                            acceptableConfidence={acceptableConfidence}
                            currentSegment={currentSegment}
                            handleSegmentClick={handleSegmentClick}
                        />
                    </div>
                );
            })}
        </>
    );
}
