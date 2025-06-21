'use server';
/**
 * @fileOverview An AI agent that provides a weather forecast.
 *
 * - getWeatherForecast - A function that handles the weather forecast process.
 * - GetWeatherForecastInput - The input type for the getWeatherForecast function.
 * - GetWeatherForecastOutput - The return type for the getWeatherForecast function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetWeatherForecastInputSchema = z.object({
  location: z.string().describe('The location for the weather forecast (e.g., "Napa Valley, CA").'),
});
export type GetWeatherForecastInput = z.infer<typeof GetWeatherForecastInputSchema>;

const WeatherConditionSchema = z.enum([
    "Sunny", "Partly Cloudy", "Cloudy", "Rainy", "Stormy", "Snowy", "Windy", "Foggy"
]);

const GetWeatherForecastOutputSchema = z.object({
  temperature: z.number().describe('The current temperature in Celsius.'),
  feelsLike: z.number().describe('What the temperature feels like in Celsius.'),
  condition: WeatherConditionSchema.describe('A one-word description of the weather condition.'),
  precipitationChance: z.number().describe('The chance of precipitation as a percentage (0-100).'),
  humidity: z.number().describe('The humidity as a percentage (0-100).'),
  windSpeed: z.number().describe('The wind speed in km/h.'),
});
export type GetWeatherForecastOutput = z.infer<typeof GetWeatherForecastOutputSchema>;

export async function getWeatherForecast(input: GetWeatherForecastInput): Promise<GetWeatherForecastOutput> {
  return weatherForecastFlow(input);
}

// In a real-world scenario, this tool would call a weather API.
// For this demo, we'll let the LLM generate a realistic forecast based on its knowledge.
const getWeatherTool = ai.defineTool(
    {
      name: 'getWeatherTool',
      description: 'Gets the current weather forecast for a specified location.',
      inputSchema: GetWeatherForecastInputSchema,
      outputSchema: GetWeatherForecastOutputSchema
    },
    async ({location}) => {
      // This is a mock. The LLM will generate data in the prompt.
      // We are defining the tool so the LLM knows what to output.
      return {
        temperature: 25,
        feelsLike: 27,
        condition: "Sunny",
        precipitationChance: 5,
        humidity: 60,
        windSpeed: 10
      };
    }
);

const prompt = ai.definePrompt({
  name: 'weatherForecastPrompt',
  input: {schema: GetWeatherForecastInputSchema},
  output: {schema: GetWeatherForecastOutputSchema},
  tools: [getWeatherTool],
  prompt: `You are a helpful weather assistant. Your task is to provide a weather forecast for the given location using your knowledge. Do not make up weather, provide a realistic forecast based on the location. Use the getWeatherTool to format your response.

Location: {{{location}}}`,
});

const weatherForecastFlow = ai.defineFlow(
  {
    name: 'weatherForecastFlow',
    inputSchema: GetWeatherForecastInputSchema,
    outputSchema: GetWeatherForecastOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
