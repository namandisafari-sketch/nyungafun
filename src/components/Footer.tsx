import { Shield } from "lucide-react";
import nyungaLogo from "@/assets/nyunga-logo.png";
import kabejjaLogo from "@/assets/kabejja-logo.png";

const TikTokIcon = ({ size = 20, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.73a8.19 8.19 0 004.76 1.52V6.8a4.84 4.84 0 01-1-.11z" />
  </svg>
);

const Footer = () => (
  <footer className="bg-primary text-primary-foreground py-8">
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img src={nyungaLogo} alt="Nyunga Foundation" className="h-10 w-10 object-contain" />
          <div className="leading-tight">
            <span className="font-display text-lg font-bold block">Nyunga Foundation</span>
            <span className="text-xs text-primary-foreground/60 italic">"Still there's Hope"</span>
          </div>
        </div>

        {/* Social Media */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-primary-foreground/70">Follow us:</span>
          <a
            href="https://www.tiktok.com/@nyungafoundation.ug?lang=en"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-primary-foreground/10 hover:bg-primary-foreground/20 px-3 py-1.5 rounded-full transition-colors"
          >
            <TikTokIcon size={16} />
            <span className="text-sm font-medium">TikTok</span>
          </a>
        </div>

        <div className="flex items-center gap-1 text-sm text-primary-foreground/60">
          <Shield size={14} />
          <span>&copy; {new Date().getFullYear()} Nyunga Foundation. All rights reserved.</span>
        </div>
      </div>
      <div className="mt-6 pt-4 border-t border-primary-foreground/10 flex flex-col sm:flex-row items-center justify-center gap-3 text-xs text-primary-foreground/50">
        <img src={kabejjaLogo} alt="Kabejja Systems" className="h-8 w-8 rounded object-contain" />
        <span className="text-center">
          System developed &amp; protected by <strong className="text-primary-foreground/70">Kabejja Systems</strong>. Contact{" "}
          <a href="tel:+256745368426" className="text-primary-foreground/70 underline">+256745368426</a> or visit{" "}
          <a href="https://www.kabejjasystems.store" target="_blank" rel="noopener noreferrer" className="text-primary-foreground/70 underline">www.kabejjasystems.store</a>
        </span>
      </div>
    </div>
  </footer>
);

export default Footer;
