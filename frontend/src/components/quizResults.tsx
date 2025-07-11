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
  ApiActiveAnswer
} from "@/components/quiz";

import { getAnswerData } from "@/lib/utils";

const getQuizQuestionAnswer = (questionId: number, answers: ApiActiveAnswer[]) => {
  return answers.find(answer => answer.quiz_question_id === questionId);
};

const getNumberCorrect = (answers: ApiActiveAnswer[]) => {
  return answers.reduce((count, answer) => {
    return answer.quiz_question_answer_index === 0 ? count + 1 : count;
  }, 0);
};

export const formatTime = (seconds: number): string => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  const parts = [];
  if (h > 0) parts.push(`${h}h`);
  if (m > 0 || h > 0) parts.push(`${m}m`);
  parts.push(`${s}s`);

  return parts.join(" ");
};

const getTotalTimeSpent = (answers: ApiActiveAnswer[]) => {
  const totalSeconds = answers.reduce((count, answer) => {
    return count + answer.sec_on_question;
  }, 0);
  return formatTime(totalSeconds);
};

const Correct: React.FC = () => (
  <span className="correct">
    {String.fromCharCode(10003)}
  </span>
)

const Incorrect: React.FC = () => (
  <span className="incorrect">
    x
  </span>
)

export const QuizResults: React.FC = (props: {quiz: ApiQuiz, answers: ApiActiveAnswer[]}) => {
  const { quiz, answers } = props;

  return quiz && answers.length ? (
    <Card>
      <CardHeader className="pb-8">
        <CardTitle>Quiz #{quiz.id}: {quiz.title}</CardTitle>
      </CardHeader>
      <CardContent>Quiz Complete!</CardContent>
      <CardContent>
        <CardDescription>You got {getNumberCorrect(answers)}  out of { quiz?.questions?.length } correct!</CardDescription>
        <CardDescription>You spent {getTotalTimeSpent(answers)}  on this quiz</CardDescription>
      </CardContent>
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
              { answer?.quiz_question_answer_index === 0 ? <Correct /> : <Incorrect /> }
            </li>
          );
        })}
      </ul>
      </CardContent>
    </Card>
  ) : null;
}