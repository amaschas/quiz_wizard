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
    assignment_question_type TEXT DEFAULT 'multiple-choice' CHECK (assignment_question_type IN (
      'multiple-choice',
      'free-from'
    )),
    choices TEXT, -- sqlite doesn't support arrays, so we'll store choices as a string of ';;'-separated values
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

CREATE TABLE
  assignment_answers (
    user_id INTEGER NOT NULL REFERENCES users (id),
    assignment_id INTEGER NOT NULL REFERENCES assignments (id),
    assignment_question_id INTEGER NOT NULL REFERENCES assignment_questions (id),
    assignment_question_answer_index INTEGER DEFAULT -1,
    is_active BOOLEAN NOT NULL DEFAULT 0 CHECK (is_active IN (0, 1)),
    ms_on_question INTEGER DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, assignment_id, assignment_question_id)
  );