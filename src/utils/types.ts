export interface DatabaseInfo {
    Name: string;
    Description?: string;
}

export interface TableInfo {
    Name: string;
    DatabaseName: string;
    Description?: string;
}

export interface PatientData {
    table: string;
    data: any[];
}

export interface BedrockResponse {
    body: {
        completion: string;
    };
}

export interface QueryResult {
    QueryExecutionId: string;
    ResultSet?: {
        Rows: Array<{
            Data: Array<{
                VarCharValue?: string;
            }>;
        }>;
    };
}