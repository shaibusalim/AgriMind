"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { generateLocalAdvisory, type GenerateLocalAdvisoryOutput } from "@/ai/flows/local-advisory-flow";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Languages, Loader, AlertTriangle, BookText } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

const formSchema = z.object({
  topic: z.string().min(5, "Topic must be at least 5 characters."),
  language: z.string().min(2, "Language is required."),
});

type FormValues = z.infer<typeof formSchema>;

export function LocalAdvisoryClient() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GenerateLocalAdvisoryOutput | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: "Best practices for irrigating wheat crops",
      language: "Hindi",
    },
  });

  async function onSubmit(values: FormValues) {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const advisory = await generateLocalAdvisory(values);
      setResult(advisory);
    } catch (e: any) {
      setError(e.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Local Language Advisory</CardTitle>
          <CardDescription>Generate farming advice in the language of your choice.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <FormField control={form.control} name="topic" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Advisory Topic</FormLabel>
                      <FormControl><Input placeholder="e.g., Pest control for corn" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField control={form.control} name="language" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Language</FormLabel>
                      <FormControl><Input placeholder="e.g., Spanish, Swahili" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? <Loader className="animate-spin" /> : <Languages />}
                Generate Advisory
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {loading && (
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <Loader className="animate-spin" />
          <span>Generating advisory in {form.getValues("language")}...</span>
        </div>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertTriangle />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {result && (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <BookText className="text-primary"/>
                    Your Advisory in {form.getValues("language")}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="prose prose-sm dark:prose-invert max-w-none p-4 bg-secondary/50 rounded-md whitespace-pre-wrap">
                    {result.advisory}
                </div>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
