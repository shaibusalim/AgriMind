"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { predictCropYield, type PredictCropYieldOutput } from "@/ai/flows/predict-crop-yield";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AreaChart, Loader, AlertTriangle, BarChart3, TrendingUp } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

const formSchema = z.object({
  cropType: z.string().min(2, "Crop type is required."),
  soilData: z.string().min(10, "Please provide some soil data."),
  weatherPatterns: z.string().min(10, "Please describe weather patterns."),
  historicalCropPerformance: z.string().min(10, "Please provide historical data."),
});

type FormValues = z.infer<typeof formSchema>;

export function YieldPredictionClient() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PredictCropYieldOutput | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cropType: "Corn",
      soilData: "Loam soil, pH 6.5, good drainage.",
      weatherPatterns: "Moderate rainfall, average temperature of 25°C during growing season.",
      historicalCropPerformance: "Previous years yielded 4 tons/hectare with similar conditions.",
    },
  });

  async function onSubmit(values: FormValues) {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const prediction = await predictCropYield(values);
      setResult(prediction);
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
          <CardTitle>AI-Powered Yield Predictor</CardTitle>
          <CardDescription>
            Predict potential crop yield based on soil, weather, and historical data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField control={form.control} name="cropType" render={({ field }) => (
                <FormItem>
                  <FormLabel>Crop Type</FormLabel>
                  <FormControl><Input placeholder="e.g., Wheat, Soybeans" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="soilData" render={({ field }) => (
                <FormItem>
                  <FormLabel>Soil Data</FormLabel>
                  <FormControl><Textarea placeholder="Describe soil composition, pH, nutrients..." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="weatherPatterns" render={({ field }) => (
                <FormItem>
                  <FormLabel>Weather Patterns</FormLabel>
                  <FormControl><Textarea placeholder="Describe typical rainfall, temperature, and seasonal variations..." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="historicalCropPerformance" render={({ field }) => (
                <FormItem>
                  <FormLabel>Historical Crop Performance</FormLabel>
                  <FormControl><Textarea placeholder="Describe yields from previous years, notable events like droughts or pest attacks..." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              
              <Button type="submit" disabled={loading}>
                {loading ? <Loader className="animate-spin" /> : <AreaChart />}
                Predict Yield
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {loading && (
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <Loader className="animate-spin" />
          <span>Forecasting yield with AI...</span>
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
                <CardTitle>Yield Prediction Result</CardTitle>
                <CardDescription>This is the AI-generated forecast for your crop.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                    <Card className="bg-secondary/50">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Predicted Yield Range</CardTitle>
                            <BarChart3 className="w-4 h-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold text-primary">{result.yieldRange}</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-secondary/50">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Confidence Level</CardTitle>
                            <TrendingUp className="w-4 h-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">{result.confidenceLevel}</p>
                        </CardContent>
                    </Card>
                </div>
                <div>
                    <h4 className="font-semibold mb-2">Factors Influencing Yield</h4>
                    <p className="text-sm text-muted-foreground">{result.factorsInfluencingYield}</p>
                </div>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
