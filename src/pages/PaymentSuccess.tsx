import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const PaymentSuccess = () => (
  <div className="min-h-screen bg-background flex items-center justify-center px-4">
    <div className="text-center max-w-md">
      <CheckCircle className="w-16 h-16 text-gold mx-auto mb-6" />
      <h1 className="font-display text-3xl font-bold text-foreground mb-3">
        Thank You!
      </h1>
      <p className="text-muted-foreground mb-8">
        Your order has been placed. You'll receive a confirmation email shortly.
      </p>
      <Link
        to="/"
        className="inline-flex px-6 py-3 bg-gold text-gold-foreground font-semibold rounded-sm uppercase tracking-widest text-xs hover:brightness-110 transition-all"
      >
        Back to Home
      </Link>
    </div>
  </div>
);

export default PaymentSuccess;
