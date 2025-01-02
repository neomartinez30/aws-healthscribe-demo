import axios from 'axios';

const API_BASE_URL = 'https://qukigdtczjsdk.studio.us-east-1.sagemaker.aws/jupyterlab/default/proxy/8000/'


export interface DatabaseInfo {
  databases: string[];
  tables?: { [key: string]: string[] };
  patient_ids?: string[];
}

export interface SummaryRequest {
  database: string;
  tables: string[];
  patient_id: string;
  prompt_template: string;
  model?: string;
  summary_model?: string;
}

export interface ChatRequest {
  question: string;
  context: string;
  model?: string;
}

export const api = {
  getDatabases: async (): Promise<DatabaseInfo> => {
    const response = await axios.get(`${API_BASE_URL}/databases`);
    return response.data;
  },

  getDatabaseTables: async (database: string): Promise<DatabaseInfo> => {
    const response = await axios.get(`${API_BASE_URL}/databases/${database}/tables`);
    return response.data;
  },

  getPatients: async (database: string): Promise<DatabaseInfo> => {
    const response = await axios.get(`${API_BASE_URL}/databases/${database}/patients`);
    return response.data;
  },

  getPatientSummary: async (request: SummaryRequest) => {
    const response = await axios.post(`${API_BASE_URL}/summary`, request);
    return response.data;
  },

  chatWithSummary: async (request: ChatRequest) => {
    const response = await axios.post(`${API_BASE_URL}/chat`, request);
    return response.data;
  }
};