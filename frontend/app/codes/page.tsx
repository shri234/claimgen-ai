"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BookOpen, Search, ArrowRight, ShieldAlert, Sparkles, Filter } from "lucide-react";

const CODES = [
  {
    code: "CO-16",
    title: "Lacks Information Needed for Adjudication",
    category: "Documentation / Coding",
    causes: "Missing primary EOB, lacking operative notes, missing referral/prior authorization number, or incomplete clinical records.",
    strategy: "Submit original signed clinical chart notes, diagnostic test results, proof of timely referral, and an itemized statement clearly cross-referenced to CPT codes.",
  },
  {
    code: "CO-50",
    title: "Not Deemed a Medical Necessity by the Payer",
    category: "Medical Necessity",
    causes: "Procedure does not match payer Local Coverage Determination (LCD) or National Coverage Determination (NCD) criteria, or conservative therapies were unrecorded.",
    strategy: "Cite published peer-reviewed clinical guidelines, detail documented failed conservative therapies, and include treating physician letter of medical necessity.",
  },
  {
    code: "CO-18",
    title: "Duplicate Claim / Service Already Adjudicated",
    category: "Billing / Clearinghouse",
    causes: "Claim resubmitted with exact same dates and codes, or automated clearinghouse double-batch error.",
    strategy: "Demonstrate that the services were distinct sessions, separate anatomical sites (with modifiers -59, -XE, -RT, -LT), or separate units of service.",
  },
  {
    code: "CO-97",
    title: "Bundled Service (Included in Primary Procedure)",
    category: "NCCI Bundling Edit",
    causes: "Payer claims secondary procedure is inclusive to primary surgical or evaluation code under National Correct Coding Initiative.",
    strategy: "Demonstrate distinct procedural service requiring modifier -59 or -X{EPSU}, proving separate incision, separate encounter, or independent diagnostic utility.",
  },
  {
    code: "PR-204",
    title: "Service Not Covered Under Current Benefit Plan",
    category: "Plan Benefit Exclusion",
    causes: "Payer claims policy exclusion, cosmetic classification, or experimental/investigational determination.",
    strategy: "Request specific plan policy document exclusion clause, prove medical necessity over cosmetic classification, and appeal under ERISA Title I guidelines.",
  },
  {
    code: "CO-29",
    title: "Timely Filing Limit Expired",
    category: "Administrative / Filing Deadline",
    causes: "Claim received past payer standard filing window (e.g. 90/180/365 days).",
    strategy: "Provide EDI clearinghouse 999/277 acceptance reports proving initial transmission within timely filing window, or prove coordination of benefits delay.",
  },
  {
    code: "CO-45",
    title: "Charge Exceeds Fee Schedule / Maximum Allowable",
    category: "Fee Adjustment",
    causes: "Claim reimbursed below billed or out-of-network benchmark rate.",
    strategy: "Appeal based on unusual procedure complexity (modifier -22), excessive operative time, or Fair Health out-of-network usual and customary (UCR) rate benchmarks.",
  },
];

export default function CodesDirectoryPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Documentation / Coding", "Medical Necessity", "Billing / Clearinghouse", "Plan Benefit Exclusion"];

  const filtered = CODES.filter((c) => {
    const matchesSearch =
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.causes.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "All" || c.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="max-w-3xl mb-10">
        <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-semibold border border-cyan-500/20">
          Knowledge Base & RAG Index
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mt-3 tracking-tight">
          CARC & RARC Denial Reason Directory
        </h1>
        <p className="text-sm text-slate-300 mt-2">
          Search claim adjustment reason codes, understand payer root causes, and launch customized appeal rebuttals.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 border border-white/10 mb-8">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by code (e.g. CO-16) or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-black/50 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selectedCategory === cat
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Codes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((item) => (
          <div key={item.code} className="glass-panel glass-panel-hover p-6 rounded-2xl border border-white/10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-base font-bold text-cyan-400 px-3 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                  {item.code}
                </span>
                <span className="text-[11px] font-semibold text-slate-400 bg-white/[0.04] px-2.5 py-1 rounded-full border border-white/5">
                  {item.category}
                </span>
              </div>

              <h3 className="font-bold text-base text-white mt-4">{item.title}</h3>

              <div className="mt-4 space-y-2 text-xs">
                <div>
                  <span className="text-slate-400 font-semibold">Typical Causes: </span>
                  <span className="text-slate-300 leading-relaxed">{item.causes}</span>
                </div>
                <div>
                  <span className="text-indigo-400 font-semibold">Appeal Strategy: </span>
                  <span className="text-slate-300 leading-relaxed">{item.strategy}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">ERISA § 503 Rebuttal</span>
              <Link
                href={`/generate?code=${item.code}`}
                className="flex items-center gap-1.5 bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg shadow-md transition-all hover:scale-[1.02]"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
                <span>Draft Appeal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
