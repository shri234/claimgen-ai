from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import date

class ClaimAppealRequest(BaseModel):
    patient_name: str = Field(..., description="Patient Full Name")
    patient_dob: Optional[str] = Field(None, description="Date of birth YYYY-MM-DD")
    member_id: str = Field(..., description="Insurance Member ID / Policy #")
    claim_number: str = Field(..., description="Insurance Claim Reference Number")
    payer_name: str = Field(..., description="Health Plan / Payer Name, e.g. Aetna, UHC")
    payer_address: Optional[str] = Field(None, description="Payer Claims Appeal Department Address")
    provider_name: str = Field(..., description="Rendering Physician or Clinic Name")
    provider_npi: Optional[str] = Field(None, description="National Provider Identifier (NPI)")
    date_of_service: str = Field(..., description="Date service was rendered")
    procedure_codes: List[str] = Field(..., description="CPT / HCPCS Procedure codes")
    diagnosis_codes: List[str] = Field(default_factory=list, description="ICD-10 Diagnosis codes")
    billed_amount: Optional[float] = Field(None, description="Total billed amount")
    denial_code: str = Field(..., description="CARC denial code, e.g., CO-16, PR-204, CO-50")
    denial_reason_description: str = Field(..., description="Explanation of denial from EOB")
    clinical_justification: Optional[str] = Field(None, description="Physician's medical necessity or clinical rationale")

class AppealResponse(BaseModel):
    claim_id: Optional[str] = None
    appeal_letter: str
    denial_code: str
    key_legal_arguments: List[str]
    suggested_attachments: List[str]
    generated_at: str

class DenialCodeItem(BaseModel):
    code: str
    title: str
    category: str
    common_causes: str
    recommended_strategy: str

class PaymentCheckoutRequest(BaseModel):
    tier: str # 'starter', 'pro', 'agency'
    gateway: str # 'stripe' or 'razorpay'
    success_url: Optional[str] = None
    cancel_url: Optional[str] = None

class ClaimRecordResponse(BaseModel):
    id: str
    patient_identifier: Optional[str] = None
    claim_number: Optional[str] = None
    denial_code: Optional[str] = None
    appeal_letter_content: Optional[str] = None
    status: str
    created_at: str

    class Config:
        from_attributes = True

class UserProfileResponse(BaseModel):
    id: str
    email: str
    plan_tier: str
    appeal_credits: int
    created_at: str

    class Config:
        from_attributes = True

