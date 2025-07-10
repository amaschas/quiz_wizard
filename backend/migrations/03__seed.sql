-- Create some test users
INSERT INTO
  users (name, email)
VALUES
  ('John Doe', 'john@example.com'),
  ('Jane Smith', 'jane@example.com'),
  ('Alice Johnson', 'alice@example.com'),
  ('Bob Brown', 'bob@example.com');

-- Create test assignments
INSERT INTO
  assignments (title)
VALUES
  ('Basic Skeletal System Quiz'),
  ('Cardiovascular System Basics'),
  ('Digestive System Overview');

-- Create questions for Skeletal System Quiz
INSERT INTO assignment_questions (assignment_id, question_content, choices)
SELECT
  (
    SELECT id
    FROM assignments
    WHERE title = 'Basic Skeletal System Quiz'
  ),
  q.question_content,
  q.choices
FROM (
  SELECT
    'Which bone is the longest in the human body?' AS question_content,
    'Femur;;Tibia;;Humerus;;Fibula' AS choices
  UNION ALL
  SELECT 'How many bones are in the adult human body?', '206;;186;;226;;196'
  UNION ALL
  SELECT 'Which part of the skull protects the brain?', 'Cranium;;Mandible;;Maxilla;;Hyoid'
  UNION ALL
  SELECT 'What is the common name for the clavicle?', 'Collarbone;;Wishbone;;Shoulderblade;;Neckbone'
  UNION ALL
  SELECT 'Explain the difference between compact and spongy bone tissue:', NULL
) AS q;

-- Create questions for Cardiovascular Quiz
INSERT INTO assignment_questions (assignment_id, question_content, choices)
SELECT
  (
    SELECT id
    FROM assignments
    WHERE title = 'Cardiovascular System Basics'
  ),
  q.question_content,
  q.choices
FROM (
  SELECT
    'Which chamber of the heart pumps blood to the body?' AS question_content,
    'Left ventricle;;Right ventricle;;Left atrium;;Right atrium' AS choices
  UNION ALL
  SELECT 'What is the main function of red blood cells?', 'Carry oxygen;;Fight infection;;Form blood clots;;Produce antibodies'
  UNION ALL
  SELECT 'Which blood vessel carries oxygenated blood?', 'Arteries;;Veins;;Capillaries;;Venules'
  UNION ALL
  SELECT 'How many chambers are in the human heart?', '4;;2;;3;;6'
  UNION ALL
  SELECT 'Describe the path of blood flow through the heart:', NULL
) AS q;

-- Create questions for Digestive System Quiz
INSERT INTO assignment_questions (assignment_id, question_content, choices)
SELECT
  (
    SELECT id
    FROM assignments
    WHERE title = 'Digestive System Overview'
  ),
  q.question_content,
  q.choices
FROM (
  SELECT
    'Where does chemical digestion begin?' AS question_content,
    'Mouth;;Stomach;;Small intestine;;Esophagus' AS choices
  UNION ALL
  SELECT 'Which organ produces bile?', 'Liver;;Pancreas;;Gallbladder;;Stomach'
  UNION ALL
  SELECT 'What is the longest part of the digestive system?', 'Small intestine;;Large intestine;;Esophagus;;Stomach'
  UNION ALL
  SELECT 'Which enzyme breaks down proteins in the stomach?', 'Pepsin;;Amylase;;Lipase;;Trypsin'
  UNION ALL
  SELECT 'Explain the role of villi in the small intestine:', NULL
) AS q;
  