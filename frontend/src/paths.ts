import { type Params, path as pathFactory } from "static-path";

const SERVER_HOST = import.meta.env.VITE_BACKEND_SERVER || "localhost:3001";
export const SERVER_ORIGIN = `http://${SERVER_HOST}`;

const apiUrlFactory = <T extends string>(pattern: T) => {
  const builder = pathFactory(pattern);
  return (params: Params<T>) => {
    console.log("pattern", pattern)
    console.log("params", params)
    SERVER_ORIGIN + builder(params)
  };
};

// API GET URLs
export const quizApiUrl = apiUrlFactory("/quiz/:quiz_id");
export const quizzesApiUrl = apiUrlFactory("/quizzes");
export const quizAnswersApiUrl = apiUrlFactory("/quizzes/answers/:user_id/:quiz_id");
export const quizActiveAnswerApiUrl = apiUrlFactory("/quizzes/active-answer/:user_id/:quiz_id");
export const quizSubmitAnswerApiUrl = apiUrlFactory("/quizzes/submit-answer");
export const userApiUrl = apiUrlFactory("/user/complete-quiz/:user_id");
export const userSetQuizCompleteApiUrl = apiUrlFactory("/user/complete-quiz");

// API POST URLs
export const submitQuizAnswerApiUrl = apiUrlFactory("/quizzes/submit-answer");

// local routes
export const rootPath = pathFactory("/");
export const quizPath = pathFactory("/quizzes/:id");
export const quizzesPath = pathFactory("/quizzes");
