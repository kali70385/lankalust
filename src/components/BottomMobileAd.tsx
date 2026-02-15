import { useEffect, useRef, useState, useCallback } from "react";
import { getSingleCode, AD_SPACES_CHANGED } from "@/data/adSpacesStore";

const BottomMobileAd = () => {
  const [code, setCode] = useState(() => getSingleCode("bottom-mobile"));
  const containerRef = useRef<HTMLDivElement>(null);

  const refresh = useCallback(() => setCode(getSingleCode("bottom-mobile")), []);

  useEffect(() => {
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
    <div className="w-full md:hidden bg-card border-t border-border flex justify-center py-2 px-2">
      <div ref={containerRef} className="ad-space-bottom-mobile" />
    </div>
  );
};

export default BottomMobileAd;
