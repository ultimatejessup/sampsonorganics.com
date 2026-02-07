import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import landscapingImg from "@/assets/landscaping.jpg";
import { Flower2, TreePine, Shovel } from "lucide-react";

const services = [
  {
    icon: Flower2,
    title: "Garden Design",
    desc: "Custom organic garden layouts tailored to your space, climate, and goals.",
  },
  {
    icon: TreePine,
    title: "Landscape Consultation",
    desc: "Private consultations for sustainable landscaping that thrives naturally.",
  },
  {
    icon: Shovel,
    title: "Soil & Land Prep",
    desc: "Soil analysis, composting guidance, and land preparation for productive growing.",
  },
];

const Services = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="services" className="py-24 bg-primary" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <p className="text-gold font-medium uppercase tracking-[0.2em] text-sm mb-4">
            What We Offer
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            Consultation Services
          </h2>
          <p className="text-primary-foreground/70 max-w-xl mx-auto text-lg">
            Private, expert guidance for select landscaping and gardening projects.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            {services.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, x: -30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.15 }}
                className="flex gap-5 p-6 rounded-sm bg-primary-foreground/5 border border-gold/10 hover:border-gold/30 transition-colors"
              >
                <s.icon className="w-10 h-10 text-gold shrink-0 mt-1" />
                <div>
                  <h3 className="font-display text-xl font-semibold text-primary-foreground mb-2">
                    {s.title}
                  </h3>
                  <p className="text-primary-foreground/60 leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </motion.div>
            ))}

            <motion.a
              href="#contact"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.8 }}
              className="inline-block mt-4 px-8 py-4 bg-gold text-gold-foreground font-semibold rounded-sm uppercase tracking-widest text-sm hover:brightness-110 transition-all"
            >
              Book a Consultation
            </motion.a>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <img
              src={landscapingImg}
              alt="Landscape garden design"
              className="rounded-sm shadow-2xl w-full"
              loading="lazy"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Services;
