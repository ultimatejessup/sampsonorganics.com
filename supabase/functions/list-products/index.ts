import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    const prices = await stripe.prices.list({
      active: true,
      limit: 100,
      expand: ["data.product"],
    });

    const products = prices.data
      .filter((p) => {
        const prod = p.product as Stripe.Product;
        return prod && !prod.deleted && prod.active;
      })
      .map((p) => {
        const prod = p.product as Stripe.Product;
        return {
          priceId: p.id,
          productId: prod.id,
          name: prod.name,
          description: prod.description ?? "",
          amount: p.unit_amount ?? 0,
          currency: p.currency,
          price: new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: (p.currency || "usd").toUpperCase(),
          }).format((p.unit_amount ?? 0) / 100),
        };
      })
      .sort((a, b) => a.amount - b.amount);

    return new Response(JSON.stringify({ products }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
