import { XCircle } from "lucide-react";
import { Link } from "react-router-dom";

const PaymentCanceled = () => (
  <div className="min-h-screen bg-background flex items-center justify-center px-4">
    <div className="text-center max-w-md">
      <XCircle className="w-16 h-16 text-destructive mx-auto mb-6" />
      <h1 className="font-display text-3xl font-bold text-foreground mb-3">
        Payment Canceled
      </h1>
      <p className="text-muted-foreground mb-8">
        Your payment was not completed. No charges were made. Feel free to try again.
      </p>
      <Link
        to="/#shop"
        className="inline-flex px-6 py-3 bg-gold text-gold-foreground font-semibold rounded-sm uppercase tracking-widest text-xs hover:brightness-110 transition-all"
      >
        Back to Shop
      </Link>
    </div>
  </div>
);

export default PaymentCanceled;
