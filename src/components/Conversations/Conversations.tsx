// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { useCollection } from '@cloudscape-design/collection-hooks';
import Button from '@cloudscape-design/components/button';
import { CollectionPreferencesProps } from '@cloudscape-design/components/collection-preferences';
import Table from '@cloudscape-design/components/table';
import Pagination from '@cloudscape-design/components/pagination';

import { MedicalScribeJobSummary } from '@aws-sdk/client-transcribe';

import { ConversationsFilter } from '@/components/Conversations/ConversationsFilter';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useNotificationsContext } from '@/store/notifications';
import { ListHealthScribeJobsProps, listHealthScribeJobs, getHealthScribeJob } from '@/utils/HealthScribeApi';
import { getObject, getS3Object } from '@/utils/S3Api';

import { ConversationsHeaderActions } from './ConversationsHeaderActions';
import TableEmptyState from './TableEmptyState';
import { TablePreferences } from './TablePreferences';
import { columnDefs } from './conversationsColumnDefs';
import { DEFAULT_PREFERENCES } from './conversationsPrefs';

type MoreHealthScribeJobs = {
    searchFilter?: ListHealthScribeJobsProps;
    NextToken?: string;
};

interface ConversationsProps {
    onConversationSelect?: (conversation: any) => void;
}

export default function Conversations({ onConversationSelect }: ConversationsProps) {
    const { addFlashMessage } = useNotificationsContext();

    const [healthScribeJobs, setHealthScribeJobs] = useState<MedicalScribeJobSummary[]>([]);
    const [moreHealthScribeJobs, setMoreHealthScribeJobs] = useState<MoreHealthScribeJobs>({});
    const [selectedHealthScribeJob, setSelectedHealthScribeJob] = useState<MedicalScribeJobSummary[] | []>([]);

    const [tableLoading, setTableLoading] = useState(false);

    const [preferences, setPreferences] = useLocalStorage<CollectionPreferencesProps.Preferences>(
        'Conversations-Table-Preferences',
        DEFAULT_PREFERENCES
    );

    const [searchParams, setSearchParams] = useState<ListHealthScribeJobsProps>({});

    const headerCounterText = `(${healthScribeJobs.length}${Object.keys(moreHealthScribeJobs).length > 0 ? '+' : ''})`;

    const listHealthScribeJobsWrapper = useCallback(async (searchFilter: ListHealthScribeJobsProps) => {
        setTableLoading(true);
        try {
            const processedSearchFilter = { ...searchFilter };
            if (processedSearchFilter.Status === 'ALL') {
                processedSearchFilter.Status = undefined;
            }
            const listHealthScribeJobsRsp = await listHealthScribeJobs(processedSearchFilter);

            if (typeof listHealthScribeJobsRsp.MedicalScribeJobSummaries === 'undefined') {
                setHealthScribeJobs([]);
                setTableLoading(false);
                return;
            }

            const listResults: MedicalScribeJobSummary[] = listHealthScribeJobsRsp.MedicalScribeJobSummaries;

            if (processedSearchFilter.NextToken) {
                setHealthScribeJobs((prevHealthScribeJobs) => prevHealthScribeJobs.concat(listResults));
            } else {
                setHealthScribeJobs(listResults);
            }

            if (listHealthScribeJobsRsp?.NextToken) {
                setMoreHealthScribeJobs({
                    searchFilter: searchFilter,
                    NextToken: listHealthScribeJobsRsp?.NextToken,
                });
            } else {
                setMoreHealthScribeJobs({});
            }
        } catch (e: unknown) {
            setTableLoading(false);
            addFlashMessage({
                id: e?.toString() || 'ListHealthScribeJobs error',
                header: 'Conversations Error',
                content: e?.toString() || 'ListHealthScribeJobs error',
                type: 'error',
            });
        }
        setTableLoading(false);
    }, []);

    const openEndPaginationProp = useMemo(() => {
        if (Object.keys(moreHealthScribeJobs).length > 0) {
            return { openEnd: true };
        } else {
            return {};
        }
    }, [moreHealthScribeJobs]);

    async function refreshTable() {
        await listHealthScribeJobsWrapper(searchParams);
    }

    const { items, actions, collectionProps, paginationProps } = useCollection(healthScribeJobs, {
        filtering: {
            empty: <TableEmptyState title="No HealthScribe jobs" subtitle="Try clearing the search filter." />,
            noMatch: (
                <TableEmptyState
                    title="No matches"
                    subtitle="We cannot find a match."
                    action={<Button onClick={() => actions.setFiltering('')}>Clear filter</Button>}
                />
            ),
        },
        pagination: { pageSize: preferences.pageSize },
        sorting: {},
        selection: {},
    });

    useEffect(() => {
        void refreshTable();
    }, []);

    const handleSelectionChange = async ({ detail }: { detail: { selectedItems: MedicalScribeJobSummary[] } }) => {
        setSelectedHealthScribeJob(detail.selectedItems);
        if (onConversationSelect && detail.selectedItems.length > 0) {
            const jobName = detail.selectedItems[0].MedicalScribeJobName;
            try {
                const jobDetails = await getHealthScribeJob({ MedicalScribeJobName: jobName });
                const medicalScribeJob = jobDetails?.MedicalScribeJob;

                if (medicalScribeJob) {
                    const clinicalDocumentUri = medicalScribeJob.MedicalScribeOutput?.ClinicalDocumentUri;
                    const clinicalDocumentRsp = await getObject(getS3Object(clinicalDocumentUri || ''));
                    const clinicalDocument = JSON.parse((await clinicalDocumentRsp?.Body?.transformToString()) || '');

                    const transcriptFileUri = medicalScribeJob.MedicalScribeOutput?.TranscriptFileUri;
                    const transcriptFileRsp = await getObject(getS3Object(transcriptFileUri || ''));
                    const transcriptFile = JSON.parse((await transcriptFileRsp?.Body?.transformToString()) || '');

                    onConversationSelect({
                        jobLoading: false,
                        jobDetails: medicalScribeJob,
                        transcriptFile,
                        clinicalDocument,
                        highlightId: {
                            allSegmentIds: [],
                            selectedSegmentId: '',
                        },
                        setHighlightId: () => {},
                        wavesurfer: { current: undefined },
                    });
                }
            } catch (error) {
                console.error('Error loading conversation details:', error);
                addFlashMessage({
                    id: 'load-conversation-error',
                    header: 'Error',
                    content: 'Failed to load conversation details',
                    type: 'error',
                });
            }
        }
    };

    return (
        <Table
            {...collectionProps}
            columnDefinitions={columnDefs}
            columnDisplay={preferences.contentDisplay}
            contentDensity={preferences.contentDensity}
            filter={
                <ConversationsFilter
                    listHealthScribeJobs={listHealthScribeJobsWrapper}
                    searchParams={searchParams}
                    setSearchParams={setSearchParams}
                />
            }
            items={items}
            loading={tableLoading}
            loadingText="Loading HealthScribe jobs"
            onSelectionChange={handleSelectionChange}
            pagination={
                <Pagination
                    {...openEndPaginationProp}
                    {...paginationProps}
                    onChange={(event) => {
                        if (event.detail?.currentPageIndex > paginationProps.pagesCount) {
                            listHealthScribeJobsWrapper({
                                ...moreHealthScribeJobs.searchFilter,
                                NextToken: moreHealthScribeJobs.NextToken,
                            }).catch(console.error);
                        }
                        paginationProps.onChange(event);
                    }}
                />
            }
            preferences={<TablePreferences preferences={preferences} setPreferences={setPreferences} />}
            resizableColumns={true}
            selectedItems={selectedHealthScribeJob}
            selectionType="single"
            stickyColumns={preferences.stickyColumns}
            stickyHeader={true}
            stripedRows={preferences.stripedRows}
            trackBy="MedicalScribeJobName"
            variant="container"
            wrapLines={preferences.wrapLines}
        />
    );
}