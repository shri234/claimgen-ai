"use client";

import React, { useState } from "react";
import { 
  Sparkles, Download, Copy, Check, RefreshCw, FileText, 
  ShieldCheck, AlertTriangle, ArrowRight, CheckCircle2, 
  Printer, Scale, Edit3, Eye
} from "lucide-react";
import jsPDF from "jspdf";

const PRESETS = {
  "CO-16": {
    patient_name: "Sarah Jenkins",
    patient_dob: "1987-04-12",
    member_id: "UHC-992384102",
    claim_number: "CLM-2024-91823",
    payer_name: "UnitedHealthcare Commercial",
    payer_address: "P.O. Box 740800, Atlanta, GA 30374",
    provider_name: "Apex Neurological Associates",
    provider_npi: "1849204910",
    date_of_service: "2024-02-18",
    procedure_codes: "95810, 95811",
    diagnosis_codes: "G47.33, R53.83",
    billed_amount: "2850.00",
    denial_code: "CO-16",
    denial_reason_description: "Claim/service lacks information or has submission/billing error(s) needed for adjudication. Missing polysomnography sleep questionnaire and primary referral.",
    clinical_justification: "Patient presented with severe excessive daytime sleepiness (Epworth score 18/24) and witnessed nocturnal apneic episodes. Polysomnography test was clinically imperative to diagnose obstructive sleep apnea and titrate PAP therapy.",
  },
  "CO-50": {
    patient_name: "David Miller",
    patient_dob: "1975-09-24",
    member_id: "BCBS-449102834",
    claim_number: "BCBS-CLM-88102",
    payer_name: "Blue Cross Blue Shield of Texas",
    payer_address: "P.O. Box 660044, Dallas, TX 75266",
    provider_name: "Orthopedic & Spine Institute",
    provider_npi: "1392019485",
    date_of_service: "2024-03-05",
    procedure_codes: "27447",
    diagnosis_codes: "M17.11, M25.561",
    billed_amount: "14500.00",
    denial_code: "CO-50",
    denial_reason_description: "These are non-covered services because this is not deemed a medical necessity by the payer. Conservative physical therapy trials were insufficient.",
    clinical_justification: "Patient has end-stage tricompartmental osteoarthritis of the right knee (Kellgren-Lawrence Grade 4). Documented failure of 6 months of supervised physical therapy, unloader bracing, and two corticosteroid injections.",
  },
  "PR-204": {
    patient_name: "Maria Gonzales",
    patient_dob: "1991-11-03",
    member_id: "AET-771920491",
    claim_number: "AETNA-CLM-44012",
    payer_name: "Aetna Health Inc.",
    payer_address: "P.O. Box 14079, Lexington, KY 40512",
    provider_name: "Coastal Surgical Center",
    provider_npi: "1902847192",
    date_of_service: "2024-01-22",
    procedure_codes: "64721",
    diagnosis_codes: "G56.01",
    billed_amount: "3200.00",
    denial_code: "PR-204",
    denial_reason_description: "This service/equipment/drug is not covered under the patient's current benefit plan. Deemed elective or non-covered ambulatory procedure.",
    clinical_justification: "Patient suffered severe median nerve entrapment with constant sensory loss and thenar atrophy confirmed by electrodiagnostic EMG/NCS studies. Surgical neuroplasty was urgent to prevent irreversible nerve death.",
  }
};

export default function GenerateAppealPage() {
  const [formData, setFormData] = useState(PRESETS["CO-16"]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [appealResult, setAppealResult] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editableLetter, setEditableLetter] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const applyPreset = (code: "CO-16" | "CO-50" | "PR-204") => {
    setFormData(PRESETS[code]);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setCopied(false);

    try {
      const payload = {
        ...formData,
        procedure_codes: formData.procedure_codes.split(",").map((s) => s.trim()),
        diagnosis_codes: formData.diagnosis_codes.split(",").map((s) => s.trim()),
        billed_amount: formData.billed_amount ? parseFloat(formData.billed_amount) : undefined,
      };

      const res = await fetch("/api/appeals/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Generation failed");
      const data = await res.json();
      setAppealResult(data);
      setEditableLetter(data.appeal_letter);
    } catch (err) {
      console.error(err);
      alert("Error generating appeal. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    const textToCopy = editableLetter || appealResult?.appeal_letter;
    if (!textToCopy) return;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const downloadPDF = () => {
    const textToPrint = editableLetter || appealResult?.appeal_letter;
    if (!textToPrint) return;

    const doc = new jsPDF({ unit: "pt", format: "letter" });
    const margin = 40;
    const pageWidth = doc.internal.pageSize.getWidth();
    const maxWidth = pageWidth - margin * 2;

    doc.setFont("times", "normal");
    doc.setFontSize(10.5);

    // Clean markdown bold tags for clean PDF rendering
    const cleanText = textToPrint
      .replace(/\*\*/g, "")
      .replace(/###/g, "")
      .replace(/---/g, "________________________________________________________");

    const splitLines = doc.splitTextToSize(cleanText, maxWidth);

    let cursorY = 50;
    const pageHeight = doc.internal.pageSize.getHeight();

    for (let i = 0; i < splitLines.length; i++) {
      if (cursorY > pageHeight - 50) {
        doc.addPage();
        cursorY = 50;
      }
      doc.text(splitLines[i], margin, cursorY);
      cursorY += 14;
    }

    doc.save(`Appeal_${formData.denial_code}_${formData.claim_number}.pdf`);
  };

  const currentText = editableLetter || appealResult?.appeal_letter || "";
  const wordCount = currentText ? currentText.trim().split(/\s+/).length : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-8 border-b border-white/10 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-semibold border border-indigo-500/30">
              Level-1 Appeals Workspace
            </span>
            <span className="text-xs text-slate-400">ERISA § 503 Ready</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Generate Certified Claim Appeal Packet
          </h1>
        </div>

        {/* Quick presets */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 mr-1 hidden sm:inline">Load Sample:</span>
          <button
            type="button"
            onClick={() => applyPreset("CO-16")}
            className="px-2.5 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-medium text-slate-300 transition-colors"
          >
            CO-16 (Missing Info)
          </button>
          <button
            type="button"
            onClick={() => applyPreset("CO-50")}
            className="px-2.5 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-medium text-slate-300 transition-colors"
          >
            CO-50 (Med Necessity)
          </button>
          <button
            type="button"
            onClick={() => applyPreset("PR-204")}
            className="px-2.5 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-medium text-slate-300 transition-colors"
          >
            PR-204 (Plan Exclusion)
          </button>
        </div>
      </div>

      {/* Main Grid: Left Form (5 cols), Right Preview (7 cols) */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Input Form */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-2xl border border-white/10 shadow-2xl">
          <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-5">
            <h2 className="font-bold text-sm text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-cyan-400" />
              Claim & Denial Details
            </h2>
            <span className="text-[11px] text-slate-400">All fields encrypted</span>
          </div>

          <form onSubmit={handleGenerate} className="space-y-4 text-xs">
            {/* Patient Name & DOB */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Patient Full Name</label>
                <input
                  type="text"
                  name="patient_name"
                  value={formData.patient_name}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-xs"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Date of Birth</label>
                <input
                  type="date"
                  name="patient_dob"
                  value={formData.patient_dob}
                  onChange={handleInputChange}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-xs"
                />
              </div>
            </div>

            {/* Member ID & Claim Number */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Member / Policy ID</label>
                <input
                  type="text"
                  name="member_id"
                  value={formData.member_id}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-xs"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Claim Reference #</label>
                <input
                  type="text"
                  name="claim_number"
                  value={formData.claim_number}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-xs"
                />
              </div>
            </div>

            {/* Payer Name & Denial Code */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Insurance Payer</label>
                <input
                  type="text"
                  name="payer_name"
                  value={formData.payer_name}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-xs"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-medium">CARC Denial Code</label>
                <select
                  name="denial_code"
                  value={formData.denial_code}
                  onChange={handleInputChange}
                  className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 text-xs font-semibold"
                >
                  <option value="CO-16">CO-16 (Missing Information)</option>
                  <option value="CO-50">CO-50 (Not Medical Necessity)</option>
                  <option value="CO-18">CO-18 (Duplicate Claim)</option>
                  <option value="CO-97">CO-97 (Bundled Service / NCCI)</option>
                  <option value="PR-204">PR-204 (Plan Benefit Exclusion)</option>
                  <option value="CO-29">CO-29 (Timely Filing Limit)</option>
                  <option value="CO-45">CO-45 (Fee Schedule Exceeded)</option>
                </select>
              </div>
            </div>

            {/* Provider Name & DOS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Rendering Provider / Clinic</label>
                <input
                  type="text"
                  name="provider_name"
                  value={formData.provider_name}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-xs"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Date of Service (DOS)</label>
                <input
                  type="date"
                  name="date_of_service"
                  value={formData.date_of_service}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-xs"
                />
              </div>
            </div>

            {/* CPT Codes & Billed Amount */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">CPT / HCPCS Codes</label>
                <input
                  type="text"
                  name="procedure_codes"
                  value={formData.procedure_codes}
                  onChange={handleInputChange}
                  placeholder="e.g. 99214, 27447"
                  required
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-xs"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Billed Amount ($ USD)</label>
                <input
                  type="number"
                  name="billed_amount"
                  value={formData.billed_amount}
                  onChange={handleInputChange}
                  step="0.01"
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-xs"
                />
              </div>
            </div>

            {/* Denial Remark from EOB */}
            <div>
              <label className="block text-slate-400 mb-1 font-medium">EOB Denial Remark / Payer Explanation</label>
              <textarea
                name="denial_reason_description"
                rows={2}
                value={formData.denial_reason_description}
                onChange={handleInputChange}
                required
                className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-xs leading-relaxed"
              />
            </div>

            {/* Clinical Justification */}
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Attending Physician Clinical Justification</label>
              <textarea
                name="clinical_justification"
                rows={3}
                value={formData.clinical_justification}
                onChange={handleInputChange}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-xs leading-relaxed"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.01] disabled:opacity-50 text-xs"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-cyan-200" />
                  <span>Synthesizing Legal Appeal & Policy Citations...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-cyan-200" />
                  <span>Generate Level-1 Appeal Packet</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Live Letter & Preview */}
        <div className="lg:col-span-7 space-y-6">
          {/* Action Toolbar */}
          <div className="glass-panel px-5 py-3.5 rounded-2xl flex flex-wrap items-center justify-between gap-3 border border-white/10">
            <div className="flex items-center gap-3">
              <span className="font-bold text-xs text-white flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Appeal Packet Preview
              </span>
              {currentText && (
                <span className="text-[11px] text-slate-400 border-l border-white/10 pl-3">
                  {wordCount} words (~{Math.ceil(wordCount / 200)} min read)
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {currentText && (
                <>
                  <button
                    type="button"
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-xs font-medium text-slate-300 border border-white/10 transition-colors"
                  >
                    {isEditing ? <Eye className="w-3.5 h-3.5 text-cyan-400" /> : <Edit3 className="w-3.5 h-3.5 text-indigo-400" />}
                    <span>{isEditing ? "Preview" : "Edit"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={copyToClipboard}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-xs font-medium text-slate-300 border border-white/10 transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? "Copied!" : "Copy"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={downloadPDF}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02]"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Letter Body Display */}
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 shadow-2xl min-h-[560px] relative">
            {!currentText && !loading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4">
                  <Sparkles className="w-7 h-7 text-cyan-400 animate-pulse" />
                </div>
                <h3 className="font-bold text-base text-white">No Appeal Packet Generated Yet</h3>
                <p className="text-xs text-slate-400 max-w-sm mt-1 leading-relaxed">
                  Fill in the claim parameters on the left or select a sample preset (e.g. CO-16 or CO-50) and click <strong>"Generate Level-1 Appeal Packet"</strong>.
                </p>
              </div>
            )}

            {loading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-black/40 backdrop-blur-sm rounded-2xl z-10">
                <RefreshCw className="w-9 h-9 text-cyan-400 animate-spin mb-4" />
                <p className="font-bold text-sm text-white">Synthesizing Clinical Evidence & ERISA Statutes...</p>
                <p className="text-xs text-slate-400 mt-1">Cross-referencing {formData.denial_code} with AMA and LCD benchmarks.</p>
              </div>
            )}

            {currentText && isEditing ? (
              <textarea
                value={editableLetter}
                onChange={(e) => setEditableLetter(e.target.value)}
                className="w-full h-[520px] bg-black/50 border border-white/10 rounded-xl p-4 text-xs font-mono text-slate-200 focus:outline-none focus:border-indigo-500 leading-relaxed"
              />
            ) : currentText && !isEditing ? (
              <div className="text-xs text-slate-300 leading-relaxed font-sans space-y-3 whitespace-pre-wrap selection:bg-indigo-500">
                {currentText}
              </div>
            ) : null}
          </div>

          {/* Key Legal Arguments & Attachments Drawer */}
          {appealResult && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="glass-panel p-4 rounded-xl border border-white/5">
                <span className="text-xs font-bold text-white flex items-center gap-1.5 mb-2.5">
                  <Scale className="w-3.5 h-3.5 text-cyan-400" />
                  Key Legal Statutes Cited
                </span>
                <ul className="space-y-1.5">
                  {appealResult.key_legal_arguments?.map((arg: string, i: number) => (
                    <li key={i} className="text-[11px] text-slate-300 flex items-start gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{arg}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="glass-panel p-4 rounded-xl border border-white/5">
                <span className="text-xs font-bold text-white flex items-center gap-1.5 mb-2.5">
                  <FileText className="w-3.5 h-3.5 text-indigo-400" />
                  Required Enclosures Checklist
                </span>
                <ul className="space-y-1.5">
                  {appealResult.suggested_attachments?.map((att: string, i: number) => (
                    <li key={i} className="text-[11px] text-slate-300 flex items-start gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{att}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
