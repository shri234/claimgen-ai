"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldAlert, Sparkles, FileText, BookOpen, CreditCard, ArrowRight } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { name: "Generator", href: "/generate", icon: Sparkles },
    { name: "CARC Directory", href: "/codes", icon: BookOpen },
    { name: "Pricing", href: "/pricing", icon: CreditCard },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#07090E]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all">
            <div className="w-full h-full bg-[#0B0F19] rounded-[10px] flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                ClaimGen
              </span>
              <span className="text-xs px-1.5 py-0.5 rounded-full font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                AI
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium tracking-wide">HEALTHCARE APPEAL SAAS</p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1 bg-white/[0.03] border border-white/5 rounded-full px-3 py-1.5">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-indigo-600/30 text-white border border-indigo-500/40 shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-cyan-400" : "text-slate-400"}`} />
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-medium text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            CMS Guidelines Synced
          </div>

          <Link
            href="/generate"
            className="flex items-center gap-1.5 bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-md shadow-indigo-600/20 hover:shadow-indigo-600/40 transition-all hover:scale-[1.02]"
          >
            <span>Draft Appeal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
