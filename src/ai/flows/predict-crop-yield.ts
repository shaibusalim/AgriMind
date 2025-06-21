'use server';

/**
 * @fileOverview An AI agent that predicts crop yield based on historical data, weather patterns, and soil data.
 *
 * - predictCropYield - A function that handles the crop yield prediction process.
 * - PredictCropYieldInput - The input type for the predictCropYield function.
 * - PredictCropYieldOutput - The return type for the predictCropYield function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictCropYieldInputSchema = z.object({
  cropType: z.string().describe('The type of crop to predict yield for.'),
  soilData: z.string().describe('The soil data for the farm.'),
  weatherPatterns: z.string().describe('Historical weather patterns for the location.'),
  historicalCropPerformance: z.string().describe('Historical crop performance data for the farm.'),
});
export type PredictCropYieldInput = z.infer<typeof PredictCropYieldInputSchema>;

const PredictCropYieldOutputSchema = z.object({
  yieldRange: z.string().describe('The predicted yield range for the crop.'),
  confidenceLevel: z.string().describe('The confidence level of the prediction.'),
  factorsInfluencingYield: z.string().describe('Factors influencing the predicted yield.'),
});
export type PredictCropYieldOutput = z.infer<typeof PredictCropYieldOutputSchema>;

export async function predictCropYield(input: PredictCropYieldInput): Promise<PredictCropYieldOutput> {
  return predictCropYieldFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictCropYieldPrompt',
  input: {schema: PredictCropYieldInputSchema},
  output: {schema: PredictCropYieldOutputSchema},
  prompt: `You are an expert agricultural advisor. Based on the following information, predict the yield range for the specified crop, the confidence level of the prediction, and the factors influencing the predicted yield.

Crop Type: {{{cropType}}}
Soil Data: {{{soilData}}}
Weather Patterns: {{{weatherPatterns}}}
Historical Crop Performance: {{{historicalCropPerformance}}}

Respond in the following format:
Yield Range: <predicted yield range>
Confidence Level: <confidence level>
Factors Influencing Yield: <factors influencing yield>`,
});

const predictCropYieldFlow = ai.defineFlow(
  {
    name: 'predictCropYieldFlow',
    inputSchema: PredictCropYieldInputSchema,
    outputSchema: PredictCropYieldOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
