"use client";

import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Bot, Loader, Send, User, AlertTriangle } from 'lucide-react';

import { chatWithBot } from '@/ai/flows/chatbot-flow';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/auth-context';

const formSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty.'),
});

type FormValues = z.infer<typeof formSchema>;

type Message = {
  role: 'user' | 'model';
  content: string;
};

export function ChatbotClient() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      content: 'Hello! I am AgriBot. How can I help you with your farm today?',
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: '',
    },
  });

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    return name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase();
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
        // The component nests the viewport, so we need to query for it.
        const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [messages]);


  async function onSubmit(values: FormValues) {
    setLoading(true);
    setError(null);

    const userMessage: Message = { role: 'user', content: values.message };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    form.reset();

    try {
      const response = await chatWithBot({
        history: messages, // Send the history *before* the new message
        message: values.message,
      });

      const botMessage: Message = { role: 'model', content: response.response };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (e: any) {
      setError(e.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="flex flex-col h-[80vh]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <Bot className="text-primary" /> AgriBot Assistant
        </CardTitle>
        <CardDescription>Your AI-powered agricultural chatbot.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <ScrollArea className="h-full pr-4" ref={scrollAreaRef}>
          <div className="space-y-6">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'model' && (
                  <Avatar className="w-8 h-8">
                    <AvatarFallback><Bot size={20}/></AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`max-w-xs md:max-w-md lg:max-w-xl rounded-xl p-3 text-sm ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary'
                  }`}
                >
                  <p>{message.content}</p>
                </div>
                {message.role === 'user' && (
                  <Avatar className="w-8 h-8">
                    {user?.photoURL ? <AvatarImage src={user.photoURL} alt={user.displayName || 'User'} /> : null}
                    <AvatarFallback>{getInitials(user?.displayName)}</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
             {loading && (
                <div className="flex gap-3 justify-start">
                    <Avatar className="w-8 h-8">
                        <AvatarFallback><Bot size={20}/></AvatarFallback>
                    </Avatar>
                    <div className="max-w-xs md:max-w-md lg:max-w-xl rounded-xl p-3 text-sm bg-secondary flex items-center gap-2">
                        <Loader className="animate-spin" size={16}/>
                        <span>Thinking...</span>
                    </div>
                </div>
             )}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="pt-6 border-t">
        <div className="w-full">
            {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertTriangle />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2 w-full">
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input
                          placeholder="Ask about crops, pests, weather..."
                          {...field}
                          autoComplete="off"
                          disabled={loading}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={loading} size="icon" aria-label="Send message">
                  {loading ? <Loader className="animate-spin" /> : <Send />}
                </Button>
              </form>
            </Form>
        </div>
      </CardFooter>
    </Card>
  );
}
