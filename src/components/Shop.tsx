import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { ShoppingBag, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import sampsonTshirtImg from "@/assets/sampson-tshirt.png";
import jadePlant1 from "@/assets/jade-plant-1.jpeg";
import jadePlant2 from "@/assets/jade-plant-2.jpeg";

const products = [
  {
    name: "Sampson Organics T-Shirt",
    price: "$25.00",
    priceId: "price_1SyyKlK1wvlIdw9tWj07B8kp",
    description: "Soft, premium tee with embroidered logo. Wear the mission.",
    images: [sampsonTshirtImg],
  },
  {
    name: "Sampson Organics Hoodie",
    price: "$45.00",
    priceId: "price_1SyyLNK1wvlIdw9tNqDw2gbY",
    description: "Cozy pullover hoodie with front logo print. Stay warm, stay rooted.",
    images: [],
    emoji: "🧥",
  },
  {
    name: "Jade Plant",
    price: "$34.99",
    priceId: "price_1TaQciK1wvlIdw9tmeQDQZQK",
    description: "Beautiful, low-maintenance jade plant. A symbol of prosperity and growth.",
    images: [jadePlant2, jadePlant1],
  },
];

const Shop = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [loading, setLoading] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState<Record<string, number>>({});

  const handleCheckout = async (priceId: string) => {
    if (!priceId) {
      toast({
        title: "Coming soon",
        description: "This product will be available for purchase soon!",
      });
      return;
    }
    setLoading(priceId);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { priceId },
      });

      if (error) throw error;
      if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch (err: any) {
      toast({
        title: "Checkout error",
        description: err.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  const getCurrentImage = (productName: string) => {
    return activeImage[productName] || 0;
  };

  return (
    <section id="shop" className="py-24 bg-card" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <p className="text-gold font-medium uppercase tracking-[0.2em] text-sm mb-4">Sampson's Market</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
            Genuine.<span className="text-gradient-gold">Organic</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Every purchase supports our mission to bring sustainable agriculture to underserved communities. Build the
            movement purchase our branded gear, plants and more.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {products.map((product, i) => (
            <motion.div
              key={product.name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.15 }}
              className="bg-background border border-border rounded-sm p-6 text-center flex flex-col items-center"
            >
              {product.images && product.images.length > 0 ? (
                <div className="w-full mb-5">
                  <div className="aspect-square overflow-hidden rounded-sm mb-2">
                    <img
                      src={product.images[getCurrentImage(product.name)]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  {product.images.length > 1 && (
                    <div className="flex gap-2 justify-center">
                      {product.images.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveImage((prev) => ({ ...prev, [product.name]: idx }))}
                          className={`w-12 h-12 rounded-sm overflow-hidden border-2 transition-colors ${
                            getCurrentImage(product.name) === idx ? "border-gold" : "border-border hover:border-gold/50"
                          }`}
                        >
                          <img src={img} alt="" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : product.emoji ? (
                <div className="text-6xl mb-5">{product.emoji}</div>
              ) : null}
              <h3 className="font-display text-xl font-bold text-foreground mb-1">{product.name}</h3>
              <p className="text-gold font-semibold text-lg mb-3">{product.price}</p>
              <p className="text-muted-foreground text-sm mb-6 leading-relaxed">{product.description}</p>
              <button
                onClick={() => handleCheckout(product.priceId)}
                disabled={loading === product.priceId}
                className="mt-auto inline-flex items-center gap-2 px-6 py-3 bg-gold text-gold-foreground font-semibold rounded-sm uppercase tracking-widest text-xs hover:brightness-110 transition-all disabled:opacity-60"
              >
                {loading === product.priceId ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <ShoppingBag className="w-4 h-4" />
                )}
                {product.priceId ? "Buy Now" : "Coming Soon"}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Shop;
