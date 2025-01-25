import { 
    AthenaClient, 
    GetQueryExecutionCommand, 
    GetQueryResultsCommand,
    StartQueryExecutionCommand,
    ListDatabasesCommand
} from '@aws-sdk/client-athena';
import { GlueClient, GetTablesCommand } from '@aws-sdk/client-glue';
import { CONFIG } from '../config';
import { getConfigRegion, getCredentials } from '../Sdk';

let athenaClient: AthenaClient;
let glueClient: GlueClient;

async function initClients() {
    const credentials = await getCredentials();
    athenaClient = new AthenaClient({
        region: getConfigRegion(),
        credentials
    });
    
    glueClient = new GlueClient({
        region: getConfigRegion(),
        credentials
    });
}

export async function getDatabases() {
    if (!athenaClient) await initClients();
    
    const command = new ListDatabasesCommand({
        CatalogName: 'AwsDataCatalog'
    });
    
    return await athenaClient.send(command);
}

export async function getTables(database: string) {
    if (!glueClient) await initClients();
    
    const command = new GetTablesCommand({
        DatabaseName: database
    });
    
    const response = await glueClient.send(command);
    return response.TableList?.map(table => table.Name) || [];
}

export async function executeQuery(query: string, database: string) {
    if (!athenaClient) await initClients();
    
    const command = new StartQueryExecutionCommand({
        QueryString: query,
        QueryExecutionContext: {
            Database: database,
            Catalog: 'AwsDataCatalog'
        },
        WorkGroup: CONFIG.WORKGROUP
    });

    return await athenaClient.send(command);
}

export async function getQueryExecution(queryExecutionId: string) {
    if (!athenaClient) await initClients();
    
    const command = new GetQueryExecutionCommand({
        QueryExecutionId: queryExecutionId
    });

    return await athenaClient.send(command);
}

export async function getQueryResults(queryExecutionId: string) {
    if (!athenaClient) await initClients();
    
    // Wait for query to complete
    let status = 'RUNNING';
    while (status === 'RUNNING' || status === 'QUEUED') {
        const execution = await getQueryExecution(queryExecutionId);
        status = execution.QueryExecution?.Status?.State || 'FAILED';
        
        if (status === 'FAILED') {
            throw new Error(execution.QueryExecution?.Status?.StateChangeReason || 'Query failed');
        }
        
        if (status === 'RUNNING' || status === 'QUEUED') {
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }

    const command = new GetQueryResultsCommand({
        QueryExecutionId: queryExecutionId
    });

    return await athenaClient.send(command);
}