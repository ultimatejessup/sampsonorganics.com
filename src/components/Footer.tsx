import { useState } from "react";
import { Mail, Phone } from "lucide-react";
import logo from "@/assets/logo.png";
import NewsletterModal from "./NewsletterModal";

const Footer = () => {
  const [showNewsletter, setShowNewsletter] = useState(false);

  return (
    <footer className="bg-primary py-16 border-t border-gold/20">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img src={logo} alt="Sampson Organics" className="h-10 w-10" />
              <span className="font-display text-lg font-bold text-primary-foreground">
                Sampson Organics
              </span>
            </div>
            <p className="text-primary-foreground/60 text-sm leading-relaxed">
              Rooted in community. Growing a healthier future through sustainable, organic farming in Michigan.
            </p>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-display text-sm font-bold text-primary-foreground uppercase tracking-wider">
              Contact
            </h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gold shrink-0" />
                <span className="text-primary-foreground/60 text-sm">
                  PO Box 6613, Detroit, Michigan 48203
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gold shrink-0" />
                <a href="tel:3134511274" className="text-primary-foreground/60 text-sm hover:text-gold transition-colors">
                  313-451-1274
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gold shrink-0" />
                <a href="mailto:info@sampsonorganics.com" className="text-primary-foreground/60 text-sm hover:text-gold transition-colors">
                  info@sampsonorganics.com
                </a>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="font-display text-sm font-bold text-primary-foreground uppercase tracking-wider">
              Stay Connected
            </h4>
            <p className="text-primary-foreground/60 text-sm leading-relaxed">
              Subscribe to our newsletter for updates on organic farming, new products, and community events.
            </p>
            <button
              onClick={() => setShowNewsletter(true)}
              className="px-6 py-3 bg-gold text-gold-foreground font-semibold rounded-sm uppercase tracking-widest text-xs hover:brightness-110 transition-all"
            >
              Subscribe
            </button>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-primary-foreground/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex gap-8">
            {["Mission", "Services", "Shop", "Contact"].map((l) => (
              <a
                key={l}
                href={`#${l.toLowerCase()}`}
                className="text-primary-foreground/60 hover:text-gold transition-colors text-sm uppercase tracking-wider"
              >
                {l}
              </a>
            ))}
          </div>
          <p className="text-primary-foreground/40 text-sm">
            © {new Date().getFullYear()} Sampson Organics. All rights reserved.
          </p>
        </div>
      </div>

      <NewsletterModal open={showNewsletter} onClose={() => setShowNewsletter(false)} />
    </footer>
  );
};

export default Footer;
