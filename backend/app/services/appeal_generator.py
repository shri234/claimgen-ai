import os
import datetime
from typing import AsyncGenerator
from app.models.schemas import ClaimAppealRequest, AppealResponse
from app.services.carc_knowledge_base import get_denial_code_info
from app.core.config import settings

def construct_appeal_prompt(req: ClaimAppealRequest) -> str:
    kb_info = get_denial_code_info(req.denial_code)
    
    prompt = f"""You are an elite Healthcare Billing & Legal Appeals Specialist.
Write a formal, comprehensive, and legally robust Level 1 Insurance Claim Denial Appeal Letter.

CLAIM DETAILS:
- Patient Name: {req.patient_name}
- Patient DOB: {req.patient_dob or 'On File'}
- Member/Policy ID: {req.member_id}
- Claim Reference #: {req.claim_number}
- Date of Service: {req.date_of_service}
- Rendering Provider: {req.provider_name} (NPI: {req.provider_npi or 'On File'})
- Insurance Payer: {req.payer_name}
- Payer Appeals Address: {req.payer_address or 'Claims Appeals & Grievance Department'}
- Procedure Codes (CPT): {', '.join(req.procedure_codes)}
- Diagnosis Codes (ICD-10): {', '.join(req.diagnosis_codes) if req.diagnosis_codes else 'Documented in Chart'}
- Total Billed Amount: ${req.billed_amount:,.2f} if req.billed_amount else 'As Itemized'

DENIAL REASON & POLICY KNOWLEDGE:
- Denial Reason Code: {req.denial_code} ({kb_info.title})
- Payer Remark: {req.denial_reason_description}
- Benchmark Strategy: {kb_info.recommended_strategy}
- Physician Clinical Rationale: {req.clinical_justification or 'Services performed were in strict compliance with current standard of medical care.'}

INSTRUCTIONS FOR THE APPEAL LETTER:
1. Include formal standard letterhead layout: Provider info at top, Date, Payer info, RE header with claim details.
2. Section 1: Executive Statement of Formal Appeal - clearly state intent to overturn denial under state insurance regulations and ERISA Title I Sec 503.
3. Section 2: Clinical Background & Medical Necessity - synthesize the patient diagnosis and procedure rationale.
4. Section 3: Rebuttal of Denial Code ({req.denial_code}) - detail why the denial was incorrect or why documentation now presented resolves the issue.
5. Section 4: Relevant Statutory Citations - cite CMS Medicare Coverage Database, LCD/NCD standards, or AMA CPT guidelines where relevant.
6. Section 5: List of Enclosed Evidentiary Attachments.
7. Section 6: Request for Expedited Re-Adjudication within 30 days and professional closing signature block.

Format professionally in clear markdown with clean headings and bullet points.
"""
    return prompt

def generate_local_appeal_template(req: ClaimAppealRequest) -> str:
    kb_info = get_denial_code_info(req.denial_code)
    today_str = datetime.date.today().strftime("%B %d, %Y")
    
    return f"""**{req.provider_name.upper()}**  
NPI: {req.provider_npi or '9876543210'} | Tax ID: XX-XXXXXXX  
Claims & Billing Department  

**DATE:** {today_str}  

**TO:**  
{req.payer_name}  
Attention: Appeals & Grievances Department  
{req.payer_address or 'P.O. Box 14000, Claims Re-Adjudication Center'}  

---

### **RE: FORMAL LEVEL-1 APPEAL OF CLAIM DENIAL**
* **Patient Name:** {req.patient_name}  
* **Date of Birth:** {req.patient_dob or '1985-05-15'}  
* **Member / Policy ID:** {req.member_id}  
* **Claim Reference Number:** {req.claim_number}  
* **Date of Service (DOS):** {req.date_of_service}  
* **Billed Amount:** ${f"{req.billed_amount:,.2f}" if req.billed_amount else "1,850.00"}  
* **Procedure Codes (CPT/HCPCS):** {", ".join(req.procedure_codes)}  
* **Diagnosis Codes (ICD-10):** {", ".join(req.diagnosis_codes) if req.diagnosis_codes else "Z00.00, M54.5"}  
* **Payer Denial Code:** **{req.denial_code}** — {kb_info.title}  
* **Denial Description:** *"{req.denial_reason_description}"*  

---

Dear Claims Appeals Committee,

Please accept this letter as a formal Level-1 appeal submitted on behalf of **{req.patient_name}** by **{req.provider_name}** contesting the adverse determination and denial of the above-referenced claim. The claim was erroneously adjudicated under denial code **{req.denial_code}** (*{kb_info.title}*).

Upon comprehensive review of the clinical record, payer guidelines, and applicable statutory mandates under **ERISA § 503 (29 U.S.C. § 1133)** and state prompt-payment statutes, we respectfully assert that the rendered services were medically necessary, fully documented, and met all clinical indications for reimbursement.

---

### **I. CLINICAL SUMMARY & INDICATION FOR SERVICE**
The patient presented on **{req.date_of_service}** requiring clinical intervention for diagnosed conditions. {req.clinical_justification or f"The attending clinician performed an exhaustive diagnostic assessment and determined that CPT {', '.join(req.procedure_codes)} was clinically indicated to prevent acute clinical deterioration."}

Prior conservative management therapies were evaluated and documented in accordance with standard medical practice. The intervention performed was neither experimental nor investigational, but recognized as the gold standard of clinical care by the relevant specialty board.

---

### **II. DIRECT REBUTTAL OF DENIAL CODE {req.denial_code}**
The Explanation of Benefits (EOB) indicated denial due to:  
> *"{req.denial_reason_description}"*

**Rebuttal Argument:**  
1. **Compliance with Guidelines:** {kb_info.recommended_strategy}  
2. **Coding Accuracy:** The reported CPT codes ({", ".join(req.procedure_codes)}) accurately represent the specific procedural work performed. All modifier assignments, units, and documentation satisfy AMA CPT conventions.  
3. **Completeness of Record:** Any documentation previously perceived as lacking is enclosed in full within this formal appeal submission.

---

### **III. LEGAL & REGULATORY MANDATES**
Under federal regulations governing healthcare claims:
* **29 CFR § 2560.503-1:** The plan administrator is legally mandated to conduct a full, fair, and objective review taking into account all comments, documents, and records submitted, without deference to the initial adverse benefit determination.
* **Relevant Local Coverage Determination (LCD):** The clinical services provided adhere strictly to established coverage criteria published for this jurisdiction.

---

### **IV. ENCLOSED EVIDENCE & DOCUMENTATION**
In support of this redetermination request, we have attached the following evidentiary exhibits:
1. Complete signed operative/clinical chart notes for Date of Service: {req.date_of_service}
2. Attending Physician's Letter of Medical Necessity
3. Copy of original CMS-1500 / UB-04 claim and payer EOB remittance advice
4. Proof of pre-service authorization / primary referral verification (if applicable)

---

### **V. CONCLUSION & DEMAND FOR ADJUDICATION**
Based on the clinical documentation provided, we respectfully demand that {req.payer_name} reverse its denial under code {req.denial_code} and issue prompt payment in accordance with your provider agreement and statutory prompt-pay interest provisions within **thirty (30) calendar days** of receipt.

Should you require any supplementary records, please contact our billing department immediately at the contact information on file.

Sincerely,

*(Signature on File)*  
**{req.provider_name}**  
NPI: {req.provider_npi or '9876543210'}  
Billing & Appeals Department
"""

async def generate_appeal_letter(req: ClaimAppealRequest) -> AppealResponse:
    kb_info = get_denial_code_info(req.denial_code)
    
    # If Anthropic API key is provided, use Claude 3.5 Sonnet
    if settings.ANTHROPIC_API_KEY and settings.ANTHROPIC_API_KEY.startswith("sk-"):
        try:
            import anthropic
            client = anthropic.AsyncAnthropic(api_key=settings.ANTHROPIC_API_KEY)
            prompt = construct_appeal_prompt(req)
            msg = await client.messages.create(
                model="claude-3-5-sonnet-20241022",
                max_tokens=2500,
                messages=[{"role": "user", "content": prompt}]
            )
            content = msg.content[0].text
        except Exception:
            content = generate_local_appeal_template(req)
    # If OpenAI API key is provided, use OpenAI
    elif settings.OPENAI_API_KEY and settings.OPENAI_API_KEY.startswith("sk-"):
        try:
            from openai import AsyncOpenAI
            client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
            prompt = construct_appeal_prompt(req)
            res = await client.chat.completions.create(
                model="gpt-4o",
                messages=[{"role": "user", "content": prompt}]
            )
            content = res.choices[0].message.content or generate_local_appeal_template(req)
        except Exception:
            content = generate_local_appeal_template(req)
    else:
        content = generate_local_appeal_template(req)

    return AppealResponse(
        appeal_letter=content,
        denial_code=req.denial_code,
        key_legal_arguments=[
            f"ERISA § 503 full and fair review mandate for {req.denial_code}",
            f"Adherence to AMA CPT coding conventions for {', '.join(req.procedure_codes)}",
            "Established medical necessity via certified treating physician chart notes",
            "Statutory prompt-payment interest compliance"
        ],
        suggested_attachments=[
            f"Signed Clinical Encounter Notes ({req.date_of_service})",
            "Treating Physician Letter of Medical Necessity",
            "Copy of Payer EOB with Denial Code Highlighted",
            "Relevant Local Coverage Determination (LCD) Excerpt"
        ],
        generated_at=datetime.datetime.utcnow().isoformat()
    )

async def stream_appeal_letter(req: ClaimAppealRequest) -> AsyncGenerator[str, None]:
    # Stream chunks of text for real-time live typing experience
    full_response = await generate_appeal_letter(req)
    lines = full_response.appeal_letter.split("\n")
    import asyncio
    for line in lines:
        yield f"data: {line}\n\n"
        await asyncio.sleep(0.02)
    yield "data: [DONE]\n\n"
