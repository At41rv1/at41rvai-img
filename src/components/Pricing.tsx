
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function Pricing() {
    const { user } = useAuth();

    const pricingTiers = user ?
    [
        {
            name: "Basic",
            price: "Free",
            features: [
                "1 free image generation",
                "Access to At41rv Pro model",
                "Community gallery access",
            ],
            cta: "Upgraded",
            isCurrent: false,
        },
        {
            name: "Ultimate",
            price: "Included",
            features: [
                "Unlimited image generations",
                "Access to At41rv Pro model",
                "Access to At41rv Ultimate model",
                "Priority support",
            ],
            cta: "Your Current Plan",
            isCurrent: true,
        },
    ] :
    [
        {
            name: "Basic",
            price: "Free",
            features: [
                "1 free image generation",
                "Access to At41rv Pro model",
                "Community gallery access",
            ],
            cta: "Your Current Plan",
            isCurrent: true,
        },
        {
            name: "Ultimate",
            price: "Free",
            features: [
                "Unlimited image generations",
                "Access to At41rv Pro model",
                "Access to At41rv Ultimate model",
                "Priority support",
            ],
            cta: "Login to Get Ultimate",
            isCurrent: false,
        },
    ];

    return (
        <div id="pricing" className="py-16 md:py-24">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-5xl font-bold text-foreground">Pricing Plans</h2>
                <p className="text-lg md:text-xl text-muted-foreground mt-2">
                    Login to get the Ultimate plan for free.
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {pricingTiers.map((tier) => (
                    <Card key={tier.name} className={`flex flex-col ${tier.isCurrent ? 'border-primary' : ''}`}>
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold">{tier.name}</CardTitle>
                            <CardDescription className="text-4xl font-extrabold">{tier.price}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <ul className="space-y-3">
                                {tier.features.map((feature) => (
                                    <li key={feature} className="flex items-center gap-2">
                                        <Check className="h-5 w-5 text-primary" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                        <CardFooter>
                           <Button 
                                disabled={tier.isCurrent || tier.name === 'Basic'}
                                variant={tier.isCurrent ? "outline" : "default"} 
                                className="w-full h-11 text-lg" 
                                size="lg"
                            >
                                {tier.cta}
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
             <p className="text-center text-muted-foreground mt-8">
                It's simple: log in and unlock everything for free.
            </p>
        </div>
    );
}
