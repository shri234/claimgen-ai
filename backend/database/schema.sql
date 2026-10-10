-- Enable Vector Extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255),
    plan_tier VARCHAR(50) DEFAULT 'free',
    appeal_credits INT DEFAULT 3,
    stripe_customer_id VARCHAR(255),
    razorpay_customer_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- CARC / RARC Knowledge Base with Vectors
CREATE TABLE IF NOT EXISTS payer_rules_kb (
    id SERIAL PRIMARY KEY,
    denial_code VARCHAR(20) NOT NULL,
    payer_name VARCHAR(100),
    guideline_text TEXT NOT NULL,
    appeal_strategy TEXT NOT NULL,
    embedding vector(1536)
);

-- Appeals Table
CREATE TABLE IF NOT EXISTS claims (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    patient_identifier VARCHAR(100),
    claim_number VARCHAR(100),
    denial_code VARCHAR(50),
    eob_file_url TEXT,
    appeal_letter_content TEXT,
    status VARCHAR(50) DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
