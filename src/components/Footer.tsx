import logo from "@/assets/logo.png";

const Footer = () => {
  return (
    <footer className="bg-primary py-12 border-t border-gold/20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Sampson Organics" className="h-10 w-10" />
            <span className="font-display text-lg font-bold text-primary-foreground">
              Sampson Organics
            </span>
          </div>

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
    </footer>
  );
};

export default Footer;
