import cors from "@fastify/cors";
import fastify from "fastify";
import { FastifyRequest } from 'fastify';
import { db } from "./db-client";

interface SubmitAnswerBody {
	user_id: number;
	quiz_id: number;
	answer_id: number;
	question_answer_index?: number;
	question_type?: string;
	ms_on_question?: number;
  }

const server = fastify();

server.register(cors, {});

const PORT = +(process.env.BACKEND_SERVER_PORT ?? 3000);

server.get("/", async (_request, _reply) => {
	return "hello world\n";
});

server.get("/users", (_request, reply) => {
	const data = db.prepare("SELECT * FROM users").all();

	return data;
});

server.get("/quizzes", (_request, reply) => {
	const data = db.prepare("SELECT * FROM quizzes").all();

	return data;
});

server.get("/quizzes/:id", (request, reply) => {
	const quiz_data_query = db.prepare("SELECT * FROM quizzes WHERE id = :id");
	const quiz_data = quiz_data_query.get(request.params) || {};
	const question_data_query = db.prepare("SELECT * FROM quiz_questions WHERE quiz_id = :id");
	const question_data = question_data_query.all(request.params) || {};

	return {
		...quiz_data,
		questions: question_data
	}
});

server.get("/quizzes/answers/:user_id/:question_id", (request, reply) => {
	const query = db.prepare(
		"SELECT * FROM quiz_answers WHERE user_id = :user_id AND quiz_question_id = :question_id"
	);
	const quiz_data = query.get(request.params) || {};

	return {
		...quiz_data
	}
});

server.post('/quizzes/submit-answer', async (request: FastifyRequest<{ Body: SubmitAnswerBody }>, reply) => {
	console.log(request.body)
	const {
		user_id,
		quiz_id,
		answer_id,
		question_answer_index = -1,
		question_type = 'multiple-choice',
		ms_on_question = 0
	} = request.body;
  
	if (!user_id || !quiz_id || !answer_id) {
	  return reply.code(400).send({ error: 'user_id, quiz_id, and answer_id are required' });
	}

	// Update indicated answer and question set active
	const insertAnswer = db.prepare(`
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
			quiz_question_answer_index = :quiz_question_answer_index,
			ms_on_question = :ms_on_question,
			is_active = 1;
	`);

	const updateOtherAnswers = db.prepare(`
		UPDATE quiz_answers
		SET is_active = 0
		WHERE quiz_id != @quiz_id
		  AND quiz_question_id = @quiz_question_id
	`);
  

	const transaction = db.transaction((params) => {
		updateOtherAnswers.run(params);
		insertAnswer.run(params);
	});

	transaction({
		user_id: user_id,
		quiz_id: quiz_id,
		quiz_question_id: answer_id,
		quiz_question_answer_index: question_answer_index,
		ms_on_question: ms_on_question,
	});
});  

server.listen({ port: PORT, host: '0.0.0.0' }, (err) => {
	if (err) {
		console.error(err);
		process.exit(1);
	}
	console.log(`Server listening at http://localhost:${PORT}`);
});
