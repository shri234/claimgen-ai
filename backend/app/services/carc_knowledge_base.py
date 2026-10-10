from typing import Dict, List
from app.models.schemas import DenialCodeItem

CARC_DATABASE: Dict[str, DenialCodeItem] = {
    "CO-16": DenialCodeItem(
        code="CO-16",
        title="Lacks Information Needed for Adjudication",
        category="Missing Documentation / Coding Error",
        common_causes="Missing primary EOB, lack of medical records, missing referral/prior authorization number, or incomplete clinical documentation.",
        recommended_strategy="Submit original clinical chart notes, diagnostic test results, proof of timely referral, and an itemized statement clearly cross-referenced to the billed CPT codes."
    ),
    "CO-50": DenialCodeItem(
        code="CO-50",
        title="Not Deemed a Medical Necessity by the Payer",
        category="Clinical / Medical Necessity",
        common_causes="Procedure does not match payer Local Coverage Determination (LCD) or National Coverage Determination (NCD) criteria, or conservative therapies were not documented.",
        recommended_strategy="Cite published peer-reviewed clinical guidelines, detail failed conservative therapies, and include the treating physician's signed letter of medical necessity explaining patient risk factors."
    ),
    "CO-18": DenialCodeItem(
        code="CO-18",
        title="Duplicate Claim / Service Already Adjudicated",
        category="Billing / Adjudication Error",
        common_causes="Claim resubmitted with exact same dates and codes, or automated clearinghouse duplicate submission error.",
        recommended_strategy="Demonstrate that the services were distinct sessions, separate anatomical sites (with appropriate modifiers like -59, -XE, -RT, -LT), or separate units of service."
    ),
    "CO-97": DenialCodeItem(
        code="CO-97",
        title="Bundled Service (Included in Primary Procedure)",
        category="NCCI Bundling Edit",
        common_causes="Payer claims secondary procedure is inclusive to primary surgical or evaluation code under National Correct Coding Initiative edits.",
        recommended_strategy="Demonstrate distinct procedural service requiring modifier -59 or -X{EPSU}, proving separate incision, separate encounter, or independent diagnostic utility."
    ),
    "PR-204": DenialCodeItem(
        code="PR-204",
        title="Service Not Covered Under Current Benefit Plan",
        category="Plan Benefit Exclusion",
        common_causes="Payer claims policy exclusion, cosmetic classification, or experimental/investigational determination.",
        recommended_strategy="Request specific plan policy document exclusion clause, prove medical necessity over cosmetic/experimental classification, and appeal under ERISA Title I guidelines."
    ),
    "CO-29": DenialCodeItem(
        code="CO-29",
        title="Timely Filing Limit Expired",
        category="Administrative / Filing Deadline",
        common_causes="Claim received past payer standard filing window (e.g. 90/180/365 days).",
        recommended_strategy="Provide EDI clearinghouse 999/277 acceptance reports proving initial transmission within timely filing window, or prove coordination of benefits delay from primary payer."
    ),
    "CO-45": DenialCodeItem(
        code="CO-45",
        title="Charge Exceeds Fee Schedule / Maximum Allowable",
        category="Contractual / Fee Adjustment",
        common_causes="Claim reimbursed below billed or out-of-network benchmark rate.",
        recommended_strategy="Appeal based on unusual procedure complexity (modifier -22), excessive operative time, or Fair Health out-of-network usual and customary (UCR) rate benchmarks."
    )
}

def get_all_denial_codes() -> List[DenialCodeItem]:
    return list(CARC_DATABASE.values())

def get_denial_code_info(code: str) -> DenialCodeItem:
    cleaned = code.strip().upper()
    return CARC_DATABASE.get(cleaned, DenialCodeItem(
        code=code,
        title=f"Denial Code {code}",
        category="General Appeal",
        common_causes="Adjudication denial as specified on EOB statement.",
        recommended_strategy="Review payer specific LCD/NCD coverage policies and submit complete supporting operative reports and clinical chart notes."
    ))
