import { useState, useEffect } from "react";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

const AGE_KEY = "lankalust_age_verified";
const EXPIRY_DAYS = 30;

function isVerified(): boolean {
  try {
    const stored = localStorage.getItem(AGE_KEY);
    if (!stored) return false;
    const { ts } = JSON.parse(stored);
    const elapsed = Date.now() - ts;
    return elapsed < EXPIRY_DAYS * 24 * 60 * 60 * 1000;
  } catch {
    return false;
  }
}

const AgeVerification = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!isVerified()) setShow(true);
  }, []);

  if (!show) return null;

  const handleYes = () => {
    localStorage.setItem(AGE_KEY, JSON.stringify({ ts: Date.now() }));
    setShow(false);
  };

  const handleNo = () => {
    window.location.href = "https://www.google.com";
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-xl p-8 max-w-md w-full text-center shadow-2xl">
        <ShieldAlert className="w-14 h-14 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-display font-bold text-foreground mb-2">Age Verification</h2>
        <p className="text-sm text-muted-foreground mb-1">
          This website contains adult content intended for individuals aged <strong className="text-foreground">18 years or older</strong>.
        </p>
        <p className="text-sm text-muted-foreground mb-6">
          By entering, you confirm that you are at least 18 years of age and consent to viewing adult material.
        </p>

        <div className="flex gap-3">
          <Button variant="hero" size="lg" className="flex-1 text-base" onClick={handleYes}>
            Yes, I'm 18+
          </Button>
          <Button variant="secondary" size="lg" className="flex-1 text-base" onClick={handleNo}>
            No, Leave
          </Button>
        </div>

        <p className="text-[10px] text-muted-foreground/60 mt-4">
          This verification is valid for {EXPIRY_DAYS} days.
        </p>
      </div>
    </div>
  );
};

export default AgeVerification;
