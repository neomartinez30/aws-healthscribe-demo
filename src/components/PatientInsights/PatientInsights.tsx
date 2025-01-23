// src/App.tsx
import React, { useState, useEffect } from "react";
import { Select, Button, Input, Spin, notification } from "antd";
import { AthenaClient, 
    StartQueryExecutionCommand, 
    GetQueryExecutionCommand, 
    GetQueryResultsCommand } from "@aws-sdk/client-athena";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import axios from "axios";
import { parse } from "papaparse";

const { Option } = Select;

const athenaClient = new AthenaClient({ region: "us-east-1" });
const s3Client = new S3Client({ region: "us-east-1" });

interface Params {
  db: string;
  table: string[];
  model: string;
  summaryModel: string;
  id: string;
  template: string;
}

const App: React.FC = () => {
  const [databases, setDatabases] = useState<string[]>([]);
  const [selectedDatabase, setSelectedDatabase] = useState<string | null>(null);
  const [tables, setTables] = useState<string[]>([]);
  const [selectedTables, setSelectedTables] = useState<string[]>([]);
  const [patientIds, setPatientIds] = useState<string[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [model, setModel] = useState<string | null>(null);
  const [summaryModel, setSummaryModel] = useState<string | null>(null);
  const [promptTemplate, setPromptTemplate] = useState<string>("prompt 1");
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);

  useEffect(() => {
    fetchDatabases();
  }, []);

  const fetchDatabases = async () => {
    setIsLoading(true);
    try {
      const response = await athenaClient.send(
        new StartQueryExecutionCommand({
          QueryString: "SHOW DATABASES;",
          QueryExecutionContext: { Catalog: "AwsDataCatalog" },
          WorkGroup: "primary",
        })
      );
      const queryExecutionId = response.QueryExecutionId!;
      const result = await fetchAthenaResults(queryExecutionId);
  
      const dbs = result
        .map((row: { Data?: Array<{ VarCharValue?: string }> }) => row.Data?.[0]?.VarCharValue || "")
        .filter((db) => db); // Exclude empty values
  
      setDatabases(dbs);
    } catch (error) {
      if (error instanceof Error) {
        notification.error({ message: "Error fetching databases", description: error.message });
      } else {
        notification.error({ message: "Unknown error occurred" });
      }
    } finally {
      setIsLoading(false);
    }
  };
  

  const fetchAthenaResults = async (executionId: string) => {
    let state = "RUNNING";
    while (state === "RUNNING" || state === "QUEUED") {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const response = await athenaClient.send(
        new GetQueryExecutionCommand({ QueryExecutionId: executionId })
      );
      state = response.QueryExecution?.Status?.State || "FAILED";
      if (state === "FAILED") {
        throw new Error("Athena query failed");
      }
    }
    const results = await athenaClient.send(
      new GetQueryResultsCommand({ QueryExecutionId: executionId })
    );
    return results.ResultSet?.Rows || [];
  };

  const fetchTables = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(`/get-tables`, { database: selectedDatabase });
      setTables(response.data);
    } 
    catch (error) {
        if (error instanceof Error) {
          notification.error({ message: "Error fetching tables", description: error.message });
        } else {
          notification.error({ message: "Unknown error occurred" });
        }
      }
      

    finally {
      setIsLoading(false);
    }
  };

  const summarizeData = async () => {
    if (!selectedDatabase || !selectedTables.length || !selectedPatientId || !model || !summaryModel) {
      notification.error({ message: "Missing required fields" });
      return;
    }

    const params: Params = {
      db: selectedDatabase,
      table: selectedTables,
      model,
      summaryModel,
      id: selectedPatientId,
      template: promptTemplate,
    };

    setIsLoading(true);
    try {
      const response = await axios.post(`/summarize`, params);
      setSummary(response.data);
    }  
    catch (error) {
        if (error instanceof Error) {
          notification.error({ message: "Error summarizing data", description: error.message });
        } else {
          notification.error({ message: "Unknown error occurred" });
        }
      }finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Medical Insights Dashboard</h1>
      <div style={{ marginBottom: "20px" }}>
        <Select
            placeholder="Select Database"
            style={{ width: "100%" }}
            value={selectedDatabase}
            onChange={(value: string) => setSelectedDatabase(value)}
        >

          {databases.map((db) => (
            <Option key={db} value={db}>
              {db}
            </Option>
          ))}
        </Select>
      </div>
      <div style={{ marginBottom: "20px" }}>
        <Button onClick={fetchTables} disabled={!selectedDatabase}>
          Fetch Tables
        </Button>
        <Select
          placeholder="Select Tables"
          mode="multiple"
          style={{ width: "100%" }}
          value={selectedTables}
          onChange={(value) => setSelectedTables(value)}
        >
          {tables.map((table) => (
            <Option key={table} value={table}>
              {table}
            </Option>
          ))}
        </Select>
      </div>
      <div style={{ marginBottom: "20px" }}>
      <Input
        placeholder="Patient ID"
        value={selectedPatientId || ""}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSelectedPatientId(e.target.value)}
       />
       
      </div>
      <div style={{ marginBottom: "20px" }}>
        <Select
          placeholder="Select Model"
          style={{ width: "100%" }}
          value={model}
          onChange={(value) => setModel(value)}
        >
          <Option value="model1">Model 1</Option>
          <Option value="model2">Model 2</Option>
        </Select>
        <Select
          placeholder="Select Summary Model"
          style={{ width: "100%", marginTop: "10px" }}
          value={summaryModel}
          onChange={(value) => setSummaryModel(value)}
        >
          <Option value="summaryModel1">Summary Model 1</Option>
          <Option value="summaryModel2">Summary Model 2</Option>
        </Select>
      </div>
      <div style={{ marginBottom: "20px" }}>
        <Select
          placeholder="Select Prompt Template"
          style={{ width: "100%" }}
          value={promptTemplate}
          onChange={(value) => setPromptTemplate(value)}
        >
          <Option value="prompt 1">Prompt 1</Option>
          <Option value="prompt 2">Prompt 2</Option>
        </Select>
      </div>
      <Button type="primary" onClick={summarizeData} loading={isLoading}>
        Summarize Data
      </Button>
      {summary && (
        <div style={{ marginTop: "20px" }}>
          <h2>Summary</h2>
          <p>{summary}</p>
        </div>
      )}
    </div>
  );
};

export default App;