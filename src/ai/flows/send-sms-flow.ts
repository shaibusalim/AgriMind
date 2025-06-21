'use server';
/**
 * @fileOverview A flow to send SMS notifications.
 *
 * - sendSmsNotification - A function that handles sending an SMS.
 * - SendSmsNotificationInput - The input type for the sendSmsNotification function.
 * - SendSmsNotificationOutput - The return type for the sendSmsNotification function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SendSmsNotificationInputSchema = z.object({
  phoneNumber: z.string().describe("The recipient's phone number in international format (e.g., +1234567890)."),
  message: z.string().describe('The text message content to send.'),
});
export type SendSmsNotificationInput = z.infer<typeof SendSmsNotificationInputSchema>;

const SendSmsNotificationOutputSchema = z.object({
  status: z.string().describe('The status of the message sending attempt (e.g., "Sent", "Failed").'),
  messageId: z.string().describe('The unique ID of the sent message, if successful.'),
});
export type SendSmsNotificationOutput = z.infer<typeof SendSmsNotificationOutputSchema>;

export async function sendSmsNotification(input: SendSmsNotificationInput): Promise<SendSmsNotificationOutput> {
  return sendSmsFlow(input);
}

const sendSmsTool = ai.defineTool(
    {
        name: 'sendSmsTool',
        description: 'Sends an SMS message to a given phone number.',
        inputSchema: SendSmsNotificationInputSchema,
        outputSchema: SendSmsNotificationOutputSchema
    },
    async (input) => {
        console.log(`Simulating SMS to ${input.phoneNumber}: "${input.message}"`);
        // In a real application, you would integrate with an SMS gateway like Twilio here.
        return {
            status: 'Sent',
            messageId: `sms_${Date.now()}_${Math.random().toString(36).substring(2)}`,
        }
    }
);

const prompt = ai.definePrompt({
  name: 'sendSmsPrompt',
  input: {schema: SendSmsNotificationInputSchema},
  output: {schema: SendSmsNotificationOutputSchema},
  tools: [sendSmsTool],
  prompt: `Use the sendSmsTool to send the provided message to the given phone number.

Phone Number: {{{phoneNumber}}}
Message: {{{message}}}
`,
});

const sendSmsFlow = ai.defineFlow(
  {
    name: 'sendSmsFlow',
    inputSchema: SendSmsNotificationInputSchema,
    outputSchema: SendSmsNotificationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
