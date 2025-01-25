import { 
    BedrockRuntimeClient, 
    InvokeModelCommand,
    InvokeModelWithResponseStreamCommand
} from '@aws-sdk/client-bedrock-runtime';
import { CONFIG } from '../config';
import { getConfigRegion, getCredentials } from '../Sdk';

let bedrockClient: BedrockRuntimeClient;

async function initClient() {
    const credentials = await getCredentials();
    bedrockClient = new BedrockRuntimeClient({
        region: getConfigRegion(),
        credentials
    });
}

export async function invokeBedrock(prompt: string, modelId: string = CONFIG.BEDROCK_MODELS.CLAUDE) {
    if (!bedrockClient) await initClient();

    const request = {
        modelId,
        body: JSON.stringify({
            prompt,
            max_tokens: 2000,
            temperature: 0.1,
            top_p: 0.9,
            stop_sequences: ["\n\nHuman:", "\n\nAssistant:"]
        })
    };

    const command = new InvokeModelCommand(request);
    const response = await bedrockClient.send(command);
    
    return JSON.parse(new TextDecoder().decode(response.body));
}

export async function streamBedrock(
    prompt: string,
    modelId: string = CONFIG.BEDROCK_MODELS.CLAUDE,
    onChunk?: (chunk: string) => void
) {
    if (!bedrockClient) await initClient();

    const request = {
        modelId,
        body: JSON.stringify({
            prompt,
            max_tokens: 2000,
            temperature: 0.1,
            top_p: 0.9,
            stop_sequences: ["\n\nHuman:", "\n\nAssistant:"],
            stream: true
        })
    };

    const command = new InvokeModelWithResponseStreamCommand(request);
    const response = await bedrockClient.send(command);
    
    let fullResponse = '';
    
    for await (const chunk of response.body!) {
        const decoded = new TextDecoder().decode(chunk.chunk?.bytes);
        const parsed = JSON.parse(decoded);
        
        if (parsed.completion) {
            fullResponse += parsed.completion;
            if (onChunk) onChunk(parsed.completion);
        }
    }
    
    return fullResponse;
}