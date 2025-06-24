'use server';
/**
 * @fileOverview A conversational AI chatbot for agricultural advice.
 *
 * - chatWithBot - A function that handles the chatbot conversation.
 * - ChatWithBotInput - The input type for the chatWithBot function.
 * - ChatWithBotOutput - The return type for the chatWithBot function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MessageSchema = z.object({
  role: z.enum(['user', 'model']).describe("The role of the message sender, either 'user' or 'model'."),
  content: z.string().describe("The text content of the message."),
});

const ChatWithBotInputSchema = z.object({
  history: z.array(MessageSchema).describe("The conversation history."),
  message: z.string().describe("The latest message from the user."),
});
export type ChatWithBotInput = z.infer<typeof ChatWithBotInputSchema>;

const ChatWithBotOutputSchema = z.object({
  response: z.string().describe('The AI-generated response.'),
});
export type ChatWithBotOutput = z.infer<typeof ChatWithBotOutputSchema>;

export async function chatWithBot(input: ChatWithBotInput): Promise<ChatWithBotOutput> {
  return chatbotFlow(input);
}

const prompt = ai.definePrompt({
  name: 'chatbotPrompt',
  input: {schema: ChatWithBotInputSchema},
  prompt: `You are AgriBot, a friendly and knowledgeable agricultural assistant for the AgriMind application. Your goal is to help farmers with their questions about crops, pests, weather, and general farming practices.

Provide helpful, clear, and concise answers. If you don't know an answer, say so.

You have access to the same tools as the rest of the application, so if a user asks about something complex like predicting yield or recommending a crop with specific data, guide them to the appropriate feature page in the app instead of trying to replicate the calculation.

Here is the conversation history so far:
{{#each history}}
- {{this.role}}: {{{this.content}}}
{{/each}}

Here is the new message from the user:
- user: {{{message}}}

Your response should be just the text of your reply.`,
});

const chatbotFlow = ai.defineFlow(
  {
    name: 'chatbotFlow',
    inputSchema: ChatWithBotInputSchema,
    outputSchema: ChatWithBotOutputSchema,
  },
  async input => {
    const llmResponse = await prompt(input);
    return { response: llmResponse.text };
  }
);
