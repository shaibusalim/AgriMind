'use server';
/**
 * @fileOverview Generates agricultural advisories in local languages.
 *
 * - generateLocalAdvisory - A function that handles the advisory generation process.
 * - GenerateLocalAdvisoryInput - The input type for the generateLocalAdvisory function.
 * - GenerateLocalAdvisoryOutput - The return type for the generateLocalAdvisory function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateLocalAdvisoryInputSchema = z.object({
  topic: z.string().describe('The topic for the advisory (e.g., "Pest Control for Corn", "Fertilizer Application").'),
  language: z.string().describe('The local language to write the advisory in (e.g., "Hindi", "Swahili", "Spanish").'),
});
export type GenerateLocalAdvisoryInput = z.infer<typeof GenerateLocalAdvisoryInputSchema>;

const GenerateLocalAdvisoryOutputSchema = z.object({
  advisory: z.string().describe('The generated advisory text in the specified language.'),
});
export type GenerateLocalAdvisoryOutput = z.infer<typeof GenerateLocalAdvisoryOutputSchema>;

export async function generateLocalAdvisory(
  input: GenerateLocalAdvisoryInput
): Promise<GenerateLocalAdvisoryOutput> {
  return generateLocalAdvisoryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateLocalAdvisoryPrompt',
  input: {schema: GenerateLocalAdvisoryInputSchema},
  output: {schema: GenerateLocalAdvisoryOutputSchema},
  prompt: `You are an expert agricultural advisor with deep knowledge of farming practices worldwide. Your task is to provide a clear, concise, and actionable advisory for a farmer.

The advisory should be on the topic of: {{{topic}}}

Crucially, you must write the entire advisory in the following language: {{{language}}}.

The tone should be simple, direct, and easy for a rural farmer to understand. Avoid technical jargon where possible. Structure the advisory with a title, a brief introduction, and then a few key bullet points or steps.`,
});

const generateLocalAdvisoryFlow = ai.defineFlow(
  {
    name: 'generateLocalAdvisoryFlow',
    inputSchema: GenerateLocalAdvisoryInputSchema,
    outputSchema: GenerateLocalAdvisoryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
