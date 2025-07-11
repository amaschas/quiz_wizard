import { type Params, path as pathFactory } from "static-path";

const SERVER_HOST = import.meta.env.VITE_BACKEND_SERVER || "localhost:3001";
export const SERVER_ORIGIN = `http://${SERVER_HOST}`;

// const apiUrlFactory = <T extends string>(pattern: T) => {
//   const builder = pathFactory(pattern);
//   return (params: Params<T>) => {
//     const stringParams = Object.fromEntries(
//       Object.entries(params).map(([key, value]) => [key, String(value)])
//     ) as Params<T>;
//     return SERVER_ORIGIN + builder(stringParams);
//   };
// };

type LooseParams<T extends string> = {
  [K in keyof Params<T>]: string | number;
};

const apiUrlFactory = <T extends string>(pattern: T) => {
  const builder = pathFactory(pattern);

  return (params: LooseParams<T>) => {
    const stringParams = Object.fromEntries(
      Object.entries(params).map(([key, value]) => [key, String(value)])
    ) as Params<T>; // cast back to the stricter type after coercion

    return SERVER_ORIGIN + builder(stringParams);
  };
};

// API GET URLs
export const userApiUrl = apiUrlFactory("/user/:user_id");
export const quizApiUrl = apiUrlFactory("/quiz/:quiz_id");
export const quizzesApiUrl = apiUrlFactory("/quizzes");
export const quizAnswersApiUrl = apiUrlFactory("/quizzes/answers/:user_id/:quiz_id");
export const quizActiveAnswerApiUrl = apiUrlFactory("/quizzes/active-answer/:user_id/:quiz_id");

// API POST URLs
export const userSetQuizCompleteApiUrl = apiUrlFactory("/user/complete-quiz");
export const quizSubmitAnswerApiUrl = apiUrlFactory("/quizzes/submit-answer");

// local routes
export const rootPath = pathFactory("/");
export const quizPath = pathFactory("/quizzes/:id");
export const quizzesPath = pathFactory("/quizzes");
