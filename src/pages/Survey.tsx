import { useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, Sprout } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import logo from "@/assets/logo.png";

const SURVEY_VERSION = "snowsoc-2026-10";

const BARRIERS = [
  "Lack of space",
  "Not enough time",
  "Don't know where to start",
  "Cost of supplies",
  "Fear of plants not surviving",
  "Weather concerns",
];

const CONFIDENCE = [
  "Very confident",
  "Somewhat confident",
  "I'm not sure",
  "Not very confident",
  "Not confident at all",
];

const INTEREST = ["Very interested", "Somewhat interested", "I'm not sure", "Not interested"];
const YES_MAYBE_NO = ["Yes", "Maybe", "No"];
const BUY_VS_GROW = [
  "Yes, I'd rather purchase than grow",
  "Maybe, depending on pricing",
  "No, I prefer growing myself",
  "I'm not interested in either",
];

const inputClass =
  "w-full px-4 py-3 bg-background border border-border rounded-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold transition-colors";

type RadioGroupProps = {
  name: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
};

const RadioGroup = ({ name, options, value, onChange }: RadioGroupProps) => (
  <div className="space-y-2" role="radiogroup">
    {options.map((o) => (
      <label key={o} className="flex items-center gap-3 cursor-pointer text-foreground">
        <input
          type="radio"
          name={name}
          value={o}
          checked={value === o}
          onChange={() => onChange(o)}
          className="h-4 w-4 accent-[hsl(var(--gold))]"
        />
        <span>{o}</span>
      </label>
    ))}
  </div>
);

const Question = ({ n, text, children }: { n: number; text: string; children: React.ReactNode }) => (
  <fieldset className="bg-card border border-border rounded-sm p-6 space-y-4">
    <legend className="sr-only">{`Question ${n}`}</legend>
    <p className="font-display text-lg font-semibold text-foreground">
      {n}. {text}
    </p>
    {children}
  </fieldset>
);

const Survey = () => {
  const [associations, setAssociations] = useState("");
  const [barriers, setBarriers] = useState<string[]>([]);
  const [barriersOther, setBarriersOther] = useState("");
  const [confidence, setConfidence] = useState("");
  const [interestSustainable, setInterestSustainable] = useState("");
  const [workshop, setWorkshop] = useState("");
  const [interestHerbal, setInterestHerbal] = useState("");
  const [buyVsGrow, setBuyVsGrow] = useState("");
  const [plantExchange, setPlantExchange] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [emailOptIn, setEmailOptIn] = useState(false);
  const [smsOptIn, setSmsOptIn] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const wantsFollowUp = ["Yes", "Maybe"].includes(workshop) || ["Yes", "Maybe"].includes(plantExchange);

  const toggleBarrier = (b: string) =>
    setBarriers((prev) => (prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b]));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const wantsContact = wantsFollowUp && (emailOptIn || smsOptIn);
    if (wantsContact) {
      if (!name.trim()) {
        toast({ title: "Please add your name", variant: "destructive" });
        return;
      }
      if (emailOptIn && !email.trim()) {
        toast({ title: "Please add your email", variant: "destructive" });
        return;
      }
      if (smsOptIn && !phone.trim()) {
        toast({ title: "Please add your phone number", variant: "destructive" });
        return;
      }
    }

    setSubmitting(true);
    // Generated client-side so no SELECT access is needed after the insert.
    const responseId = crypto.randomUUID();

    try {
      const { error } = await supabase.from("survey_responses").insert({
        id: responseId,
        survey_version: SURVEY_VERSION,
        gardening_associations: associations.trim() || null,
        barriers,
        barriers_other: barriersOther.trim() || null,
        confidence: confidence || null,
        interest_sustainable: interestSustainable || null,
        workshop_attendance: workshop || null,
        interest_herbal: interestHerbal || null,
        buy_vs_grow: buyVsGrow || null,
        plant_exchange: plantExchange || null,
      });
      if (error) throw error;

      if (wantsContact) {
        const interests: string[] = [];
        if (["Yes", "Maybe"].includes(workshop)) interests.push("Workshop");
        if (["Yes", "Maybe"].includes(plantExchange)) interests.push("Plant Exchange");

        const { error: contactError } = await supabase.from("survey_contacts").insert({
          response_id: responseId,
          name: name.trim(),
          email: emailOptIn ? email.trim() : null,
          phone: smsOptIn ? phone.trim() : null,
          email_opt_in: emailOptIn,
          sms_opt_in: smsOptIn,
          interests,
        });
        if (contactError) throw contactError;

        // Best effort: add to Mailchimp with interest tags. The survey answers are already saved.
        if (emailOptIn) {
          supabase.functions
            .invoke("mailchimp-subscribe", {
              body: {
                name: name.trim(),
                email: email.trim(),
                phone: smsOptIn ? phone.trim() : undefined,
                emailOptIn,
                smsOptIn,
                tags: interests,
              },
            })
            .catch((err) => console.error("Mailchimp subscribe failed", err));
        }
      }

      setDone(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      toast({
        title: "We couldn't save your answers",
        description: err instanceof Error ? err.message : "Please try again in a moment.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary border-b border-gold/20">
        <div className="container mx-auto flex items-center gap-3 py-3 px-4">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="Sampson Organics" className="h-12 w-12" />
            <span className="font-display text-xl font-bold text-primary-foreground tracking-wide">
              Sampson Organics
            </span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-2xl">
        {done ? (
          <div className="bg-card border border-gold/30 rounded-sm p-12 text-center">
            <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sprout className="w-7 h-7 text-gold" />
            </div>
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">Thank you!</h1>
            <p className="text-muted-foreground mb-6">
              Your answers will help us shape the workshops, programs, and products we build for our community.
            </p>
            <Link
              to="/"
              className="inline-block px-8 py-4 bg-gold text-gold-foreground font-semibold rounded-sm uppercase tracking-widest text-sm hover:brightness-110 transition-all"
            >
              Back to the site
            </Link>
          </div>
        ) : (
          <>
            <p className="text-gold font-medium uppercase tracking-[0.2em] text-sm mb-3">SNOWSOC</p>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
              Sustainable Growing + Community Survey
            </h1>
            <p className="text-muted-foreground mb-2">
              Sho N Tel Wellness x Sampson Organics Collaborative is building community-centered sustainable
              farming, wellness education, and local growing initiatives in Michigan.
            </p>
            <p className="text-muted-foreground mb-8">
              Your feedback helps us design programs, workshops, and products that truly serve our community. It
              takes about three minutes and every question is optional.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <Question n={1} text="When you hear the word “gardening,” what do you think of?">
                <textarea
                  value={associations}
                  onChange={(e) => setAssociations(e.target.value)}
                  maxLength={2000}
                  rows={4}
                  placeholder="Share whatever comes to mind"
                  className={`${inputClass} resize-none`}
                />
              </Question>

              <Question n={2} text="What has stopped you from starting or maintaining a garden? (Select all that apply)">
                <div className="space-y-2">
                  {BARRIERS.map((b) => (
                    <label key={b} className="flex items-center gap-3 cursor-pointer text-foreground">
                      <input
                        type="checkbox"
                        checked={barriers.includes(b)}
                        onChange={() => toggleBarrier(b)}
                        className="h-4 w-4 accent-[hsl(var(--gold))]"
                      />
                      <span>{b}</span>
                    </label>
                  ))}
                </div>
                <input
                  type="text"
                  value={barriersOther}
                  onChange={(e) => setBarriersOther(e.target.value)}
                  maxLength={500}
                  placeholder="Something else? Tell us here"
                  className={inputClass}
                />
              </Question>

              <Question n={3} text="How confident do you feel about growing food in your current space?">
                <RadioGroup name="confidence" options={CONFIDENCE} value={confidence} onChange={setConfidence} />
              </Question>

              <Question n={4} text="How interested are you in learning about sustainable farming practices and techniques?">
                <RadioGroup
                  name="interestSustainable"
                  options={INTEREST}
                  value={interestSustainable}
                  onChange={setInterestSustainable}
                />
              </Question>

              <Question n={5} text="Would you attend a workshop on home gardening, what to grow in Michigan, and when to plant it?">
                <RadioGroup name="workshop" options={YES_MAYBE_NO} value={workshop} onChange={setWorkshop} />
              </Question>

              <Question n={6} text="Would you be interested in learning how to grow herbs for natural remedies?">
                <RadioGroup
                  name="interestHerbal"
                  options={INTEREST}
                  value={interestHerbal}
                  onChange={setInterestHerbal}
                />
              </Question>

              <Question
                n={7}
                text="If you're interested in gardening but don't want to maintain it yourself, would you buy locally grown items to pick up when ready?"
              >
                <RadioGroup name="buyVsGrow" options={BUY_VS_GROW} value={buyVsGrow} onChange={setBuyVsGrow} />
              </Question>

              <Question n={8} text="Would you attend a community plant exchange hosted by us?">
                <RadioGroup
                  name="plantExchange"
                  options={YES_MAYBE_NO}
                  value={plantExchange}
                  onChange={setPlantExchange}
                />
              </Question>

              {wantsFollowUp && (
                <fieldset className="bg-card border border-gold/30 rounded-sm p-6 space-y-4">
                  <legend className="sr-only">Stay in the loop</legend>
                  <p className="font-display text-lg font-semibold text-foreground">Want to hear about those events?</p>
                  <p className="text-sm text-muted-foreground">
                    Leave your details and we'll let you know when dates are set. This is optional, and your survey
                    answers are saved separately from your contact information.
                  </p>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={200}
                    placeholder="Your Name"
                    className={inputClass}
                  />
                  <label className="flex items-center gap-3 cursor-pointer text-foreground">
                    <input
                      type="checkbox"
                      checked={emailOptIn}
                      onChange={(e) => setEmailOptIn(e.target.checked)}
                      className="h-4 w-4 accent-[hsl(var(--gold))]"
                    />
                    <span>Email me about events</span>
                  </label>
                  {emailOptIn && (
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      maxLength={320}
                      placeholder="Your Email"
                      className={inputClass}
                    />
                  )}
                  <label className="flex items-center gap-3 cursor-pointer text-foreground">
                    <input
                      type="checkbox"
                      checked={smsOptIn}
                      onChange={(e) => setSmsOptIn(e.target.checked)}
                      className="h-4 w-4 accent-[hsl(var(--gold))]"
                    />
                    <span>Text me about events</span>
                  </label>
                  {smsOptIn && (
                    <>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        maxLength={40}
                        placeholder="Mobile Number"
                        className={inputClass}
                      />
                      <p className="text-xs text-muted-foreground">
                        By checking this box you agree to receive event text messages from Sampson Organics and
                        SNOWSOC. Message and data rates may apply. Reply STOP to opt out.
                      </p>
                    </>
                  )}
                </fieldset>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full px-8 py-4 bg-gold text-gold-foreground font-semibold rounded-sm uppercase tracking-widest text-sm hover:brightness-110 transition-all disabled:opacity-50"
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting...
                  </span>
                ) : (
                  "Submit Survey"
                )}
              </button>
            </form>
          </>
        )}
      </main>
    </div>
  );
};

export default Survey;
