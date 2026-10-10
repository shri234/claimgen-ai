from fastapi import APIRouter, HTTPException, BackgroundTasks, Request, Depends
from fastapi.responses import StreamingResponse
from typing import List, Dict, Any
from sqlalchemy.orm import Session

from app.models.schemas import (
    ClaimAppealRequest, AppealResponse, DenialCodeItem, PaymentCheckoutRequest,
    ClaimRecordResponse, UserProfileResponse
)
from app.models.db_models import Claim, User
from app.core.database import get_db
from app.services.carc_knowledge_base import get_all_denial_codes, get_denial_code_info
from app.services.appeal_generator import generate_appeal_letter, stream_appeal_letter
from app.services.payment_service import create_stripe_checkout_session, create_razorpay_order
from app.core.config import settings

api_router = APIRouter()

@api_router.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION
    }

@api_router.get("/denial-codes", response_model=List[DenialCodeItem])
def list_denial_codes():
    """Retrieve full catalog of supported CARC / RARC denial codes."""
    return get_all_denial_codes()

@api_router.get("/denial-codes/{code}", response_model=DenialCodeItem)
def get_single_code(code: str):
    """Retrieve legal strategy and policy guidelines for a specific denial code."""
    return get_denial_code_info(code)

@api_router.post("/appeals/generate", response_model=AppealResponse)
async def generate_appeal(request: ClaimAppealRequest, db: Session = Depends(get_db)):
    """Generate a comprehensive Level 1 appeal packet using Generative AI and save to database."""
    try:
        response = await generate_appeal_letter(request)

        # Persist claim to database via SQLAlchemy ORM
        try:
            new_claim = Claim(
                patient_identifier=request.patient_name,
                claim_number=request.claim_number,
                denial_code=request.denial_code,
                appeal_letter_content=response.appeal_letter,
                status="generated"
            )
            db.add(new_claim)
            db.commit()
            db.refresh(new_claim)
            response.claim_id = str(new_claim.id)
        except Exception as db_err:
            print(f"Warning: Failed to persist claim to DB: {db_err}")

        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Generation failed: {str(e)}")

@api_router.get("/appeals", response_model=List[ClaimRecordResponse])
def list_appeals(limit: int = 50, offset: int = 0, db: Session = Depends(get_db)):
    """Retrieve history of generated appeals from database."""
    claims = db.query(Claim).order_by(Claim.created_at.desc()).offset(offset).limit(limit).all()
    return [
        ClaimRecordResponse(
            id=str(c.id),
            patient_identifier=c.patient_identifier,
            claim_number=c.claim_number,
            denial_code=c.denial_code,
            appeal_letter_content=c.appeal_letter_content,
            status=c.status,
            created_at=c.created_at.isoformat() if c.created_at else ""
        )
        for c in claims
    ]

@api_router.get("/appeals/{claim_id}", response_model=ClaimRecordResponse)
def get_appeal_by_id(claim_id: str, db: Session = Depends(get_db)):
    """Retrieve specific appeal by ID from database."""
    claim = db.query(Claim).filter(Claim.id == claim_id).first()
    if not claim:
        raise HTTPException(status_code=404, detail="Appeal claim not found")
    return ClaimRecordResponse(
        id=str(claim.id),
        patient_identifier=claim.patient_identifier,
        claim_number=claim.claim_number,
        denial_code=claim.denial_code,
        appeal_letter_content=claim.appeal_letter_content,
        status=claim.status,
        created_at=claim.created_at.isoformat() if claim.created_at else ""
    )

@api_router.delete("/appeals/{claim_id}")
def delete_appeal(claim_id: str, db: Session = Depends(get_db)):
    """Delete an appeal record from database."""
    claim = db.query(Claim).filter(Claim.id == claim_id).first()
    if not claim:
        raise HTTPException(status_code=404, detail="Appeal claim not found")
    db.delete(claim)
    db.commit()
    return {"status": "success", "message": f"Appeal {claim_id} deleted"}

@api_router.post("/appeals/stream")
async def stream_appeal(request: ClaimAppealRequest):
    """Real-time SSE streaming endpoint for live letter typing."""
    return StreamingResponse(
        stream_appeal_letter(request),
        media_type="text/event-stream"
    )

@api_router.post("/payments/checkout")
def create_checkout(req: PaymentCheckoutRequest):
    """Create Stripe Checkout session or Razorpay Order."""
    success_url = req.success_url or f"{settings.FRONTEND_URL}/dashboard?payment=success"
    cancel_url = req.cancel_url or f"{settings.FRONTEND_URL}/pricing?payment=cancelled"
    
    if req.gateway.lower() == "razorpay":
        return create_razorpay_order(req.tier)
    else:
        return create_stripe_checkout_session(req.tier, success_url, cancel_url)

@api_router.post("/payments/webhooks/stripe")
async def stripe_webhook(request: Request):
    """Handle Stripe subscription lifecycle events."""
    payload = await request.body()
    # In production with keys: stripe.Webhook.construct_event(...)
    return {"status": "received", "event": "invoice.payment_succeeded"}

@api_router.post("/payments/webhooks/razorpay")
async def razorpay_webhook(request: Request):
    """Handle Razorpay payment authorization and credit allocations."""
    payload = await request.json()
    return {"status": "received", "event": payload.get("event", "payment.captured")}
