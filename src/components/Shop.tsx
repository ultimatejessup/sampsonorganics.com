import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ShoppingBag } from "lucide-react";
import logo from "@/assets/logo.png";

const Shop = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="shop" className="py-24 bg-card" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center max-w-2xl mx-auto"
        >
          <p className="text-gold font-medium uppercase tracking-[0.2em] text-sm mb-4">
            Merch Store
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
            Wear the <span className="text-gradient-gold">Movement</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-10 leading-relaxed">
            Rep Sampson Organics with our branded merchandise. Every purchase
            supports our mission to bring sustainable agriculture to underserved
            communities.
          </p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative inline-block mb-10"
          >
            <div className="w-48 h-48 mx-auto bg-primary rounded-full flex items-center justify-center shadow-2xl border-4 border-gold/30">
              <img src={logo} alt="Sampson Organics Logo" className="w-32 h-32" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5 }}
          >
            <a
              href="#contact"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gold text-gold-foreground font-semibold rounded-sm uppercase tracking-widest text-sm hover:brightness-110 transition-all"
            >
              <ShoppingBag className="w-5 h-5" />
              Coming Soon
            </a>
            <p className="text-muted-foreground text-sm mt-4">
              Our online store is launching soon. Stay tuned!
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Shop;
