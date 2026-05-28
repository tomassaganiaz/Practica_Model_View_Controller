-- Loans database schema
CREATE TABLE IF NOT EXISTS loans (
  id SERIAL PRIMARY KEY,
  member_id INTEGER NOT NULL,
  book_id INTEGER NOT NULL,
  date TIMESTAMP NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true
);
