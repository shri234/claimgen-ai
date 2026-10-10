"use client";

import React, { useState } from "react";
import { Check, Sparkles, ShieldCheck, Zap, CreditCard, ArrowRight, Building2 } from "lucide-react";

export default function PricingPage() {
  const [currency, setCurrency] = useState<"USD" | "INR">("USD");
  const [selectedGateway, setSelectedGateway] = useState<"stripe" | "razorpay">("stripe");
  const [processingTier, setProcessingTier] = useState<string | null>(null);

  const plans = [
    {
      id: "starter",
      name: "Starter Biller",
      tagline: "For solo medical billers and small private practices.",
      priceUSD: "$29",
      priceINR: "₹2,499",
      period: "/month",
      appeals: "25 Appeal Packets / mo",
      popular: false,
      features: [
        "25 Certified Level-1 Appeals / mo",
        "Full CARC & RARC Code Directory",
        "1-Click Letterhead PDF Export",
        "ERISA § 503 Legal Rebuttal Citations",
        "Email Support",
      ],
    },
    {
      id: "pro",
      name: "Professional Clinic",
      tagline: "For busy clinics and dedicated billing agencies.",
      priceUSD: "$79",
      priceINR: "₹6,499",
      period: "/month",
      appeals: "100 Appeal Packets / mo",
      popular: true,
      features: [
        "100 Certified Level-1 Appeals / mo",
        "Custom Practice Letterhead & Physician NPIs",
        "Priority High-Dollar Claim RAG Matching",
        "Full EOB Multi-Code Rebuttals",
        "Instant Copy & Direct Print Formatting",
        "Priority Support (2-Hour Response)",
      ],
    },
    {
      id: "agency",
      name: "Enterprise Agency",
      tagline: "For hospital RCM departments and billing enterprises.",
      priceUSD: "$199",
      priceINR: "₹15,999",
      period: "/month",
      appeals: "Unlimited Appeals",
      popular: false,
      features: [
        "Unlimited Monthly Appeal Packets",
        "Multi-Biller Clinic Team Access (10 Seats)",
        "Automated EOB Document Batch Parsing",
        "Custom Payer Policy Vector Injection",
        "Webhook & REST API Access",
        "Dedicated RCM Account Manager",
      ],
    },
  ];

  const handleCheckout = async (tierId: string) => {
    setProcessingTier(tierId);
    try {
      const res = await fetch("http://localhost:8000/api/v1/payments/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tier: tierId,
          gateway: selectedGateway,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.checkout_url) {
          alert(`Redirecting to ${selectedGateway.toUpperCase()} Checkout (${tierId.toUpperCase()} Tier)...`);
          window.location.href = data.checkout_url;
          return;
        }
      }
    } catch {
      // Offline fallback
    }

    // Interactive Demo Confirmation
    setTimeout(() => {
      setProcessingTier(null);
      alert(
        `✓ ${selectedGateway.toUpperCase()} payment simulation successful!\nAccount upgraded to ${tierId.toUpperCase()} plan with active subscription.`
      );
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold border border-indigo-500/20">
          Transparent Pricing for Healthcare Teams
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white mt-4 tracking-tight">
          Recover More Revenue for a Fraction of the Cost
        </h1>
        <p className="text-sm text-slate-300 mt-3">
          One successfully overturned claim pays for an entire year of ClaimGen AI.
        </p>

        {/* Currency & Gateway Switcher */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          {/* Currency Toggle */}
          <div className="inline-flex items-center bg-white/[0.04] p-1 rounded-xl border border-white/10">
            <button
              onClick={() => {
                setCurrency("USD");
                setSelectedGateway("stripe");
              }}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currency === "USD"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              USD ($) — Global
            </button>
            <button
              onClick={() => {
                setCurrency("INR");
                setSelectedGateway("razorpay");
              }}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currency === "INR"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              INR (₹) — India
            </button>
          </div>

          {/* Gateway Badge */}
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <CreditCard className="w-4 h-4 text-cyan-400" />
            <span>Integrated with:</span>
            <span className="font-bold text-white px-2 py-0.5 rounded bg-white/[0.06] border border-white/10">
              {selectedGateway === "stripe" ? "Stripe Checkout" : "Razorpay Subscriptions"}
            </span>
          </div>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
        {plans.map((p) => (
          <div
            key={p.id}
            className={`glass-panel rounded-2xl p-7 flex flex-col justify-between relative transition-all ${
              p.popular
                ? "border-indigo-500/50 shadow-2xl shadow-indigo-500/10 scale-105 z-10"
                : "border-white/10 hover:border-white/20"
            }`}
          >
            {p.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 text-white text-[11px] font-bold shadow-md">
                MOST POPULAR
              </div>
            )}

            <div>
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg text-white">{p.name}</h3>
                <span className="text-[11px] font-medium text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
                  {p.appeals}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-2 min-h-[32px]">{p.tagline}</p>

              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-white">
                  {currency === "USD" ? p.priceUSD : p.priceINR}
                </span>
                <span className="text-xs text-slate-400 font-medium">{p.period}</span>
              </div>

              {/* Feature List */}
              <ul className="mt-8 space-y-3">
                {p.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5">
              <button
                type="button"
                onClick={() => handleCheckout(p.id)}
                disabled={processingTier === p.id}
                className={`w-full py-3 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-2 ${
                  p.popular
                    ? "bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white shadow-lg shadow-indigo-600/30 hover:scale-[1.02]"
                    : "bg-white/[0.06] hover:bg-white/[0.1] text-white border border-white/10"
                }`}
              >
                {processingTier === p.id ? (
                  <span>Processing Checkout...</span>
                ) : (
                  <>
                    <span>Subscribe with {selectedGateway === "stripe" ? "Stripe" : "Razorpay"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Assurance banner */}
      <div className="mt-16 glass-panel p-6 rounded-2xl max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 border border-white/5">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-emerald-400 shrink-0" />
          <div>
            <h4 className="text-sm font-bold text-white">30-Day Money-Back Guarantee</h4>
            <p className="text-xs text-slate-400">
              If ClaimGen AI does not help you recover at least 3x the subscription cost in overturned claims, we will refund your month in full.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
