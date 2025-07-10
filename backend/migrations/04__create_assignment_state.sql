CREATE TABLE
  assignment_state (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    assignment_id INTEGER NOT NULL REFERENCES assignments (id),
    active_question_id INTEGER DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

CREATE TABLE
  assignment_answers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    assignment_question_type TEXT,
    assignment_id INTEGER NOT NULL REFERENCES assignments (id),
    assignment_question_id INTEGER NOT NULL REFERENCES assignment_questions (id),
    assignment_question_answer_index INTEGER DEFAULT -1,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  );