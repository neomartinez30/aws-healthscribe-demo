import React, { useEffect, useState } from 'react';
import Select from '@cloudscape-design/components/select';
import Container from '@cloudscape-design/components/container';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Header from '@cloudscape-design/components/header';
import { api, DatabaseInfo } from '@/utils/api';
import Spinner from '@cloudscape-design/components/spinner';
import Box from '@cloudscape-design/components/box';
import Multiselect from '@cloudscape-design/components/multiselect';

export function DatabaseSettings() {
  const [loading, setLoading] = useState(true);
  const [databases, setDatabases] = useState<DatabaseInfo | null>(null);
  const [selectedDb, setSelectedDb] = useState<string | null>(null);
  const [tables, setTables] = useState<string[]>([]);
  const [selectedTables, setSelectedTables] = useState<string[]>([]);
  const [patients, setPatients] = useState<string[]>([]);

  useEffect(() => {
    loadDatabases();
  }, []);

  useEffect(() => {
    if (selectedDb) {
      loadTables(selectedDb);
      loadPatients(selectedDb);
    }
  }, [selectedDb]);

  const loadDatabases = async () => {
    try {
      const data = await api.getDatabases();
      setDatabases(data);
    } catch (error) {
      console.error('Error loading databases:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTables = async (database: string) => {
    try {
      const data = await api.getDatabaseTables(database);
      if (data.tables && data.tables[database]) {
        setTables(data.tables[database]);
      }
    } catch (error) {
      console.error('Error loading tables:', error);
    }
  };

  const loadPatients = async (database: string) => {
    try {
      const data = await api.getPatients(database);
      if (data.patient_ids) {
        setPatients(data.patient_ids);
      }
    } catch (error) {
      console.error('Error loading patients:', error);
    }
  };

  if (loading) {
    return <Spinner size="large" />;
  }

  return (
    <Container
      header={
        <Header variant="h2">
          Database Configuration
        </Header>
      }
    >
      <SpaceBetween size="l">
        <Box>
          <SpaceBetween size="m">
            <Select
              selectedOption={selectedDb ? { label: selectedDb, value: selectedDb } : null}
              onChange={({ detail }) => setSelectedDb(detail.selectedOption?.value || null)}
              options={(databases?.databases || []).map(db => ({ label: db, value: db }))}
              placeholder="Select a database"
            />

      <Multiselect
        selectedOptions={selectedTables.map(table => ({ label: table, value: table }))}
        onChange={({ detail }) =>
          setSelectedTables(detail.selectedOptions.map(option => option.value).filter(Boolean))
      }
        options={tables.map(table => ({ label: table, value: table }))}
        placeholder="Select tables"
    />


            <Select
              selectedOption={null}
              options={patients.map(id => ({ label: id, value: id }))}
              placeholder="Select a patient"
            />
          </SpaceBetween>
        </Box>
      </SpaceBetween>
    </Container>
  );
}