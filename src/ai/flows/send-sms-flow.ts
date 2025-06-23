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

// In a real app, this would use a service like Twilio. For now, it simulates sending an SMS.
const sendSmsTool = ai.defineTool(
    {
        name: 'sendSmsTool',
        description: 'Sends an SMS message to a given phone number.',
        inputSchema: SendSmsNotificationInputSchema,
        outputSchema: SendSmsNotificationOutputSchema
    },
    async (input) => {
        console.log(`Simulating SMS to ${input.phoneNumber}: "${input.message}"`);
        // Here you would integrate with an SMS gateway.
        // The simulation will always succeed.
        return {
            status: 'Sent',
            messageId: `sms_${Date.now()}_${Math.random().toString(36).substring(2)}`,
        }
    }
);

// This flow directly calls the tool, as no complex LLM reasoning is needed for this direct action.
const sendSmsFlow = ai.defineFlow(
  {
    name: 'sendSmsFlow',
    inputSchema: SendSmsNotificationInputSchema,
    outputSchema: SendSmsNotificationOutputSchema,
  },
  async input => {
    // We call the tool directly instead of asking an LLM to do it.
    const result = await sendSmsTool(input);
    return result;
  }
);
