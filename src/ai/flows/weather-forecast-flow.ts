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
  location: z.string().describe('The location for the weather forecast (e.g., "Napa Valley, CA", "lat 34.05, long -118.24").'),
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

const prompt = ai.definePrompt({
  name: 'weatherForecastPrompt',
  input: {schema: GetWeatherForecastInputSchema},
  output: {schema: GetWeatherForecastOutputSchema},
  prompt: `You are a helpful weather assistant. Your task is to provide a realistic weather forecast based on your knowledge of the given location.
  
Do not make up weather. Provide a reasonable forecast based on the location's climate. Your response must be in the form of a JSON object that matches the specified output schema.

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
    if (!output) {
      throw new Error("The AI failed to generate a valid weather forecast. The output was empty.");
    }
    return output;
  }
);
