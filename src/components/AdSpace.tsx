import { useEffect, useRef, useState, useCallback } from "react";
import { getSingleCode, getRotatingCode, AD_SPACES_CHANGED } from "@/data/adSpacesStore";

// ─── Single Ad Space ─────────────────────────────────────────────
interface AdSpaceProps {
  slotKey: string;
  className?: string;
}

export const AdSpace = ({ slotKey, className = "" }: AdSpaceProps) => {
  const [code, setCode] = useState(() => getSingleCode(slotKey));
  const containerRef = useRef<HTMLDivElement>(null);

  // Re-read code whenever ad spaces change or on route navigation
  const refresh = useCallback(() => setCode(getSingleCode(slotKey)), [slotKey]);

  useEffect(() => {
    refresh();
    window.addEventListener(AD_SPACES_CHANGED, refresh);
    return () => window.removeEventListener(AD_SPACES_CHANGED, refresh);
  }, [refresh]);

  // Inject HTML
  useEffect(() => {
    if (!code || !containerRef.current) return;
    const el = containerRef.current;
    el.innerHTML = code;
    // Execute any <script> tags injected
    const scripts = el.querySelectorAll("script");
    scripts.forEach((oldScript) => {
      const newScript = document.createElement("script");
      Array.from(oldScript.attributes).forEach((attr) =>
        newScript.setAttribute(attr.name, attr.value)
      );
      newScript.textContent = oldScript.textContent;
      oldScript.parentNode?.replaceChild(newScript, oldScript);
    });
  }, [code]);

  if (!code) return null;

  return (
    <div
      ref={containerRef}
      className={`ad-space ad-space-${slotKey} ${className}`}
      data-ad-slot={slotKey}
    />
  );
};

// ─── Rotating Ad Space ───────────────────────────────────────────
interface RotatingAdSpaceProps {
  slotKey: string;
  index: number;
  className?: string;
}

export const RotatingAdSpace = ({ slotKey, index, className = "" }: RotatingAdSpaceProps) => {
  const [code, setCode] = useState(() => getRotatingCode(slotKey, index));
  const containerRef = useRef<HTMLDivElement>(null);

  const refresh = useCallback(() => setCode(getRotatingCode(slotKey, index)), [slotKey, index]);

  useEffect(() => {
    refresh();
    window.addEventListener(AD_SPACES_CHANGED, refresh);
    return () => window.removeEventListener(AD_SPACES_CHANGED, refresh);
  }, [refresh]);

  useEffect(() => {
    if (!code || !containerRef.current) return;
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
  }, [code]);

  if (!code) return null;

  return (
    <div
      ref={containerRef}
      className={`ad-space ad-space-${slotKey} ${className}`}
      data-ad-slot={slotKey}
      data-ad-index={index}
    />
  );
};
