"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { sendSmsNotification } from "@/ai/flows/send-sms-flow";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Loader, AlertTriangle, Send } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

const formSchema = z.object({
  phoneNumber: z.string().min(10, "A valid phone number is required."),
  message: z.string().min(5, "Message must be at least 5 characters.").max(160, "Message cannot exceed 160 characters."),
});

type FormValues = z.infer<typeof formSchema>;

export function SmsNotificationClient() {
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phoneNumber: "+15551234567",
      message: "Weather alert: Heavy rainfall expected tomorrow morning. Secure your equipment.",
    },
  });

  async function onSubmit(values: FormValues) {
    setLoading(true);
    setError(null);
    
    try {
      const result = await sendSmsNotification(values);
      if (result.status === 'Sent') {
        toast({
            title: "SMS Sent Successfully",
            description: `Message sent to ${values.phoneNumber}. Message ID: ${result.messageId}`,
        });
        form.reset();
      } else {
        throw new Error("Failed to send SMS.");
      }
    } catch (e: any)      {
      setError(e.message || "An unexpected error occurred.");
       toast({
        variant: "destructive",
        title: "Error Sending SMS",
        description: e.message || "An unexpected error occurred.",
      });
    } finally {
      setLoading(false);
    }
  }

  if (!isMounted) {
    return null;
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Send SMS Notification</CardTitle>
          <CardDescription>
            Broadcast alerts and updates to farmers, even if they are offline.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField control={form.control} name="phoneNumber" render={({ field }) => (
                <FormItem>
                  <FormLabel>Recipient Phone Number</FormLabel>
                  <FormControl><Input placeholder="+1234567890" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="message" render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl><Textarea placeholder="Enter your alert message here..." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              
              <Button type="submit" disabled={loading}>
                {loading ? <Loader className="animate-spin" /> : <Send />}
                Send SMS
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {error && (
        <Alert variant="destructive">
          <AlertTriangle />
          <AlertTitle>Last attempt failed</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
