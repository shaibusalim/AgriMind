'use server';

/**
 * @fileOverview An AI agent that recommends optimal crop types based on soil data and climate conditions.
 *
 * - recommendOptimalCrop - A function that handles the crop recommendation process.
 * - RecommendOptimalCropInput - The input type for the recommendOptimalCrop function.
 * - RecommendOptimalCropOutput - The return type for the recommendOptimalCrop function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SoilDataSchema = z.object({
  nitrogenLevel: z.number().describe('Nitrogen level in the soil (ppm).'),
  phosphorusLevel: z.number().describe('Phosphorus level in the soil (ppm).'),
  potassiumLevel: z.number().describe('Potassium level in the soil (ppm).'),
  pHLevel: z.number().describe('pH level of the soil.'),
  organicMatterContent: z.number().describe('Organic matter content in the soil (%).'),
  texture: z.string().describe('Soil texture (e.g., sandy, loamy, clayey).'),
});

const ClimateDataSchema = z.object({
  averageRainfall: z.number().describe('Average rainfall in the area (mm/year).'),
  averageTemperature: z.number().describe('Average temperature in the area (°C).'),
  growingSeasonLength: z.number().describe('Length of the growing season (days).'),
  humidity: z.number().describe('Average humidity in the area (%).'),
});

const RecommendOptimalCropInputSchema = z.object({
  soilData: SoilDataSchema.describe('Detailed information about the soil composition.'),
  climateData: ClimateDataSchema.describe('Detailed information about the climate conditions.'),
  location: z.string().describe('The geographical location of the farm.'),
});
export type RecommendOptimalCropInput = z.infer<typeof RecommendOptimalCropInputSchema>;

const CropRecommendationSchema = z.object({
  cropType: z.string().describe('The recommended crop type.'),
  yieldEstimate: z.string().describe('Estimated yield range for the recommended crop (e.g., 2-3 tons/hectare).'),
  riskAssessment: z.string().describe('Assessment of potential risks associated with the crop (e.g., pest susceptibility, water requirements).'),
  additionalTips: z.string().describe('Any additional tips for growing the crop in the specified conditions.'),
});

const RecommendOptimalCropOutputSchema = z.object({
  recommendations: z.array(CropRecommendationSchema).describe('List of crop recommendations based on the input data.'),
});
export type RecommendOptimalCropOutput = z.infer<typeof RecommendOptimalCropOutputSchema>;

export async function recommendOptimalCrop(input: RecommendOptimalCropInput): Promise<RecommendOptimalCropOutput> {
  return recommendOptimalCropFlow(input);
}

const analyzeOptimalCrop = ai.defineTool(
    {
      name: 'analyzeOptimalCrop',
      description: 'Analyzes soil data and local climate conditions to recommend optimal crop types.',
      inputSchema: RecommendOptimalCropInputSchema,
      outputSchema: RecommendOptimalCropOutputSchema
    },
    async (input) => {
      return {
        recommendations: []
      };
    }
);

const prompt = ai.definePrompt({
  name: 'recommendOptimalCropPrompt',
  input: {schema: RecommendOptimalCropInputSchema},
  output: {schema: RecommendOptimalCropOutputSchema},
  tools: [analyzeOptimalCrop],
  prompt: `Based on the following soil data, climate data and location, recommend the most suitable crop types for the farm. Use the analyzeOptimalCrop tool to determine the optimal crop types.

Soil Data: {{{JSON.stringify(soilData, null, 2)}}}
Climate Data: {{{JSON.stringify(climateData, null, 2)}}}
Location: {{{location}}}

Consider high-yield and low-risk options.
`,
});

const recommendOptimalCropFlow = ai.defineFlow(
  {
    name: 'recommendOptimalCropFlow',
    inputSchema: RecommendOptimalCropInputSchema,
    outputSchema: RecommendOptimalCropOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

