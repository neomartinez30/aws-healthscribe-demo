import { AthenaClient, GetQueryExecutionCommand, StartQueryExecutionCommand } from '@aws-sdk/client-athena';
import { GlueClient, GetTablesCommand } from '@aws-sdk/client-glue';
import { getConfigRegion, getCredentials } from '../Sdk';

const athenaClient = new AthenaClient({
    region: getConfigRegion(),
    credentials: await getCredentials()
});

const glueClient = new GlueClient({
    region: getConfigRegion(), 
    credentials: await getCredentials()
});

export async function getDatabases() {
    const response = await athenaClient.send(new StartQueryExecutionCommand({
        QueryString: 'SHOW DATABASES',
        QueryExecutionContext: {
            Catalog: 'AwsDataCatalog'
        },
        WorkGroup: 'primary'
    }));
    
    return response;
}

export async function getTables(database: string) {
    const response = await glueClient.send(new GetTablesCommand({
        DatabaseName: database
    }));
    
    return response.TableList?.map(table => table.Name) || [];
}

export async function executeQuery(query: string, database: string) {
    const response = await athenaClient.send(new StartQueryExecutionCommand({
        QueryString: query,
        QueryExecutionContext: {
            Database: database,
            Catalog: 'AwsDataCatalog'
        },
        WorkGroup: 'primary'
    }));

    return response;
}

export async function getQueryResults(queryExecutionId: string) {
    const response = await athenaClient.send(new GetQueryExecutionCommand({
        QueryExecutionId: queryExecutionId
    }));

    return response;
}