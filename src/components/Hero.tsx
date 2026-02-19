import { motion } from "framer-motion";
import { useState } from "react";
import heroImg from "@/assets/hero-farm.jpg";
import NewsletterModal from "./NewsletterModal";

const Hero = () => {
  const [showNewsletter, setShowNewsletter] = useState(false);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={heroImg}
          alt="Organic farm rows at golden hour"
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-primary/70" />
      </div>

      <div className="relative z-10 container mx-auto px-4 text-center py-32">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="text-gold font-medium uppercase tracking-[0.3em] text-sm mb-6"
        >
          Black-Owned · Michigan · Organic
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-primary-foreground leading-tight mb-6"
        >
          Rooted in
          <br />
          <span className="text-gradient-gold">Community</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7 }}
          className="text-primary-foreground/80 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-light leading-relaxed"
        >
          Enriching communities through organic, sustainable farming.
          We champion land ownership, environmental stewardship, and
          access to fresh produce for all.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.7 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a
            href="#mission"
            className="inline-block px-8 py-4 bg-gold text-gold-foreground font-semibold rounded-sm uppercase tracking-widest text-sm hover:brightness-110 transition-all"
          >
            Our Mission
          </a>
          <button
            onClick={() => setShowNewsletter(true)}
            className="inline-block px-8 py-4 border-2 border-gold text-gold font-semibold rounded-sm uppercase tracking-widest text-sm hover:bg-gold hover:text-gold-foreground transition-all"
          >
            Get in Touch
          </button>
        </motion.div>

        <NewsletterModal open={showNewsletter} onClose={() => setShowNewsletter(false)} />
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-gold/50 rounded-full flex justify-center pt-2">
          <div className="w-1 h-3 bg-gold/70 rounded-full" />
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
