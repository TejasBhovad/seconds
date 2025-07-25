"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Users, Sparkles, ArrowRight, X, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";
export default function FirstTimeLanding({ onClose }) {
  const router = useRouter();
  const handleGetStarted = () => {
    router.push("/dashboard");
    localStorage.setItem("hasVisited", "true");
    onClose();
  };

  const handleDismiss = () => {
    localStorage.setItem("hasVisited", "true");
    onClose();
  };

  return (
    <div className="animate-fade-in mb-6">
      <Card className="border-primary/20 from-background via-primary/5 to-accent/10 relative overflow-hidden bg-gradient-to-r">
        <CardContent className="p-6">
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground absolute top-2 right-2 h-8 w-8"
            onClick={handleDismiss}
          >
            <X className="h-4 w-4" />
          </Button>

          <div className="pr-10">
            <div className="mb-4 flex items-center gap-2">
              <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full">
                <Sparkles className="text-primary h-4 w-4" />
              </div>
              <span className="text-primary text-sm font-medium">
                Welcome to EventCountdown
              </span>
            </div>

            <div className="mb-4">
              <h2 className="text-foreground mb-2 text-xl font-bold tracking-tight">
                Create Exciting Countdown Timers for Your Events
              </h2>
              <p className="text-muted-foreground text-sm">
                Build anticipation with beautiful countdowns, track RSVPs, and
                make every event memorable. Perfect for parties, launches,
                meetings, and special occasions.
              </p>
            </div>

            <div className="mb-4 flex flex-wrap gap-4 text-xs">
              <div className="text-muted-foreground flex items-center gap-1.5">
                <Calendar className="text-primary h-3 w-3" />
                <span>Schedule Events</span>
              </div>
              <div className="text-muted-foreground flex items-center gap-1.5">
                <Clock className="text-accent h-3 w-3" />
                <span>Live Countdowns</span>
              </div>
              <div className="text-muted-foreground flex items-center gap-1.5">
                <Users className="text-primary h-3 w-3" />
                <span>RSVP Tracking</span>
              </div>
              <div className="text-muted-foreground flex items-center gap-1.5">
                <Sparkles className="text-accent h-3 w-3" />
                <span>Custom Themes</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                onClick={handleGetStarted}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                size="sm"
              >
                Get Started
                <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                onClick={handleDismiss}
                size="sm"
                className="text-muted-foreground hover:text-foreground"
              >
                Maybe Later
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
