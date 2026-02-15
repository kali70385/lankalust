import { useState, useEffect, useRef, useCallback } from "react";
import { getSingleCode, AD_SPACES_CHANGED } from "@/data/adSpacesStore";
import { X } from "lucide-react";

const SlidingAdSpace = () => {
  const [code, setCode] = useState(() => getSingleCode("sliding-bottom"));
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Re-read code when ad spaces change
  const refresh = useCallback(() => {
    const newCode = getSingleCode("sliding-bottom");
    setCode(newCode);
    // If code just appeared and not dismissed, restart the show timer
    if (newCode && !dismissed) setVisible(false);
  }, [dismissed]);

  useEffect(() => {
    window.addEventListener(AD_SPACES_CHANGED, refresh);
    return () => window.removeEventListener(AD_SPACES_CHANGED, refresh);
  }, [refresh]);

  // Show after a short delay when code is available
  useEffect(() => {
    if (!code || dismissed || visible) return;
    const timer = setTimeout(() => setVisible(true), 2000);
    return () => clearTimeout(timer);
  }, [code, dismissed, visible]);

  // Inject HTML
  useEffect(() => {
    if (!code || !containerRef.current || !visible) return;
    const el = containerRef.current;
    el.innerHTML = code;
    const scripts = el.querySelectorAll("script");
    scripts.forEach((oldScript) => {
      const newScript = document.createElement("script");
      Array.from(oldScript.attributes).forEach((attr) =>
        newScript.setAttribute(attr.name, attr.value)
      );
      newScript.textContent = oldScript.textContent;
      oldScript.parentNode?.replaceChild(newScript, oldScript);
    });
  }, [code, visible]);

  if (!code || dismissed) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-[60] bg-card/95 backdrop-blur border-t border-border shadow-lg transition-transform duration-500 ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="container relative flex items-center justify-center py-2">
        <button
          onClick={() => {
            setVisible(false);
            setDismissed(true);
          }}
          className="absolute top-1 right-2 w-6 h-6 rounded-full bg-secondary/80 flex items-center justify-center hover:bg-destructive/20 transition-colors z-10"
          aria-label="Dismiss ad"
        >
          <X className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
        <div ref={containerRef} className="ad-space-sliding-bottom" />
      </div>
    </div>
  );
};

export default SlidingAdSpace;
