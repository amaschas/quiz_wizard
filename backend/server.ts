import cors from "@fastify/cors";
import fastify from "fastify";
import { db } from "./db-client";

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
	const data = db.prepare("SELECT * FROM assignments").all();

	return data;
});

server.get("/quizzes/:id", (request, reply) => {
	const quiz_data_query = db.prepare("SELECT * FROM assignments WHERE id = :id");
	const quiz_data = quiz_data_query.get(request.params) || {};
	const question_data_query = db.prepare("SELECT * FROM assignment_questions WHERE assignment_id = :id");
	const question_data = question_data_query.all(request.params) || {};

	return {
		...quiz_data,
		questions: question_data
	}
});

server.post("qyizzes/submit-answer/:quiz_id/:question_id", (request, reply) => {
	
})

server.listen({ port: PORT, host: '0.0.0.0' }, (err) => {
	if (err) {
		console.error(err);
		process.exit(1);
	}
	console.log(`Server listening at http://localhost:${PORT}`);
});
