"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { detectCropPestsAndDiseases, type DetectCropPestsAndDiseasesOutput } from "@/ai/flows/detect-crop-pests-diseases";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Bug, Loader, AlertTriangle, Upload, CheckCircle, XCircle, Lightbulb } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Progress } from "../ui/progress";

export function PestDetectionClient() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DetectCropPestsAndDiseasesOutput | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        setResult(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!preview) {
      setError("Please select an image first.");
      return;
    }
    
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const detection = await detectCropPestsAndDiseases({ photoDataUri: preview });
      setResult(detection);
    } catch (e: any) {
      setError(e.message || "An unexpected error occurred during analysis.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleRemoveImage = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Pest & Disease Detection</CardTitle>
          <CardDescription>Upload an image of a crop to detect potential pests and diseases.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            {!preview ? (
              <Label htmlFor="picture" className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg text-center cursor-pointer hover:border-primary/50 transition-colors">
                  <Upload className="w-12 h-12 text-muted-foreground" />
                  <span className="mt-4 font-semibold text-lg">Upload Crop Image</span>
                  <p className="text-muted-foreground text-sm mt-1">Drag and drop or click to upload</p>
                  <Input id="picture" type="file" accept="image/*" onChange={handleFileChange} ref={fileInputRef} className="sr-only" />
              </Label>
            ) : (
                <div className="space-y-4">
                    <div className="relative w-full max-w-lg mx-auto">
                        <Image
                            src={preview}
                            alt="Crop preview"
                            width={500}
                            height={500}
                            className="rounded-lg object-contain w-full h-auto"
                            data-ai-hint="plant disease"
                        />
                        <Button variant="destructive" size="icon" className="absolute top-2 right-2" onClick={handleRemoveImage}>
                            <XCircle className="w-5 h-5"/>
                            <span className="sr-only">Remove Image</span>
                        </Button>
                    </div>
                    <Button onClick={handleAnalyze} disabled={loading} className="w-full">
                        {loading ? <Loader className="animate-spin" /> : <Bug />}
                        Analyze Image
                    </Button>
                </div>
            )}
        </CardContent>
      </Card>

      {loading && (
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <Loader className="animate-spin" />
          <span>Scanning image for pests and diseases...</span>
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
            <CardTitle>Analysis Result</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant={result.hasPestsOrDiseases ? "destructive" : "default"} className={!result.hasPestsOrDiseases ? "border-accent/50 bg-accent/10 text-accent" : ""}>
                {result.hasPestsOrDiseases ? <Bug /> : <CheckCircle className="text-accent"/>}
                <AlertTitle>
                    {result.hasPestsOrDiseases ? "Potential Issue Detected" : "Looks Healthy"}
                </AlertTitle>
                <AlertDescription>
                   The AI has identified the following: <strong>{result.identification}</strong>.
                </AlertDescription>
            </Alert>
            
            <div className="space-y-2">
                <h4 className="font-semibold">Confidence Level</h4>
                <div className="flex items-center gap-2">
                    <Progress value={result.confidence * 100} className="w-full" />
                    <span className="font-mono text-sm">{(result.confidence * 100).toFixed(0)}%</span>
                </div>
            </div>

            <div className="space-y-2 pt-2">
                <h4 className="font-semibold flex items-center gap-2">
                    <Lightbulb className="text-primary"/>
                    {result.hasPestsOrDiseases ? "Recommended Action" : "Proactive Tip"}
                </h4>
                <p className="text-muted-foreground">{result.treatmentSuggestion}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
