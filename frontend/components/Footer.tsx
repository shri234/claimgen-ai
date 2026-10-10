"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, HeartPulse } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/10 bg-[#07090E] py-12 mt-20 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 border border-indigo-500/30">
            <HeartPulse className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <span className="font-bold text-white text-sm">ClaimGen AI</span>
            <p className="text-[11px] text-slate-400">
              Autonomous Medical Denial Appeal Engine for Healthcare Providers
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 text-slate-400">
          <Link href="/codes" className="hover:text-white transition-colors">
            CARC Code Library
          </Link>
          <Link href="/pricing" className="hover:text-white transition-colors">
            Pricing & Subscriptions
          </Link>
          <span className="flex items-center gap-1.5 text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            HIPAA-Ready Architecture
          </span>
        </div>

        <div className="text-slate-400">
          © 2026 ClaimGen AI. Built with FastAPI & Next.js.
        </div>
      </div>
    </footer>
  );
}
