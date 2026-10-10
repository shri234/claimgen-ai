import os
from typing import Dict, Any
from app.core.config import settings

def create_stripe_checkout_session(tier: str, success_url: str, cancel_url: str) -> Dict[str, Any]:
    prices = {
        "starter": {"amount": 2900, "name": "ClaimGen Starter Plan (25 Appeals/mo)"},
        "pro": {"amount": 7900, "name": "ClaimGen Professional Plan (100 Appeals/mo)"},
        "agency": {"amount": 19900, "name": "ClaimGen Enterprise Agency (Unlimited)"}
    }
    selected = prices.get(tier, prices["pro"])
    
    if settings.STRIPE_SECRET_KEY and settings.STRIPE_SECRET_KEY.startswith("sk_"):
        import stripe
        stripe.api_key = settings.STRIPE_SECRET_KEY
        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price_data': {
                    'currency': 'usd',
                    'product_data': {'name': selected['name']},
                    'unit_amount': selected['amount'],
                },
                'quantity': 1,
            }],
            mode='payment',
            success_url=success_url,
            cancel_url=cancel_url,
        )
        return {"checkout_url": session.url, "session_id": session.id, "gateway": "stripe"}
    
    # Mock checkout response for testing without live keys
    return {
        "checkout_url": f"{success_url}?session_id=mock_stripe_{tier}",
        "session_id": f"mock_stripe_sess_{tier}",
        "gateway": "stripe",
        "mock": True
    }

def create_razorpay_order(tier: str) -> Dict[str, Any]:
    inr_prices = {
        "starter": 249900, # INR 2,499 in paise
        "pro": 649900,    # INR 6,499 in paise
        "agency": 1599900 # INR 15,999 in paise
    }
    amount = inr_prices.get(tier, inr_prices["pro"])
    
    if settings.RAZORPAY_KEY_ID and settings.RAZORPAY_KEY_SECRET:
        import razorpay
        client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
        order = client.order.create({
            "amount": amount,
            "currency": "INR",
            "receipt": f"claimgen_rcpt_{tier}",
            "notes": {"plan_tier": tier}
        })
        return {
            "order_id": order["id"],
            "amount": amount,
            "currency": "INR",
            "key_id": settings.RAZORPAY_KEY_ID,
            "gateway": "razorpay"
        }
    
    # Mock Razorpay response for testing
    return {
        "order_id": f"order_mock_rzp_{tier}",
        "amount": amount,
        "currency": "INR",
        "key_id": "rzp_test_claimgen_demo",
        "gateway": "razorpay",
        "mock": True
    }
