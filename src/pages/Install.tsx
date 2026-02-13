import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useInstallPrompt, useIsPWA } from "@/hooks/usePWA";
import { Download, Smartphone, CheckCircle, Share } from "lucide-react";
import logo from "@/assets/nyunga-logo.png";

const Install = () => {
  const { canInstall, install } = useInstallPrompt();
  const isPWA = useIsPWA();

  if (isPWA) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <Card className="max-w-sm w-full">
          <CardContent className="py-10 text-center space-y-4">
            <CheckCircle size={48} className="mx-auto text-accent" />
            <h1 className="font-display text-xl font-bold text-primary">App Installed!</h1>
            <p className="text-sm text-muted-foreground">
              You're already using the Nyunga Foundation app. Enjoy the mobile experience!
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-10">
      <Card className="max-w-sm w-full">
        <CardContent className="py-8 space-y-6">
          <div className="text-center space-y-3">
            <img src={logo} alt="Nyunga Foundation" className="h-16 w-auto mx-auto" />
            <h1 className="font-display text-2xl font-bold text-primary">Install Nyunga App</h1>
            <p className="text-sm text-muted-foreground">
              Get the full mobile app experience — faster access, offline support, and a dedicated app feel.
            </p>
          </div>

          {canInstall ? (
            <Button
              onClick={install}
              className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 gap-2 h-12 text-base"
            >
              <Download size={20} /> Install App
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <Smartphone size={20} className="text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">On iPhone / Safari</p>
                    <p className="text-xs text-muted-foreground">
                      Tap <Share size={12} className="inline" /> Share → "Add to Home Screen"
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Smartphone size={20} className="text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">On Android / Chrome</p>
                    <p className="text-xs text-muted-foreground">
                      Tap ⋮ Menu → "Install App" or "Add to Home Screen"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Install;
