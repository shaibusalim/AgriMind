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
} from "lucide-react";

const quickLinks = [
  {
    href: "/crop-recommendation",
    label: "Get Crop Recommendation",
    icon: Sprout,
  },
  { href: "/yield-prediction", label: "Predict Crop Yield", icon: AreaChart },
  { href: "/pest-detection", label: "Detect Pests", icon: Bug },
];

export default function DashboardPage() {
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
            <CardDescription>Next 24 hours</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sun className="w-8 h-8 text-accent" />
                <div>
                  <p className="font-semibold">Sunny</p>
                  <p className="text-sm text-muted-foreground">Clear skies</p>
                </div>
              </div>
              <p className="text-2xl font-bold">28°C</p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <CloudRain className="w-5 h-5 text-muted-foreground" />
                <span>Precipitation: 5%</span>
              </div>
              <div className="flex items-center gap-2">
                <Wind className="w-5 h-5 text-muted-foreground" />
                <span>Wind: 12 km/h</span>
              </div>
              <div className="flex items-center gap-2">
                <Thermometer className="w-5 h-5 text-muted-foreground" />
                <span>Feels like: 30°C</span>
              </div>
              <div className="flex items-center gap-2">
                <CloudDrizzle className="w-5 h-5 text-muted-foreground" />
                <span>Humidity: 65%</span>
              </div>
            </div>
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
