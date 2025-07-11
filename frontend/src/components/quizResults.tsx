import type React from "react";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

import type {
  ApiQuiz,
  ApiActiveAnswer,
} from "@/components/quiz";

import { getAnswerData } from "@/lib/utils";

const getQuizQuestionAnswer = (questionId: number, answers: ApiActiveAnswer[]) => {
  return answers.find(answer => answer.quiz_question_id === questionId);
};

export const QuizResults: React.FC = (props: {quiz: ApiQuiz, answers: ApiActiveAnswer[]}) => {
  const { quiz, answers } = props;

  return quiz && answers.length ? (
    <Card>
      <CardHeader className="pb-8">
        <CardTitle>Quiz #{quiz.id}: {quiz.title}</CardTitle>
      </CardHeader>
      <CardContent><CardDescription>Quiz Complete!</CardDescription></CardContent>
      <CardContent>
      <ul>
        { quiz.questions?.map((question, index) => {
          const answer = getQuizQuestionAnswer(question.id, answers);
          const answerData = answer ? getAnswerData(answer, [question]) : null;
          return (
            <li key={`answer-${question.id}`}>
              {`#${index + 1}: ${question?.question_content} - ${
              answerData?.quiz_answer_choices?.[answer?.quiz_question_answer_index || 0]?.value ?? "(no answer)"
            }`}
              { answer?.quiz_question_answer_index === 0 ? " correct" : " incorrect" }
            </li>
          );
        })}
      </ul>
      </CardContent>
    </Card>
  ) : null;
}