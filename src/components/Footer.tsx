import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="border-t border-border bg-card/40 mt-auto">
    <div className="container py-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div>
          <h4 className="font-display font-bold text-gradient text-lg mb-3">LankaLust</h4>
          <p className="text-sm text-muted-foreground">Sri Lanka's premier adult classifieds platform.</p>
        </div>
        <div>
          <h5 className="font-semibold text-foreground mb-2 text-sm">Categories</h5>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li><Link to="/ads?cat=male" className="hover:text-primary transition-colors">Male Personals</Link></li>
            <li><Link to="/ads?cat=female" className="hover:text-primary transition-colors">Female Personals</Link></li>
            <li><Link to="/ads?cat=massage" className="hover:text-primary transition-colors">Massage</Link></li>
            <li><Link to="/ads?cat=livecam" className="hover:text-primary transition-colors">Live Cam</Link></li>
          </ul>
        </div>
        <div>
          <h5 className="font-semibold text-foreground mb-2 text-sm">More</h5>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li><Link to="/ads?cat=toys" className="hover:text-primary transition-colors">Toys</Link></li>
            <li><Link to="/ads?cat=jobs" className="hover:text-primary transition-colors">Jobs</Link></li>
            <li><Link to="/ads?cat=hotels" className="hover:text-primary transition-colors">Hotel/Rooms</Link></li>
            <li><Link to="/ads?cat=other" className="hover:text-primary transition-colors">Other</Link></li>
          </ul>
        </div>
        <div>
          <h5 className="font-semibold text-foreground mb-2 text-sm">About</h5>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
            <li><Link to="/terms" className="hover:text-primary transition-colors">Terms of Use</Link></li>
            <li><Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
          </ul>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
        <div>
          <h5 className="font-semibold text-foreground mb-2 text-sm">Features</h5>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li><Link to="/chat" className="hover:text-primary transition-colors">Chat Rooms</Link></li>
            <li><Link to="/dating" className="hover:text-primary transition-colors">Dating</Link></li>
            <li><Link to="/stories" className="hover:text-primary transition-colors">WalKatha</Link></li>
          </ul>
        </div>
        <div>
          <h5 className="font-semibold text-foreground mb-2 text-sm">Support</h5>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li><Link to="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
            <li><Link to="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
            <li><Link to="/safety" className="hover:text-primary transition-colors">Safety Tips</Link></li>
          </ul>
        </div>
      </div>
      <div className="mt-8 pt-4 border-t border-border text-center text-xs text-muted-foreground">
        © 2026 LankaLust. Adults only (18+). All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
