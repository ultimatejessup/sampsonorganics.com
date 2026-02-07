import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import produceImg from "@/assets/produce.jpg";
import { Leaf, Users, Sprout } from "lucide-react";

const pillars = [
  {
    icon: Leaf,
    title: "Sustainable Practices",
    desc: "We grow using 100% organic methods that protect and enrich our soil for generations to come.",
  },
  {
    icon: Users,
    title: "Community Access",
    desc: "Redefining delivery and access to fresh, locally grown produce for underserved communities.",
  },
  {
    icon: Sprout,
    title: "Land Ownership",
    desc: "Encouraging and supporting land ownership and cultivation as a path to generational wealth.",
  },
];

const Mission = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="mission" className="py-24 bg-background" ref={ref}>
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <p className="text-gold font-medium uppercase tracking-[0.2em] text-sm mb-4">
              Our Mission
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
              Growing Food,{" "}
              <span className="text-gradient-gold">Growing People</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-4">
              Sampson Organics is a Black-owned horticultural and farming company
              based in Michigan. We specialize in organic, sustainable practices
              that enrich our communities and promote environmental stewardship.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed">
              We are committed to redefining delivery and access to fresh, locally
              grown produce to underserved communities — because everyone deserves
              to eat well.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <img
              src={produceImg}
              alt="Fresh organic produce"
              className="rounded-sm w-full shadow-2xl"
              loading="lazy"
            />
            <div className="absolute -bottom-4 -left-4 w-24 h-24 border-2 border-gold rounded-sm" />
          </motion.div>
        </div>

        {/* Pillars */}
        <div className="grid md:grid-cols-3 gap-8">
          {pillars.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 + i * 0.15 }}
              className="bg-card p-8 rounded-sm border border-border hover:border-gold/40 transition-colors group"
            >
              <p.icon className="w-10 h-10 text-gold mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                {p.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Mission;
