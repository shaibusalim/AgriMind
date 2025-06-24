import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Tractor, Wheat } from "lucide-react";

const plantingSuggestions = [
    { crop: "Corn", period: "Late April to early May", note: "Ensure soil temperature is above 10°C." },
    { crop: "Soybeans", period: "May", note: "Plant after the last frost date for your area." },
    { crop: "Winter Wheat", period: "September to October", note: "Planting before fall rains helps with germination." },
]

const harvestingTimes = [
    { crop: "Corn", period: "Late September to October", note: "Harvest when kernels are dented and dry." },
    { crop: "Soybeans", period: "Late September to November", note: "Harvest when pods are dry and rattling." },
    { crop: "Winter Wheat", period: "June to July", note: "Harvest when stalks are golden and heads are bent." },
]

export default function SeasonalPlanningPage() {
    return (
        <div className="space-y-8">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold font-headline">Seasonal Planning Assistant</h1>
                <p className="text-muted-foreground">
                    Optimal planting and harvesting times based on typical climate patterns.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Tractor className="text-primary"/> Planting Suggestions
                        </CardTitle>
                        <CardDescription>Recommended planting windows for common crops.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {plantingSuggestions.map((item, index) => (
                            <Card key={index} className="bg-secondary/50">
                                <CardContent className="p-4">
                                    <h4 className="font-semibold">{item.crop}</h4>
                                    <p className="text-primary font-medium flex items-center gap-2"><CalendarDays className="w-4 h-4" /> {item.period}</p>
                                    <p className="text-sm text-muted-foreground mt-1">{item.note}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Wheat className="text-accent"/> Harvesting Times
                        </CardTitle>
                        <CardDescription>Ideal harvesting periods to maximize yield and quality.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {harvestingTimes.map((item, index) => (
                            <Card key={index} className="bg-secondary/50">
                                <CardContent className="p-4">
                                    <h4 className="font-semibold">{item.crop}</h4>
                                    <p className="text-accent-foreground font-medium flex items-center gap-2"><CalendarDays className="w-4 h-4" /> {item.period}</p>
                                    <p className="text-sm text-muted-foreground mt-1">{item.note}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
