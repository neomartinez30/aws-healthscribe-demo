import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { IClinicalInsights, ITranscript } from '@/types/HealthScribe';
import { WordPopoverTranscript } from './WordPopover';

interface TranscriptSegmentProps {
    script: ITranscript;
    smallTalkCheck: boolean;
    audioTime: number;
    audioReady: boolean;
    wavesurfer: React.MutableRefObject<WaveSurfer | undefined>;
}

export const TranscriptSegment = memo(function TranscriptSegment({
    script,
    smallTalkCheck,
    audioTime,
    audioReady,
    wavesurfer,
}: TranscriptSegmentProps) {
    const segmentRef = useRef<HTMLDivElement>(null);
    const [triggerKey, setTriggerKey] = useState(false);

    const executeScroll = () => {
        (segmentRef.current as HTMLDivElement).scrollIntoView({
            behavior: 'smooth',
            block: wavesurfer.current?.isPlaying() ? 'nearest' : 'start',
            inline: 'center',
        });
        setTriggerKey(true);
    };

    useEffect(() => {
        if (audioTime >= script.BeginAudioTime && audioTime <= script.EndAudioTime && !triggerKey) {
            executeScroll();
        } else if ((audioTime < script.BeginAudioTime || audioTime > script.EndAudioTime) && triggerKey) {
            setTriggerKey(false);
        }
    }, [audioTime]);

    const disableSegment = useMemo(() => {
        return ['OTHER', 'SMALL_TALK'].includes(script.SectionDetails.SectionName) && smallTalkCheck;
    }, [script.SectionDetails.SectionName, smallTalkCheck]);

    const audioDuration = useMemo(() => {
        if (audioReady) {
            return wavesurfer.current?.getDuration() || -1;
        } else {
            return -1;
        }
    }, [audioReady]);

    return (
        <div ref={segmentRef} className="scroll-mt-20">
            {script.Words.map((word, i) => {
                const isPunctuation = word.BeginAudioTime === word.EndAudioTime;
                const highlightWord = audioTime > word.BeginAudioTime && audioTime < word.EndAudioTime && !isPunctuation;
                const isClinicalEntity = !!word.ClinicalEntity && !!word.Type;
                return (
                    <WordPopoverTranscript
                        key={i}
                        isPunctuation={isPunctuation}
                        highlightWord={highlightWord}
                        disableSegment={disableSegment}
                        isClinicalEntity={isClinicalEntity}
                        wordBeginAudioTime={word.BeginAudioTime}
                        audioDuration={audioDuration}
                        word={word.Alternatives[0]}
                        wordClinicalEntity={word.ClinicalEntity as IClinicalInsights}
                        audioReady={audioReady}
                        wavesurfer={wavesurfer}
                    />
                );
            })}
        </div>
    );
});
