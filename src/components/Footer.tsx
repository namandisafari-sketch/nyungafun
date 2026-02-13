import { Shield } from "lucide-react";

const Footer = () => (
  <footer className="bg-primary text-primary-foreground py-8">
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-primary-foreground/20 flex items-center justify-center">
            <span className="font-display text-sm font-bold">GW</span>
          </div>
          <span className="font-display text-lg font-bold">God's Will</span>
        </div>
        <div className="flex items-center gap-1 text-sm text-primary-foreground/60">
          <Shield size={14} />
          <span>Scholarship Management System &copy; {new Date().getFullYear()}</span>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
