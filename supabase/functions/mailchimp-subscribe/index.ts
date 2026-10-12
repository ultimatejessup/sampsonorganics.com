import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, name, phone, emailOptIn, smsOptIn, tags: extraTags } = await req.json();

    if (!email || !name) {
      throw new Error("Email and name are required");
    }

    const API_KEY = Deno.env.get("MAILCHIMP_API_KEY") || "";
    const AUDIENCE_ID = Deno.env.get("MAILCHIMP_AUDIENCE_ID") || "";

    const dc = API_KEY.split("-").pop();
    const url = `https://${dc}.api.mailchimp.com/3.0/lists/${AUDIENCE_ID}/members`;

    const nameParts = name.trim().split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    const tags: string[] = [];
    if (emailOptIn) tags.push("Email Opt-In");
    if (smsOptIn) tags.push("SMS Opt-In");

    // Interest tags from the SNOWSOC survey. Allowlisted so callers can't create arbitrary tags.
    const ALLOWED_INTEREST_TAGS = ["Workshop", "Plant Exchange"];
    if (Array.isArray(extraTags)) {
      for (const t of extraTags) {
        if (ALLOWED_INTEREST_TAGS.includes(t) && !tags.includes(t)) tags.push(t);
      }
    }

    const mergeFields: Record<string, string> = {
      FNAME: firstName,
      LNAME: lastName,
    };
    if (phone && smsOptIn) {
      mergeFields.PHONE = phone;
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `apikey ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email_address: email,
        status: "subscribed",
        merge_fields: mergeFields,
        tags,
      }),
    });

    const data = await response.json();

    if (!response.ok && data.title !== "Member Exists") {
      throw new Error(data.detail || "Failed to subscribe");
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Mailchimp error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
