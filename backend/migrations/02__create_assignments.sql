DROP TABLE IF EXISTS assignment_questions;
DROP TABLE IF EXISTS assignments;

CREATE TABLE
  assignments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

CREATE TABLE
  assignment_questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    assignment_id INTEGER NOT NULL REFERENCES assignments (id),
    question_content TEXT,
    choices TEXT, -- sqlite doesn't support arrays, so we'll store choices as a string of ';;'-separated values
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  );