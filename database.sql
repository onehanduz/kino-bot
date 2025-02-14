CREATE TABLE users(
  id SERIAL PRIMARY KEY,
  telegram_id BIGINT,
  isAdmin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE code (
  id SERIAL PRIMARY KEY,
  code VARCHAR (255),
  msg_id VARCHAR (255),
  created_at TIMESTAMP DEFAULT now()
);

