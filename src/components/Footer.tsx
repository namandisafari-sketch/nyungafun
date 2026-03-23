import { Shield } from "lucide-react";
import nyungaLogo from "@/assets/nyunga-logo.png";
import kabejjaLogo from "@/assets/kabejja-logo.png";

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
