"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  CloudDrizzle,
  CloudRain,
  Sun,
  Thermometer,
  Wind,
  Bell,
  AreaChart,
  Sprout,
  Bug,
  ChevronRight,
  Cloudy,
  Snowflake,
  CloudFog,
  Zap,
  Loader,
} from "lucide-react";
import { useState, useEffect } from "react";
import { getWeatherForecast, type GetWeatherForecastOutput } from "@/ai/flows/weather-forecast-flow";
import { Skeleton } from "@/components/ui/skeleton";

const quickLinks = [
  {
    href: "/crop-recommendation",
    label: "Get Crop Recommendation",
    icon: Sprout,
  },
  { href: "/yield-prediction", label: "Predict Crop Yield", icon: AreaChart },
  { href: "/pest-detection", label: "Detect Pests", icon: Bug },
];

const WeatherIcon = ({ condition }: { condition?: string }) => {
    if (!condition) return <Sun className="w-8 h-8 text-primary" />;
    const lowerCaseCondition = condition.toLowerCase();

    if (lowerCaseCondition.includes("sun") || lowerCaseCondition.includes("clear")) return <Sun className="w-8 h-8 text-primary" />;
    if (lowerCaseCondition.includes("cloud")) return <Cloudy className="w-8 h-8 text-muted-foreground" />;
    if (lowerCaseCondition.includes("rain")) return <CloudRain className="w-8 h-8 text-blue-500" />;
    if (lowerCaseCondition.includes("storm")) return <Zap className="w-8 h-8 text-destructive" />;
    if (lowerCaseCondition.includes("snow")) return <Snowflake className="w-8 h-8 text-blue-300" />;
    if (lowerCaseCondition.includes("fog")) return <CloudFog className="w-8 h-8 text-muted-foreground" />;
    if (lowerCaseCondition.includes("wind")) return <Wind className="w-8 h-8 text-muted-foreground" />;
    return <Sun className="w-8 h-8 text-primary" />;
}

export default function DashboardPage() {
    const [weather, setWeather] = useState<GetWeatherForecastOutput | null>(null);
    const [weatherLoading, setWeatherLoading] = useState(true);
    const [weatherError, setWeatherError] = useState<string | null>(null);
    const [locationName, setLocationName] = useState("your location...");

    useEffect(() => {
        const fetchWeatherData = async (location: string, displayLocation?: string) => {
            try {
                // Don't set loading to true if we are just falling back
                if(!weather) setWeatherLoading(true);

                const forecast = await getWeatherForecast({ location });
                setWeather(forecast);
                setLocationName(displayLocation || location.split(',').slice(0, 2).join(', '));
            } catch (error) {
                setWeatherError("Could not fetch weather data.");
                console.error(error);
            } finally {
                setWeatherLoading(false);
            }
        };

        const getAndFetchWeather = () => {
            if (!navigator.geolocation) {
                setWeatherError("Geolocation is not supported. Showing default.");
                fetchWeatherData("Central Valley, California", "Central Valley, CA");
                return;
            }
            
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

                    if (!apiKey) {
                        console.warn("Google Maps API key is missing. Using coordinates for forecast.");
                        // The AI can often infer location from lat/long string
                        fetchWeatherData(`lat ${latitude}, long ${longitude}`, "Your Location");
                        return;
                    }
                    
                    try {
                        const geoResponse = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`);
                        const geoData = await geoResponse.json();
                        if (geoData.results && geoData.results.length > 0) {
                            const addressComponents = geoData.results[0].address_components;
                            const city = addressComponents.find(c => c.types.includes("locality"))?.long_name;
                            const country = addressComponents.find(c => c.types.includes("country"))?.long_name;
                            
                            // Construct the location name, e.g., "Tamale, Ghana"
                            const displayLocation = (city && country) ? `${city}, ${country}` : geoData.results[0].formatted_address;
                            
                            // Pass the location to the weather AI
                            fetchWeatherData(displayLocation, displayLocation);
                        } else {
                           throw new Error("No location found for coordinates.");
                        }
                    } catch (e) {
                        console.error("Reverse geocoding failed:", e);
                        setWeatherError("Could not determine city name. Using coordinates.");
                        fetchWeatherData(`lat ${latitude}, long ${longitude}`, "Your Location");
                    }
                },
                (error) => {
                    console.error("Geolocation error:", error.message);
                    setWeatherError("Could not get location. Showing default forecast.");
                    fetchWeatherData("Central Valley, California", "Central Valley, CA");
                }
            );
        };

        getAndFetchWeather();
    }, []);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold font-headline">Welcome Back, Farmer!</h1>
        <p className="text-muted-foreground">
          Here's a snapshot of your farm's status and helpful tools.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Jump right into your most-used features.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {quickLinks.map((link) => (
                <Link href={link.href} key={link.href} className="block group">
                  <Card className="hover:border-primary/80 hover:bg-secondary transition-colors">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="bg-primary/10 p-3 rounded-md">
                          <link.icon className="w-6 h-6 text-primary" />
                        </div>
                        <span className="font-semibold">{link.label}</span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Weather Forecast</CardTitle>
            <CardDescription>Next 24 hours in {locationName}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {weatherLoading ? (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Skeleton className="w-8 h-8 rounded-full" />
                            <div>
                                <Skeleton className="h-5 w-20" />
                                <Skeleton className="h-4 w-24 mt-1" />
                            </div>
                        </div>
                        <Skeleton className="h-8 w-16" />
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <Skeleton className="h-5 w-full" />
                        <Skeleton className="h-5 w-full" />
                        <Skeleton className="h-5 w-full" />
                        <Skeleton className="h-5 w-full" />
                    </div>
                </div>
            ) : weatherError && !weather ? (
                <Alert variant="destructive">
                  <AlertDescription>{weatherError}</AlertDescription>
                </Alert>
            ) : weather ? (
                <>
                    {weatherError && <Alert variant="destructive" className="mb-4"><AlertDescription>{weatherError}</AlertDescription></Alert>}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <WeatherIcon condition={weather.condition} />
                        <div>
                          <p className="font-semibold">{weather.condition}</p>
                          <p className="text-sm text-muted-foreground">Clear skies</p>
                        </div>
                      </div>
                      <p className="text-2xl font-bold">{weather.temperature}°C</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <CloudRain className="w-5 h-5 text-muted-foreground" />
                        <span>Precip: {weather.precipitationChance}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Wind className="w-5 h-5 text-muted-foreground" />
                        <span>Wind: {weather.windSpeed} km/h</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Thermometer className="w-5 h-5 text-muted-foreground" />
                        <span>Feels like: {weather.feelsLike}°C</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CloudDrizzle className="w-5 h-5 text-muted-foreground" />
                        <span>Humidity: {weather.humidity}%</span>
                      </div>
                    </div>
                </>
            ) : null}
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-2xl font-bold font-headline mb-4">
          Prevention Alerts
        </h2>
        <div className="space-y-4">
          <Alert>
            <Bell className="h-4 w-4" />
            <AlertTitle>Low Nitrogen Levels Detected</AlertTitle>
            <AlertDescription>
              Area B of your farm shows low nitrogen. Consider applying a
              nitrogen-rich fertilizer.
            </AlertDescription>
          </Alert>
          <Alert variant="destructive">
            <Bug className="h-4 w-4" />
            <AlertTitle>Potential Aphid Infestation</AlertTitle>
            <AlertDescription>
              High probability of aphid activity in the north-east corner.
              Scout the area and prepare for treatment.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
}
