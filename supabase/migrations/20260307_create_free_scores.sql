-- Free score lead magnet table
CREATE TABLE free_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  overall_score NUMERIC(3,1),
  photo_score NUMERIC(3,1),
  bio_score NUMERIC(3,1),
  first_impression_score NUMERIC(3,1),
  converted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_free_scores_email ON free_scores(email);
