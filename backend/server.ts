import cors from "@fastify/cors";
import fastify from "fastify";
import { FastifyRequest } from 'fastify';
import { db } from "./db-client";

interface SubmitAnswerBody {
	user_id: number;
	quiz_id: number;
	question_id: number;
	question_answer_index?: number;
	question_type?: string;
	ms_on_question?: number;
}

interface QuizAnswerRow {
  user_id: number;
  quiz_id: number;
  quiz_question_id: number;
  quiz_question_answer_index: number;
  is_active: number; // stored as 0 or 1 in SQLite
  ms_on_question: number;
};

interface User {
  id: number;
  name: string;
  email: string;
  quizzes_completed: string;
}

const server = fastify();

server.register(cors, {});

const PORT = +(process.env.BACKEND_SERVER_PORT ?? 3000);

server.get("/users", (_request, reply) => {
	const data = db.prepare("SELECT * FROM users").all();

	return data;
});

server.get("/user/:user_id", (request, reply) => {
	const data = db.prepare("SELECT * FROM users Where id = :user_id").get(request.params);

	return data;
});

server.get("/quizzes", (_request, reply) => {
	const data = db.prepare("SELECT * FROM quizzes").all();

	return data;
});

server.get("/quiz/:quiz_id", (request, reply) => {
	const quiz_data_query = db.prepare("SELECT * FROM quizzes WHERE id = :quiz_id");
	const quiz_data = quiz_data_query.get(request.params) || {};
	const question_data_query = db.prepare("SELECT * FROM quiz_questions WHERE quiz_id = :quiz_id");
	const question_data = question_data_query.all(request.params) || {};

	return {
		...quiz_data,
		questions: question_data
	}
});

server.get("/quizzes/answers/:user_id/:quiz_id", (request, reply) => {
	const query = db.prepare(
		"SELECT * FROM quiz_answers WHERE user_id = :user_id AND quiz_id = :quiz_id"
	);
	const quiz_data = query.all(request.params) || {};

	return {
		...quiz_data
	}
});

server.get("/quizzes/active-answer/:user_id/:quiz_id", (request, reply) => {
	const query = db.prepare(
		"SELECT * FROM quiz_answers WHERE user_id = :user_id AND quiz_id = :quiz_id AND is_active = 1"
	);
	const result = query.get(request.params) as QuizAnswerRow | undefined;

  if (!result) {
    return {};
  }

  return {
    ...result,
    is_active: Boolean(result.is_active),
  };
});

server.post('/quizzes/submit-answer', async (request: FastifyRequest<{ Body: SubmitAnswerBody }>, reply) => {
	console.log(request.body)
	const {
		user_id,
		quiz_id,
		question_id,
		question_answer_index,
		question_type = 'multiple-choice',
		ms_on_question = 0
	} = request.body;
  
	if (!user_id || !quiz_id || !question_id) {
	  return reply.code(400).send({ error: 'user_id, quiz_id, and question_id are required' });
	}

	// Update indicated answer and question set active
	const insertOrUpdateAnswer = db.prepare(`
		INSERT INTO quiz_answers (
			user_id,
			quiz_id,
			quiz_question_id,
			quiz_question_answer_index,
			is_active,
			ms_on_question
		)
		VALUES (
			:user_id,
			:quiz_id,
			:quiz_question_id,
			:quiz_question_answer_index,
			1,
			:ms_on_question
		)
		ON CONFLICT(user_id, quiz_id, quiz_question_id)
		DO UPDATE SET
      quiz_question_answer_index = CASE
        WHEN :quiz_question_answer_index IS NOT NULL THEN :quiz_question_answer_index
        ELSE quiz_question_answer_index
      END,
			ms_on_question = :ms_on_question,
			is_active = 1;
	`);

	const updateOtherAnswers = db.prepare(`
		UPDATE quiz_answers
		SET is_active = 0
		WHERE quiz_id = @quiz_id
		  AND quiz_question_id != @quiz_question_id
	`);

	const transaction = db.transaction((params) => {
		const answerUpdateresult = updateOtherAnswers.run(params);
    console.log(answerUpdateresult)
		const answerInsertresult = insertOrUpdateAnswer.run(params);
    console.log(answerInsertresult)
	});

	transaction({
		user_id: user_id,
		quiz_id: quiz_id,
		quiz_question_id: question_id,
		quiz_question_answer_index: question_answer_index,
		ms_on_question: ms_on_question,
    question_type: question_type
	});

  return { status: 'ok' };
});

server.post('/users/complete-quiz', async (request: FastifyRequest<{ Body: { user_id: number, quiz_id: number } }>, reply) => {
    const { user_id, quiz_id } = request.body;
    // Fetch current quizzes_completed
    const getUser = db.prepare("SELECT quizzes_completed FROM users WHERE id = ?");
    const user = getUser.get(user_id) as User | undefined;

    if (!user) {
      return reply.code(404).send({ error: "User not found" });
    }

    // Parse existing quiz IDs
    const existingIds = user.quizzes_completed
      ? user.quizzes_completed.split(";;").map(Number)
      : [];

    // Add the new quiz ID only if it's not already present
    if (!existingIds.includes(quiz_id)) {
      existingIds.push(quiz_id);
    }

    // Convert back to ';;'-separated string
    const updated = existingIds.join(";;");

    // Update the user record
    const updateUser = db.prepare("UPDATE users SET quizzes_completed = ? WHERE id = ?");
    updateUser.run(updated, user_id);

    return reply.code(200).send({ user_id, quizzes_completed: updated });
  }
);

server.listen({ port: PORT, host: '0.0.0.0' }, (err) => {
	if (err) {
		console.error(err);
		process.exit(1);
	}
	console.log(`Server listening at http://localhost:${PORT}`);
});
