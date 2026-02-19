import { useState } from "react";
import { X, Loader2, Mail, Smartphone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface NewsletterModalProps {
  open: boolean;
  onClose: () => void;
}

const NewsletterModal = ({ open, onClose }: NewsletterModalProps) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [emailOptIn, setEmailOptIn] = useState(true);
  const [smsOptIn, setSmsOptIn] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!emailOptIn && !smsOptIn) {
      toast({
        title: "Please select at least one",
        description: "Choose email or mobile notifications to subscribe.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = (formData.get("name") as string).trim();
    const email = (formData.get("email") as string).trim();
    const phone = smsOptIn ? (formData.get("phone") as string)?.trim() : undefined;

    try {
      const { error } = await supabase.functions.invoke("mailchimp-subscribe", {
        body: { name, email, phone, emailOptIn, smsOptIn },
      });

      if (error) throw error;
      setSuccess(true);
    } catch (err: any) {
      toast({
        title: "Something went wrong",
        description: err.message || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSuccess(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-card border border-gold/30 rounded-sm p-8 max-w-md w-full relative"
          >
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {success ? (
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-7 h-7 text-gold" />
                </div>
                <h3 className="font-display text-2xl font-bold text-foreground mb-2">
                  You're Subscribed!
                </h3>
                <p className="text-muted-foreground">
                  Welcome to the Sampson Organics community.
                </p>
              </div>
            ) : (
              <>
                <h3 className="font-display text-2xl font-bold text-foreground mb-2">
                  Join Our Newsletter
                </h3>
                <p className="text-muted-foreground text-sm mb-6">
                  Stay updated on organic farming, new products, and community events.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Your Name"
                    className="w-full px-4 py-3 bg-background border border-border rounded-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold transition-colors"
                  />
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="Your Email"
                    className="w-full px-4 py-3 bg-background border border-border rounded-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold transition-colors"
                  />

                  {/* Opt-in checkboxes */}
                  <div className="space-y-3 py-2">
                    <p className="text-sm font-semibold text-foreground">I'd like to receive updates via:</p>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-5 h-5 border-2 rounded-sm flex items-center justify-center transition-colors ${emailOptIn ? "bg-gold border-gold" : "border-border group-hover:border-gold/50"}`}>
                        {emailOptIn && <span className="text-gold-foreground text-xs font-bold">✓</span>}
                      </div>
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-foreground">Email</span>
                      <input type="checkbox" className="sr-only" checked={emailOptIn} onChange={(e) => setEmailOptIn(e.target.checked)} />
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-5 h-5 border-2 rounded-sm flex items-center justify-center transition-colors ${smsOptIn ? "bg-gold border-gold" : "border-border group-hover:border-gold/50"}`}>
                        {smsOptIn && <span className="text-gold-foreground text-xs font-bold">✓</span>}
                      </div>
                      <Smartphone className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-foreground">Mobile / SMS</span>
                      <input type="checkbox" className="sr-only" checked={smsOptIn} onChange={(e) => setSmsOptIn(e.target.checked)} />
                    </label>
                  </div>

                  {smsOptIn && (
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="Phone Number"
                      className="w-full px-4 py-3 bg-background border border-border rounded-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold transition-colors"
                    />
                  )}

                  <p className="text-xs text-muted-foreground">
                    By subscribing, you agree to receive communications from Sampson Organics. You can unsubscribe at any time.
                  </p>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-8 py-4 bg-gold text-gold-foreground font-semibold rounded-sm uppercase tracking-widest text-sm hover:brightness-110 transition-all disabled:opacity-50"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Subscribing...
                      </span>
                    ) : (
                      "Subscribe"
                    )}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NewsletterModal;
