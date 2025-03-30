import React from 'react';
import { Dispatch, MutableRefObject, SetStateAction, useEffect, useState } from 'react';
import * as awsui from '@cloudscape-design/design-tokens';
import Grid from '@cloudscape-design/components/grid';
import has from 'lodash/has';
import keyBy from 'lodash/keyBy';
import keys from 'lodash/keys';
import pickBy from 'lodash/pickBy';
import slice from 'lodash/slice';
import takeWhile from 'lodash/takeWhile';
import values from 'lodash/values';
import { toast } from 'react-hot-toast';
import WaveSurfer from 'wavesurfer.js';
import LoadingContainer from '@/components/Conversation/Common/LoadingContainer';
import ScrollingContainer from '@/components/Conversation/Common/ScrollingContainer';
import { IAuraTranscriptOutput, IClinicalInsights, ITranscript, ITranscriptItems, ITranscriptSegments } from '@/types/HealthScribe';
import toTitleCase from '@/utils/toTitleCase';
import { HighlightId } from '../types';
import { TranscriptSegment } from './TranscriptSegment';

const TRANSCRIPT_SPACING = '10px';

type LeftPanelProps = {
    jobLoading: boolean;
    transcriptFile: IAuraTranscriptOutput | null;
    highlightId: HighlightId;
    setHighlightId: Dispatch<SetStateAction<HighlightId>>;
    wavesurfer: MutableRefObject<WaveSurfer | undefined>;
    smallTalkCheck: boolean;
    audioTime: number;
    setAudioTime: Dispatch<SetStateAction<number>>;
    audioReady: boolean;
};

export default function LeftPanel({
    jobLoading,
    transcriptFile,
    highlightId,
    setHighlightId,
    wavesurfer,
    smallTalkCheck,
    audioTime,
    setAudioTime,
    audioReady,
}: LeftPanelProps) {
    const [multiSpeakers, setMultiSpeakers] = useState<string[]>([]);
    const [transcript, setTranscript] = useState<ITranscript[]>([]);

    useEffect(() => {
        if (jobLoading || transcriptFile == null) return;

        setMultiSpeakers([]);

        const transcriptItems: ITranscriptItems[] = transcriptFile!.Conversation?.TranscriptItems;
        const transcriptSegments: ITranscriptSegments[] = transcriptFile!.Conversation?.TranscriptSegments;
        const transcriptInsights: IClinicalInsights[] = transcriptFile.Conversation?.ClinicalInsights;

        let words = transcriptItems;
        const transcriptMod = [];

        for (const segment of transcriptSegments) {
            const wordArray = takeWhile(words, (val) => {
                return val.EndAudioTime <= segment.EndAudioTime;
            });
            transcriptMod.push({ ...segment, Words: wordArray });
            words = slice(words, wordArray.length);
        }

        const segmentDict = keyBy(transcriptMod, 'SegmentId');

        const transcriptSpeakers = [...new Set(transcriptSegments.map((s) => s.ParticipantDetails.ParticipantRole))];
        if (transcriptSpeakers.length > 2) {
            const speakerList = [...new Set(transcriptSpeakers.map((s) => s.split('_')[0]))];
            const speakerCount = speakerList.map((sl) => {
                return { speaker: sl, count: transcriptSpeakers.filter((ts) => ts.split('_')[0] === sl).length };
            });
            const transcriptMultiSpeakers = speakerCount.filter((sc) => sc.count > 1).map((sc) => sc.speaker);
            if (transcriptMultiSpeakers.length > 0) {
                setMultiSpeakers(transcriptMultiSpeakers);
            }
        }

        const insightRef: { [key: string]: number } = {};
        for (const insight of transcriptInsights) {
            for (const span of insight.Spans) {
                let currentStartIndex = 0;
                const dIndexes = keys(
                    pickBy(segmentDict[span.SegmentId].Words, ({ Alternatives }) => {
                        const copyIndex = currentStartIndex;

                        if (Alternatives[0].Content.length === 1 && !/^[a-zA-Z]+$/.test(Alternatives[0].Content[0])) {
                            currentStartIndex += Alternatives[0].Content.length;
                        } else {
                            currentStartIndex += Alternatives[0].Content.length + 1;
                        }

                        return span.BeginCharacterOffset <= copyIndex && span.EndCharacterOffset >= copyIndex;
                    })
                );
                for (const detected of dIndexes) {
                    const index = parseInt(detected);

                    if (index !== -1) {
                        switch (insight.InsightType) {
                            case 'ClinicalEntity': {
                                segmentDict[span.SegmentId].Words[index].ClinicalEntity = insight;

                                if (
                                    !has(insightRef, segmentDict[span.SegmentId].Words[index].ClinicalEntity.InsightId)
                                ) {
                                    insightRef[segmentDict[span.SegmentId].Words[index].ClinicalEntity.InsightId] =
                                        segmentDict[span.SegmentId].Words[index].BeginAudioTime;
                                }
                                break;
                            }
                            case 'ClinicalPhrase': {
                                segmentDict[span.SegmentId].Words[index].ClinicalPhrase = insight;

                                if (
                                    !has(insightRef, segmentDict[span.SegmentId].Words[index].ClinicalPhrase.InsightId)
                                ) {
                                    insightRef[segmentDict[span.SegmentId].Words[index].ClinicalPhrase.InsightId] =
                                        segmentDict[span.SegmentId].Words[index].BeginAudioTime;
                                }
                                break;
                            }
                            default:
                                break;
                        }
                    } else {
                        toast.error(`Insight missed: ${insight}`);
                    }
                }
            }
        }

        setTranscript(values(segmentDict));
    }, [jobLoading, transcriptFile]);

    useEffect(() => {
        function resetHighlightId() {
            setHighlightId({
                allSegmentIds: [],
                selectedSegmentId: '',
            });
        }

        if (highlightId.selectedSegmentId) {
            const transcriptHighlightAll = transcript
                .filter((t) => highlightId.allSegmentIds.includes(t.SegmentId))
                ?.map((h) => {
                    return { SegmentId: h.SegmentId, BeginAudioTime: h.BeginAudioTime, EndAudioTime: h.EndAudioTime };
                });

            if (transcriptHighlightAll.length === 0) {
                resetHighlightId();
                return;
            }

            const transcriptHighlightSelectedInd = transcriptHighlightAll.findIndex(
                (t) => t.SegmentId === highlightId.selectedSegmentId
            );

            if (!audioReady && transcriptHighlightSelectedInd >= 0) {
                setAudioTime(transcriptHighlightAll[transcriptHighlightSelectedInd].BeginAudioTime);
            }
        }
    }, [highlightId, transcript, audioReady, setAudioTime]);

    if (jobLoading || transcriptFile == null) {
        return <LoadingContainer containerTitle="Transcript" text="Loading Transcript" />;
    } else {
        return (
            <ScrollingContainer containerTitle="Transcript">
                {transcript.map((script, key) => {
                    const newSpeaker =
                        script.ParticipantDetails.ParticipantRole !==
                        transcript[key - 1]?.ParticipantDetails.ParticipantRole;
                    const speakerName = script.ParticipantDetails.ParticipantRole.split('_')[0];
                    const speakerNameFormatted = multiSpeakers.includes(speakerName)
                        ? `${toTitleCase(speakerName)} ${
                              parseInt(script.ParticipantDetails.ParticipantRole.split('_')[1]) + 1
                          }`
                        : toTitleCase(speakerName);
                    const highlightSegmentBackgroundColor =
                        script.SegmentId === highlightId.selectedSegmentId
                            ? awsui.colorBackgroundToggleCheckedDisabled
                            : highlightId.allSegmentIds.includes(script.SegmentId)
                              ? awsui.colorBackgroundToggleCheckedDisabled
                              : '';
                    return (
                        <div key={key} className={key === 0 ? 'pt-4' : ''}>
                            <Grid disableGutters gridDefinition={[{ colspan: 2 }, { colspan: 10 }]}>
                                <div
                                    className={`${
                                        newSpeaker && key > 0 ? `pt-[${TRANSCRIPT_SPACING}]` : ''
                                    } font-bold text-${multiSpeakers ? 'sm' : 'base'} ${
                                        ['OTHER', 'SMALL_TALK'].includes(script.SectionDetails.SectionName) &&
                                        smallTalkCheck
                                            ? 'text-[#9d9d9de1]'
                                            : ''
                                    }`}
                                >
                                    {newSpeaker && (
                                        <div className="whitespace-nowrap overflow-scroll scrollbar-hide">
                                            {speakerNameFormatted}
                                        </div>
                                    )}
                                </div>
                                <div
                                    style={{
                                        paddingTop: newSpeaker && key > 0 ? TRANSCRIPT_SPACING : '',
                                        backgroundColor: highlightSegmentBackgroundColor,
                                    }}
                                >
                                    <TranscriptSegment
                                        script={script}
                                        smallTalkCheck={smallTalkCheck}
                                        audioTime={audioTime}
                                        audioReady={audioReady}
                                        wavesurfer={wavesurfer}
                                    />
                                </div>
                            </Grid>
                        </div>
                    );
                })}
            </ScrollingContainer>
        );
    }
}
