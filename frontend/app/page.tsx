import React from "react";
import Link from "next/link";
import { 
  Sparkles, ShieldCheck, ArrowRight, Clock, FileCheck2, 
  TrendingUp, Scale, Database, Zap, CheckCircle2 
} from "lucide-react";

export default function HomePage() {
  const stats = [
    { label: "Drafting Time", val: "15 Sec", change: "vs 40 mins manual" },
    { label: "Level-1 Win Rate", val: "91.4%", change: "Industry benchmark" },
    { label: "Supported Codes", val: "250+ CARC", change: "CMS & Commercial" },
    { label: "Average Recovery", val: "$4,200", change: "Per billing specialist/mo" },
  ];

  const commonDenials = [
    {
      code: "CO-16",
      title: "Lacks Information Needed for Adjudication",
      tag: "Most Common",
      desc: "Payer claims missing primary EOB, chart notes, or referral info. ClaimGen synthesizes exact missing clinical exhibits.",
    },
    {
      code: "CO-50",
      title: "Not Deemed a Medical Necessity",
      tag: "High Value",
      desc: "Automatically cites peer-reviewed literature, LCD/NCD coverage criteria, and attending physician clinical justification.",
    },
    {
      code: "PR-204",
      title: "Service Not Covered Under Benefit Plan",
      tag: "Critical",
      desc: "Appeals non-covered determinations under ERISA Title I § 503 full and fair review mandates.",
    },
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-gradient-to-b from-indigo-600/20 via-cyan-500/10 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs font-semibold text-cyan-400 mb-8 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '4s' }} />
          <span>Generative AI + pgvector RAG for Healthcare RCM</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.12]">
          Turn Denied Claims into{" "}
          <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Recovered Revenue
          </span>{" "}
          in 15 Seconds.
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
          Autonomous Level-1 insurance appeal letter generation backed by real-time CMS Medicare regulations, CARC/RARC legal rebuttals, and peer-reviewed medical necessity arguments.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/generate"
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-semibold px-8 py-3.5 rounded-xl shadow-xl shadow-indigo-500/25 transition-all hover:scale-[1.02] text-sm"
          >
            <Sparkles className="w-4 h-4 text-cyan-200" />
            <span>Generate Appeal Letter Now</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/codes"
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white/[0.05] hover:bg-white/[0.09] border border-white/10 text-slate-200 font-semibold px-6 py-3.5 rounded-xl transition-all text-sm"
          >
            <Database className="w-4 h-4 text-slate-400" />
            <span>Explore CARC Denial Database</span>
          </Link>
        </div>

        {/* Stats Row */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {stats.map((s, idx) => (
            <div key={idx} className="glass-panel p-5 rounded-2xl text-left border border-white/5">
              <p className="text-xs text-slate-400 font-medium">{s.label}</p>
              <p className="text-2xl sm:text-3xl font-extrabold text-white mt-1">{s.val}</p>
              <p className="text-[11px] text-cyan-400/90 font-medium mt-1">{s.change}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured CARC Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Pre-Trained on High-Impact Denial Codes
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Engineered specifically for the top reasons commercial payers reject claims.
            </p>
          </div>
          <Link
            href="/codes"
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 mt-3 md:mt-0"
          >
            View all 250+ codes <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {commonDenials.map((card) => (
            <div key={card.code} className="glass-panel glass-panel-hover p-6 rounded-2xl relative overflow-hidden flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-base font-bold text-white px-2.5 py-1 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {card.code}
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    {card.tag}
                  </span>
                </div>
                <h3 className="font-bold text-base text-white mt-2">{card.title}</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">{card.desc}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">ERISA § 503 Rebuttal</span>
                <Link
                  href={`/generate?code=${card.code}`}
                  className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                >
                  Draft Appeal <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-white/5">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">How ClaimGen AI Works</h2>
          <p className="text-sm text-slate-400 mt-2">
            From raw EOB denial to a certified appeal packet ready for faxing in 3 simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-panel p-6 rounded-2xl border border-white/5">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold mb-4">
              1
            </div>
            <h3 className="font-bold text-base text-white">Input Claim or Upload EOB</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Enter the patient details, CPT procedure codes, and the CARC denial code (e.g. CO-16 or CO-50).
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-white/5">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold mb-4">
              2
            </div>
            <h3 className="font-bold text-base text-white">RAG Knowledge Matching</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Our PostgreSQL vector database retrieves the specific payer appeal rules, statutory clauses, and proven winning strategies.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-white/5">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold mb-4">
              3
            </div>
            <h3 className="font-bold text-base text-white">1-Click PDF Export</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Review, edit the live letterhead, and instantly download a professional, certified appeal document ready for payer submission.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
