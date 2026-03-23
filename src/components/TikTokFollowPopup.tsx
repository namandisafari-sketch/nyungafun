import { useState, useEffect } from "react";
import { X } from "lucide-react";

const TikTokIcon = ({ size = 20, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.73a8.19 8.19 0 004.76 1.52V6.8a4.84 4.84 0 01-1-.11z" />
  </svg>
);

const TikTokFollowPopup = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem("tiktok_popup_dismissed");
    if (dismissed) return;
    const timer = setTimeout(() => setVisible(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    setVisible(false);
    sessionStorage.setItem("tiktok_popup_dismissed", "1");
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fade-in max-w-xs">
      <div className="bg-card border border-border rounded-xl shadow-xl p-5 relative">
        <button onClick={dismiss} className="absolute top-2 right-2 p-1 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
          <X size={16} />
        </button>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0">
            <TikTokIcon size={20} className="text-primary-foreground" />
          </div>
          <div>
            <p className="font-display font-bold text-sm text-foreground">Follow us on TikTok!</p>
            <p className="text-xs text-muted-foreground">@nyungafoundation.ug</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
          Stay updated with our latest stories, events, and student success journeys.
        </p>
        <a
          href="https://www.tiktok.com/@nyungafoundation.ug?lang=en"
          target="_blank"
          rel="noopener noreferrer"
          onClick={dismiss}
          className="flex items-center justify-center gap-2 w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-sm px-4 py-2.5 rounded-lg transition-colors"
        >
          <TikTokIcon size={16} />
          Follow on TikTok
        </a>
      </div>
    </div>
  );
};

export default TikTokFollowPopup;
