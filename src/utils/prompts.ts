export const PROMPTS = {
    PATIENT_SUMMARY: `Analyze the following patient data and provide a comprehensive medical summary. Include:

1. Basic patient information
2. Key medical conditions and diagnoses
3. Medications and treatments
4. Lab results and vital signs
5. Notable trends or patterns
6. Potential health risks or concerns

Format the summary in clear sections with bullet points where appropriate.
Keep the tone professional and factual.
Only include information that is explicitly present in the data.

Patient Data:
{{data}}

Please provide a detailed but concise summary based on this information.`,

    SECTION_SUMMARY: `Analyze the following FHIR resource data and provide a focused summary of this specific aspect of the patient's health record:

Resource: {{resourceType}}
Data: {{data}}

Focus on:
1. Key information specific to this resource type
2. Relevant dates and timestamps
3. Clinical significance
4. Any patterns or trends

Keep the summary specific to this resource type and avoid speculation.`,

    CHAT_CONTEXT: `You are a medical assistant helping to analyze patient records. 
Use the following patient data as context for answering questions:

{{data}}

Only answer questions based on information present in the data.
If information is not available, clearly state that.
Keep responses professional and factual.`
};