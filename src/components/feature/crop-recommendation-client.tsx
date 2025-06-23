"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { recommendOptimalCrop, type RecommendOptimalCropOutput } from "@/ai/flows/recommend-optimal-crop";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Sprout, Loader, AlertTriangle, Lightbulb } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

const formSchema = z.object({
    location: z.string().min(2, "Location is required."),
    nitrogenLevel: z.coerce.number().min(0, "Must be a positive number."),
    phosphorusLevel: z.coerce.number().min(0, "Must be a positive number."),
    potassiumLevel: z.coerce.number().min(0, "Must be a positive number."),
    pHLevel: z.coerce.number().min(0).max(14, "pH must be between 0 and 14."),
    organicMatterContent: z.coerce.number().min(0, "Must be a positive number."),
    texture: z.string().min(2, "Soil texture is required."),
    averageRainfall: z.coerce.number().min(0, "Must be a positive number."),
    averageTemperature: z.coerce.number(),
    growingSeasonLength: z.coerce.number().min(0, "Must be a positive number."),
    humidity: z.coerce.number().min(0).max(100, "Must be between 0 and 100."),
});

type FormValues = z.infer<typeof formSchema>;

export function CropRecommendationClient() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<RecommendOptimalCropOutput | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      location: "",
      nitrogenLevel: 150,
      phosphorusLevel: 70,
      potassiumLevel: 200,
      pHLevel: 6.5,
      organicMatterContent: 3.5,
      texture: "Loamy",
      averageRainfall: 800,
      averageTemperature: 22,
      growingSeasonLength: 180,
      humidity: 60,
    },
  });

  async function onSubmit(values: FormValues) {
    setLoading(true);
    setError(null);
    setResult(null);
    
    const input = {
        location: values.location,
        soilData: {
            nitrogenLevel: values.nitrogenLevel,
            phosphorusLevel: values.phosphorusLevel,
            potassiumLevel: values.potassiumLevel,
            pHLevel: values.pHLevel,
            organicMatterContent: values.organicMatterContent,
            texture: values.texture,
        },
        climateData: {
            averageRainfall: values.averageRainfall,
            averageTemperature: values.averageTemperature,
            growingSeasonLength: values.growingSeasonLength,
            humidity: values.humidity,
        },
    };

    try {
      const recommendation = await recommendOptimalCrop(input);
      setResult(recommendation);
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
          <CardTitle>Crop Recommendation Engine</CardTitle>
          <CardDescription>Enter your farm's data to receive AI-powered crop recommendations.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Location</h3>
                <FormField control={form.control} name="location" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Farm Location (e.g. City, State/Country)</FormLabel>
                      <FormControl><Input placeholder="e.g., Central Valley, California" {...field} /></FormControl>
                      <FormDescription>
                        Providing a specific location helps the AI give more accurate, region-specific advice.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <h3 className="font-semibold text-lg">Soil Data</h3>
                <div className="grid md:grid-cols-3 gap-4">
                    <FormField control={form.control} name="nitrogenLevel" render={({ field }) => (<FormItem><FormLabel>Nitrogen (ppm)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="phosphorusLevel" render={({ field }) => (<FormItem><FormLabel>Phosphorus (ppm)</F<ctrl61>ormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="potassiumLevel" render={({ field }) => (<FormItem><FormLabel>Potassium (ppm)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="pHLevel" render={({ field }) => (<FormItem><FormLabel>pH Level</FormLabel><FormControl><Input type="number" step="0.1" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="organicMatterContent" render={({ field }) => (<FormItem><FormLabel>Organic Matter (%)</FormLabel><FormControl><Input type="number" step="0.1" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="texture" render={({ field }) => (<FormItem><FormLabel>Texture</FormLabel><FormControl><Input placeholder="e.g., Sandy, Loamy" {...field} /></FormControl><FormMessage /></FormItem>)} />
                </div>

                <h3 className="font-semibold text-lg">Climate Data</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <FormField control={form.control} name="averageRainfall" render={({ field }) => (<FormItem><FormLabel>Avg. Rainfall (mm/yr)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="averageTemperature" render={({ field }) => (<FormItem><FormLabel>Avg. Temperature (°C)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="growingSeasonLength" render={({ field }) => (<FormItem><FormLabel>Season Length (days)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="humidity" render={({ field }) => (<FormItem><FormLabel>Avg. Humidity (%)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                </div>
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? <Loader className="animate-spin" /> : <Sprout />}
                Get Recommendations
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {loading && (
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <Loader className="animate-spin" />
          <span>Analyzing data and generating recommendations...</span>
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
                <CardTitle>AI Recommendations</CardTitle>
                <CardDescription>Based on your data, here are the top crop recommendations.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {result.recommendations.length > 0 ? (
                    result.recommendations.map((rec, index) => (
                        <Card key={index} className="bg-secondary/50">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><Sprout className="text-primary"/>{rec.cropType}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <p><strong>Yield Estimate:</strong> {rec.yieldEstimate}</p>
                                <p><strong>Risk Assessment:</strong> {rec.riskAssessment}</p>
                                <p><strong>Additional Tips:</strong> {rec.additionalTips}</p>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <Alert>
                        <Lightbulb />
                        <AlertTitle>No Recommendations Found</AlertTitle>
                        <AlertDescription>The AI could not generate specific recommendations. Please try adjusting your input values.</AlertDescription>
                    </Alert>
                )}
            </CardContent>
        </Card>
      )}
    </div>
  );
}
