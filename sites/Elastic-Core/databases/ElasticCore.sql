--------------------------------------------------------------------------------
-- Elastic Core Database Schema
--------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS User (
		id                   TEXT PRIMARY KEY,
		email                TEXT,
		emailConfirmed       NUMERIC NOT NULL DEFAULT 0,
		passwordHash         TEXT,
		lockoutEnd           TEXT,
		lockoutEnabled       NUMERIC NOT NULL DEFAULT 0,
		accessFailedCount    INTEGER NOT NULL DEFAULT 0,
		creationDate		 TEXT, 
		-- Constraints
		CONSTRAINT User_ck_id UNIQUE (id),
		CONSTRAINT User_ck_emailConfirmed CHECK (emailConfirmed IN (0, 1)),
		CONSTRAINT User_ck_lockoutEnabled CHECK (lockoutEnabled IN (0, 1))
) WITHOUT ROWID;

CREATE INDEX User_ix_email ON User (email);


