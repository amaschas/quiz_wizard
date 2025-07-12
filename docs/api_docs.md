### 🧑‍ User Endpoints

#### `GET /users`

Retrieve a list of all users.

#### Response:
- `200 OK` if users are found.
- An empty array if no users are found.

#### Response:
```json
[
  {
    "id": 1,
    "name": "Alice",
    "quizzes_completed": "1;;2"
  },
  ...
]
```

#### `GET /user/:user_id`

Retrieve a specific user by their ID.

#### Path Parameters:
- `user_id` (integer) — The ID of the user to retrieve.

#### Response:
- `200 OK` if the user is found.
- `null` if the user does not exist.

#### Example Response:
```json
{
  "id": 1,
  "name": "Alice",
  "quizzes_completed": "1;;2"
}
```

### Quiz Endpoints

#### `GET /quizzes`

Retrieve a list of all available quizzes.

#### Response:
- `200 OK` — Returns an array of quiz objects.
- An empty array if no quizzes are found.

#### Example Response:
```json
[
  {
    "id": 1,
    "title": "Skeletal System Quiz"
  },
  {
    "id": 2,
    "title": "Muscular System Quiz"
  }
]
```

#### `GET /quiz/:quiz_id`

Retrieve detailed information about a specific quiz, including its associated questions.

#### Path Parameters:
- `quiz_id` (integer) — The ID of the quiz to retrieve.

#### Response:
- `200 OK` — Returns a quiz object with a `questions` array.
- If no quiz is found, returns `null`.

#### Example Response:
```json
{
  "id": 1,
  "title": "Skeletal System Quiz",
  "questions": [
    {
      "id": 10,
      "quiz_id": 1,
      "question_content": "Which bone is the longest in the human body?",
      "quiz_answer_choices": "Femur;;Tibia;;Humerus;;Radius"
    },
    {
      "id": 11,
      "quiz_id": 1,
      "question_content": "How many bones are in the adult human body?",
      "quiz_answer_choices": "206;;208;;210;;204"
    }
  ]
}
```

#### `GET /quiz/answers/:user_id/:quiz_id`

Retrieve all answers submitted by a specific user for a specific quiz.

#### Path Parameters:
- `user_id` (integer) — The ID of the user.
- `quiz_id` (integer) — The ID of the quiz.

#### Response:
- `200 OK` — Returns an array of answer objects.
- If no answers exist, returns an empty array.

#### Example Response:
```json
[
  {
    "user_id": 1,
    "quiz_id": 2,
    "quiz_question_id": 10,
    "quiz_question_answer_index": 1,
    "is_active": 0,
    "sec_on_question": 12
  },
  {
    "user_id": 1,
    "quiz_id": 2,
    "quiz_question_id": 11,
    "quiz_question_answer_index": 2,
    "is_active": 1,
    "sec_on_question": 20
  }
]
```

#### `GET /quiz/active-answer/:user_id/:quiz_id`

Retrieve the active answer (i.e. the most recently interacted question) for a specific user and quiz.

#### Path Parameters:
- `user_id` (integer) — The ID of the user.
- `quiz_id` (integer) — The ID of the quiz.

#### Response:
- `200 OK` — Returns a single answer object marked as active.
- Returns `null` the record is not found.

#### Example Response (if found):
```json
{
  "user_id": 1,
  "quiz_id": 2,
  "quiz_question_id": 11,
  "quiz_question_answer_index": 2,
  "is_active": true,
  "sec_on_question": 20
}
```

#### `POST /quiz/answer`

Submit or update an answer for a quiz question.  
This endpoint also marks the submitted answer as active and deactivates all other answers for the same quiz and user.

#### Request Body:
- `user_id` (integer, required) — The ID of the user submitting the answer.
- `quiz_id` (integer, required) — The ID of the quiz.
- `question_id` (integer, required) — The ID of the quiz question.
- `question_answer_index` (integer, optional) — The index of the selected answer choice.
- `sec_on_question` (integer, optional) — Number of seconds spent on the question.

#### Response:
- `200 OK` — If the record was successfully created or updated.
- `400 Bad Request` - If any of user_id, quiz_id, or question_id are missing.

#### Example Request:
```json
{
  "user_id": 1,
  "quiz_id": 2,
  "question_id": 11,
  "question_answer_index": 3,
  "sec_on_question": 45
}
```

#### `POST /user/complete-quiz`

Mark a quiz as completed for a user.  
If the quiz was already marked complete, the operation is a no-op.

---

#### Request Body:
- `user_id` (integer, required) — The ID of the user.
- `quiz_id` (integer, required) — The ID of the quiz to mark as completed.

---

#### Response:
- `200 OK` — If the user and quiz were found.
- `404 Not Found` - Returned if the specified user or quiz do not exist.

#### Example Request:
```json
{
  "user_id": 1,
  "quiz_id": 3
}
```