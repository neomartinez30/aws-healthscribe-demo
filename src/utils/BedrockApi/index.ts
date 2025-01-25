import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';
import { getConfigRegion, getCredentials } from '../Sdk';

const bedrockClient = new BedrockRuntimeClient({
    region: getConfigRegion(),
    credentials: await getCredentials()
});

export async function invokeBedrock(prompt: string, modelId: string) {
    const response = await bedrockClient.send(new InvokeModelCommand({
        modelId,
        body: JSON.stringify({
            prompt,
            max_tokens: 2000,
            temperature: 0.1
        })
    }));

    return response;
}

export async function streamBedrock(params: any, messages: any[], systemMessage: string) {
    const response = await bedrockClient.send(new InvokeModelCommand({
        modelId: params.model,
        body: JSON.stringify({
            messages,
            system: systemMessage,
            max_tokens: 2000,
            temperature: 0.1,
            stream: true
        })
    }));

    return response;
}