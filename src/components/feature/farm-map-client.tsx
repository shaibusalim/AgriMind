"use client";

import { APIProvider, Map } from "@vis.gl/react-google-maps";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { AlertTriangle } from "lucide-react";

export function FarmMapClient() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
        <Alert variant="destructive">
            <AlertTriangle />
            <AlertTitle>Configuration Error</AlertTitle>
            <AlertDescription>
                Google Maps API key is missing. Please set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in your environment variables.
            </AlertDescription>
        </Alert>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Interactive Farm Map</CardTitle>
        <CardDescription>
          Visualize your farm and fertility levels. (Fertility overlay coming soon)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="aspect-video w-full rounded-lg overflow-hidden border">
          <APIProvider apiKey={apiKey}>
            <Map
              defaultCenter={{ lat: 36.7783, lng: -119.4179 }} // Default to Central Valley, CA
              defaultZoom={10}
              gestureHandling={"greedy"}
              disableDefaultUI={true}
              mapId="agrimind_map"
            />
          </APIProvider>
        </div>
      </CardContent>
    </Card>
  );
}
