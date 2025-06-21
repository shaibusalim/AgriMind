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
  identification: z.string().describe('The identification of the pests or diseases.'),
  confidence: z.number().describe('The confidence level of the identification.'),
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
  prompt: `You are an expert in detecting pests and diseases in crops.

You will use this information to detect any pests or diseases in the crop.
You will make a determination as to whether the crop has pests or diseases or not, and what they are, and set the hasPestsOrDiseases output field appropriately.

Analyze the following image and detect any pests or diseases.

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
