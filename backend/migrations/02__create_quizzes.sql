CREATE TABLE
  quizzes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

CREATE TABLE
  quiz_questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    quiz_id INTEGER NOT NULL REFERENCES quizzes (id),
    question_content TEXT,
    quiz_question_type TEXT DEFAULT 'multiple-choice' CHECK (quiz_question_type IN (
      'multiple-choice',
      'free-from'
    )),
    quiz_answer_choices TEXT, -- sqlite doesn't support arrays, so we'll store choices as a string of ';;'-separated values
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

CREATE TABLE
  quiz_answers (
    user_id INTEGER NOT NULL REFERENCES users (id),
    quiz_id INTEGER NOT NULL REFERENCES quizzes (id),
    quiz_question_id INTEGER NOT NULL REFERENCES quiz_questions (id),
    quiz_question_answer_index INTEGER DEFAULT -1,
    is_active BOOLEAN NOT NULL DEFAULT 0 CHECK (is_active IN (0, 1)),
    ms_on_question INTEGER DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, quiz_id, quiz_question_id)
  );