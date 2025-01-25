import React, { useState, useEffect } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Select from '@cloudscape-design/components/select';
import Button from '@cloudscape-design/components/button';
import Box from '@cloudscape-design/components/box';
import Spinner from '@cloudscape-design/components/spinner';
import { useNotificationsContext } from '@/store/notifications';
import { getDatabases, getTables, executeQuery, getQueryResults } from '@/utils/AthenaApi';
import { invokeBedrock, streamBedrock } from '@/utils/BedrockApi';

export default function PatientInsights() {
    const { addFlashMessage } = useNotificationsContext();
    const [loading, setLoading] = useState(false);
    const [databases, setDatabases] = useState<string[]>([]);
    const [selectedDatabase, setSelectedDatabase] = useState<string>('');
    const [tables, setTables] = useState<string[]>([]);
    const [selectedTables, setSelectedTables] = useState<string[]>([]);
    const [patientIds, setPatientIds] = useState<string[]>([]);
    const [selectedPatientId, setSelectedPatientId] = useState<string>('');
    const [summary, setSummary] = useState<string>('');

    useEffect(() => {
        loadDatabases();
    }, []);

    useEffect(() => {
        if (selectedDatabase) {
            loadTables();
        }
    }, [selectedDatabase]);

    useEffect(() => {
        if (selectedDatabase && selectedTables.length > 0) {
            loadPatientIds();
        }
    }, [selectedDatabase, selectedTables]);

    async function loadDatabases() {
        try {
            setLoading(true);
            const response = await getDatabases();
            const dbList = response.DatabaseList?.map(db => db.Name) || [];
            setDatabases(dbList);
        } catch (error) {
            addFlashMessage({
                type: 'error',
                header: 'Error loading databases',
                content: 'Failed to load databases. Please try again.'
            });
        } finally {
            setLoading(false);
        }
    }

    async function loadTables() {
        try {
            setLoading(true);
            const tableList = await getTables(selectedDatabase);
            setTables(tableList);
        } catch (error) {
            addFlashMessage({
                type: 'error',
                header: 'Error loading tables',
                content: 'Failed to load tables. Please try again.'
            });
        } finally {
            setLoading(false);
        }
    }

    async function loadPatientIds() {
        try {
            setLoading(true);
            const query = `SELECT DISTINCT id FROM ${selectedDatabase}.patient`;
            const response = await executeQuery(query, selectedDatabase);
            const results = await getQueryResults(response.QueryExecutionId!);
            const ids = results.ResultSet?.Rows?.slice(1).map(row => row.Data?.[0].VarCharValue) || [];
            setPatientIds(ids);
        } catch (error) {
            addFlashMessage({
                type: 'error',
                header: 'Error loading patient IDs',
                content: 'Failed to load patient IDs. Please try again.'
            });
        } finally {
            setLoading(false);
        }
    }

    async function generateSummary() {
        try {
            setLoading(true);
            
            // Get patient data from selected tables
            const tableData = await Promise.all(
                selectedTables.map(async (table) => {
                    const query = `SELECT * FROM ${selectedDatabase}.${table} WHERE id = '${selectedPatientId}'`;
                    const response = await executeQuery(query, selectedDatabase);
                    const results = await getQueryResults(response.QueryExecutionId!);
                    return {
                        table,
                        data: results.ResultSet?.Rows || []
                    };
                })
            );

            // Generate summary using Bedrock
            const prompt = `Analyze the following patient data and provide a comprehensive medical summary:
            ${JSON.stringify(tableData, null, 2)}`;

            const response = await invokeBedrock(prompt, 'anthropic.claude-v2');
            const summary = JSON.parse(response.body.toString()).completion;
            setSummary(summary);

        } catch (error) {
            addFlashMessage({
                type: 'error',
                header: 'Error generating summary',
                content: 'Failed to generate patient summary. Please try again.'
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <Container
            header={
                <Header
                    variant="h1"
                    description="Generate comprehensive patient insights using AWS Bedrock"
                >
                    Patient Insights
                </Header>
            }
        >
            <SpaceBetween size="l">
                <Select
                    selectedOption={selectedDatabase ? { label: selectedDatabase, value: selectedDatabase } : null}
                    onChange={({ detail }) => setSelectedDatabase(detail.selectedOption?.value || '')}
                    options={databases.map(db => ({ label: db, value: db }))}
                    placeholder="Select a database"
                    disabled={loading}
                />

                <Select
                    selectedOption={selectedTables.map(table => ({ label: table, value: table }))}
                    onChange={({ detail }) => setSelectedTables(detail.selectedOptions.map(opt => opt.value || ''))}
                    options={tables.map(table => ({ label: table, value: table }))}
                    placeholder="Select tables"
                    disabled={loading || !selectedDatabase}
                    multiple
                />

                <Select
                    selectedOption={selectedPatientId ? { label: selectedPatientId, value: selectedPatientId } : null}
                    onChange={({ detail }) => setSelectedPatientId(detail.selectedOption?.value || '')}
                    options={patientIds.map(id => ({ label: id, value: id }))}
                    placeholder="Select a patient"
                    disabled={loading || selectedTables.length === 0}
                />

                <Button
                    onClick={generateSummary}
                    disabled={loading || !selectedPatientId}
                    loading={loading}
                >
                    Generate Summary
                </Button>

                {loading && (
                    <Box textAlign="center">
                        <Spinner size="large" />
                        <Box variant="p">Processing...</Box>
                    </Box>
                )}

                {summary && (
                    <Container header={<Header variant="h2">Patient Summary</Header>}>
                        <Box variant="p">{summary}</Box>
                    </Container>
                )}
            </SpaceBetween>
        </Container>
    );
}