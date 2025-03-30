import React from 'react';
import Box from '@cloudscape-design/components/box';
import { SegmentExtractedData } from '@/types/ComprehendMedical';
import { IEvidence } from '@/types/HealthScribe';
import { ExtractedHealthDataWord } from './SummaryListComponents';
import { processSummarizedSegment } from './summarizedConceptsUtils';

function NoEntities() {
    return (
        <div className="pl-1">
            <Box variant="small">No Clinical Entities</Box>
        </div>
    );
}

type SummaryListDefaultProps = {
    sectionName: string;
    summary: IEvidence[];
    summaryExtractedHealthData?: SegmentExtractedData[];
    acceptableConfidence: number;
    currentSegment: string;
    handleSegmentClick: (SummarizedSegment: string, EvidenceLinks: { SegmentId: string }[]) => void;
};

export function SummaryListDefault({
    sectionName,
    summary,
    summaryExtractedHealthData,
    acceptableConfidence,
    currentSegment = '',
    handleSegmentClick,
}: SummaryListDefaultProps) {
    if (summary.length) {
        return (
            <ul className="mt-[1px] mb-[1px] pl-4 list-outside">
                {summary.map(({ EvidenceLinks, SummarizedSegment }, sectionIndex) => {
                    if (SummarizedSegment === '') return false;

                    let sectionHeader = '';
                    let indent = false;
                    if (SummarizedSegment.endsWith('\n')) {
                        const splitSegement = SummarizedSegment.split('\n');
                        if (SummarizedSegment.split('\n').length === 3) {
                            sectionHeader = splitSegement[0];
                            SummarizedSegment = SummarizedSegment.substring(SummarizedSegment.indexOf('\n') + 1);
                        }
                        indent = true;
                    }
                    const sectionHeaderWordLength = sectionHeader ? sectionHeader.split(' ').length : 0;

                    const summaryItemDivStyle = {
                        color: currentSegment === SummarizedSegment ? '#9d9d9de1' : '',
                        backgroundColor: currentSegment === SummarizedSegment ? '#f2f3f3' : '',
                    };

                    if (summaryExtractedHealthData) {
                        const sectionExtractedData = summaryExtractedHealthData[sectionIndex];
                        return (
                            <div key={`${sectionName}_${sectionIndex}`}>
                                {sectionHeaderWordLength > 0 && (
                                    <div className="-ml-4">
                                        {sectionExtractedData.words
                                            .slice(0, sectionHeaderWordLength)
                                            .map(({ word, linkedId }, wordIndex) => (
                                                <ExtractedHealthDataWord
                                                    key={`${sectionName}_${sectionIndex}_${wordIndex}`}
                                                    linkedId={linkedId}
                                                    sectionExtractedData={sectionExtractedData}
                                                    word={word}
                                                    acceptableConfidence={acceptableConfidence}
                                                />
                                            ))}
                                    </div>
                                )}
                                <li className={`py-[2px] pb-[5px] pl-0 ml-0 ${indent ? 'ml-3' : ''}`}>
                                    <div
                                        onClick={() => handleSegmentClick(SummarizedSegment, EvidenceLinks)}
                                        className="inline cursor-pointer leading-normal font-normal"
                                        style={summaryItemDivStyle}
                                    >
                                        {sectionExtractedData.words
                                            .slice(sectionHeaderWordLength)
                                            .map(({ word, linkedId }, wordIndex) => {
                                                if (word === '-' && wordIndex <= 1) return false;

                                                return (
                                                    <ExtractedHealthDataWord
                                                        key={`${sectionName}_${sectionIndex}_${wordIndex}`}
                                                        linkedId={linkedId}
                                                        sectionExtractedData={sectionExtractedData}
                                                        word={word}
                                                        acceptableConfidence={acceptableConfidence}
                                                    />
                                                );
                                            })}
                                    </div>
                                </li>
                            </div>
                        );
                    } else {
                        return (
                            <div key={`${sectionName}_${sectionIndex}`}>
                                {sectionHeader && (
                                    <div className="-ml-4">{sectionHeader}</div>
                                )}
                                <li className={`py-[2px] pb-[5px] pl-0 ml-0 ${indent ? 'ml-3' : ''}`}>
                                    <div
                                        onClick={() => handleSegmentClick(SummarizedSegment, EvidenceLinks)}
                                        className="inline cursor-pointer leading-normal font-normal"
                                        style={summaryItemDivStyle}
                                    >
                                        {processSummarizedSegment(SummarizedSegment)}
                                    </div>
                                </li>
                            </div>
                        );
                    }
                })}
            </ul>
        );
    } else {
        return <NoEntities />;
    }
}
