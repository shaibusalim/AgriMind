'use server';
/**
 * @fileOverview Detects crop pests and diseases from an image.
 *
 * - detectCropPestsAndDiseases - A function that handles the pest and disease detection process.
 * - DetectCropPestsAndDiseasesInput - The input type for the detectCropPestsAndDiseases function.
 * - DetectCropPestsAndDiseasesOutput - The return type for the detectCropPestsAndDiseases function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectCropPestsAndDiseasesInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a crop, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type DetectCropPestsAndDiseasesInput = z.infer<typeof DetectCropPestsAndDiseasesInputSchema>;

const DetectCropPestsAndDiseasesOutputSchema = z.object({
  hasPestsOrDiseases: z
    .boolean()
    .describe('Whether or not the crop has pests or diseases.'),
  identification: z.string().describe('The identification of the pests or diseases. If none, state "Healthy".'),
  confidence: z.number().describe('The confidence level of the identification (from 0 to 1).'),
  treatmentSuggestion: z.string().describe('A brief suggestion for treating the identified issue. If healthy, provide a general tip for keeping the crop healthy.')
});
export type DetectCropPestsAndDiseasesOutput = z.infer<typeof DetectCropPestsAndDiseasesOutputSchema>;

export async function detectCropPestsAndDiseases(
  input: DetectCropPestsAndDiseasesInput
): Promise<DetectCropPestsAndDiseasesOutput> {
  return detectCropPestsAndDiseasesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'detectCropPestsAndDiseasesPrompt',
  input: {schema: DetectCropPestsAndDiseasesInputSchema},
  output: {schema: DetectCropPestsAndDiseasesOutputSchema},
  prompt: `You are an expert botanist and agricultural pest control specialist. Your goal is to analyze an image of a plant, identify any pests or diseases, and provide a recommended treatment.

You will use the provided image to make your diagnosis.
- If pests or diseases are detected, set 'hasPestsOrDiseases' to true, identify them in the 'identification' field, and provide a practical 'treatmentSuggestion'.
- If the plant appears healthy, set 'hasPestsOrDiseases' to false, set 'identification' to "Healthy", and for 'treatmentSuggestion' provide a general tip for maintaining plant health.
- Provide a confidence score between 0 and 1 for your diagnosis.

Analyze the following image:

Photo: {{media url=photoDataUri}}`,
});

const detectCropPestsAndDiseasesFlow = ai.defineFlow(
  {
    name: 'detectCropPestsAndDiseasesFlow',
    inputSchema: DetectCropPestsAndDiseasesInputSchema,
    outputSchema: DetectCropPestsAndDiseasesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
