const AWS = require('aws-sdk');

exports.handler = async (event) => {
    const athena = new AWS.Athena();
    const glue = new AWS.Glue();
    
    try {
        switch (event.operation) {
            case 'LIST_DATABASES':
                const databases = await athena.listDatabases({
                    CatalogName: 'AwsDataCatalog'
                }).promise();
                return {
                    statusCode: 200,
                    body: JSON.stringify(databases)
                };
                
            case 'LIST_TABLES':
                const tables = await glue.getTables({
                    DatabaseName: event.databaseName
                }).promise();
                return {
                    statusCode: 200,
                    body: JSON.stringify(tables)
                };
                
            case 'EXECUTE_QUERY':
                const queryExecution = await athena.startQueryExecution({
                    QueryString: event.query,
                    QueryExecutionContext: {
                        Database: event.database,
                        Catalog: 'AwsDataCatalog'
                    },
                    WorkGroup: 'primary'
                }).promise();
                
                return {
                    statusCode: 200,
                    body: JSON.stringify(queryExecution)
                };
                
            default:
                return {
                    statusCode: 400,
                    body: JSON.stringify({ error: 'Invalid operation' })
                };
        }
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};