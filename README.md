# ClaimGen AI — Healthcare Claim Denial Appeal Generator SaaS

> **A B2B SaaS platform that automates Level-1 medical claim denial appeal letters in 15 seconds.**
> Built with Next.js (App Router), NextAuth, Python FastAPI, PostgreSQL with `pgvector`, and dual Stripe / Razorpay payment flows.

---

## 🌟 Key Features

1. **Autonomous Level-1 Appeal Generation:**
   - Pre-trained and prompt-engineered for CARC/RARC denial codes (`CO-16`, `CO-50`, `CO-18`, `CO-97`, `PR-204`, `CO-29`, `CO-45`).
   - Cites federal statutes (**ERISA § 503 / 29 U.S.C. § 1133**), AMA CPT coding rules, and Local Coverage Determinations (LCD).
2. **Interactive Clinical Workspace:**
   - 1-Click sample preset buttons (`CO-16 Missing Info`, `CO-50 Medical Necessity`, `PR-204 Plan Exclusion`).
   - Live word counter and estimated reading time.
   - In-place rich editor toggle and instant copy to clipboard.
   - **1-Click Certified Letterhead PDF Export** (via `jspdf`).
3. **CARC / RARC Knowledge Directory:**
   - Searchable, categorized index of denial reason codes with proven legal rebuttal strategies.
4. **Multi-Gateway Subscriptions:**
   - **Stripe Checkout** (USD / Global) and **Razorpay** (INR / Domestic India) with webhook listeners.
5. **PostgreSQL + `pgvector` Schema:**
   - Unified relational tables for claims, billing, and vector embeddings of payer appeal guidelines.

---

## 📁 Project Architecture

```
claimgen-ai/
├── backend/                  # Python FastAPI Service
│   ├── app/
│   │   ├── api/routes.py     # Endpoints: /appeals, /denial-codes, /payments
│   │   ├── core/config.py    # Environment settings
│   │   ├── models/schemas.py # Pydantic data schemas
│   │   ├── services/
│   │   │   ├── appeal_generator.py   # Claude 3.5 Sonnet & LLM engine
│   │   │   ├── carc_knowledge_base.py# CARC rules & strategies
│   │   │   └── payment_service.py    # Stripe & Razorpay workflows
│   │   └── main.py           # FastAPI entrypoint & CORS
│   ├── database/schema.sql   # PostgreSQL + pgvector schema
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/                 # Next.js 16 (App Router) + Tailwind CSS
│   ├── app/
│   │   ├── page.tsx          # High-converting landing page
│   │   ├── generate/page.tsx # Flagship AI Appeal Workspace
│   │   ├── codes/page.tsx    # Searchable CARC Denial Directory
│   │   ├── pricing/page.tsx  # Tiered plans (Stripe & Razorpay)
│   │   ├── api/appeals/      # API generation bridge
│   │   └── api/auth/         # NextAuth credentials/JWT handler
│   ├── components/           # Navbar, Footer, UI components
│   └── globals.css           # Glassmorphism & SaaS design system
│
└── docker-compose.yml        # Multi-container Postgres + FastAPI + Next.js setup
```

---

## 🚀 How to Run Locally

### 1. Frontend (Currently Live on `http://localhost:3000`)
```bash
cd D:\personal\claimgen-ai\frontend
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser!

### 2. Backend (Python FastAPI)
```bash
cd D:\personal\claimgen-ai\backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
API Documentation will be live at: **`http://localhost:8000/docs`**

### 3. All Services with Docker
```bash
cd D:\personal\claimgen-ai
docker compose up -d
```
